import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { insertUserSchema, insertProjectSchema, insertReportSchema } from "@shared/schema";

// Extend session types
declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: string;
    organizationId: number;
  }
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Generate unique organization code
function generateOrgCode(): string {
  return "NGO-" + Math.floor(1000 + Math.random() * 9000);
}

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  console.log("Admin check - userId:", req.session.userId, "userRole:", req.session.userRole);
  if (!req.session.userId || req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(session(sessionConfig));

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { type, ...userData } = req.body;
      
      if (type === "admin") {
        // Admin registration
        const { firstName, lastName, email, password, organizationName } = userData;
        
        // Check if email already exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }

        // Create organization
        const orgCode = generateOrgCode();
        const organization = await storage.createOrganization({
          name: organizationName,
          code: orgCode,
        });

        // Create admin user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await storage.createUser({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: "admin",
          organizationId: organization.id,
        });

        console.log("Admin user created:", { id: user.id, role: user.role, email: user.email });

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.organizationId = user.organizationId;

        console.log("Session set:", { userId: req.session.userId, userRole: req.session.userRole });

        res.json({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          organization: {
            id: organization.id,
            name: organization.name,
            code: organization.code,
          },
        });
      } else if (type === "officer") {
        // Officer registration
        const { firstName, lastName, email, password, organizationCode } = userData;
        
        // Check if email already exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }

        // Find organization by code
        const organization = await storage.getOrganizationByCode(organizationCode);
        if (!organization) {
          return res.status(400).json({ message: "Invalid organization code" });
        }

        // Create officer user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await storage.createUser({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: "officer",
          organizationId: organization.id,
        });

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.organizationId = user.organizationId;

        res.json({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          organization: {
            id: organization.id,
            name: organization.name,
            code: organization.code,
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid registration type" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.organizationId = user.organizationId;

      const organization = await storage.getOrganizationByCode("");
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      console.log("Auth me request - sessionUserId:", req.session.userId, "sessionRole:", req.session.userRole);
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User from database:", { id: user.id, role: user.role, email: user.email });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          organizationId: user.organizationId,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get organization details
  app.get("/api/organization", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const organization = await storage.getOrganizationById(user.organizationId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json({
        id: organization.id,
        name: organization.name,
        code: organization.code,
        createdAt: organization.createdAt,
      });
    } catch (error) {
      console.error("Get organization error:", error);
      res.status(500).json({ message: "Failed to get organization" });
    }
  });

  // Project routes
  app.post("/api/projects", requireAuth, async (req: any, res) => {
    try {
      console.log("Project creation attempt - userId:", req.session.userId, "userRole:", req.session.userRole);
      
      // Check if user is admin using session role
      if (req.session.userRole !== "admin") {
        console.log("Project creation denied - user role:", req.session.userRole);
        return res.status(403).json({ message: "Admin access required" });
      }

      const projectData = insertProjectSchema.parse({
        ...req.body,
        deadline: req.body.deadline ? new Date(req.body.deadline) : null,
        budget: req.body.budget ? String(req.body.budget) : null,
        budgetUsed: req.body.budgetUsed ? String(req.body.budgetUsed) : "0",
        organizationId: req.session.organizationId,
        createdBy: req.session.userId,
      });

      console.log("Creating project with data:", projectData);
      const project = await storage.createProject(projectData);
      console.log("Project created successfully:", project.id);
      res.json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const projects = await storage.getProjectsByOrganization(req.session.organizationId);
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  // Update project
  app.put("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const projectId = parseInt(req.params.id);
      const updateData = {
        ...req.body,
        deadline: req.body.deadline ? new Date(req.body.deadline) : null,
        budget: req.body.budget ? String(req.body.budget) : null,
        budgetUsed: req.body.budgetUsed ? String(req.body.budgetUsed) : undefined,
        progress: req.body.progress !== undefined ? parseInt(req.body.progress) : undefined,
      };

      const project = await storage.updateProject(projectId, updateData);
      res.json(project);
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const projectId = parseInt(req.params.id);
      await storage.bulkDeleteProjects([projectId], req.session.organizationId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Bulk project operations
  app.delete("/api/projects/bulk", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { projectIds } = req.body;
      if (!Array.isArray(projectIds) || projectIds.length === 0) {
        return res.status(400).json({ message: "Project IDs are required" });
      }

      await storage.bulkDeleteProjects(projectIds, req.session.organizationId);
      res.json({ message: `${projectIds.length} projects deleted successfully` });
    } catch (error) {
      console.error("Bulk delete projects error:", error);
      res.status(500).json({ message: "Failed to delete projects" });
    }
  });

  app.patch("/api/projects/bulk-status", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { projectIds, status } = req.body;
      if (!Array.isArray(projectIds) || projectIds.length === 0) {
        return res.status(400).json({ message: "Project IDs are required" });
      }

      await storage.bulkUpdateProjectStatus(projectIds, status, req.session.organizationId);
      res.json({ message: `${projectIds.length} projects updated successfully` });
    } catch (error) {
      console.error("Bulk update projects error:", error);
      res.status(500).json({ message: "Failed to update projects" });
    }
  });

  app.post("/api/projects/export", requireAuth, async (req: any, res) => {
    try {
      const { projectIds } = req.body;
      const projects = await storage.getProjectsForExport(projectIds || [], req.session.organizationId);
      
      const headers = ["ID", "Name", "Description", "Budget", "Deadline", "Status", "Goals", "Created At"];
      const csvRows = [
        headers.join(","),
        ...projects.map((project: any) => [
          project.id,
          `"${(project.name || "").replace(/"/g, '""')}"`,
          `"${(project.description || "").replace(/"/g, '""')}"`,
          project.budget || "",
          project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
          project.status || "active",
          `"${(project.goals || "").replace(/"/g, '""')}"`,
          new Date(project.createdAt).toISOString().split('T')[0]
        ].join(","))
      ];

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=projects-export.csv");
      res.send(csvRows.join("\n"));
    } catch (error) {
      console.error("Export projects error:", error);
      res.status(500).json({ message: "Failed to export projects" });
    }
  });

  // Report routes
  app.post("/api/reports", requireAuth, upload.array("files", 5), async (req: any, res) => {
    try {
      const files = req.files?.map((file: any) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
      })) || [];

      const reportData = insertReportSchema.parse({
        ...req.body,
        files,
        submittedBy: req.session.userId,
      });

      const report = await storage.createReport(reportData);
      res.json(report);
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports", requireAuth, async (req: any, res) => {
    try {
      const reports = await storage.getReportsByOrganization(req.session.organizationId);
      res.json(reports);
    } catch (error) {
      console.error("Get reports error:", error);
      res.status(500).json({ message: "Failed to get reports" });
    }
  });

  app.get("/api/reports/pending", requireAdmin, async (req: any, res) => {
    try {
      const reports = await storage.getPendingReports(req.session.organizationId);
      res.json(reports);
    } catch (error) {
      console.error("Get pending reports error:", error);
      res.status(500).json({ message: "Failed to get pending reports" });
    }
  });

  app.patch("/api/reports/:id/status", requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, reviewNotes } = req.body;

      const report = await storage.updateReportStatus(
        parseInt(id),
        status,
        req.session.userId,
        reviewNotes
      );

      res.json(report);
    } catch (error) {
      console.error("Update report status error:", error);
      res.status(500).json({ message: "Failed to update report status" });
    }
  });

  // Bulk report operations
  app.patch("/api/reports/bulk-approve", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { reportIds } = req.body;
      if (!Array.isArray(reportIds) || reportIds.length === 0) {
        return res.status(400).json({ message: "Report IDs are required" });
      }

      await storage.bulkUpdateReportStatus(reportIds, "approved", req.session.userId, req.session.organizationId);
      res.json({ message: `${reportIds.length} reports approved successfully` });
    } catch (error) {
      console.error("Bulk approve reports error:", error);
      res.status(500).json({ message: "Failed to approve reports" });
    }
  });

  app.patch("/api/reports/bulk-reject", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { reportIds } = req.body;
      if (!Array.isArray(reportIds) || reportIds.length === 0) {
        return res.status(400).json({ message: "Report IDs are required" });
      }

      await storage.bulkUpdateReportStatus(reportIds, "rejected", req.session.userId, req.session.organizationId);
      res.json({ message: `${reportIds.length} reports rejected successfully` });
    } catch (error) {
      console.error("Bulk reject reports error:", error);
      res.status(500).json({ message: "Failed to reject reports" });
    }
  });

  app.post("/api/reports/export", requireAuth, async (req: any, res) => {
    try {
      const { reportIds } = req.body;
      const reports = await storage.getReportsForExport(reportIds || [], req.session.organizationId);
      
      const headers = ["ID", "Title", "Description", "Status", "Project", "Submitted By", "Created At", "Review Notes"];
      const csvRows = [
        headers.join(","),
        ...reports.map((report: any) => [
          report.id,
          `"${(report.title || "").replace(/"/g, '""')}"`,
          `"${(report.description || "").replace(/"/g, '""')}"`,
          report.status,
          `"${(report.projectName || "").replace(/"/g, '""')}"`,
          `"${(report.submittedByName || "").replace(/"/g, '""')}"`,
          new Date(report.createdAt).toISOString().split('T')[0],
          `"${(report.reviewNotes || "").replace(/"/g, '""')}"`
        ].join(","))
      ];

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=reports-export.csv");
      res.send(csvRows.join("\n"));
    } catch (error) {
      console.error("Export reports error:", error);
      res.status(500).json({ message: "Failed to export reports" });
    }
  });

  // Dashboard data routes
  app.get("/api/dashboard/stats", requireAuth, async (req: any, res) => {
    try {
      const projects = await storage.getProjectsByOrganization(req.session.organizationId);
      const reports = await storage.getReportsByOrganization(req.session.organizationId);
      const users = await storage.getUsersByOrganization(req.session.organizationId);
      const pendingReports = await storage.getPendingReports(req.session.organizationId);

      const totalBudget = projects.reduce((sum, project) => {
        return sum + (parseFloat(project.budget?.toString() || "0"));
      }, 0);

      res.json({
        activeProjects: projects.length,
        totalReports: reports.length,
        pendingReports: pendingReports.length,
        teamMembers: users.length,
        totalBudget,
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

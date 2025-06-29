import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { z } from "zod";
import { insertUserSchema, insertProjectSchema, insertReportSchema, insertMessageSchema } from "@shared/schema";
import { deadlineTracker } from "./deadlineTracker";
import { emailService } from "./emailNotifications";
import { aiReportReviewer } from "./aiReportReviewer";

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
      console.log("Login attempt:", email, "password length:", password?.length);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log("User not found:", email);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("User found:", user.id, "stored hash:", user.password);
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isValidPassword);
      
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

  app.post("/api/auth/logout", (req: any, res) => {
    console.log("Logout request - sessionUserId:", req.session?.userId);
    
    // Clear session data
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      
      console.log("Logout successful");
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

  // Get team members
  app.get("/api/organization/members", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const members = await storage.getUsersByOrganization(user.organizationId);
      res.json(members.map(member => ({
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        role: member.role,
        createdAt: member.createdAt,
      })));
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({ message: "Failed to get team members" });
    }
  });

  // Remove team member (admin only)
  app.delete("/api/organization/members/:memberId", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      const memberToRemove = await storage.getUserById(memberId);
      
      if (!memberToRemove) {
        return res.status(404).json({ message: "Member not found" });
      }

      // Check if member belongs to same organization
      if (memberToRemove.organizationId !== req.session.organizationId) {
        return res.status(403).json({ message: "Member not in your organization" });
      }

      // Cannot remove admin accounts
      if (memberToRemove.role === "admin") {
        return res.status(403).json({ message: "Cannot remove admin accounts" });
      }

      // Delete the user account completely
      await storage.deleteUser(memberId);
      res.json({ message: "Team member removed successfully" });
    } catch (error) {
      console.error("Remove member error:", error);
      res.status(500).json({ message: "Failed to remove team member" });
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

  // Update project (PUT)
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

  // Update project (PATCH) - for edit modal
  app.patch("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const projectId = parseInt(req.params.id);
      
      // Clean update data with proper type conversion
      const updateData: any = {};
      
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.progress !== undefined) updateData.progress = parseInt(req.body.progress);
      if (req.body.budget !== undefined) updateData.budget = String(req.body.budget);
      if (req.body.budgetUsed !== undefined) updateData.budgetUsed = String(req.body.budgetUsed);
      if (req.body.deadline !== undefined) {
        updateData.deadline = req.body.deadline ? new Date(req.body.deadline) : null;
      }

      console.log("PATCH project update data:", updateData);
      const project = await storage.updateProject(projectId, updateData);
      console.log("Updated project:", project);
      res.json(project);
    } catch (error) {
      console.error("PATCH project error:", error);
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

      console.log("Report submission data:", {
        title: req.body.title,
        content: req.body.content,
        projectId: req.body.projectId,
        projectIdType: typeof req.body.projectId,
        userId: req.session.userId,
        organizationId: req.session.organizationId
      });

      const projectId = parseInt(req.body.projectId);
      if (isNaN(projectId)) {
        console.error("Invalid projectId:", req.body.projectId);
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const reportData = {
        title: req.body.title,
        content: req.body.content,
        projectId: projectId,
        submittedBy: req.session.userId,
        files: files.length > 0 ? files : null,
        status: "submitted", // Set status to submitted when creating
        submittedAt: new Date() // Set submission timestamp
      };

      console.log("Validated report data:", reportData);
      const validatedData = insertReportSchema.parse(reportData);

      const report = await storage.createReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports", requireAuth, async (req: any, res) => {
    try {
      let reports;
      if (req.session.userRole === 'admin') {
        reports = await storage.getReportsByOrganization(req.session.organizationId);
      } else {
        // Officers should only see their own reports
        const allReports = await storage.getReportsByOrganization(req.session.organizationId);
        reports = allReports.filter((report: any) => report.submittedBy === req.session.userId);
        console.log(`Officer ${req.session.userId} reports:`, reports.map(r => ({ id: r.id, title: r.title, status: r.status, submittedBy: r.submittedBy })));
        console.log(`Officer ${req.session.userId} has ${reports.length} reports total`);
      }
      
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

  // Update an existing report (for editing drafts) - with file upload support
  app.put("/api/reports/:id", requireAuth, upload.array('files', 10), async (req: any, res) => {
    const reportId = parseInt(req.params.id);
    const { userId, userRole, organizationId } = req.session;
    
    try {
      const existingReport = await storage.getReportById(reportId);
      if (!existingReport) {
        return res.status(404).json({ error: "Report not found" });
      }
      
      if (existingReport.submittedBy !== userId) {
        return res.status(403).json({ error: "Can only edit your own reports" });
      }
      
      if (existingReport.status !== 'draft') {
        return res.status(400).json({ error: "Can only edit draft reports" });
      }
      
      // Handle file uploads
      const files = Array.isArray(req.files) ? req.files.map((file: any) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
      })) : [];
      
      console.log("Updating report:", {
        reportId,
        title: req.body.title,
        content: req.body.content,
        projectId: req.body.projectId,
        files: files.length
      });
      
      const { title, content, projectId } = req.body;
      
      // Merge existing files with new files if any
      let updatedFiles = Array.isArray(existingReport.files) ? existingReport.files : [];
      if (files.length > 0) {
        updatedFiles = [...updatedFiles, ...files];
      }
      
      const updated = await storage.updateReport(reportId, {
        title,
        content,
        projectId: parseInt(projectId),
        files: updatedFiles.length > 0 ? updatedFiles : undefined,
        status: "submitted",
        submittedAt: new Date(),
      });
      
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating report:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Recall report (officer only - for their own reports)
  app.post("/api/reports/:id/recall", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const report = await storage.recallReport(parseInt(id), req.session.userId);
      res.json(report);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to recall report" });
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

      // Calculate active projects (not completed) and completed projects
      const completedProjects = projects.filter(project => project.progress === 100).length;
      const activeProjects = projects.length - completedProjects;

      // Calculate overall progress as average of all project progress
      const overallProgress = projects.length > 0 
        ? Math.round(projects.reduce((sum, project) => sum + (project.progress || 0), 0) / projects.length)
        : 0;

      // Calculate total budget used across all projects
      const totalBudgetUsed = projects.reduce((sum, project) => {
        return sum + (parseFloat(project.budgetUsed?.toString() || "0"));
      }, 0);

      // Calculate budget utilization percentage
      const budgetUtilization = totalBudget > 0 
        ? Math.round((totalBudgetUsed / totalBudget) * 100)
        : 0;

      res.json({
        activeProjects,
        completedProjects,
        totalProjects: projects.length,
        overallProgress,
        totalReports: reports.length,
        pendingReports: pendingReports.length,
        teamMembers: users.length,
        totalBudget,
        totalBudgetUsed,
        budgetUtilization,
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // File serving route
  app.get("/api/files/:filename", requireAuth, async (req: any, res) => {
    try {
      const { filename } = req.params;
      const uploadsDir = path.resolve(process.cwd(), "uploads");
      const filePath = path.join(uploadsDir, filename);
      
      console.log("=== FILE DOWNLOAD REQUEST ===");
      console.log("Filename:", filename);
      console.log("File path:", filePath);
      console.log("User ID:", req.session.userId);
      console.log("User role:", req.session.userRole);
      console.log("Organization ID:", req.session.organizationId);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return res.status(404).json({ message: "File not found" });
      }
      
      // Check if this is a report file first
      const reports = await storage.getReportsByOrganization(req.session.organizationId);
      console.log("Checking reports for file:", filename);
      console.log("Found reports:", reports.length);
      
      const reportWithFile = reports.find(report => {
        if (report.files && Array.isArray(report.files)) {
          console.log("Report", report.id, "files:", report.files);
          return report.files.some((file: any) => file.filename === filename);
        }
        return false;
      });
      
      if (reportWithFile) {
        console.log("File found in report:", reportWithFile.id);
        const fileInfo = reportWithFile.files.find((file: any) => file.filename === filename);
        const originalName = fileInfo?.originalName || filename;
        
        console.log("Serving report file:", {
          filename,
          originalName,
          filePath,
          fileExists: fs.existsSync(filePath)
        });
        
        // Set proper headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        // Serve the file
        return res.sendFile(filePath, (err) => {
          if (err) {
            console.error("File download error:", err);
            if (!res.headersSent) {
              res.status(500).json({ message: "Download failed" });
            }
          }
        });
      }
      
      // Check if this is a message file
      const messages = await storage.getAllMessagesForOrganization(req.session.organizationId);
      console.log("Found messages for organization:", messages.length);
      
      const messageWithFile = messages.find(msg => {
        if (!msg.fileUrl) return false;
        // Handle both "/api/files/filename" and just "filename" formats
        const msgFilename = msg.fileUrl.replace('/api/files/', '');
        return msgFilename === filename;
      });
      
      console.log("Looking for message with filename:", filename);
      console.log("Message with file found:", messageWithFile ? 'Yes' : 'No');
      if (messageWithFile) {
        console.log("File message details:", {
          id: messageWithFile.id,
          senderId: messageWithFile.senderId,
          recipientId: messageWithFile.recipientId,
          fileUrl: messageWithFile.fileUrl
        });
      }
      
      if (!messageWithFile) {
        console.log("File access denied - not found in messages or reports");
        return res.status(403).json({ message: "File access denied" });
      }
      
      const originalName = messageWithFile.fileName || filename;
      
      // Set proper headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
      res.setHeader('Content-Type', messageWithFile?.fileType || 'application/octet-stream');
      
      // Serve the file
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("File download error:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Download failed" });
          }
        }
      });
    } catch (error) {
      console.error("File serving error:", error);
      res.status(500).json({ message: "File serving failed" });
    }
  });

  // Messaging routes
  app.post("/api/messages", requireAuth, async (req: any, res) => {
    try {
      console.log("Message request body:", req.body);
      console.log("Session data:", {
        userId: req.session.userId,
        organizationId: req.session.organizationId
      });

      const messageData = {
        content: req.body.content,
        recipientId: req.body.recipientId,
        senderId: req.session.userId,
        organizationId: req.session.organizationId,
        urgency: req.body.urgency || "normal",
      };

      console.log("Prepared message data:", messageData);
      const validatedData = insertMessageSchema.parse(messageData);
      console.log("Validated message data:", validatedData);

      const message = await storage.sendMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // File upload for messages
  app.post("/api/messages/upload", requireAuth, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { recipientId, content } = req.body;
      if (!recipientId) {
        return res.status(400).json({ message: "Recipient ID is required" });
      }

      // Generate a unique filename
      const fileExtension = path.extname(req.file.originalname);
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
      const newPath = path.join(uploadDir, uniqueFilename);
      
      // Move file to permanent location with unique name
      fs.renameSync(req.file.path, newPath);

      // Create message with file attachment
      const messageData = {
        content: content || `📎 Document: ${req.file.originalname}`,
        senderId: req.session.userId,
        recipientId: parseInt(recipientId),
        organizationId: req.session.organizationId,
        fileUrl: `/api/files/${uniqueFilename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      };

      const message = await storage.sendMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Upload message error:", error);
      // Clean up uploaded file if there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get unread messages count for current user
  app.get("/api/messages/unread", requireAuth, async (req: any, res) => {
    try {
      console.log("Getting unread messages for user:", req.session.userId, "org:", req.session.organizationId);
      
      if (!req.session.userId || !req.session.organizationId) {
        return res.status(400).json({ message: "Invalid session data" });
      }
      
      const unreadMessages = await storage.getUnreadMessagesForUser(req.session.userId, req.session.organizationId);
      res.json({ count: unreadMessages.length, messages: unreadMessages });
    } catch (error) {
      console.error("Get unread messages error:", error);
      res.status(500).json({ message: "Failed to get unread messages" });
    }
  });

  // Mark message as read
  app.patch("/api/messages/:messageId/read", requireAuth, async (req: any, res) => {
    try {
      const { messageId } = req.params;
      await storage.markMessageAsRead(parseInt(messageId));
      res.json({ success: true });
    } catch (error) {
      console.error("Mark message as read error:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Mark all messages as read for current user
  app.post("/api/messages/mark-all-read", requireAuth, async (req: any, res) => {
    try {
      console.log(`Marking all messages as read for user: ${req.session.userId} org: ${req.session.organizationId}`);
      await storage.markAllMessagesAsReadForUser(req.session.userId, req.session.organizationId);
      console.log(`Successfully marked all messages as read for user: ${req.session.userId}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark all messages as read error:", error);
      res.status(500).json({ message: "Failed to mark all messages as read" });
    }
  });

  // Get all messages for current user
  app.get("/api/messages", requireAuth, async (req: any, res) => {
    try {
      if (req.session.userRole === "admin") {
        // Admin gets all messages in organization
        const messages = await storage.getAllMessagesForOrganization(req.session.organizationId);
        res.json(messages);
      } else {
        // Officer gets messages between them and admin
        const users = await storage.getUsersByOrganization(req.session.organizationId);
        const admin = users.find(user => user.role === "admin");
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }
        
        const messages = await storage.getMessagesBetweenUsers(admin.id, req.session.userId, req.session.organizationId);
        res.json(messages);
      }
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // AI Dashboard Insights
  app.post("/api/ai/dashboard-insights", requireAuth, async (req: any, res) => {
    try {
      const { aiDashboardService } = await import("./aiDashboardService");
      
      // Get enhanced project data for AI analysis
      const projects = await storage.getProjectsByOrganization(req.session.organizationId);
      const reports = await storage.getReportsByOrganization(req.session.organizationId);
      const users = await storage.getUsersByOrganization(req.session.organizationId);
      
      // Prepare comprehensive analysis data
      const analysisData = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        overdueProjects: projects.filter(p => {
          if (!p.deadline) return false;
          return new Date(p.deadline) < new Date() && p.status !== 'completed';
        }).length,
        averageProgress: projects.length > 0 ? 
          projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length : 0,
        totalBudget: projects.reduce((acc, p) => acc + parseFloat(p.budget || '0'), 0),
        usedBudget: projects.reduce((acc, p) => acc + parseFloat(p.budgetUsed || '0'), 0),
        pendingReports: reports.filter(r => r.status === 'submitted').length,
        approvedReports: reports.filter(r => r.status === 'approved').length,
        rejectedReports: reports.filter(r => r.status === 'rejected').length,
        recentActivity: reports.filter(r => {
          const reportDate = new Date(r.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reportDate > weekAgo;
        }).length,
        teamMembers: users.length,
        projectDeadlines: projects.map(p => p.deadline).filter(Boolean)
      };

      const insights = await aiDashboardService.generateDashboardInsights(analysisData);
      res.json(insights);
      
    } catch (error: any) {
      console.error("AI Dashboard Insights Error:", error);
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });

  app.get("/api/messages/:userId", requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      if (req.session.userRole === "admin") {
        // Admin viewing messages with a specific user
        const messages = await storage.getMessagesBetweenUsers(req.session.userId, parseInt(userId), req.session.organizationId);
        res.json(messages);
      } else {
        // Officer viewing messages with admin
        // Find admin of the organization
        const users = await storage.getUsersByOrganization(req.session.organizationId);
        const admin = users.find(user => user.role === "admin");
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }
        
        // Get messages between admin and current user
        const messages = await storage.getMessagesBetweenUsers(admin.id, req.session.userId, req.session.organizationId);
        res.json(messages);
      }
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.get("/api/messages/unread/count", requireAuth, async (req: any, res) => {
    try {
      const unreadMessages = await storage.getUnreadMessagesForUser(req.session.userId, req.session.organizationId);
      res.json({ count: unreadMessages.length });
    } catch (error) {
      console.error("Get unread messages error:", error);
      res.status(500).json({ message: "Failed to get unread messages" });
    }
  });

  app.patch("/api/messages/:id/read", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markMessageAsRead(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Mark message as read error:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // AI Report Review endpoint
  app.post('/api/reports/analyze', requireAuth, async (req: any, res) => {
    try {
      console.log('AI Analysis Request received:', {
        bodyKeys: Object.keys(req.body),
        userId: req.session.userId,
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        title: req.body.title,
        contentLength: req.body.content?.length
      });

      const { 
        title, 
        content, 
        projectId, 
        projectDescription, 
        projectGoals, 
        hasAttachments, 
        attachmentCount, 
        attachmentTypes,
        attachmentContents,
        reportId,
        challengesFaced, 
        nextSteps, 
        budgetNotes 
      } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      // Get full project details for context
      let project = null;
      if (projectId) {
        project = await storage.getProjectById(projectId);
        console.log('Project found:', project);
      }

      // Handle file parsing for existing reports
      let finalAttachmentContents = attachmentContents || '';
      let attachmentPaths: string[] = [];
      
      console.log('Analysis request - attachmentContents provided:', !!attachmentContents);
      console.log('Analysis request - reportId:', reportId);
      console.log('Analysis request - hasAttachments:', hasAttachments);
      
      if (!finalAttachmentContents && reportId && hasAttachments) {
        // Get the existing report with files
        const existingReport = await storage.getReportById(reportId);
        if (existingReport && existingReport.files && Array.isArray(existingReport.files)) {
          console.log('Found existing report files:', existingReport.files);
          attachmentPaths = existingReport.files.map((file: any) => file.filename);
          console.log('Attachment paths for parsing:', attachmentPaths);
        }
      }

      const reportData = {
        title,
        content,
        projectName: project?.name || "Unknown Project",
        projectDescription: project?.description || projectDescription || "",
        projectGoals: project?.goals || projectGoals || "",
        projectBudget: project?.budget || 0,
        projectStatus: project?.status || "active",
        hasAttachments,
        attachmentCount: attachmentCount || 0,
        attachmentTypes: attachmentTypes || [],
        attachmentPaths: attachmentPaths.length > 0 ? attachmentPaths : undefined,
        attachmentContents: finalAttachmentContents,
        challengesFaced,
        nextSteps,
        budgetNotes
      };

      console.log('Calling AI with data:', reportData);
      const analysis = await aiReportReviewer.analyzeReport(reportData);
      console.log('AI Analysis completed:', analysis);

      res.json(analysis);
    } catch (error) {
      console.error("AI Report Analysis Error Details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ 
        message: "Failed to analyze report", 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Contact/Meeting booking endpoint
  app.post('/api/contact/meeting', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        company,
        phone,
        organizationType,
        teamSize,
        meetingPurpose,
        preferredTime,
        message
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !company) {
        return res.status(400).json({
          message: "Missing required fields: firstName, lastName, email, and company are required"
        });
      }

      const requestId = `MTG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Store the meeting booking in the database
      const booking = await storage.createMeetingBooking({
        firstName,
        lastName,
        email,
        company,
        phone: phone || null,
        organizationType: organizationType || null,
        teamSize: teamSize || null,
        meetingPurpose: meetingPurpose || null,
        preferredTime: preferredTime || null,
        message: message || null,
        requestId,
        status: "pending"
      });

      // Send email notifications
      const { emailService } = await import('./emailNotifications');
      try {
        await emailService.sendNewBookingNotification(booking);
        console.log('Email notifications sent for booking:', booking.requestId);
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError);
        // Don't fail the request if email fails
      }

      console.log('Meeting booking stored:', {
        id: booking.id,
        requestId: booking.requestId,
        company: booking.company,
        email: booking.email
      });

      res.json({
        message: "Meeting request submitted successfully",
        requestId: booking.requestId
      });

    } catch (error) {
      console.error("Error processing meeting request:", error);
      res.status(500).json({ message: "Failed to process meeting request" });
    }
  });

  // Admin endpoint to get meeting bookings
  app.get('/api/admin/meeting-bookings', async (req, res) => {
    try {
      const { status } = req.query;
      const bookings = await storage.getMeetingBookings(status as string);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching meeting bookings:", error);
      res.status(500).json({ message: "Failed to fetch meeting bookings" });
    }
  });

  // Admin endpoint to update booking status
  app.patch('/api/admin/meeting-bookings/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedBooking = await storage.updateMeetingBookingStatus(parseInt(id), status);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // PDF Generation endpoint
  app.post("/api/generate-pdf", requireAuth, async (req, res) => {
    try {
      const { htmlContent, filename, reportType } = req.body;
      
      if (!htmlContent || !filename) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const puppeteer = require('puppeteer');
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set page format and options
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      await browser.close();
      
      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send PDF buffer
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import {
  organizations,
  users,
  projects,
  reports,
  type Organization,
  type User,
  type Project,
  type Report,
  type InsertOrganization,
  type InsertUser,
  type InsertProject,
  type InsertReport,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Organization operations
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  getOrganizationByCode(code: string): Promise<Organization | undefined>;

  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUsersByOrganization(organizationId: number): Promise<User[]>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjectsByOrganization(organizationId: number): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project>;

  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReportsByProject(projectId: number): Promise<Report[]>;
  getReportsByOrganization(organizationId: number): Promise<Report[]>;
  getPendingReports(organizationId: number): Promise<Report[]>;
  getReportById(id: number): Promise<Report | undefined>;
  updateReportStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<Report>;
}

export class DatabaseStorage implements IStorage {
  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const [created] = await db.insert(organizations).values(organization).returning();
    return created;
  }

  async getOrganizationByCode(code: string): Promise<Organization | undefined> {
    const [organization] = await db.select().from(organizations).where(eq(organizations.code, code));
    return organization;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsersByOrganization(organizationId: number): Promise<User[]> {
    return await db.select().from(users).where(eq(users.organizationId, organizationId));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async getProjectsByOrganization(organizationId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.organizationId, organizationId));
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const [updated] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return updated;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [created] = await db.insert(reports).values(report).returning();
    return created;
  }

  async getReportsByProject(projectId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.projectId, projectId)).orderBy(desc(reports.submittedAt));
  }

  async getReportsByOrganization(organizationId: number): Promise<Report[]> {
    return await db
      .select({
        id: reports.id,
        title: reports.title,
        content: reports.content,
        files: reports.files,
        status: reports.status,
        projectId: reports.projectId,
        submittedBy: reports.submittedBy,
        reviewedBy: reports.reviewedBy,
        reviewNotes: reports.reviewNotes,
        submittedAt: reports.submittedAt,
        reviewedAt: reports.reviewedAt,
      })
      .from(reports)
      .innerJoin(projects, eq(reports.projectId, projects.id))
      .where(eq(projects.organizationId, organizationId))
      .orderBy(desc(reports.submittedAt));
  }

  async getPendingReports(organizationId: number): Promise<Report[]> {
    return await db
      .select({
        id: reports.id,
        title: reports.title,
        content: reports.content,
        files: reports.files,
        status: reports.status,
        projectId: reports.projectId,
        submittedBy: reports.submittedBy,
        reviewedBy: reports.reviewedBy,
        reviewNotes: reports.reviewNotes,
        submittedAt: reports.submittedAt,
        reviewedAt: reports.reviewedAt,
      })
      .from(reports)
      .innerJoin(projects, eq(reports.projectId, projects.id))
      .where(and(eq(projects.organizationId, organizationId), eq(reports.status, "pending")))
      .orderBy(desc(reports.submittedAt));
  }

  async getReportById(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async updateReportStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<Report> {
    const [updated] = await db
      .update(reports)
      .set({
        status,
        reviewedBy,
        reviewNotes,
        reviewedAt: new Date(),
      })
      .where(eq(reports.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();

import {
  organizations,
  users,
  projects,
  reports,
  messages,
  type Organization,
  type User,
  type Project,
  type Report,
  type Message,
  type InsertOrganization,
  type InsertUser,
  type InsertProject,
  type InsertReport,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, inArray, sql } from "drizzle-orm";

export interface IStorage {
  // Organization operations
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  getOrganizationByCode(code: string): Promise<Organization | undefined>;
  getOrganizationById(id: number): Promise<Organization | undefined>;

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

  // Message operations
  sendMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(senderId: number, recipientId: number, organizationId: number): Promise<Message[]>;
  getUnreadMessagesForUser(userId: number, organizationId: number): Promise<Message[]>;
  markMessageAsRead(messageId: number): Promise<void>;

  // Bulk operations
  bulkDeleteProjects(projectIds: number[], organizationId: number): Promise<void>;
  bulkUpdateProjectStatus(projectIds: number[], status: string, organizationId: number): Promise<void>;
  getProjectsForExport(projectIds: number[], organizationId: number): Promise<any[]>;
  bulkUpdateReportStatus(reportIds: number[], status: string, reviewedBy: number, organizationId: number): Promise<void>;
  getReportsForExport(reportIds: number[], organizationId: number): Promise<any[]>;
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

  async getOrganizationById(id: number): Promise<Organization | undefined> {
    const [organization] = await db.select().from(organizations).where(eq(organizations.id, id));
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

  // Message operations
  async sendMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async getMessagesBetweenUsers(senderId: number, recipientId: number, organizationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.organizationId, organizationId),
          or(
            and(
              eq(messages.senderId, senderId),
              eq(messages.recipientId, recipientId)
            ),
            and(
              eq(messages.senderId, recipientId),
              eq(messages.recipientId, senderId)
            )
          )
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async getUnreadMessagesForUser(userId: number, organizationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.recipientId, userId),
          eq(messages.organizationId, organizationId),
          eq(messages.isRead, false)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  // Bulk operations
  async bulkDeleteProjects(projectIds: number[], organizationId: number): Promise<void> {
    await db
      .delete(projects)
      .where(
        and(
          inArray(projects.id, projectIds),
          eq(projects.organizationId, organizationId)
        )
      );
  }

  async bulkUpdateProjectStatus(projectIds: number[], status: string, organizationId: number): Promise<void> {
    await db
      .update(projects)
      .set({ status })
      .where(
        and(
          inArray(projects.id, projectIds),
          eq(projects.organizationId, organizationId)
        )
      );
  }

  async getProjectsForExport(projectIds: number[], organizationId: number): Promise<any[]> {
    if (projectIds.length > 0) {
      return await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.organizationId, organizationId),
            inArray(projects.id, projectIds)
          )
        );
    } else {
      return await db
        .select()
        .from(projects)
        .where(eq(projects.organizationId, organizationId));
    }
  }

  async bulkUpdateReportStatus(reportIds: number[], status: string, reviewedBy: number, organizationId: number): Promise<void> {
    const validReports = await db
      .select({ id: reports.id })
      .from(reports)
      .innerJoin(projects, eq(reports.projectId, projects.id))
      .where(
        and(
          inArray(reports.id, reportIds),
          eq(projects.organizationId, organizationId)
        )
      );

    const validReportIds = validReports.map(r => r.id);

    if (validReportIds.length > 0) {
      await db
        .update(reports)
        .set({
          status,
          reviewedBy,
          reviewedAt: new Date(),
        })
        .where(inArray(reports.id, validReportIds));
    }
  }

  async getReportsForExport(reportIds: number[], organizationId: number): Promise<any[]> {
    if (reportIds.length > 0) {
      return await db
        .select({
          id: reports.id,
          title: reports.title,
          description: reports.content,
          status: reports.status,
          createdAt: reports.submittedAt,
          reviewNotes: reports.reviewNotes,
          projectName: projects.name,
          submittedByName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        })
        .from(reports)
        .innerJoin(projects, eq(reports.projectId, projects.id))
        .innerJoin(users, eq(reports.submittedBy, users.id))
        .where(
          and(
            eq(projects.organizationId, organizationId),
            inArray(reports.id, reportIds)
          )
        );
    } else {
      return await db
        .select({
          id: reports.id,
          title: reports.title,
          description: reports.content,
          status: reports.status,
          createdAt: reports.submittedAt,
          reviewNotes: reports.reviewNotes,
          projectName: projects.name,
          submittedByName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        })
        .from(reports)
        .innerJoin(projects, eq(reports.projectId, projects.id))
        .innerJoin(users, eq(reports.submittedBy, users.id))
        .where(eq(projects.organizationId, organizationId));
    }
  }
}

export const storage = new DatabaseStorage();

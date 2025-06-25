import { pgTable, text, varchar, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(), // 'admin' or 'officer'
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  budgetUsed: decimal("budget_used", { precision: 10, scale: 2 }).default("0"), // Amount spent so far
  deadline: timestamp("deadline"),
  daysLeft: integer("days_left"),
  isOverdue: boolean("is_overdue").default(false),
  overdueNotificationSent: boolean("overdue_notification_sent").default(false),
  goals: text("goals"),
  status: text("status").notNull().default("active"), // 'active', 'on-hold', 'completed', 'cancelled', 'overdue'
  progress: integer("progress").default(0), // Progress percentage 0-100
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  files: jsonb("files"), // Array of file metadata objects
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  projectId: integer("project_id").references(() => projects.id).notNull(),
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

// Messages table for admin-to-team communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  urgency: varchar("urgency", { length: 20 }).default("normal").notNull(), // low, normal, high, urgent
  isRead: boolean("is_read").default(false).notNull(),
  fileUrl: text("file_url"), // URL to uploaded file
  fileName: text("file_name"), // Original filename
  fileSize: integer("file_size"), // File size in bytes
  fileType: text("file_type"), // MIME type
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meeting bookings table for sales inquiries
export const meetingBookings = pgTable("meeting_bookings", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  phone: text("phone"),
  organizationType: text("organization_type"),
  teamSize: text("team_size"),
  meetingPurpose: text("meeting_purpose"),
  preferredTime: text("preferred_time"),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, contacted, scheduled, completed, cancelled
  requestId: text("request_id").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  projects: many(projects),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  createdProjects: many(projects),
  submittedReports: many(reports, { relationName: "submittedReports" }),
  reviewedReports: many(reports, { relationName: "reviewedReports" }),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  project: one(projects, {
    fields: [reports.projectId],
    references: [projects.id],
  }),
  submitter: one(users, {
    fields: [reports.submittedBy],
    references: [users.id],
    relationName: "submittedReports",
  }),
  reviewer: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id],
    relationName: "reviewedReports",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  organization: one(organizations, {
    fields: [messages.organizationId],
    references: [organizations.id],
  }),
}));

// Insert schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertMeetingBookingSchema = createInsertSchema(meetingBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type MeetingBooking = typeof meetingBookings.$inferSelect;
export type InsertMeetingBooking = z.infer<typeof insertMeetingBookingSchema>;

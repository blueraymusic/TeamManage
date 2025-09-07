import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { IStorage } from './storage.js';
import { 
  Organization, 
  InsertOrganization, 
  User, 
  InsertUser, 
  Project, 
  InsertProject, 
  Report, 
  InsertReport, 
  Message, 
  InsertMessage, 
  MeetingBooking, 
  InsertMeetingBooking 
} from '@shared/schema';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface CSVData {
  organizations: Organization[];
  users: User[];
  projects: Project[];
  reports: Report[];
  messages: Message[];
  meetingBookings: MeetingBooking[];
}

export class CSVStorage implements IStorage {
  private dataDir = path.join(process.cwd(), 'data');
  private data: CSVData = {
    organizations: [],
    users: [],
    projects: [],
    reports: [],
    messages: [],
    meetingBookings: []
  };

  constructor() {
    this.ensureDataDir();
    this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private async loadData() {
    try {
      // Load all CSV files
      await Promise.all([
        this.loadCSV('organizations'),
        this.loadCSV('users'),
        this.loadCSV('projects'),
        this.loadCSV('reports'),
        this.loadCSV('messages'),
        this.loadCSV('meetingBookings')
      ]);
    } catch (error) {
      console.log('No existing CSV files found, starting with empty data');
    }
  }

  private async loadCSV(entity: keyof CSVData) {
    const filePath = path.join(this.dataDir, `${entity}.csv`);
    if (!fs.existsSync(filePath)) {
      this.data[entity] = [];
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Convert string IDs back to numbers
          if (data.id) data.id = parseInt(data.id);
          if (data.organizationId) data.organizationId = parseInt(data.organizationId);
          if (data.projectId) data.projectId = parseInt(data.projectId);
          if (data.submittedBy) data.submittedBy = parseInt(data.submittedBy);
          if (data.reviewedBy) data.reviewedBy = parseInt(data.reviewedBy);
          if (data.senderId) data.senderId = parseInt(data.senderId);
          if (data.recipientId) data.recipientId = parseInt(data.recipientId);
          if (data.createdBy) data.createdBy = parseInt(data.createdBy);
          if (data.progress) data.progress = parseInt(data.progress);
          if (data.daysLeft) data.daysLeft = parseInt(data.daysLeft);
          if (data.isOverdue) data.isOverdue = data.isOverdue === 'true';
          if (data.overdueNotificationSent) data.overdueNotificationSent = data.overdueNotificationSent === 'true';
          if (data.isRead) data.isRead = data.isRead === 'true';
          if (data.fileSize) data.fileSize = parseInt(data.fileSize);
          
          results.push(data);
        })
        .on('end', () => {
          (this.data[entity] as any[]) = results;
          resolve();
        })
        .on('error', reject);
    });
  }

  private async saveCSV(entity: keyof CSVData) {
    const filePath = path.join(this.dataDir, `${entity}.csv`);
    const data = this.data[entity];
    
    if (data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]).map(key => ({ id: key, title: key }));
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers
    });

    await csvWriter.writeRecords(data);
  }

  private getNextId(entity: keyof CSVData): number {
    const data = this.data[entity] as any[];
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
  }

  // Organization operations
  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const newOrg: Organization = {
      id: this.getNextId('organizations'),
      ...organization,
      createdAt: new Date()
    };
    
    this.data.organizations.push(newOrg);
    await this.saveCSV('organizations');
    return newOrg;
  }

  async getOrganizationByCode(code: string): Promise<Organization | undefined> {
    return this.data.organizations.find(org => org.code === code);
  }

  async getOrganizationById(id: number): Promise<Organization | undefined> {
    return this.data.organizations.find(org => org.id === id);
  }

  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.getNextId('users'),
      ...user,
      createdAt: new Date()
    };
    
    this.data.users.push(newUser);
    await this.saveCSV('users');
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.data.users.find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.data.users.find(user => user.id === id);
  }

  async getUsersByOrganization(organizationId: number): Promise<User[]> {
    return this.data.users.filter(user => user.organizationId === organizationId);
  }

  async deleteUser(id: number): Promise<void> {
    // Remove user
    this.data.users = this.data.users.filter(user => user.id !== id);
    
    // Remove related messages and reports
    this.data.messages = this.data.messages.filter(msg => 
      msg.senderId !== id && msg.recipientId !== id
    );
    this.data.reports = this.data.reports.filter(report => 
      report.submittedBy !== id
    );
    
    await Promise.all([
      this.saveCSV('users'),
      this.saveCSV('messages'), 
      this.saveCSV('reports')
    ]);
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    // Calculate days left if deadline is provided
    if (project.deadline) {
      const deadline = new Date(project.deadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);
      const diffTime = deadline.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      project.daysLeft = daysLeft;
      project.isOverdue = daysLeft < 0;
    }

    const newProject: Project = {
      id: this.getNextId('projects'),
      ...project,
      createdAt: new Date()
    };
    
    this.data.projects.push(newProject);
    await this.saveCSV('projects');
    return newProject;
  }

  async getProjectsByOrganization(organizationId: number): Promise<Project[]> {
    return this.data.projects.filter(project => project.organizationId === organizationId);
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.data.projects.find(project => project.id === id);
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const projectIndex = this.data.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    this.data.projects[projectIndex] = { ...this.data.projects[projectIndex], ...updates };
    await this.saveCSV('projects');
    return this.data.projects[projectIndex];
  }

  async updateReport(id: number, updates: Partial<Report>): Promise<Report> {
    const reportIndex = this.data.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }
    
    this.data.reports[reportIndex] = { ...this.data.reports[reportIndex], ...updates };
    await this.saveCSV('reports');
    return this.data.reports[reportIndex];
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const newReport: Report = {
      id: this.getNextId('reports'),
      ...report,
      submittedAt: new Date(),
      reviewedAt: null
    };
    
    this.data.reports.push(newReport);
    await this.saveCSV('reports');
    return newReport;
  }

  async getReportsByProject(projectId: number): Promise<Report[]> {
    return this.data.reports.filter(report => report.projectId === projectId);
  }

  async getReportsByOrganization(organizationId: number): Promise<Report[]> {
    const orgProjects = this.data.projects.filter(p => p.organizationId === organizationId);
    const projectIds = orgProjects.map(p => p.id);
    return this.data.reports.filter(report => projectIds.includes(report.projectId));
  }

  async getPendingReports(organizationId: number): Promise<Report[]> {
    const orgReports = await this.getReportsByOrganization(organizationId);
    return orgReports.filter(report => report.status === 'submitted');
  }

  async getReportById(id: number): Promise<Report | undefined> {
    return this.data.reports.find(report => report.id === id);
  }

  async updateReportStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string): Promise<Report> {
    const reportIndex = this.data.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }
    
    this.data.reports[reportIndex] = {
      ...this.data.reports[reportIndex],
      status,
      reviewedBy,
      reviewNotes: reviewNotes || null,
      reviewedAt: new Date()
    };
    
    await this.saveCSV('reports');
    return this.data.reports[reportIndex];
  }

  async recallReport(id: number, officerId: number): Promise<Report> {
    const reportIndex = this.data.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }
    
    if (this.data.reports[reportIndex].submittedBy !== officerId) {
      throw new Error('Unauthorized to recall this report');
    }
    
    this.data.reports[reportIndex] = {
      ...this.data.reports[reportIndex],
      status: 'draft',
      reviewedBy: null,
      reviewNotes: null,
      reviewedAt: null
    };
    
    await this.saveCSV('reports');
    return this.data.reports[reportIndex];
  }

  // Message operations
  async sendMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: this.getNextId('messages'),
      ...message,
      isRead: false,
      createdAt: new Date()
    };
    
    this.data.messages.push(newMessage);
    await this.saveCSV('messages');
    return newMessage;
  }

  async getMessagesBetweenUsers(senderId: number, recipientId: number, organizationId: number): Promise<Message[]> {
    return this.data.messages.filter(msg => 
      msg.organizationId === organizationId &&
      ((msg.senderId === senderId && msg.recipientId === recipientId) ||
       (msg.senderId === recipientId && msg.recipientId === senderId))
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async getAllMessagesForOrganization(organizationId: number): Promise<Message[]> {
    return this.data.messages.filter(msg => msg.organizationId === organizationId);
  }

  async getUnreadMessagesForUser(userId: number, organizationId: number): Promise<Message[]> {
    return this.data.messages.filter(msg => 
      msg.recipientId === userId && 
      msg.organizationId === organizationId && 
      !msg.isRead
    );
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    const messageIndex = this.data.messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      this.data.messages[messageIndex].isRead = true;
      await this.saveCSV('messages');
    }
  }

  async markAllMessagesAsReadForUser(userId: number, organizationId: number): Promise<void> {
    let updated = false;
    this.data.messages.forEach(msg => {
      if (msg.recipientId === userId && msg.organizationId === organizationId && !msg.isRead) {
        msg.isRead = true;
        updated = true;
      }
    });
    
    if (updated) {
      await this.saveCSV('messages');
    }
  }

  // Bulk operations
  async bulkDeleteProjects(projectIds: number[], organizationId: number): Promise<void> {
    this.data.projects = this.data.projects.filter(p => 
      !(projectIds.includes(p.id) && p.organizationId === organizationId)
    );
    
    // Also delete related reports
    this.data.reports = this.data.reports.filter(r => !projectIds.includes(r.projectId));
    
    await Promise.all([
      this.saveCSV('projects'),
      this.saveCSV('reports')
    ]);
  }

  async bulkUpdateProjectStatus(projectIds: number[], status: string, organizationId: number): Promise<void> {
    let updated = false;
    this.data.projects.forEach(project => {
      if (projectIds.includes(project.id) && project.organizationId === organizationId) {
        project.status = status;
        updated = true;
      }
    });
    
    if (updated) {
      await this.saveCSV('projects');
    }
  }

  async getProjectsForExport(projectIds: number[], organizationId: number): Promise<any[]> {
    return this.data.projects.filter(p => 
      projectIds.includes(p.id) && p.organizationId === organizationId
    );
  }

  async bulkUpdateReportStatus(reportIds: number[], status: string, reviewedBy: number, organizationId: number): Promise<void> {
    let updated = false;
    this.data.reports.forEach(report => {
      const project = this.data.projects.find(p => p.id === report.projectId);
      if (reportIds.includes(report.id) && project?.organizationId === organizationId) {
        report.status = status;
        report.reviewedBy = reviewedBy;
        report.reviewedAt = new Date();
        updated = true;
      }
    });
    
    if (updated) {
      await this.saveCSV('reports');
    }
  }

  async getReportsForExport(reportIds: number[], organizationId: number): Promise<any[]> {
    const orgProjects = this.data.projects.filter(p => p.organizationId === organizationId);
    const projectIds = orgProjects.map(p => p.id);
    
    return this.data.reports.filter(r => 
      reportIds.includes(r.id) && projectIds.includes(r.projectId)
    );
  }

  // Meeting booking operations
  async createMeetingBooking(booking: InsertMeetingBooking): Promise<MeetingBooking> {
    const newBooking: MeetingBooking = {
      id: this.getNextId('meetingBookings'),
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.data.meetingBookings.push(newBooking);
    await this.saveCSV('meetingBookings');
    return newBooking;
  }

  async getMeetingBookings(status?: string): Promise<MeetingBooking[]> {
    if (status) {
      return this.data.meetingBookings.filter(booking => booking.status === status);
    }
    return this.data.meetingBookings;
  }

  async getMeetingBookingById(id: number): Promise<MeetingBooking | undefined> {
    return this.data.meetingBookings.find(booking => booking.id === id);
  }

  async updateMeetingBookingStatus(id: number, status: string): Promise<MeetingBooking> {
    const bookingIndex = this.data.meetingBookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      throw new Error('Meeting booking not found');
    }
    
    this.data.meetingBookings[bookingIndex] = {
      ...this.data.meetingBookings[bookingIndex],
      status,
      updatedAt: new Date()
    };
    
    await this.saveCSV('meetingBookings');
    return this.data.meetingBookings[bookingIndex];
  }

  async getMeetingBookingByRequestId(requestId: string): Promise<MeetingBooking | undefined> {
    return this.data.meetingBookings.find(booking => booking.requestId === requestId);
  }
}

export const csvStorage = new CSVStorage();
import { db } from "./db";
import { projects, users } from "@shared/schema";
import { eq, and, ne, isNull, or } from "drizzle-orm";
import { emailService } from "./emailNotifications";

export class DeadlineTracker {
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Calculate days left until deadline
   */
  static calculateDaysLeft(deadline: Date): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    // Reset time to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Update days left for all projects with deadlines
   */
  async updateProjectDeadlines(): Promise<void> {
    try {
      console.log("Running daily deadline update...");
      
      // Get all active projects with deadlines
      const activeProjects = await db
        .select()
        .from(projects)
        .where(
          and(
            ne(projects.status, "completed"),
            ne(projects.status, "cancelled"),
            isNull(projects.deadline) === false
          )
        );

      const updates = [];
      const overdueProjects = [];

      for (const project of activeProjects) {
        if (!project.deadline) continue;

        const daysLeft = DeadlineTracker.calculateDaysLeft(project.deadline);
        const isOverdue = daysLeft < 0;

        // Update project with new days left and overdue status
        updates.push(
          db
            .update(projects)
            .set({
              daysLeft: daysLeft,
              isOverdue: isOverdue,
              status: isOverdue && project.status === "active" ? "overdue" : project.status,
              updatedAt: new Date(),
            })
            .where(eq(projects.id, project.id))
        );

        // Track projects that just became overdue (need notifications)
        if (isOverdue && !project.overdueNotificationSent) {
          overdueProjects.push(project);
        }
      }

      // Execute all updates
      await Promise.all(updates);

      // Send overdue notifications
      if (overdueProjects.length > 0) {
        await this.sendOverdueNotifications(overdueProjects);
      }

      console.log(`Updated ${activeProjects.length} projects, ${overdueProjects.length} became overdue`);
    } catch (error) {
      console.error("Error updating project deadlines:", error);
    }
  }

  /**
   * Send notifications for overdue projects
   */
  private async sendOverdueNotifications(overdueProjects: any[]): Promise<void> {
    try {
      for (const project of overdueProjects) {
        // Get all team members for this organization
        const teamMembers = await db
          .select()
          .from(users)
          .where(eq(users.organizationId, project.organizationId));

        // Send email notifications to all team members
        const emailPromises = teamMembers.map(async (member) => {
          if (member.email) {
            const subject = `⚠️ Project Overdue: ${project.name}`;
            const content = this.generateOverdueEmailContent(project, member);
            
            return emailService.sendEmail({
              to: member.email,
              from: "notifications@adel-ngo.com",
              subject: subject,
              html: content.html,
              text: content.text,
            });
          }
        });

        await Promise.all(emailPromises.filter(Boolean));

        // Mark notification as sent
        await db
          .update(projects)
          .set({
            overdueNotificationSent: true,
            updatedAt: new Date(),
          })
          .where(eq(projects.id, project.id));
      }
    } catch (error) {
      console.error("Error sending overdue notifications:", error);
    }
  }

  /**
   * Generate email content for overdue notifications
   */
  private generateOverdueEmailContent(project: any, member: any): { html: string; text: string } {
    const daysOverdue = Math.abs(project.daysLeft || 0);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⚠️ Project Overdue</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Immediate attention required</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">Hello ${member.firstName || member.email},</p>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; color: #dc2626; font-size: 20px;">Project "${project.name}" is Overdue</h2>
            <p style="margin: 0 0 10px 0; color: #7f1d1d;"><strong>Days overdue:</strong> ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}</p>
            <p style="margin: 0 0 10px 0; color: #7f1d1d;"><strong>Original deadline:</strong> ${new Date(project.deadline).toLocaleDateString()}</p>
            <p style="margin: 0; color: #7f1d1d;"><strong>Current progress:</strong> ${project.progress || 0}%</p>
          </div>
          
          <div style="margin: 25px 0;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Required Actions:</h3>
            <ul style="color: #6b7280; line-height: 1.6; padding-left: 20px;">
              <li>Review project status and update progress immediately</li>
              <li>Submit any pending reports or documentation</li>
              <li>Coordinate with team members to accelerate completion</li>
              <li>Contact project admin if deadline extension is needed</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Access Project Dashboard
            </a>
          </div>
          
          <p style="margin: 20px 0 0 0; font-size: 14px; color: #9ca3af; text-align: center;">
            This is an automated notification from ADEL Project Management System
          </p>
        </div>
      </div>
    `;

    const text = `
PROJECT OVERDUE NOTIFICATION

Hello ${member.firstName || member.email},

Project "${project.name}" is now overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}.

Project Details:
- Original deadline: ${new Date(project.deadline).toLocaleDateString()}
- Current progress: ${project.progress || 0}%

Required Actions:
1. Review project status and update progress immediately
2. Submit any pending reports or documentation
3. Coordinate with team members to accelerate completion
4. Contact project admin if deadline extension is needed

Access your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5000'}

This is an automated notification from ADEL Project Management System.
    `;

    return { html, text };
  }

  /**
   * Get deadline status for display
   */
  static getDeadlineStatus(project: any): { 
    text: string; 
    color: string; 
    urgency: 'safe' | 'warning' | 'danger' | 'overdue' 
  } {
    if (!project.deadline) {
      return { text: 'No deadline', color: 'text-gray-500', urgency: 'safe' };
    }

    const daysLeft = project.daysLeft ?? DeadlineTracker.calculateDaysLeft(project.deadline);

    if (daysLeft < 0) {
      const daysOverdue = Math.abs(daysLeft);
      return { 
        text: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`, 
        color: 'text-red-600', 
        urgency: 'overdue' 
      };
    } else if (daysLeft === 0) {
      return { text: 'Due today', color: 'text-red-500', urgency: 'danger' };
    } else if (daysLeft === 1) {
      return { text: '1 day left', color: 'text-orange-500', urgency: 'danger' };
    } else if (daysLeft <= 3) {
      return { text: `${daysLeft} days left`, color: 'text-orange-500', urgency: 'warning' };
    } else if (daysLeft <= 7) {
      return { text: `${daysLeft} days left`, color: 'text-yellow-600', urgency: 'warning' };
    } else {
      return { text: `${daysLeft} days left`, color: 'text-green-600', urgency: 'safe' };
    }
  }

  /**
   * Start the daily deadline tracking
   */
  start(): void {
    // Run immediately on start
    this.updateProjectDeadlines();

    // Then run every 24 hours (86400000 ms)
    this.intervalId = setInterval(() => {
      this.updateProjectDeadlines();
    }, 86400000);

    console.log("Deadline tracker started - running daily updates");
  }

  /**
   * Stop the deadline tracking
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Deadline tracker stopped");
    }
  }
}

export const deadlineTracker = new DeadlineTracker();
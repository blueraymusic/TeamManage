import { MeetingBooking } from "@shared/schema";

// Email notification service for meeting bookings
export class EmailNotificationService {
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!process.env.SENDGRID_API_KEY;
  }

  async sendNewBookingNotification(booking: MeetingBooking): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('📧 Platform Owner Notification:', {
        to: process.env.OWNER_EMAIL || 'owner@adelplatform.com',
        subject: `New ADEL Demo Request from ${booking.company}`,
        requestId: booking.requestId,
        prospect: {
          name: `${booking.firstName} ${booking.lastName}`,
          email: booking.email,
          company: booking.company,
          organizationType: booking.organizationType,
          teamSize: booking.teamSize,
          meetingPurpose: booking.meetingPurpose,
          preferredTime: booking.preferredTime,
          phone: booking.phone,
          message: booking.message
        },
        submittedAt: booking.createdAt
      });
      return true;
    }

    try {
      // When SENDGRID_API_KEY is provided, this will send actual emails
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const ownerEmail = {
        to: process.env.OWNER_EMAIL || 'owner@adelplatform.com', // Your email as platform owner
        from: 'noreply@adelplatform.com', // Replace with your verified sender
        subject: `New ADEL Demo Request from ${booking.company}`,
        html: this.generateOwnerEmailHTML(booking),
        text: this.generateOwnerEmailText(booking)
      };

      const confirmationEmail = {
        to: booking.email,
        from: 'noreply@adelplatform.com',
        subject: 'Demo Request Received - ADEL Platform',
        html: this.generateConfirmationEmailHTML(booking),
        text: this.generateConfirmationEmailText(booking)
      };

      await Promise.all([
        sgMail.send(ownerEmail),
        sgMail.send(confirmationEmail)
      ]);

      return true;
    } catch (error) {
      console.error('Email notification failed:', error);
      return false;
    }
  }

  private generateOwnerEmailHTML(booking: MeetingBooking): string {
    return `
      <h2>🎯 New ADEL Platform Demo Request</h2>
      <p>A potential customer wants to see your NGO management platform in action!</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">👤 Prospect Information</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Contact:</strong> ${booking.firstName} ${booking.lastName}</li>
          <li><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></li>
          <li><strong>Phone:</strong> ${booking.phone || 'Not provided'}</li>
          <li><strong>Organization:</strong> ${booking.company}</li>
        </ul>
      </div>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0284c7; margin-top: 0;">🏢 Organization Profile</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Type:</strong> ${booking.organizationType || 'Not specified'}</li>
          <li><strong>Team Size:</strong> ${booking.teamSize || 'Not specified'}</li>
        </ul>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #16a34a; margin-top: 0;">📅 Meeting Request</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Interest:</strong> ${booking.meetingPurpose || 'Product Demo'}</li>
          <li><strong>Preferred Time:</strong> ${booking.preferredTime || 'Flexible'}</li>
        </ul>
      </div>
      
      ${booking.message ? `
        <div style="background: #fef7cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #a16207; margin-top: 0;">💬 Their Message</h3>
          <p style="font-style: italic;">"${booking.message}"</p>
        </div>
      ` : ''}
      
      <hr style="margin: 30px 0;">
      <p><strong>Request ID:</strong> ${booking.requestId}</p>
      <p><strong>Submitted:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
      
      <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border-radius: 8px;">
        <p style="margin: 0;"><strong>💡 Next Steps:</strong> Reach out within 24 hours to schedule their personalized ADEL demo. This is a qualified lead interested in your NGO management platform!</p>
      </div>
    `;
  }

  private generateOwnerEmailText(booking: MeetingBooking): string {
    return `
🎯 NEW ADEL PLATFORM DEMO REQUEST

A potential customer wants to see your NGO management platform!

PROSPECT INFORMATION:
- Contact: ${booking.firstName} ${booking.lastName}
- Email: ${booking.email}
- Phone: ${booking.phone || 'Not provided'}
- Organization: ${booking.company}

ORGANIZATION PROFILE:
- Type: ${booking.organizationType || 'Not specified'}
- Team Size: ${booking.teamSize || 'Not specified'}

MEETING REQUEST:
- Interest: ${booking.meetingPurpose || 'Product Demo'}
- Preferred Time: ${booking.preferredTime || 'Flexible'}

${booking.message ? `THEIR MESSAGE: "${booking.message}"` : ''}

Request ID: ${booking.requestId}
Submitted: ${new Date(booking.createdAt).toLocaleString()}

NEXT STEPS: Reach out within 24 hours to schedule their personalized ADEL demo. This is a qualified lead interested in your NGO management platform!
    `;
  }

  private generateConfirmationEmailHTML(booking: MeetingBooking): string {
    return `
      <h2>Thank you for your interest in ADEL!</h2>
      <p>Hi ${booking.firstName},</p>
      
      <p>I've received your demo request for ${booking.company} and will personally reach out within 24 hours to schedule a demonstration of the ADEL platform.</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Your Request Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Request ID:</strong> ${booking.requestId}</li>
          <li><strong>Organization:</strong> ${booking.company}</li>
          <li><strong>Meeting Purpose:</strong> ${booking.meetingPurpose || 'Product Demo'}</li>
          <li><strong>Preferred Time:</strong> ${booking.preferredTime || 'Flexible'}</li>
        </ul>
      </div>
      
      <p>During our demo, I'll show you how ADEL can help ${booking.company} streamline project management, enhance team collaboration, and track progress more effectively.</p>
      
      <p>If you have any urgent questions before our meeting, feel free to reply to this email.</p>
      
      <p>Looking forward to connecting with you!</p>
      
      <p>Best regards,<br>
      ADEL Platform</p>
      
      <hr>
      <p><small>This confirmation was sent automatically. You can reply if you need to make changes to your request.</small></p>
    `;
  }

  private generateConfirmationEmailText(booking: MeetingBooking): string {
    return `
Thank you for your interest in ADEL!

Hi ${booking.firstName},

I've received your demo request for ${booking.company} and will personally reach out within 24 hours to schedule a demonstration of the ADEL platform.

Your Request Details:
- Request ID: ${booking.requestId}
- Organization: ${booking.company}
- Meeting Purpose: ${booking.meetingPurpose || 'Product Demo'}
- Preferred Time: ${booking.preferredTime || 'Flexible'}

During our demo, I'll show you how ADEL can help ${booking.company} streamline project management, enhance team collaboration, and track progress more effectively.

If you have any urgent questions before our meeting, feel free to reply to this email.

Looking forward to connecting with you!

Best regards,
ADEL Platform

---
This confirmation was sent automatically. You can reply if you need to make changes to your request.
    `;
  }
}

export const emailService = new EmailNotificationService();
# ADEL - NGO Project Management Platform

## Overview

ADEL is a comprehensive web-based project management platform designed specifically for NGOs and non-profit organizations. The system provides role-based access control with admin and officer roles, enabling efficient team collaboration, project tracking, and report management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for monorepo structure

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Session Management**: Express-session for authentication
- **File Handling**: Multer for file uploads with local storage
- **Email Service**: SendGrid integration for notifications

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Neon serverless)
- **Migration**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication & Authorization
- Role-based access control (Admin/Officer)
- Session-based authentication with secure cookies
- Organization-scoped access control
- Unique organization codes for team member registration

### Project Management
- Hierarchical project structure within organizations
- Budget tracking with spent amount monitoring
- Progress tracking with percentage completion
- Status management (active, on-hold, completed, cancelled)
- Deadline management with date tracking

### Report System
- File attachment support for progress reports
- Multi-stage approval workflow (pending, approved, rejected)
- Administrative review with notes capability
- Real-time status updates and notifications

### Team Collaboration
- Organization-based team management
- Real-time messaging system with urgency levels and unread notification badges
- File sharing capabilities within messages with consistent UI across roles
- Admin oversight of team communications
- Automatic message read status tracking and updates

### Internationalization
- Multi-language support (English/French)
- Client-side language switching
- Comprehensive translation system

## Data Flow

### User Registration Flow
1. Admin creates organization account and receives unique code
2. Officers register using organization code to join team
3. Role-based dashboard access is automatically configured

### Project Workflow
1. Admin creates projects with budget and timeline
2. Officers submit progress reports with file attachments
3. Admin reviews and approves/rejects reports
4. System automatically updates project progress metrics

### Communication Flow
1. Team members send messages with priority levels
2. File attachments are processed and stored locally
3. Real-time updates notify recipients of new messages
4. Admin has oversight capabilities for all communications

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with PostgreSQL dialect
- **UI Components**: Extensive Radix UI component library
- **Charts**: Recharts for data visualization
- **File Processing**: Multer for upload handling
- **Email**: SendGrid for notification delivery
- **Security**: bcrypt for password hashing

### Development Dependencies
- **Build**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full type safety across frontend and backend
- **Linting**: ESLint configuration for code quality
- **Hot Reload**: Vite HMR for development efficiency

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Compiled build with Node.js server
- **Database**: Environment-based DATABASE_URL configuration
- **Sessions**: Configurable session secrets

### Build Process
1. Frontend assets compiled with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static file serving configured for production
4. Database migrations run via Drizzle Kit

### File Storage
- Local file system storage in `uploads` directory
- Configurable file size limits (10MB default)
- Secure file access with authentication checks

## Changelog
```
Changelog:
- June 24, 2025. Initial setup
- June 24, 2025. Implemented message notification system with unread badges
- June 24, 2025. Fixed file upload UI consistency between admin and officer
- June 24, 2025. Added comprehensive file download debugging for admin-to-officer transfers
- June 24, 2025. Fixed React hooks violation in chat interface and implemented granular message read tracking
- June 24, 2025. Fixed report review display to show officer names and project names instead of IDs
- June 24, 2025. Enhanced footer with social media links and extended Quick Links (Pricing, FAQ, Support, Documentation)
- June 24, 2025. Created Privacy Policy and Terms of Service pages with professional content and routing
- June 24, 2025. Enhanced legal pages with modern design featuring hero sections, color-coded cards, glassmorphism effects, and professional iconography
- June 24, 2025. Updated legal pages to match main site theme with light gradient backgrounds instead of dark theme
- June 24, 2025. Redesigned contact sections in legal pages with enhanced card-based layout, availability indicators, and improved visual hierarchy
- June 24, 2025. Replaced all mailto links with popup contact forms across landing, Privacy Policy, and Terms of Service pages for better user experience
- June 25, 2025. Implemented scrollable team members list with 4 visible members at a time for better organization management
- June 25, 2025. Added search functionality to team members list for quick member lookup by name or email
- June 25, 2025. Implemented scrollable conversations list with search functionality for admin chat interface
- June 25, 2025. Optimized conversations display to show exactly 7 conversations at a time with matching layout
- June 25, 2025. Adjusted conversations to show 7 full conversations with 8th partially visible for better scrolling indication
- June 25, 2025. Enhanced key action buttons (Add Report, New Project) with improved visibility, sizing, and color-coding for better user experience
- June 25, 2025. Added scrollable reports display showing maximum 3 reports at a time for better space management in both admin and officer dashboards
- June 25, 2025. Implemented overdue project notifications with automatic filtering for completed projects and red badge counters on Projects tab
- June 25, 2025. Fixed deadline calculation accuracy and automatic status updates based on progress completion levels
- June 25, 2025. Deployed AI Assistant for Officer-Side Report Review with OpenAI integration for intelligent report analysis and improvement suggestions
- June 25, 2025. Enhanced AI analysis system with comprehensive file parsing (Excel, CSV, JSON, XML, text files) and reduced submission threshold to 40% for more accessible report approval
- June 25, 2025. Fixed asymmetric file sharing in messaging system between admin and officer roles
- June 25, 2025. Resolved message sending validation errors by fixing data transmission between client and server
- June 25, 2025. Updated AdminChatInterface to properly handle both text messages and file uploads with separate endpoints
- June 25, 2025. Added deadline and original deadline fields to Edit Project form with proper date formatting
- June 25, 2025. Fixed project status logic to automatically revert completed projects to active when progress drops below 100%
- June 27, 2025. Implemented report recall functionality allowing officers to withdraw submitted reports before admin review with "Call Back" button
- June 27, 2025. Enhanced officer dashboard with fully functional call back system - pending count displays correctly, officers can recall submitted reports to draft status, and edit recalled reports with improved button styling
- June 27, 2025. Implemented comprehensive responsive design with smooth transition animations across all dashboard components, forms, and UI elements. Added mobile-first breakpoints, enhanced hover effects, custom animations, and improved accessibility for mobile devices.
- June 27, 2025. Fixed submit report functionality in edit mode with proper data persistence. Enhanced ReportForm component with TypeScript type safety, proper form data loading for existing reports, and fixed validation issues. Edit functionality now correctly loads existing report data and updates reports without creating duplicates.
- June 27, 2025. Completed report edit and submission workflow. Fixed cancel button functionality, implemented proper form data loading for draft reports, and corrected submission flow to change report status from "draft" to "submitted" for admin approval. Reports now properly transition through the approval workflow.
- June 27, 2025. Implemented comprehensive Dashboard & Analytics enhancements with interactive charts, smart notifications, and performance insights. Added AnalyticsDashboard component with project status distribution pie charts, report trend analysis, budget utilization tracking, and progress analytics. Created SmartNotifications system with intelligent alerts for overdue projects, approaching deadlines, budget warnings, and performance insights. Enhanced both admin and officer dashboards with new Analytics tabs featuring responsive layouts and real-time data visualization using Recharts library.
- June 27, 2025. Enhanced analytics dashboard visual design with improved color schemes, professional gradients, and enhanced typography. Upgraded metric cards with gradient backgrounds, rounded icon containers, and better contrast ratios. Improved chart styling with donut charts, enhanced tooltips, gradient fills, and professional axis styling. Enhanced smart notifications with priority alert styling, better visual hierarchy, and improved color-coded severity indicators. Upgraded project timeline with professional card layouts and enhanced visual presentation throughout analytics components.
- June 27, 2025. Implemented comprehensive Budget Utilization Analysis with detailed financial tracking. Added budget summary cards showing total budget, spent amounts, and remaining funds with gradient backgrounds. Created enhanced budget visualization charts with gradient fills, professional tooltips, and currency formatting. Implemented project-level budget breakdown with utilization progress bars and detailed spending metrics for better financial oversight.
- June 27, 2025. Adjusted Budget Utilization Analysis component size to be more compact with reduced padding, smaller icons, compressed chart height, and optimized text sizes for better space efficiency while maintaining visual appeal and readability.
- June 27, 2025. Removed budget summary cards from Budget Utilization Analysis component and kept only the clean bar chart visualization to eliminate number display formatting issues and improve visual clarity.
- June 27, 2025. Fixed tooltip text color across all analytics dashboard charts (Budget Utilization, Project Status Distribution, Progress Distribution) to display white text for better visibility and readability against dark tooltip backgrounds.
- June 27, 2025. Redesigned complete landing page with comprehensive feature showcase including AI-powered analytics, smart notifications, advanced reporting, budget tracking, and team collaboration. Updated content to be inclusive for all organization types, not just NGOs. Created modern gradient design with smooth animations, interactive sections highlighting AI report analysis, smart notifications system, and comprehensive project management capabilities.
- June 27, 2025. Enhanced header navigation with professional styling including icons, hover effects, gradient underlines, and smooth-scrolling functionality. Improved navigation items with color-coded sections and interactive elements for better user experience.
- June 27, 2025. Simplified AI Report Analysis section to "AI Feedback on Reports" with clearer value proposition focusing on grammar check, clarity score, and action suggestions provided before admin approval.
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Preferred styling: Professional appearance without emojis, use proper icons instead.
```
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
- June 27, 2025. Added comprehensive optional features including AI scoring example (85/100 with sample feedback), PDF export for donors mention, live testimonials from three diverse organizations, and interactive dashboard preview with mock analytics cards showing real metrics and interface design.
- June 27, 2025. Implemented Interactive PDF Report Preview feature with professional report templates, real admin data integration, and donor-ready formatting. Added PDF Preview button to admin dashboard Reports section with seamless modal integration. Enhanced landing page to showcase professional PDF export capabilities for stakeholder reporting.
- June 28, 2025. Enhanced PDF Report Preview with distinct template content and real data integration. Created meaningful differences between Progress, Financial, and Analytics report templates using actual organization data. Added Analysis button to overview section for easy access to professional report templates.
- June 28, 2025. Implemented comprehensive PDF download functionality with dual options: bulk reports for entire organization (named as "hjhjhj: Project Management Report") and project-specific reports (named as "ProjectName: Report Type"). Added dropdown selection for individual project downloads with professional HTML export format and real-time data integration.
- June 28, 2025. Removed widgets functionality from both admin and officer dashboards to simplify the interface. Restored original tab structure with 5 tabs: Overview, Projects, Reports, Analytics, and Messages for officers; Overview, Projects, Reports, Analytics, and Team for admins. Fixed PDF report preview layout with improved spacing and responsive design.
- June 28, 2025. Fixed notification badge system for admin users. Messages tab badge now disappears after 2-second delay when viewing Messages tab. Individual officer conversation badges disappear immediately when viewing specific conversations. Corrected variable reference from selectedOfficer to selectedMemberId to prevent runtime errors.
- June 28, 2025. Implemented server-side PDF generation using Puppeteer to replace HTML downloads with actual PDF files. Added new API endpoint (/api/generate-pdf) for server-side PDF creation with proper file downloads. Enhanced PDF download UI with professional card-based design, clear descriptions, and improved visual hierarchy. Fixed Reports section layout to properly align PDF Preview and Bulk Report Operations buttons on the same level.
- June 28, 2025. Fixed persistent message notifications by implementing automatic message read tracking when conversations are opened in admin chat interface. Added proper message marking as read functionality to eliminate "view message" notifications that continued showing after messages were already seen. Enhanced notification dismissal logic with localStorage persistence for conversation badges.
- June 28, 2025. Completely removed floating message notification system per user request. Deleted FloatingMessageNotification component and cleaned up all references from admin and officer dashboards to eliminate persistent notification alerts entirely.
- June 28, 2025. Implemented comprehensive mobile-friendly responsive design across ADEL platform. Enhanced admin and officer dashboards with mobile breakpoints (sm/md/lg), touch-friendly interfaces, responsive grid layouts, compressed spacing for mobile, adaptive text sizes, mobile-optimized tabs with shortened labels, and improved card layouts for better mobile display. Added mobile-first design principles throughout the application.
- June 28, 2025. Completed comprehensive mobile-responsive design for landing page with adaptive layouts, mobile-optimized navigation, touch-friendly buttons, responsive hero section with mobile-first breakpoints, mobile-enhanced feature cards with compressed spacing, responsive footer with mobile-friendly social links, and mobile navigation button for smaller screens. Implemented progressive enhancement from mobile (sm) to tablet (md) to desktop (lg) breakpoints throughout entire landing page interface.
- June 28, 2025. Implemented ultra-mobile optimization for landing page with extreme space efficiency. Created ultra-compact header with 14px height, micro-spacing hero section, compressed feature cards with minimal padding, ultra-compact footer with inline navigation, and extreme mobile-first design targeting small screen devices. Reduced text sizes to xs/sm breakpoints, minimized button padding, compressed social media links, and optimized all spacing for maximum content fitting on mobile screens.
- June 28, 2025. Enhanced ultra-mobile header optimization with micro-compact design. Reduced header height to 10px (40px), minimized logo to 3x3px with 0.5px padding, compressed text to base size, and created micro-compact Start button with minimal spacing. Optimized for maximum space efficiency on smallest mobile screens while maintaining visual hierarchy and usability.
- June 28, 2025. Added competitive differentiation section "Why ADEL over Other Tools?" to clearly position against Trello and Monday. Highlighted unique NGO-focused features: built-in AI suggestions for reports, donor-ready PDF generation, NGO-tailored approval workflows, and simplified feature set without enterprise complexity. Created mobile-responsive grid with branded color coding and comparison callout emphasizing ADEL's mission-driven organization focus.
- June 28, 2025. Enhanced landing page with stronger pain point language and AI-focused positioning. Updated hero headline to "The First Project Management Tool with Built-In AI Report Feedback" and subtitle addressing specific frustrations: "No more messy spreadsheets, last-minute donor report panic, or guessing if project is on track." Transformed differentiation section titles to problem-focused language: "No More Report Guesswork," "No More Last-Minute Report Panic," "No More Email Approval Chaos," and "No More Feature Overwhelm." Added visual testimonials section with organizational logos, staff photos, and trust indicators showcasing 500+ NGOs and specific user quotes highlighting pain point solutions.
- June 28, 2025. Updated feature section titles to results-focused language: "Smart Project Tracking," "Collaborate Securely & Efficiently," and "Approval-Ready Reporting" to emphasize outcomes over features. Added dedicated "Why Teams Choose ADEL" section highlighting built-in AI feedback, ready-to-send PDF donor reports, simplicity for new team members, and NGO-specific workflows. Included call-to-action with value proposition "Join 500+ NGOs who've eliminated spreadsheet chaos and report panic" to reinforce problem-solving benefits and social proof.
- June 28, 2025. Enhanced features section with structured content and clear value propositions. Updated section title to "All-in-One Platform for Project Success" with subtitle emphasizing milestone-to-report workflow. Enhanced feature cards with emoji icons, detailed bullet points for capabilities (real-time updates, deadline monitoring, role-based access, PDF previews), and improved content hierarchy with separate descriptions and feature lists for better scanability.
- June 28, 2025. Redesigned dashboard interfaces with modern, professional aesthetics. Enhanced both admin and officer dashboards with gradient backgrounds, glassmorphism effects with backdrop-blur, rounded-xl containers, and shadow-lg styling. Updated header designs with gradient logos, text-gradient titles, and enhanced spacing. Modernized stats cards with gradient backgrounds, rounded-xl icon containers, hover animations, and improved visual hierarchy. Upgraded tabs containers with backdrop-blur-sm styling and border-white/50 transparency for professional appearance.
- June 29, 2025. Completely redesigned dashboards with AI-powered insights and concise, easy-to-use interface. Implemented AI Dashboard Service using OpenAI GPT-4o for intelligent project analysis, executive summaries, risk assessment, and actionable recommendations. Created streamlined admin and officer dashboards with prominent AI Insights button, executive summary cards, priority actions, key metrics visualization, and simplified navigation. Added comprehensive AI analysis including project health assessment, completion trends, budget efficiency tracking, team engagement metrics, and smart notifications. Enhanced user experience with compact headers, gradient design elements, and mobile-responsive layouts focused on essential information and AI-driven intelligence.
- June 29, 2025. Fixed AI report approval rate calculation to use authentic data (68.4% instead of incorrect 100%). Corrected calculation method to use actual approved vs rejected reports from database. Removed problematic empty charts section from AI Executive Summary. AI metrics now display authentic calculated values from real project data including On-Time Delivery: 50%, Budget Efficiency: 80%, Team Engagement: 70%.
- June 29, 2025. Enhanced AI Executive Summary with comprehensive project analysis including project objectives, key inputs & activities, and performance charts. Added detailed project information display showing individual project goals, budget allocation, team metrics, and resource utilization with color-coded cards. Integrated pie chart visualization for performance metrics with authentic data from project database.
- June 29, 2025. Completed comprehensive officer dashboard AI Executive Summary enhancement to match admin dashboard functionality. Added project objectives section, key inputs & activities with budget/team metrics, accomplishments & numbers with completion tracking, interactive pie chart visualization for performance metrics (On-Time Delivery 50%, Budget Efficiency 80%, Team Engagement 70%), and detailed project status breakdown with individual project cards showing progress, spending, and remaining budget.
- June 29, 2025. Fixed officer reports section with enhanced edit and view functionality. Added proper View button for all reports, Edit button for draft and rejected reports, comprehensive view modal with report content, attachments display with download functionality, and review notes display. Enhanced edit modal with proper ReportForm integration for seamless report editing workflow.
- June 29, 2025. Implemented comprehensive Intuitive Onboarding Walkthrough feature for both admin and officer roles. Created interactive guided tour with step-by-step navigation highlighting key dashboard features including overview metrics, project management, report submission, analytics insights, and team collaboration tools. Added Tour button to dashboard headers with first-time user detection via localStorage. Enhanced user onboarding experience with role-specific walkthrough content and smooth modal transitions.
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Preferred styling: Professional appearance without emojis, use proper icons instead.
```
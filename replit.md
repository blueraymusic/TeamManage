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
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```
# Overview

ADEL (Automated Data-Enhanced Ledger) is an AI-powered project management and reporting system designed for NGOs, government agencies, and organizations with distributed teams. The platform facilitates collaboration between administrators and field officers through role-based dashboards, real-time messaging, automated report review, and comprehensive analytics. Key features include AI-enhanced report analysis, project progress tracking, budget management, deadline monitoring, and PDF report generation for stakeholders.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with custom configuration
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization and analytics dashboards

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Session-based with express-session middleware
- **File Handling**: Multer for multipart form uploads with local storage
- **API Design**: RESTful endpoints with role-based access control
- **Background Services**: Deadline tracking service with automated notifications

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with schema-first approach
- **Schema Design**: 
  - Organizations with unique access codes
  - Role-based users (admin/officer) linked to organizations
  - Projects with budget tracking, deadlines, and progress
  - Reports with file attachments and approval workflow
  - Messages system for admin-officer communication
  - Meeting bookings for prospect management

## Authentication and Authorization
- **Session Management**: Express-session with organization-scoped access
- **Password Security**: BCrypt hashing with salt rounds
- **Role-Based Access**: Middleware enforcement for admin vs officer permissions
- **Organization Isolation**: All data queries filtered by organizationId

## External Dependencies
- **AI Integration**: OpenAI GPT-4o for intelligent report analysis and dashboard insights
- **Email Service**: SendGrid for automated notifications (optional configuration)
- **File Storage**: Local filesystem with organized upload directory structure
- **Deployment**: Designed for Replit with development tooling integration
- **Monitoring**: Built-in logging and error tracking for API endpoints

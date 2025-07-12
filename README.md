# ADEL — AI-Powered Project Management & Reporting System

**ADEL** (Automated Data-Enhanced Ledger) is a modern, AI-powered platform for managing projects, tracking field progress, and streamlining report approvals. Built for government agencies, NGOs, and enterprises, ADEL helps teams work smarter with intelligent automation, clean dashboards, and real-time insights.

---

## Features

-  **AI-Enhanced Report Review**  
  Built-in AI reviews submitted reports, flags inconsistencies, and suggests improvements automatically.

-  **Dynamic Dashboards**  
  Clear, role-based views for admins, project managers, and field agents.

-  **Structured Report Submission**  
  Field agents can upload reports with files, images, and documents.

-  **Auto-Progress Tracking**  
  Project status updates automatically when tasks or milestones are met.

-  **Regional Project Management**  
  Filter and organize reports by region, project type, or assigned teams.

-  **Smart Notifications**  
  Real-time alerts for pending approvals, rejected reports, and system activity.

---
<img width="1426" alt="Capture d’écran 2025-06-28 à 23 37 33" src="https://github.com/user-attachments/assets/351eb2c8-283d-4b0a-9b91-f54cacffe9bd" />


##  Who It’s For

- Government and local development agencies  
- NGOs and nonprofits with regional teams  
- Project and site managers  
- Field engineers and technical supervisors

---

<img width="1439" alt="Capture d’écran 2025-06-28 à 23 37 12" src="https://github.com/user-attachments/assets/d9526430-1b31-40a1-82f7-df2a39c11db9" />

##  Tech Stack

- **Backend:** Laravel / Node.js  
- **Frontend:** Vue.js / React.js  
- **Database:** MySQL / PostgreSQL  
- **Hosting:** Vercel, Netlify, DigitalOcean, or any modern cloud provider  
- **Authentication:** JWT / Laravel Sanctum / Firebase (depending on your stack)

---

##  Installation

<img width="1422" alt="Capture d’écran 2025-06-28 à 23 36 58" src="https://github.com/user-attachments/assets/8fb50bae-bad0-46f2-a062-e36a80482a70" />


```bash
# Clone the repository
git clone https://github.com/your-org/adel.git
cd adel

# Install frontend dependencies
npm install

# For Laravel backend
composer install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your DB credentials and app settings

# Run database migrations
php artisan migrate --seed

# Start development servers
npm run dev        # Frontend
php artisan serve  # Backend

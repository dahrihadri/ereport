# DMDPR Project Management System

## Overview

A modern project and task management system built for MCMC to track workload and project progress. The system provides managers and higher-ups with visibility into employee tasks and project status through an intuitive timeline and status-based dashboard.

## Features

### 1. Authentication
- Azure AD Single Sign-On integration
- User redirects to dashboard after successful login

### 2. Dashboard Views

#### Timeline View
- Visual timeline of all tasks sorted by start date
- Color-coded status indicators
- Progress bars for each task
- Task details including assignee, department, and dates

#### Kanban View
- Board-style view with columns for each status
- Drag-and-drop capability (to be implemented)
- Quick overview of task distribution

### 3. Task Management (CRUD Operations)

#### Create Task
- Add new tasks with detailed information
- Fields include:
  - Title and description
  - Status (Pending, In Progress, Completed, On Hold, Cancelled)
  - Priority (Low, Medium, High, Critical)
  - Assigned to (name and email)
  - Department
  - Start and end dates
  - Progress percentage

#### Read/View Task
- Click any task to view full details
- Timeline and Kanban view support

#### Update Task
- Edit existing tasks
- Update status and progress
- Modify assignments and dates

#### Delete Task
- Remove tasks with confirmation

### 4. Statistics & Analytics
- Total tasks count
- Tasks in progress
- Completed tasks
- Average progress across all tasks
- Status distribution visualization

### 5. Filtering & Views
- Filter tasks by status
- Switch between Timeline and Kanban views
- Real-time updates

## Project Structure

```
dmdpr-web/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── login/
│   │   └── page.tsx          # Login page with Azure AD
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Root redirect to login
├── components/
│   ├── Navbar.tsx            # Navigation bar with user menu
│   ├── TimelineView.tsx      # Timeline visualization
│   ├── TaskModal.tsx         # Task create/edit/view modal
│   ├── StatCard.tsx          # Statistics display card
│   ├── StatusBadge.tsx       # Status indicator badge
│   ├── PriorityBadge.tsx     # Priority indicator badge
│   └── ProgressBar.tsx       # Progress visualization
└── types/
    └── index.ts              # TypeScript type definitions
```

## Component Details

### Dashboard ([app/dashboard/page.tsx](app/dashboard/page.tsx))
Main application page featuring:
- Statistics overview cards
- View mode toggle (Timeline/Kanban)
- Status filter dropdown
- Task creation button
- Sample data with 5 demo tasks

### Timeline View ([components/TimelineView.tsx](components/TimelineView.tsx))
- Vertical timeline with date indicators
- Color-coded status dots
- Task cards with hover effects
- Progress bars
- Click to view details

### Task Modal ([components/TaskModal.tsx](components/TaskModal.tsx))
- Three modes: Create, Edit, View
- Form validation
- Date pickers
- Progress slider
- Status and priority dropdowns

### Navbar ([components/Navbar.tsx](components/Navbar.tsx))
- MCMC branding
- User profile dropdown
- Notifications icon
- Sign out option

## Types & Data Model

### Task Interface
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedToEmail: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  progress: number;
  tags?: string[];
  department?: string;
}
```

### Task Status
- `pending` - Not started
- `in_progress` - Currently working
- `completed` - Finished
- `on_hold` - Paused
- `cancelled` - Discontinued

### Priority Levels
- `low` - Minor tasks
- `medium` - Standard priority
- `high` - Important tasks
- `critical` - Urgent priority

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. Click "MCMC Azure AD" to access dashboard

## Next Steps

### Backend Integration
- Connect to database (PostgreSQL/MongoDB)
- Implement REST API endpoints
- Add authentication middleware
- Set up Azure AD configuration

### Additional Features
- Real-time updates using WebSockets
- Drag-and-drop for Kanban board
- Advanced filtering (by assignee, department, dates)
- Search functionality
- Export reports (PDF, Excel)
- Email notifications
- Task comments and activity log
- File attachments
- Gantt chart view
- Team collaboration features

### Security
- Role-based access control (RBAC)
- Audit logging
- Data encryption
- Session management

## Technologies Used

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: SVG (can add React Icons library)
- **State Management**: React useState (can migrate to Zustand/Redux)

## Color Scheme

- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Gray shades for UI elements

## Notes

- Currently using mock data (in-memory state)
- Azure AD integration is front-end only (needs backend setup)
- All CRUD operations are client-side (requires API integration)
- Responsive design for mobile/tablet/desktop

# Admin Panel Documentation

## Overview
The Admin Panel provides comprehensive management capabilities for the DMDPR system, including user management, organizational structure, and project administration.

## Access
- **URL**: `/admin`
- **Required Role**: `SYSTEM_ADMIN`
- **Navigation**: User menu → Admin Panel (visible only to System Admins)

## Features

### 1. User Management (`/admin/users`)
Manage system users, roles, and organizational assignments.

**Capabilities:**
- ✅ Create new users
- ✅ Edit user details (name, email, role, Azure AD ID)
- ✅ Assign users to sectors and divisions
- ✅ Activate/deactivate users
- ✅ Delete users
- ✅ Search and filter users by:
  - Name or email
  - Role
  - Active status

**Statistics:**
- Total users count
- Active/inactive users
- Admin count

### 2. Sector Management (`/admin/sectors`)
Manage top-level organizational units.

**Capabilities:**
- ✅ Create sectors
- ✅ Edit sector details (code, name, description)
- ✅ Assign Chief of Sector
- ✅ Delete sectors (if no divisions exist)
- ✅ View division count per sector

**Card View:**
- Displays sector code and name
- Shows assigned chief
- Displays division count

### 3. Division Management (`/admin/divisions`)
Manage divisions under sectors.

**Capabilities:**
- ✅ Create divisions
- ✅ Edit division details
- ✅ Map divisions to parent sectors
- ✅ Assign Head of Division
- ✅ Delete divisions (if no projects exist)
- ✅ Two view modes:
  - **Tree View**: Hierarchical sector → divisions
  - **List View**: Flat table view

**Tree View Features:**
- Expandable/collapsible sectors
- Visual hierarchy with icons
- Inline edit/delete actions

### 4. Project Management (`/admin/projects`)
Manage projects across all sectors and divisions.

**Capabilities:**
- ✅ Create projects
- ✅ Edit project details
- ✅ Assign to sector and division
- ✅ Set project status (active, completed, on hold, cancelled)
- ✅ Track start and end dates
- ✅ Delete projects
- ✅ Search and filter by:
  - Name or code
  - Status
  - Sector

**Statistics:**
- Total projects
- Active projects
- Completed projects
- On hold projects

## Data Persistence

**Current Implementation (Frontend MVP):**
- Uses in-memory storage via `/lib/admin-mock-data.ts`
- Changes persist during session
- Data resets on page refresh
- Perfect for prototyping and demos

**Future Upgrades:**
- Phase 2: API routes with session storage
- Phase 3: Database integration (Prisma + PostgreSQL)

## Component Structure

```
/app/admin/
├── layout.tsx              # Admin layout with tabs
├── page.tsx                # Redirects to /users
├── users/page.tsx          # User management
├── sectors/page.tsx        # Sector management
├── divisions/page.tsx      # Division management
└── projects/page.tsx       # Project management

/components/admin/
├── UserTable.tsx           # Sortable user table
├── UserForm.tsx            # User create/edit modal
├── SectorForm.tsx          # Sector create/edit modal
├── DivisionForm.tsx        # Division create/edit modal
├── ProjectForm.tsx         # Project create/edit modal
└── OrgStructureTree.tsx    # Hierarchical org view

/lib/
└── admin-mock-data.ts      # CRUD operations
```

## Mock Data Functions

### Users
- `getAllUsers()` - Get all users
- `getUserById(id)` - Get user by ID
- `createUser(data)` - Create new user
- `updateUser(id, updates)` - Update user
- `deleteUser(id)` - Delete user
- `deactivateUser(id)` / `activateUser(id)` - Toggle status

### Sectors
- `getAllSectors()` - Get all sectors
- `getSectorById(id)` - Get sector by ID
- `createSector(data)` - Create sector
- `updateSector(id, updates)` - Update sector
- `deleteSector(id)` - Delete sector (fails if has divisions)

### Divisions
- `getAllDivisions()` - Get all divisions
- `getDivisionById(id)` - Get division by ID
- `getDivisionsBySectorId(sectorId)` - Get divisions by sector
- `createDivision(data)` - Create division
- `updateDivision(id, updates)` - Update division
- `deleteDivision(id)` - Delete division (fails if has projects)

### Projects
- `getAllProjects()` - Get all projects
- `getProjectById(id)` - Get project by ID
- `getProjectsBySectorId(sectorId)` - Filter by sector
- `getProjectsByDivisionId(divisionId)` - Filter by division
- `createProject(data)` - Create project
- `updateProject(id, updates)` - Update project
- `deleteProject(id)` - Delete project

### Utilities
- `resetAllStores()` - Reset all data to defaults
- `getStoreStats()` - Get counts for all entities

## Validation Rules

### User
- Name, email, role, Azure AD Object ID are required
- At least one sector or division recommended
- Email should be unique (not enforced in mock)

### Sector
- Code and name are required
- Code should be unique
- Cannot delete if divisions exist

### Division
- Code, name, and sector are required
- Code should be unique
- Cannot delete if projects exist

### Project
- Code, name, sector, division, and start date are required
- End date is optional
- End date must be after start date

## Future Enhancements

### Short Term
- Bulk operations (import/export users)
- User role change history
- Audit logging for all changes

### Medium Term
- API integration
- Real-time updates
- Email notifications on user creation
- Azure AD integration for SSO

### Long Term
- Advanced reporting
- User activity analytics
- Permission templates
- Organizational chart visualization
- Drag-and-drop org structure editor

## Testing

To test the admin panel:

1. Start dev server: `npm run dev`
2. Login with a SYSTEM_ADMIN user
3. Navigate to User menu → Admin Panel
4. Test CRUD operations on each tab
5. Verify filtering and search work correctly
6. Test validation (try deleting sector with divisions)

## Notes

- All admin routes are protected (currently mock auth)
- Only SYSTEM_ADMIN role can access admin panel
- Data changes are local and reset on refresh
- Build passing: All TypeScript checks pass
- Mobile responsive: Works on all screen sizes

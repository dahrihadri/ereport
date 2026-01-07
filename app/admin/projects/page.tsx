'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '@/types';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllSectors,
  getAllDivisions,
} from '@/lib/admin-mock-data';
import { Plus, Edit2, Briefcase, Search, Filter, FileSpreadsheet } from 'lucide-react';
import ProjectForm from '@/components/admin/ProjectForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { exportProjectsToCSV } from '@/lib/export-utils';
import { logAuditEvent, detectChanges } from '@/lib/audit-trail';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(getAllProjects());
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const sectors = getAllSectors();
  const divisions = getAllDivisions();

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (filterSector !== 'all') {
      filtered = filtered.filter((p) => p.sectorId === filterSector);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filterStatus, filterSector]);

  const loadProjects = () => {
    setProjects(getAllProjects());
  };

  const handleCreateProject = () => {
    setSelectedProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    const currentUser = { id: 'admin-1', name: 'System Admin' };

    if (selectedProject) {
      const changes = detectChanges(selectedProject, projectData);
      updateProject(selectedProject.id, projectData);

      logAuditEvent(
        currentUser.id,
        currentUser.name,
        'UPDATE',
        'PROJECT',
        selectedProject.id,
        projectData.name || selectedProject.name,
        changes
      );
    } else {
      const newProject = createProject(projectData as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);

      logAuditEvent(
        currentUser.id,
        currentUser.name,
        'CREATE',
        'PROJECT',
        newProject.id,
        newProject.name
      );
    }
    loadProjects();
    setIsFormOpen(false);
  };

  const handleDeleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const currentUser = { id: 'admin-1', name: 'System Admin' };
      const project = projects.find(p => p.id === projectId);

      deleteProject(projectId);

      if (project) {
        logAuditEvent(
          currentUser.id,
          currentUser.name,
          'DELETE',
          'PROJECT',
          projectId,
          project.name
        );
      }

      loadProjects();
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete project');
    }
  };

  const getSectorName = (sectorId: string) => {
    return sectors.find((s) => s.id === sectorId)?.name || 'Unknown';
  };

  const getDivisionName = (divisionId: string) => {
    return divisions.find((d) => d.id === divisionId)?.name || 'Unknown';
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status];
  };

  const getStatusLabel = (status: ProjectStatus) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage projects across all sectors and divisions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportProjectsToCSV(filteredProjects)}
            disabled={filteredProjects.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={handleCreateProject}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Projects</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{projects.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Active</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {projects.filter((p) => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Completed</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {projects.filter((p) => p.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">On Hold</div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">
            {projects.filter((p) => p.status === 'on_hold').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none text-xs sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none text-xs sm:text-sm"
            >
              <option value="all">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{project.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{project.name}</div>
                    {project.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getSectorName(project.sectorId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getDivisionName(project.divisionId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>{new Date(project.startDate).toLocaleDateString()}</div>
                    {project.endDate && (
                      <div className="text-xs text-gray-500">
                        to {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <DeleteButton
                        itemId={project.id}
                        itemName={project.name}
                        itemType="project"
                        onDelete={handleDeleteProject}
                        variant="icon"
                        size="md"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No projects found</p>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
      />
    </div>
  );
}

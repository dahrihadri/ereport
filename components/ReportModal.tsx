// 'use client';

// import { useState, useEffect } from 'react';
// import { Report, ReportPriority, ReportCategory, Project, Division } from '@/types';
// import { X, Save, FileText, Target, AlertTriangle, Lightbulb, FolderKanban, Building2, Flag, Tag } from 'lucide-react';

// interface ReportModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (report: Partial<Report>, action: 'draft' | 'submit') => void;
//   report?: Report | null;
//   mode: 'create' | 'edit' | 'view';
//   projects?: Project[];
//   divisions?: Division[];
//   currentUserId?: string;
// }

// export default function ReportModal({
//   isOpen,
//   onClose,
//   onSave,
//   report,
//   mode,
//   projects = [],
//   divisions = [],
//   currentUserId = 'user-1'
// }: ReportModalProps) {
//   const [formData, setFormData] = useState<Partial<Report>>(
//     report || {
//       title: '',
//       summary: '',
//       objectives: '',
//       keyIssues: '',
//       statusUpdate: '',
//       risks: '',
//       recommendations: '',
//       priority: 'medium',
//       category: 'operational',
//       projectId: '',
//       divisionId: '',
//       createdByUserId: currentUserId,
//     }
//   );

//   // Update form data when report prop changes
//   useEffect(() => {
//     if (report) {
//       setFormData(report);
//     } else {
//       setFormData({
//         title: '',
//         summary: '',
//         objectives: '',
//         keyIssues: '',
//         statusUpdate: '',
//         risks: '',
//         recommendations: '',
//         priority: 'medium',
//         category: 'operational',
//         projectId: '',
//         divisionId: '',
//         createdByUserId: currentUserId,
//       });
//     }
//   }, [report, isOpen, currentUserId]);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent, action: 'draft' | 'submit') => {
//     e.preventDefault();
//     onSave(formData, action);
//     onClose();
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const isViewMode = mode === 'view';
//   const title = mode === 'create' ? 'Create New Report' : mode === 'edit' ? 'Edit Report' : 'Report Details';

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4">
//       <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//               <FileText className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <form className="overflow-y-auto p-4 sm:p-6 space-y-6">
//           {/* Basic Information Section */}
//           <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 border-l-4 border-blue-500">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <FileText className="w-5 h-5 text-blue-600" />
//               Basic Information
//             </h3>

//             {/* Project Selection */}
//             <div className="mb-4">
//               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//                 <FolderKanban className="w-4 h-4 text-blue-600" />
//                 Project *
//               </label>
//               <select
//                 name="projectId"
//                 value={formData.projectId}
//                 onChange={handleChange}
//                 disabled={isViewMode}
//                 required
//                 className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
//               >
//                 <option value="">Select a project...</option>
//                 {projects.map((project) => (
//                   <option key={project.id} value={project.id}>
//                     {project.code} - {project.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Division Selection */}
//             <div className="mb-4">
//               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//                 <Building2 className="w-4 h-4 text-blue-600" />
//                 Division *
//               </label>
//               <select
//                 name="divisionId"
//                 value={formData.divisionId}
//                 onChange={handleChange}
//                 disabled={isViewMode}
//                 required
//                 className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
//               >
//                 <option value="">Select a division...</option>
//                 {divisions.map((division) => (
//                   <option key={division.id} value={division.id}>
//                     {division.code} - {division.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Report Title */}
//             <div className="mb-4">
//               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//                 <Flag className="w-4 h-4 text-blue-600" />
//                 Report Title *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 disabled={isViewMode}
//                 required
//                 className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all placeholder:text-gray-400"
//                 placeholder="Enter a clear and concise report title..."
//               />
//             </div>

//             {/* Priority and Category Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Priority *
//                 </label>
//                 <select
//                   name="priority"
//                   value={formData.priority}
//                   onChange={handleChange}
//                   disabled={isViewMode}
//                   required
//                   className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                   <option value="critical">Critical</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//                   <Tag className="w-4 h-4 text-blue-600" />
//                   Category *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={isViewMode}
//                   required
//                   className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
//                 >
//                   <option value="operational">Operational</option>
//                   <option value="strategic">Strategic</option>
//                   <option value="compliance">Compliance</option>
//                   <option value="financial">Financial</option>
//                   <option value="technical">Technical</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Executive Summary */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <FileText className="w-4 h-4 text-blue-600" />
//               Executive Summary *
//             </label>
//             <textarea
//               name="summary"
//               value={formData.summary}
//               onChange={handleChange}
//               disabled={isViewMode}
//               required
//               rows={4}
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
//               placeholder="Provide a concise summary of the report for top management..."
//             />
//           </div>

//           {/* Objectives */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <Target className="w-4 h-4 text-blue-600" />
//               Objectives
//             </label>
//             <textarea
//               name="objectives"
//               value={formData.objectives || ''}
//               onChange={handleChange}
//               disabled={isViewMode}
//               rows={3}
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
//               placeholder="List the main objectives and goals..."
//             />
//           </div>

//           {/* Status Update */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <FileText className="w-4 h-4 text-green-600" />
//               Status Update
//             </label>
//             <textarea
//               name="statusUpdate"
//               value={formData.statusUpdate || ''}
//               onChange={handleChange}
//               disabled={isViewMode}
//               rows={3}
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
//               placeholder="Provide current status and progress updates..."
//             />
//           </div>

//           {/* Key Issues */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <AlertTriangle className="w-4 h-4 text-orange-600" />
//               Key Issues
//             </label>
//             <textarea
//               name="keyIssues"
//               value={formData.keyIssues || ''}
//               onChange={handleChange}
//               disabled={isViewMode}
//               rows={3}
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
//               placeholder="Describe any challenges, blockers, or issues encountered..."
//             />
//           </div>

//           {/* Risks */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <AlertTriangle className="w-4 h-4 text-red-600" />
//               Risks
//             </label>
//             <textarea
//               name="risks"
//               value={formData.risks || ''}
//               onChange={handleChange}
//               disabled={isViewMode}
//               rows={3}
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
//               placeholder="Identify potential risks and their impact..."
//             />
//           </div>

//           {/* Recommendations */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <Lightbulb className="w-4 h-4 text-yellow-600" />
//               Recommendations
//             </label>
//             <textarea
//               name="recommendations"
//               value={formData.recommendations || ''}
//               onChange={handleChange}
//               disabled={isViewMode}
//               rows={3}
//               className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
//               placeholder="Provide recommendations and proposed solutions..."
//             />
//           </div>

//           {/* File Attachments Section - Placeholder */}
//           {!isViewMode && (
//             <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
//               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//                 <FileText className="w-4 h-4 text-blue-600" />
//                 File Attachments
//               </label>
//               <p className="text-xs text-gray-500 mb-3">
//                 Upload supporting documents, images, or other files (Coming Soon)
//               </p>
//               <button
//                 type="button"
//                 disabled
//                 className="w-full px-4 py-2 text-sm text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed"
//               >
//                 Upload Files (Coming Soon)
//               </button>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
//             >
//               {isViewMode ? 'Close' : 'Cancel'}
//             </button>
//             {!isViewMode && (
//               <>
//                 <button
//                   type="button"
//                   onClick={(e) => handleSubmit(e, 'draft')}
//                   className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2"
//                 >
//                   <Save className="w-4 h-4" />
//                   Save as Draft
//                 </button>
//                 <button
//                   type="button"
//                   onClick={(e) => handleSubmit(e, 'submit')}
//                   className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                 >
//                   <FileText className="w-4 h-4" />
//                   {mode === 'create' ? 'Submit Report' : 'Update & Submit'}
//                 </button>
//               </>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

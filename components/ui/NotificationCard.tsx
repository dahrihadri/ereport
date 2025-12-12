// import { CheckCircle2, AlertCircle, Info, AlertTriangle, Calendar, User, FileText } from 'lucide-react';

// interface NotificationDetails {
//   reportTitle?: string;
//   assignedBy?: string;
//   dueDate?: string;
//   action?: string;
// }

// interface NotificationCardProps {
//   id: string;
//   title: string;
//   message: string;
//   type: 'success' | 'error' | 'info' | 'warning';
//   time: string;
//   read: boolean;
//   details?: NotificationDetails;
//   onClick: (id: string) => void;
// }

// export default function NotificationCard({
//   id,
//   title,
//   message,
//   type,
//   time,
//   read,
//   details,
//   onClick,
// }: NotificationCardProps) {
//   const getNotificationIcon = () => {
//     switch (type) {
//       case 'success':
//         return <CheckCircle2 className="w-6 h-6 text-green-600" />;
//       case 'error':
//         return <AlertCircle className="w-6 h-6 text-red-600" />;
//       case 'warning':
//         return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
//       case 'info':
//       default:
//         return <Info className="w-6 h-6 text-blue-600" />;
//     }
//   };

//   const getNotificationBgColor = () => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-100';
//       case 'error':
//         return 'bg-red-100';
//       case 'warning':
//         return 'bg-yellow-100';
//       case 'info':
//       default:
//         return 'bg-blue-100';
//     }
//   };

//   return (
//     <div
//       className={`bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all border-2 p-4 sm:p-5 cursor-pointer ${
//         read
//           ? 'border-gray-200 hover:border-gray-300'
//           : 'border-blue-200 bg-blue-50/30 hover:border-blue-300'
//       }`}
//       onClick={() => onClick(id)}
//     >
//       <div className="flex gap-4">
//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBgColor()}`}>
//           {getNotificationIcon()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2 mb-2">
//             <h3 className="text-base sm:text-lg font-bold text-gray-800">
//               {title}
//             </h3>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <span className="text-xs text-gray-500">{time}</span>
//               {!read && (
//                 <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//               )}
//             </div>
//           </div>
//           <p className="text-sm text-gray-600 mb-3">
//             {message}
//           </p>
//           {details && (
//             <div className="flex flex-wrap gap-2 text-xs">
//               {details.reportTitle && (
//                 <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
//                   <FileText className="w-3 h-3 text-gray-600" />
//                   <span className="font-medium text-gray-700">{details.reportTitle}</span>
//                 </div>
//               )}
//               {details.assignedBy && (
//                 <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
//                   <User className="w-3 h-3 text-gray-600" />
//                   <span className="text-gray-700">{details.assignedBy}</span>
//                 </div>
//               )}
//               {details.dueDate && (
//                 <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
//                   <Calendar className="w-3 h-3 text-gray-600" />
//                   <span className="text-gray-700">{details.dueDate}</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

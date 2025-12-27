// import { User } from "@/hooks/useUsers";
// import { UserRow } from "./UserRow";

// interface Props {
//   users: User[];
//   editingUserId: number | null;
//   onEdit: (user: User) => void;
//   onDelete: (email: string) => void;
// }

// export const UsersTable = ({
//   users,
//   editingUserId,
//   onEdit,
//   onDelete,
// }: Props) => {
//   return (
//     <div className="bg-white dark:bg-slate-900/50 rounded-2xl border overflow-hidden">
//       <table className="w-full text-right">
//         <thead className="bg-slate-50 dark:bg-slate-800 text-xs">
//           <tr>
//             <th className="px-6 py-4">المستخدم</th>
//             <th className="px-6 py-4">الدور</th>
//             <th className="px-6 py-4">الحالة</th>
//             <th className="px-6 py-4 text-left">الإجراءات</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((user) => (
//             <UserRow
//               key={user.id}
//               user={user}
//               isEditing={editingUserId === user.id}
//               onEdit={() => onEdit(user)}
//               onDelete={() => onDelete(user.email)}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

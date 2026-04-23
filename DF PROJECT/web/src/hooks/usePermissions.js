import { ROLE_PERMISSIONS } from '../constants/roles';

export const usePermissions = (user) => {
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const perms = ROLE_PERMISSIONS[user.role] || [];
    return perms.includes('all') || perms.includes(permission);
  };

  const canViewAllFiles = hasPermission('all');
  const canManageUsers = hasPermission('users_view');
  const canViewLogs = hasPermission('logs_view');
  const canUploadFiles = hasPermission('files_upload');
  const canViewFiles = hasPermission('files_view');

  return {
    hasPermission,
    canViewAllFiles,
    canManageUsers,
    canViewLogs,
    canUploadFiles,
    canViewFiles
  };
};

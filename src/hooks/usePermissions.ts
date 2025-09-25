import { useState, useEffect, useCallback } from 'react';
import { fetchRolePermissions } from '../utils/Handlerfunctions/getdata';

export type Permission = {
  feature: string;
  permission: string[];
};

export type UserPermissions = Permission[];

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<UserPermissions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRolePermissions();
        setPermissions(data || []);
      } catch (err) {
        setError('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, []);

  const hasPermission = useCallback(
    (feature: string, action: 'view' | 'create' | 'edit' | 'delete' = 'view') => {
      if (!feature) return true;
      const permission = permissions.find(p => p.feature.toLowerCase() === feature.toLowerCase());
      return permission?.permission?.includes(action) || false;
    },
    [permissions]
  );

  const canView = useCallback(
    (feature: string) => hasPermission(feature, 'view'),
    [hasPermission]
  );

  return {
    permissions,
    loading,
    error,
    hasPermission,
    canView,
  };
};
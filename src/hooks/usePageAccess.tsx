import { usePermissions } from './usePermissions';
import AccessDenied from '../components/ui/AccessDenied';

/**
 * Hook to check page access and return AccessDenied component if no permission
 * @param featureName - The feature name to check permission for
 * @param customMessage - Optional custom message for access denied
 * @returns Object with hasAccess boolean and AccessDeniedComponent
 */
export const usePageAccess = (featureName: string, customMessage?: string) => {
  const { canView } = usePermissions();
  const hasAccess = canView(featureName);
  
  const AccessDeniedComponent = () => (
    <AccessDenied 
      message={customMessage || `You don't have permission to view ${featureName.toLowerCase()}.`} 
    />
  );
  
  return {
    hasAccess,
    AccessDeniedComponent
  };
};

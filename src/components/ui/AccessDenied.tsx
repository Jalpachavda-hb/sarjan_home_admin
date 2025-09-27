import { MdLock } from "react-icons/md";

interface AccessDeniedProps {
  message?: string;
}

export default function AccessDenied({ 
  message = "You don't have permission to access this page." 
}: AccessDeniedProps) {
  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <MdLock className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
        <p className="text-sm text-gray-500">
          Contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
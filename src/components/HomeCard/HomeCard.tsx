import { FaArrowUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { HiMiniUserGroup } from "react-icons/hi2";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaBuildingColumns } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  fetchDashboardCount,
  getUserRole,
} from "../../utils/Handlerfunctions/getdata";
import { usePermissions } from "../../hooks/usePermissions";

// Define the interface for formData state
interface DashboardData {
  clientCount: string;
  projectTypes: string;
  adminUsers: string;
  siteDetailsCount: string;
  today_payment: string;
  sitenames: string;
  admin_id: string;
}

export default function HomeCard() {
  const [formData, setFormData] = useState<DashboardData>({
    clientCount: "",
    projectTypes: "",
    adminUsers: "",
    siteDetailsCount: "",
    today_payment: "",
    sitenames: "",
    admin_id: "",
  });
  
  const userRole = getUserRole();
  const { canView } = usePermissions();

useEffect(() => {
  fetchDashboardCount()
    .then((data) => setFormData(prev => ({
      ...prev, // keep existing values
      ...data  // overwrite with new data
    })))
    .catch((err: Error) => console.error("Error fetching dashboardcount:", err));
}, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* Card 1 - Only show if user has Payments permission */}
      {canView("Payments") && (
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-indigo-200 p-5 dark:border-gray-800 dark:bg-indigo-400 md:p-6 min-h-[160px]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <RiMoneyRupeeCircleLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500  dark:text-slate-900">
                Today's Total Collection
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-slate-900">
                {formData.today_payment}
              </h4>
            </div>
            <Link to="/admin/payments" className="cursor-pointer">
              <Badge color="success" className="self-end">
                <FaArrowUp />
                More
              </Badge>
            </Link>
          </div>
        </div>
      )}

      {/* Card 2 - Only show if userRole === 1 */}
      {userRole === 1 && (
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-rose-200 p-5 dark:border-gray-800 dark:bg-cyan-00  md:p-6 min-h-[160px]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <HiMiniUserGroup className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-900">
                Clients
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-slate-900">
                {formData.clientCount}
              </h4>
            </div>
            <Link to="/admin/selectproject" className="cursor-pointer">
              <Badge color="success" className="self-end">
                <FaArrowUp />
                More
              </Badge>
            </Link>
          </div>
        </div>
      )}

      {/* Card 3 - Only show if user has Admin_users permission */}
      {canView("Admin_users") && (
        <div className="flex flex-col justify-between rounded-2xl border  border-gray-200 bg-violet-200 p-5 dark:border-gray-800 dark:bg-amber md:p-6 min-h-[160px]">
          <div className="flex items-center justify-center w-12 h-12  bg-gray-100 rounded-xl dark:bg-gray-800">
            <MdAdminPanelSettings className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-900">
                Admin Users
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-dark">
                {formData.adminUsers}
              </h4>
            </div>
            <Link to="/admin/admin_users" className="cursor-pointer">
              <Badge color="success" className="self-end">
                <FaArrowUp />
                More
              </Badge>
            </Link>
          </div>
        </div>
      )}

      {/* Card 4 - Only show if user has Properties permission */}
      {canView("Properties") && (
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-orange-200 p-5 dark:border-gray-800 dark:bg-red-400 md:p-6 min-h-[160px]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FaBuildingColumns className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-900">
                Number of Sites/Projects
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-dark">
                {formData.siteDetailsCount}
              </h4>
            </div>
            <Link to="/admin/projects/site_details" className="cursor-pointer">
              <Badge color="success" className="self-end">
                <FaArrowUp />
                More
              </Badge>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
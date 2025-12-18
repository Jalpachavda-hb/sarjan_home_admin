import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { IoMdDocument } from "react-icons/io";
import { fetchWebSetting } from "../utils/Handlerfunctions/getdata";
import {
  MdOutlinePendingActions,
  MdOutlineReport,
  MdMergeType,
} from "react-icons/md";
import { FaPeopleRoof, FaBuildingUser } from "react-icons/fa6";
import { BsBuildingFillCheck } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import { IoTicketSharp } from "react-icons/io5";
import { CiWallet } from "react-icons/ci";
import { FiSettings } from "react-icons/fi";
import {
  LuLayoutDashboard,
  LuClipboardCheck,
  LuUserPlus,
  LuList,
  LuSettings,
} from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa";
import { BiSolidCategoryAlt, BiSolidDetail } from "react-icons/bi";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { usePermissions } from "../hooks/usePermissions";

// TYPES
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: {
    name: string;
    path?: string;
    icon?: React.ReactNode;
    pro?: boolean;
    new?: boolean;
    permission?: string;
    subSubItems?: {
      name: string;
      path: string;
      icon?: React.ReactNode;
      permission?: string;
    }[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <LuLayoutDashboard />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <MdOutlinePendingActions />,
    name: "Pending for Approvals",
    path: "/admin/pending_for_approvals",
  },
  {
    name: "Clients/Property",
    icon: <FaPeopleRoof />,
    path: "/admin/selectproject",
    permission: "Clients",
  },
  {
    name: "Ticket Request",
    icon: <IoTicketSharp />,
    subItems: [
      {
        name: "My Ticket",
        icon: <MdMergeType />,
        path: "/admin/ticket-request/mytiket",
      },
      {
        name: "Client Ticket",
        icon: <BiSolidCategoryAlt />,
        path: "/admin/ticket-request/client",
      },
      {
        name: "Ticket History",
        icon: <BiSolidDetail />,
        path: "/admin/ticket-request/history",
      },
    ],
  },
  {
    name: "User Log",
    icon: <FaBuildingUser />,
    path: "/admin/log",
    permission: "User_log",
  },
  {
    name: "Property/Projects",
    icon: <BsBuildingFillCheck />,
    permission: "Properties",
    subItems: [
      {
        name: "Project Type",
        icon: <MdMergeType />,
        path: "/admin/projects_type",
        permission: "Properties",
      },
      {
        name: "Project Category",
        icon: <BiSolidCategoryAlt />,
        path: "/admin/projects_category",
        permission: "Properties",
      },
      {
        name: "Site Details",
        icon: <BiSolidDetail />,
        path: "/admin/projects/site_details",
        permission: "Properties",
      },
      {
        name: "Property Details",
        icon: <LuList />,
        path: "/admin/projects/property_details",
        permission: "Properties",
      },
    ],
  },
  {
    name: "Admin Users",
    icon: <RiAdminFill />,
    path: "/admin/admin_users",
    permission: "Admin_users",
  },
  {
    name: "Documents",
    icon: <IoMdDocument />,
    permission: "Documents",
    subItems: [
      {
        name: "Common Documents",
        icon: <MdMergeType />,
        path: "/admin/common_documents",
        permission: "Documents",
      },
      {
        name: "Personal Documents",
        icon: <MdMergeType />,
        path: "/admin/personal_documents",
        permission: "Documents",
      },
    ],
  },
  {
    name: "Reports",
    icon: <MdOutlineReport />,
    permission: "Reports",
    subItems: [
      {
        name: "Site Report",
        icon: <IoMdDocument />,
        path: "/admin/reports_site",
        permission: "Reports",
      },
      {
        name: "Client Report",
        icon: <IoMdDocument />,
        path: "/admin/reports_client",
        permission: "Reports",
      },
    ],
  },
  {
    name: "Payments",
    icon: <CiWallet />,
    path: "/admin/payments",
    permission: "Payments",
  },
  {
    name: "Site Inquiry",
    icon: <LuClipboardCheck />,
    path: "/admin/inquiry",
  },
];

const othersItems: NavItem[] = [
  {
    name: "Web Settings",
    icon: <LuSettings />,
    permission: "App_settings",
    subItems: [
      {
        name: "Home Section",
        icon: <LuUserPlus />,
        permission: "App_settings",
        subSubItems: [
          {
            name: "Logo Setting",
            path: "/admin/logo_setting",
            icon: <LuUserPlus />,
            permission: "App_settings",
          },
          {
            name: "Hero Section",
            path: "/admin/web_settings",
            icon: <LuUserPlus />,
            permission: "App_settings",
          },
          {
            name: "About Section",
            path: "/admin/aboutus_section",
            icon: <LuUserPlus />,
            permission: "App_settings",
          },
          {
            name: "Slider Section",
            path: "/admin/slider",
            icon: <LuUserPlus />,
            permission: "App_settings",
          },
          {
            name: "Testimonialer Section",
            path: "/admin/testimonial_section",
            icon: <LuUserPlus />,
            permission: "App_settings",
          },
        ],
      },
      {
        name: "About Us Section",
        icon: <LuUserPlus />,
        path: "/admin/web_settings/about",
        permission: "App_settings",
      },
      {
        name: "Contact Us Section",
        icon: <LuUserPlus />,
        path: "/admin/web_settings/contact",
        permission: "App_settings",
      },
    ],
  },
  {
    name: "App Settings",
    icon: <FiSettings />,
    permission: "App_settings",
    subItems: [
      {
        name: "Home Slider",
        icon: <LuUserPlus />,
        path: "/admin/settings/home_slider",
        permission: "App_settings",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();
  const { canView, loading } = usePermissions();
  const [logo, setLogo] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [openSubSubmenu, setOpenSubSubmenu] = useState<string | null>(null);
  const [subMenuHeight, _setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path?: string) => (path ? location.pathname === path : false),
    [location.pathname]
  );

  const getUserRole = (): number | null => {
    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.role_id || parsed.role || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();

  const filterMenuItems = useCallback(
    (items: NavItem[]) => {
      return items.filter((item) => {
        if (item.name === "Dashboard") return true;
        if (["Pending for Approvals", "Web Settings"].includes(item.name))
          return userRole === 1;
        if (!canView(item.permission || "")) return false;

        if (item.subItems) {
          item.subItems = item.subItems
            .map((sub) => {
              if (sub.subSubItems) {
                sub.subSubItems = sub.subSubItems.filter((s) =>
                  canView(s.permission || "")
                );
              }
              return sub;
            })
            .filter((sub) => canView(sub.permission || ""));

          return item.subItems.length > 0;
        }
        return true;
      });
    },
    [canView, userRole]
  );

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const handleSubSubmenuToggle = (subName: string) => {
    setOpenSubSubmenu((prev) => (prev === subName ? null : subName));
  };

  const isSubmenuActive = (nav: NavItem) =>
    nav.subItems?.some(
      (subItem) =>
        isActive(subItem.path) ||
        subItem.subSubItems?.some((s) => isActive(s.path))
    );

  useEffect(() => {
    fetchWebSetting()
      .then((data) => setLogo(data.logo || null))
      .catch((err) => console.error("Error fetching web setting:", err));
  }, []);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-[9999] border-r border-gray-200
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 flex justify-center">
        <Link to="/admin/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              src={logo || "/images/logo/logo-icon.png"}
              alt="Logo"
              width={200}
              height={40}
            />
          ) : (
            <img
              src={logo || "/images/logo/logo-icon.png"}
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <nav className="mb-1">
            <div className="flex flex-col gap-4">
              {["main", "others"].map((type) => {
                const menuItems =
                  type === "main"
                    ? filterMenuItems(navItems)
                    : filterMenuItems(othersItems);
                if (menuItems.length === 0) return null;

                return (
                  <div key={type}>
                    <h2
                      className={`mb-4 text-xs uppercase flex text-gray-400 ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "justify-start"
                      }`}
                    >
                      {isExpanded || isHovered || isMobileOpen ? (
                        type === "main" ? (
                          "Menu"
                        ) : (
                          "Others"
                        )
                      ) : (
                        <IoEllipsisHorizontalSharp />
                      )}
                    </h2>
                    <ul className="flex flex-col gap-4">
                      {menuItems.map((nav, index) => {
                        const key = `${type}-${index}`;
                        const isSubmenuOpen =
                          openSubmenu?.type === type &&
                          openSubmenu?.index === index;

                        return (
                          <li key={nav.name}>
                            {nav.subItems ? (
                              <button
                                onClick={() =>
                                  handleSubmenuToggle(index, type as any)
                                }
                                className={`menu-item group ${
                                  isSubmenuOpen || isSubmenuActive(nav)
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                                }`}
                              >
                                <span className="menu-item-icon-size">
                                  {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                  <>
                                    <span className="menu-item-text">
                                      {nav.name}
                                    </span>
                                    <FaAngleDown
                                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                        isSubmenuOpen
                                          ? "rotate-180 text-[#ae8643]"
                                          : ""
                                      }`}
                                    />
                                  </>
                                )}
                              </button>
                            ) : (
                              <Link
                                to={nav.path!}
                                onClick={() => {
                                  if (isMobileOpen) toggleMobileSidebar();
                                  setIsHovered(false);
                                }}
                                className={`menu-item group ${
                                  isActive(nav.path)
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                                }`}
                              >
                                <span className="menu-item-icon-size">
                                  {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                  <span className="menu-item-text">
                                    {nav.name}
                                  </span>
                                )}
                              </Link>
                            )}

                            {nav.subItems &&
                              (isExpanded || isHovered || isMobileOpen) && (
                                <div
                                  ref={(el) => {
                                    subMenuRefs.current[key as string] = el;
                                  }}
                                  className="overflow-hidden transition-all duration-300"
                                  style={{
                                    height: isSubmenuOpen
                                      ? subMenuHeight[key] || "auto"
                                      : "0px",
                                  }}
                                >
                                  <ul className="mt-2 space-y-1 ml-9">
                                    {nav.subItems.map((sub) => (
                                      <li key={sub.name}>
                                        {sub.subSubItems ? (
                                          <>
                                            <button
                                              onClick={() =>
                                                handleSubSubmenuToggle(sub.name)
                                              }
                                              className={`menu-dropdown-item flex justify-between items-center ${
                                                openSubSubmenu === sub.name
                                                  ? "menu-dropdown-item-active"
                                                  : "menu-dropdown-item-inactive"
                                              }`}
                                            >
                                              {sub.name}
                                              <FaAngleDown
                                                className={`transition-transform ${
                                                  openSubSubmenu === sub.name
                                                    ? "rotate-180 text-[#ae8643]"
                                                    : ""
                                                }`}
                                              />
                                            </button>

                                            {openSubSubmenu === sub.name && (
                                              <ul className="ml-6 mt-2 space-y-1">
                                                {sub.subSubItems.map((s) => (
                                                  <li key={s.name}>
                                                    <Link
                                                      to={s.path}
                                                      className={`menu-dropdown-item ${
                                                        isActive(s.path)
                                                          ? "menu-dropdown-item-active"
                                                          : "menu-dropdown-item-inactive"
                                                      }`}
                                                    >
                                                      {s.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </>
                                        ) : (
                                          <Link
                                            to={sub.path!}
                                            className={`menu-dropdown-item ${
                                              isActive(sub.path)
                                                ? "menu-dropdown-item-active"
                                                : "menu-dropdown-item-inactive"
                                            }`}
                                          >
                                            {sub.name}
                                          </Link>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </nav>
        )}
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;

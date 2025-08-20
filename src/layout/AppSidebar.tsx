import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { IoMdDocument } from "react-icons/io";
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

// TYPES
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string; // remove optional
    icon?: React.ReactNode;
    pro?: boolean;
    new?: boolean;
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
  },
  {
    name: "Property/Projects",
    icon: <BsBuildingFillCheck />,
    subItems: [
      {
        name: "Project Type",
        icon: <MdMergeType />,
        path: "/admin/projects_type",
      },
      {
        name: "Project Category",
        icon: <BiSolidCategoryAlt />,
        path: "/admin/projects_category",
      },
      {
        name: "Site Details",
        icon: <BiSolidDetail />,
        path: "/admin/projects/site_details",
      },
      {
        name: "Property Details",
        icon: <LuList />,
        path: "/admin/projects/property_details",
      },
    ],
  },
  {
    name: "Admin Users",
    icon: <RiAdminFill />,
    path: "/admin/admin_users",
  },
  {
    name: "Documents",
    icon: <IoMdDocument />,
    subItems: [
      {
        name: "Common Documents",
        icon: <MdMergeType />,
        path: "/admin/common_documents",
      },
      {
        name: "Personal Documents",
        icon: <MdMergeType />,
        path: "/admin/personal_documents",
      },
    ],
  },
  {
    name: "Reports",
    icon: <MdOutlineReport />,
    subItems: [
      {
        name: "Site Report",
        icon: <IoMdDocument />,
        path: "/admin/reports_site",
      },
      {
        name: "Client Report",
        icon: <IoMdDocument />,
        path: "/admin/reports_client",
      },
    ],
  },
  {
    name: "Payments",
    icon: <CiWallet />,
    path: "/admin/payments",
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
    path: "/admin/web_settings",
  },
  {
    name: "App Settings",
    icon: <FiSettings />,
    subItems: [
      {
        name: "Home Slider",
        icon: <LuUserPlus />,
        path: "/admin/settings/home_slider",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  // const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const submenuEl = subMenuRefs.current[key];
      if (submenuEl) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: submenuEl.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };
  const isSubmenuActive = (nav: NavItem) => {
    if (!nav.subItems) return false;
    return nav.subItems.some((subItem) => isActive(subItem.path));
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const key = `${menuType}-${index}`;
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  isSubmenuOpen || isSubmenuActive(nav)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isSubmenuOpen || isSubmenuActive(nav)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <FaAngleDown
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el: HTMLDivElement | null) => {
                  subMenuRefs.current[key] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen
                    ? `${subMenuHeight[key] || 0}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span className="menu-dropdown-badge">new</span>
                          )}
                          {subItem.pro && (
                            <span className="menu-dropdown-badge">pro</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/admin/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={150}
              height={40}
            />
          ) : (
            // <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
            <img
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <IoEllipsisHorizontalSharp className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <IoEllipsisHorizontalSharp />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;

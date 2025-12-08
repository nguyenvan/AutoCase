import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen, // Icon cho mục Management
  ListTree, // Icon cho Micro Test Case
  Link as LinkIcon, // Icon cho Macro Test Case
  ChevronLeft,
  ChevronRight,
  ChevronDown, // Icon cho trạng thái mở dropdown
  ChevronUp, // Icon cho trạng thái đóng dropdown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Định nghĩa cấu trúc menu
const menuItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, type: "link" as const },
  {
    label: "Test Case Management",
    path: "/management",
    icon: FolderOpen,
    type: "parent" as const,
    children: [
      { label: "Micro Test Cases", path: "/micro-cases", icon: ListTree },
      { label: "Macro Test Cases", path: "/macro-flows", icon: LinkIcon },
    ],
  },
  // Giữ lại Design Test Case nếu bạn vẫn muốn nó là một mục riêng biệt ở cấp cao nhất
  // { label: "Design Test Case", path: "/design", icon: SquarePen, type: "link" as const }, 
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(true); // Trạng thái mở/đóng cho dropdown
  const location = useLocation();

  return (
    <div
      className={`
        h-screen bg-gray-900 text-white transition-all duration-300 
        flex flex-col border-r border-gray-700
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h1 className="text-lg font-semibold">AutoCase</h1>}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1 rounded hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          if (item.type === "link") {
            // Hiển thị Link cấp 1 (Dashboard)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer
                  transition-all duration-200 mx-2 mb-2
                  ${active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                `}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          } 
          
          if (item.type === "parent") {
            // Hiển thị Menu Cha (Test Case Management)
            return (
              <div key={item.label} className="mx-2 mb-2">
                <div
                  onClick={() => setIsManagementOpen(!isManagementOpen)}
                  className={`
                    flex items-center justify-between gap-3 px-4 py-2 rounded-md cursor-pointer
                    text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && (isManagementOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>

                {/* Dropdown Items */}
                {!collapsed && isManagementOpen && (
                  <div className="ml-4 mt-1 border-l border-gray-700 pl-4">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = location.pathname === child.path;
                      
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`
                            flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer text-sm
                            transition-all duration-200 mb-1
                            ${
                              childActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }
                          `}
                        >
                          <ChildIcon size={18} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        {!collapsed && "v1.0.0"}
      </div>
    </div>
  );
};

export default Sidebar;
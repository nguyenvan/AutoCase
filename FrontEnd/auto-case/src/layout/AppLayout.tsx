import React from "react";
import Sidebar from "./Sidebar";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 h-screen overflow-auto bg-white-100 p-4">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;

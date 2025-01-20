import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="sticky top-0 h-screen">
        <LeftSidebar />
      </div>
      <div className="flex flex-grow overflow-y-auto"> {/* to stick sidebar added overflow-y-auto */}
        {/* Main Content with Feed and Right Sidebar */}
        <div className="flex-grow my-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

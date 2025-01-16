import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <div className="flex flex-grow">
        {/* Main Content with Feed and Right Sidebar */}
        <div className="flex-grow my-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

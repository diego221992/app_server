import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
const AppLayout = () => {
    const [sidebarToggle, setSidebarToggle] = useState(false);
    
    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <AppSidebar sidebarToggle={sidebarToggle}  setSidebarToggle={setSidebarToggle} />
                <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
                    <AppHeader sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

                    <main>
                        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                           
                              <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default AppLayout;
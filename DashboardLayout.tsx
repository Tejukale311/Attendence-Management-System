
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X, UserCircle } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Helper to check if a path is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-education-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold text-education-800">EduTrack</h2>}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-education-100 rounded-full flex items-center justify-center">
              <UserCircle className="text-education-600" size={30} />
            </div>
            {sidebarOpen && (
              <div className="mt-2 text-center">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            {user?.role === 'teacher' ? (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/teacher-dashboard">
                    <span className="mr-3">📊</span>
                    {sidebarOpen && "Dashboard"}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/teacher-attendance">
                    <span className="mr-3">✓</span>
                    {sidebarOpen && "Mark Attendance"}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/teacher-reports">
                    <span className="mr-3">📋</span>
                    {sidebarOpen && "Reports"}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/teacher-students">
                    <span className="mr-3">👨‍🎓</span>
                    {sidebarOpen && "Students"}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant={isActive("/student-dashboard") ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  asChild
                >
                  <Link to="/student-dashboard">
                    <span className="mr-3">📊</span>
                    {sidebarOpen && "Dashboard"}
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/student-attendance") ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  asChild
                >
                  <Link to="/student-attendance">
                    <span className="mr-3">📅</span>
                    {sidebarOpen && "Attendance"}
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/student-marks") ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  asChild
                >
                  <Link to="/student-marks">
                    <span className="mr-3">📝</span>
                    {sidebarOpen && "Marks"}
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
        
        <div className="absolute bottom-4 w-full px-4">
          <Button variant="ghost" className={`w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50`} onClick={logout}>
            <LogOut size={sidebarOpen ? 16 : 20} className="mr-2" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-education-800">{title}</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

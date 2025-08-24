
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/teacher/Dashboard";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import TeacherReports from "./pages/teacher/Reports";
import StudentManagement from "./pages/teacher/Students";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/Attendance";
import StudentMarks from "./pages/student/Marks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-attendance" element={<MarkAttendance />} />
          <Route path="/teacher-reports" element={<TeacherReports />} />
          <Route path="/teacher-students" element={<StudentManagement />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-attendance" element={<StudentAttendance />} />
          <Route path="/student-marks" element={<StudentMarks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

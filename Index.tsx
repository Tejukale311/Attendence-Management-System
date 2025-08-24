
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-education-50 to-education-100 p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-education-800">
          Attendance Management System
        </h1>
        <p className="text-lg md:text-xl text-education-700 mb-8">
          A comprehensive solution for tracking and managing student attendance efficiently
        </p>
        
        <div className="mt-8 space-x-4">
          <Button asChild size="lg" className="bg-education-600 hover:bg-education-700 px-8">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-education-600 text-education-600 hover:bg-education-50">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-education-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl text-education-600">✓</span>
          </div>
          <h3 className="text-lg font-medium mb-2 text-education-800">Mark Attendance</h3>
          <p className="text-muted-foreground">
            Teachers can easily mark and track student attendance for each class session.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-education-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl text-education-600">📊</span>
          </div>
          <h3 className="text-lg font-medium mb-2 text-education-800">Analytics & Reports</h3>
          <p className="text-muted-foreground">
            Generate detailed attendance reports and analytics for better decision-making.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-education-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl text-education-600">📱</span>
          </div>
          <h3 className="text-lg font-medium mb-2 text-education-800">Access Anywhere</h3>
          <p className="text-muted-foreground">
            Students can view their attendance records from any device, anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

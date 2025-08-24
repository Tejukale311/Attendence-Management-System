
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

// Mock attendance data
const attendanceRecords = [
  { date: "April 12th, 2025", morning: "present", afternoon: "absent", evening: "absent" },
  { date: "April 13th, 2025", morning: "present", afternoon: "absent", evening: "present" },
  { date: "April 14th, 2025", morning: "present", afternoon: "present", evening: "present" },
  { date: "April 15th, 2025", morning: "absent", afternoon: "absent", evening: "present" },
];

const StudentAttendance = () => {
  const [timeframe, setTimeframe] = useState("weekly");
  
  // Calculate summary statistics
  const totalSessions = attendanceRecords.length * 3; // 3 sessions per day
  const presentSessions = attendanceRecords.reduce((total, record) => {
    let dayCount = 0;
    if (record.morning === "present") dayCount++;
    if (record.afternoon === "present") dayCount++;
    if (record.evening === "present") dayCount++;
    return total + dayCount;
  }, 0);
  
  const attendanceRate = Math.round((presentSessions / totalSessions) * 100);
  const dayPresent = attendanceRecords.filter(r => 
    r.morning === "present" || r.afternoon === "present" || r.evening === "present"
  ).length;
  const dayAbsent = attendanceRecords.length - dayPresent;
  
  return (
    <DashboardLayout title="Attendance Management">
      <p className="text-muted-foreground mb-6">View your attendance records.</p>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Attendance Rate</h3>
            <p className="text-3xl font-bold">{attendanceRate}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Days Present</h3>
            <p className="text-3xl font-bold">{dayPresent}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Days Absent</h3>
            <p className="text-3xl font-bold">{dayAbsent}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Attendance Records</CardTitle>
          <div>
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Morning</TableHead>
                <TableHead>Afternoon</TableHead>
                <TableHead>Evening</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      record.morning === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {record.morning === "present" ? "Present" : "Absent"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      record.afternoon === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {record.afternoon === "present" ? "Present" : "Absent"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      record.evening === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {record.evening === "present" ? "Present" : "Absent"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentAttendance;

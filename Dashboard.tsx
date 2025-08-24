
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

// Mock data for teacher dashboard
const attendanceStats = {
  totalStudents: 21,
  attendanceRate: 63,
  marksAverage: 55,
  maxMarks: 100,
};

// Mock data for attendance by time slot
const timeSlotData = [
  { name: "Mon", present: 18, absent: 3 },
  { name: "Tue", present: 20, absent: 1 },
  { name: "Wed", present: 15, absent: 6 },
  { name: "Thu", present: 12, absent: 9 },
  { name: "Fri", present: 19, absent: 2 },
];

// Mock data for recent attendance
const recentAttendance = [
  { name: "Ajeet Kumar", class: "10", date: "Apr 15, 2025", present: "P", absent: "", rate: "95%" },
  { name: "Anusha Gupta", class: "10", date: "Apr 15, 2025", present: "", absent: "A", rate: "87%" },
  { name: "Tejas Patel", class: "10", date: "Apr 15, 2025", present: "P", absent: "", rate: "93%" },
];

// Colors for pie chart
const COLORS = ['#4ADE80', '#F87171'];

const TeacherDashboard = () => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  return (
    <DashboardLayout title="Student Attendance & Marks Management">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{attendanceStats.totalStudents}</div>
              <span className="ml-1 text-xs text-muted-foreground">/ Class</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{attendanceStats.attendanceRate}%</div>
              <span className="ml-1 text-xs text-muted-foreground">/ Today</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{attendanceStats.marksAverage}</div>
              <span className="ml-1 text-xs text-muted-foreground">/ {attendanceStats.maxMarks}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Time Slot</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of attendance across days</p>
            
            <div className="flex mt-2">
              <Tabs defaultValue={chartType} onValueChange={(value) => setChartType(value as 'bar' | 'pie')}>
                <TabsList>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeSlotData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar name="Present" dataKey="present" fill="#4ADE80" />
                    <Bar name="Absent" dataKey="absent" fill="#F87171" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartContainer config={{ Present: { color: '#4ADE80' }, Absent: { color: '#F87171' } }} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Present', value: timeSlotData.reduce((sum, day) => sum + day.present, 0) },
                          { name: 'Absent', value: timeSlotData.reduce((sum, day) => sum + day.absent, 0) }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
            <p className="text-sm text-muted-foreground">Overview of the recent student attendance</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAttendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.class}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.present}</TableCell>
                    <TableCell>{record.absent}</TableCell>
                    <TableCell>{record.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-4">
        <Button asChild className="bg-education-600 hover:bg-education-700">
          <Link to="/teacher-attendance">Mark Attendance</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/teacher-reports">View Reports</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;

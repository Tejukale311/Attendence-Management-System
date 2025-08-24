
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

// Mock data for student attendance
const attendanceData = {
  overall: 58,
  present: 15,
  absent: 11,
};

const pieChartData = [
  { name: "Present", value: attendanceData.present },
  { name: "Absent", value: attendanceData.absent },
];

const COLORS = ['#4ADE80', '#F87171'];

const StudentDashboard = () => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  
  return (
    <DashboardLayout title="Student Dashboard">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <p className="text-sm text-muted-foreground">Class attendance rate</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-4">{attendanceData.overall}%</div>
            <div className="text-sm text-muted-foreground">
              {attendanceData.present} present / {attendanceData.absent} absent
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Your attendance distribution</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pie" onValueChange={(value) => setChartType(value as 'pie' | 'bar')}>
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pie" className="h-[300px]">
              <ChartContainer config={{ Present: { color: '#4ADE80' }, Absent: { color: '#F87171' } }} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="bar">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Bar chart visualization will be displayed here
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center gap-6 mt-8">
            <Button asChild>
              <Link to="/student-attendance">View Attendance Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/student-marks">View Marks</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentDashboard;

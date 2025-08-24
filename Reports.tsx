
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Search, PieChart } from "lucide-react";
import { toast } from "sonner";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

// Mock data for demonstration
const monthlyData = [
  { month: "January", morning: { present: 92, absent: 6, leave: 2 }, afternoon: { present: 88, absent: 10, leave: 2 }, evening: { present: 85, absent: 12, leave: 3 } },
  { month: "February", morning: { present: 90, absent: 8, leave: 2 }, afternoon: { present: 85, absent: 12, leave: 3 }, evening: { present: 82, absent: 15, leave: 3 } },
  { month: "March", morning: { present: 88, absent: 10, leave: 2 }, afternoon: { present: 86, absent: 12, leave: 2 }, evening: { present: 80, absent: 16, leave: 4 } },
  { month: "April", morning: { present: 95, absent: 3, leave: 2 }, afternoon: { present: 92, absent: 6, leave: 2 }, evening: { present: 88, absent: 10, leave: 2 } },
  { month: "May", morning: { present: 90, absent: 8, leave: 2 }, afternoon: { present: 87, absent: 10, leave: 3 }, evening: { present: 84, absent: 13, leave: 3 } },
];

const studentAttendanceData = [
  { id: 1, name: "Alice Smith", rollNo: "S001", morning: { present: 47, absent: 2, leave: 1 }, afternoon: { present: 45, absent: 4, leave: 1 }, evening: { present: 43, absent: 6, leave: 1 }, percentage: 90 },
  { id: 2, name: "Bob Johnson", rollNo: "S002", morning: { present: 46, absent: 3, leave: 1 }, afternoon: { present: 44, absent: 5, leave: 1 }, evening: { present: 42, absent: 7, leave: 1 }, percentage: 88 },
  { id: 3, name: "Charlie Brown", rollNo: "S003", morning: { present: 48, absent: 1, leave: 1 }, afternoon: { present: 46, absent: 3, leave: 1 }, evening: { present: 44, absent: 5, leave: 1 }, percentage: 92 },
  { id: 4, name: "Diana Ross", rollNo: "S004", morning: { present: 45, absent: 4, leave: 1 }, afternoon: { present: 42, absent: 7, leave: 1 }, evening: { present: 40, absent: 9, leave: 1 }, percentage: 85 },
  { id: 5, name: "Edward Thompson", rollNo: "S005", morning: { present: 46, absent: 3, leave: 1 }, afternoon: { present: 44, absent: 5, leave: 1 }, evening: { present: 42, absent: 7, leave: 1 }, percentage: 88 },
];

type SessionType = "morning" | "afternoon" | "evening";

const TeacherReports = () => {
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [reportType, setReportType] = useState("monthly");
  const [selectedSession, setSelectedSession] = useState<SessionType>("morning");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const exportReport = () => {
    console.log("Export report", { class: selectedClass, month: selectedMonth, type: reportType, session: selectedSession });
    // In a real app, this would generate a PDF or CSV
    toast.success("Report exported successfully!");
  };

  const filteredStudents = studentAttendanceData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSessionData = (sessionData: { present: number, absent: number, leave: number }) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center">
          <span className="mr-2">{sessionData.present}%</span>
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${sessionData.present}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center">
          <span className="mr-2">{sessionData.absent}%</span>
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${sessionData.absent}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center">
          <span className="mr-2">{sessionData.leave}%</span>
          <div className="w-24 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full" 
              style={{ width: `${sessionData.leave}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {sessionData.present >= 90 ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Excellent</span>
        ) : sessionData.present >= 80 ? (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Good</span>
        ) : (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Needs Improvement</span>
        )}
      </td>
    </>
  );

  const getChartData = (month: string) => {
    const monthData = monthlyData.find(m => m.month === month);
    if (!monthData) return [];
    
    const sessionData = monthData[selectedSession];
    return [
      { name: 'Present', value: sessionData.present, color: '#22c55e' },
      { name: 'Absent', value: sessionData.absent, color: '#ef4444' },
      { name: 'Leave', value: sessionData.leave, color: '#f59e0b' },
    ];
  };

  const getStudentChartData = (student: any) => {
    const sessionData = student[selectedSession];
    return [
      { name: 'Present', value: sessionData.present, color: '#22c55e' },
      { name: 'Absent', value: sessionData.absent, color: '#ef4444' },
      { name: 'Leave', value: sessionData.leave, color: '#f59e0b' },
    ];
  };

  return (
    <DashboardLayout title="Attendance Reports">
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Class A">Class A</SelectItem>
              <SelectItem value="Class B">Class B</SelectItem>
              <SelectItem value="Class C">Class C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Overview</SelectItem>
              <SelectItem value="student">Student Wise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1">Search Student</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll no"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <Button onClick={exportReport} className="bg-education-600 hover:bg-education-700">
            Export Report
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "table" ? "chart" : "table")}
            className="gap-2"
          >
            <PieChart size={16} />
            {viewMode === "table" ? "View Charts" : "View Table"}
          </Button>
        </div>
      </div>
      
      {reportType === "monthly" ? (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Overview - {selectedMonth} ({selectedClass})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="morning" onValueChange={(value) => setSelectedSession(value as SessionType)}>
              <TabsList className="mb-4">
                <TabsTrigger value="morning" className="flex items-center">
                  🌅 Morning
                </TabsTrigger>
                <TabsTrigger value="afternoon" className="flex items-center">
                  🌞 Afternoon
                </TabsTrigger>
                <TabsTrigger value="evening" className="flex items-center">
                  🌇 Evening
                </TabsTrigger>
              </TabsList>

              {["morning", "afternoon", "evening"].map((session) => (
                <TabsContent key={session} value={session}>
                  {viewMode === "table" ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Month
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Present %
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Absent %
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Leave %
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthlyData.map((month) => (
                            <tr key={month.month}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {month.month}
                              </td>
                              {renderSessionData(month[session as keyof typeof month] as { present: number, absent: number, leave: number })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthlyData.map((month) => (
                        <Card key={month.month} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-base">{month.month} Attendance</CardTitle>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="h-[200px]">
                              <ChartContainer 
                                config={{
                                  present: { color: '#22c55e' },
                                  absent: { color: '#ef4444' },
                                  leave: { color: '#f59e0b' }
                                }}
                              >
                                <RechartsPieChart>
                                  <Pie
                                    data={getChartData(month.month)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {getChartData(month.month).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </RechartsPieChart>
                              </ChartContainer>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student-wise Attendance - {selectedMonth} ({selectedClass})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="morning" onValueChange={(value) => setSelectedSession(value as SessionType)}>
              <TabsList className="mb-4">
                <TabsTrigger value="morning" className="flex items-center">
                  🌅 Morning
                </TabsTrigger>
                <TabsTrigger value="afternoon" className="flex items-center">
                  🌞 Afternoon
                </TabsTrigger>
                <TabsTrigger value="evening" className="flex items-center">
                  🌇 Evening
                </TabsTrigger>
              </TabsList>

              {["morning", "afternoon", "evening"].map((session) => (
                <TabsContent key={session} value={session}>
                  {viewMode === "table" ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Roll No.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Present Days
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Absent Days
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Leave Days
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Attendance %
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student) => {
                            const sessionData = student[session as keyof typeof student] as { present: number, absent: number, leave: number };
                            const total = sessionData.present + sessionData.absent + sessionData.leave;
                            const percentage = Math.round((sessionData.present / total) * 100);
                            
                            return (
                              <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {student.rollNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {student.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                  {sessionData.present}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                  {sessionData.absent}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                                  {sessionData.leave}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="flex items-center">
                                    <span 
                                      className={`mr-2 font-medium ${
                                        percentage >= 90 ? 'text-green-600' : 
                                        percentage >= 80 ? 'text-blue-600' : 'text-amber-600'
                                      }`}
                                    >
                                      {percentage}%
                                    </span>
                                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                      <div 
                                        className={`h-2.5 rounded-full ${
                                          percentage >= 90 ? 'bg-green-500' : 
                                          percentage >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredStudents.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                No students found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.map((student) => (
                        <Card key={student.id} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-base">{student.name} ({student.rollNo})</CardTitle>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="h-[200px]">
                              <ChartContainer 
                                config={{
                                  present: { color: '#22c55e' },
                                  absent: { color: '#ef4444' },
                                  leave: { color: '#f59e0b' }
                                }}
                              >
                                <RechartsPieChart>
                                  <Pie
                                    data={getStudentChartData(student)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                  >
                                    {getStudentChartData(student).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </RechartsPieChart>
                              </ChartContainer>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {filteredStudents.length === 0 && (
                        <div className="col-span-3 text-center py-8 text-muted-foreground">
                          No students found
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default TeacherReports;

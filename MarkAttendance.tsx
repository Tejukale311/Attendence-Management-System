
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Import, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock student data
const students = [
  { id: 1, name: "Alice Smith", rollNo: "S001" },
  { id: 2, name: "Bob Johnson", rollNo: "S002" },
  { id: 3, name: "Charlie Brown", rollNo: "S003" },
  { id: 4, name: "Diana Ross", rollNo: "S004" },
  { id: 5, name: "Edward Thompson", rollNo: "S005" },
  { id: 6, name: "Fiona Campbell", rollNo: "S006" },
  { id: 7, name: "George Davis", rollNo: "S007" },
  { id: 8, name: "Hannah Miller", rollNo: "S008" },
  { id: 9, name: "Ian Wilson", rollNo: "S009" },
  { id: 10, name: "Jessica Moore", rollNo: "S010" },
];

type AttendanceStatus = "present" | "absent" | "leave";
type SessionType = "morning" | "afternoon" | "evening";

interface AttendanceRecord {
  id: number;
  status: AttendanceStatus;
  session: SessionType;
}

const MarkAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [selectedSession, setSelectedSession] = useState<SessionType>("morning");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceRecords(prev => {
      const existing = prev.findIndex(record => record.id === studentId && record.session === selectedSession);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], status };
        return updated;
      }
      return [...prev, { id: studentId, status, session: selectedSession }];
    });
  };

  const getStudentStatus = (studentId: number): AttendanceStatus | undefined => {
    return attendanceRecords.find(record => record.id === studentId && record.session === selectedSession)?.status;
  };

  const handleSubmit = () => {
    // Count how many students have attendance marked for the current session
    const markedStudents = students.filter(student => 
      attendanceRecords.some(record => record.id === student.id && record.session === selectedSession)
    );
    
    // Validate that all students have attendance marked
    if (markedStudents.length < students.length) {
      toast.error(`Please mark attendance for all students in the ${selectedSession} session`);
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success(`${selectedSession.charAt(0).toUpperCase() + selectedSession.slice(1)} session attendance submitted successfully`);
      setIsSubmitting(false);
      console.log("Attendance records:", {
        date,
        class: selectedClass,
        session: selectedSession,
        records: attendanceRecords.filter(record => record.session === selectedSession),
      });
    }, 1000);
  };

  const markAllAs = (status: AttendanceStatus) => {
    const currentSessionRecords = attendanceRecords.filter(record => record.session !== selectedSession);
    
    const newSessionRecords = students.map(student => ({
      id: student.id,
      status,
      session: selectedSession
    }));
    
    setAttendanceRecords([...currentSessionRecords, ...newSessionRecords]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = () => {
    try {
      // Simple CSV processing
      const rows = csvContent.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',');
      
      // Check if the CSV has the required columns
      if (!headers.includes('rollNo') || !headers.includes('status')) {
        throw new Error('CSV must contain rollNo and status columns');
      }
      
      const rollNoIndex = headers.indexOf('rollNo');
      const statusIndex = headers.indexOf('status');
      
      // Process each row
      const importedRecords: AttendanceRecord[] = [];
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(',');
        if (cells.length >= Math.max(rollNoIndex, statusIndex) + 1) {
          const rollNo = cells[rollNoIndex].trim();
          const status = cells[statusIndex].trim().toLowerCase() as AttendanceStatus;
          
          // Find the student
          const student = students.find(s => s.rollNo === rollNo);
          if (student && ['present', 'absent', 'leave'].includes(status)) {
            importedRecords.push({
              id: student.id,
              status: status as AttendanceStatus,
              session: selectedSession
            });
          }
        }
      }
      
      if (importedRecords.length > 0) {
        // Update attendance records
        setAttendanceRecords(prev => {
          // Remove any existing records for these students in this session
          const filtered = prev.filter(record => 
            !importedRecords.some(imported => 
              imported.id === record.id && imported.session === selectedSession
            )
          );
          return [...filtered, ...importedRecords];
        });
        
        toast.success(`Successfully imported attendance for ${importedRecords.length} students`);
        setImportDialogOpen(false);
        setCsvContent('');
      } else {
        toast.error('No valid records found in the CSV file');
      }
    } catch (error) {
      toast.error(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Mark Attendance">
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-end">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Class A">Class A</SelectItem>
              <SelectItem value="Class B">Class B</SelectItem>
              <SelectItem value="Class C">Class C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Search Student</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or roll number"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 md:mt-0">
              <Import size={16} className="mr-2" />
              Import CSV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Attendance from CSV</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with columns for rollNo and status (present, absent, or leave).
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full p-2 border border-dashed rounded-md"
              />
              {csvContent && (
                <div className="border p-2 rounded-md max-h-32 overflow-auto">
                  <pre className="text-xs">{csvContent}</pre>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={processCSV} disabled={!csvContent}>
                  Import
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance - {selectedClass} ({date})</CardTitle>
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
              <TabsContent key={session} value={session} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => markAllAs("present")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    All Present
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => markAllAs("absent")}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    All Absent
                  </Button>
                </div>
                
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
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                variant={getStudentStatus(student.id) === "present" ? "default" : "outline"}
                                onClick={() => handleStatusChange(student.id, "present")}
                                className={getStudentStatus(student.id) === "present" 
                                  ? "bg-green-600 hover:bg-green-700" 
                                  : "border-green-200 text-green-600 hover:bg-green-50"}
                              >
                                Present
                              </Button>
                              <Button 
                                size="sm"
                                variant={getStudentStatus(student.id) === "absent" ? "default" : "outline"}
                                onClick={() => handleStatusChange(student.id, "absent")}
                                className={getStudentStatus(student.id) === "absent" 
                                  ? "bg-red-600 hover:bg-red-700" 
                                  : "border-red-200 text-red-600 hover:bg-red-50"}
                              >
                                Absent
                              </Button>
                              <Button 
                                size="sm"
                                variant={getStudentStatus(student.id) === "leave" ? "default" : "outline"}
                                onClick={() => handleStatusChange(student.id, "leave")}
                                className={getStudentStatus(student.id) === "leave" 
                                  ? "bg-amber-600 hover:bg-amber-700" 
                                  : "border-amber-200 text-amber-600 hover:bg-amber-50"}
                              >
                                Leave
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || filteredStudents.some(student => !getStudentStatus(student.id))}
              className="bg-education-600 hover:bg-education-700"
            >
              {isSubmitting ? "Submitting..." : `Submit ${selectedSession.charAt(0).toUpperCase() + selectedSession.slice(1)} Attendance`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MarkAttendance;

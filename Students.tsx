
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock student data
const initialStudents = [
  { id: 1, name: "Alice Smith", rollNo: "S001", class: "Class A" },
  { id: 2, name: "Bob Johnson", rollNo: "S002", class: "Class A" },
  { id: 3, name: "Charlie Brown", rollNo: "S003", class: "Class B" },
  { id: 4, name: "Diana Ross", rollNo: "S004", class: "Class B" },
  { id: 5, name: "Edward Thompson", rollNo: "S005", class: "Class C" },
];

const StudentManagement = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [newStudent, setNewStudent] = useState({ name: "", rollNo: "", class: "Class A" });
  const [isAdding, setIsAdding] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNo) {
      toast.error("Please fill all required fields");
      return;
    }

    // Check for duplicate roll number
    if (students.some(student => student.rollNo === newStudent.rollNo)) {
      toast.error("Roll number already exists");
      return;
    }

    const student = {
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      name: newStudent.name,
      rollNo: newStudent.rollNo,
      class: newStudent.class
    };

    setStudents([...students, student]);
    setNewStudent({ name: "", rollNo: "", class: "Class A" });
    setIsAdding(false);
    toast.success("Student added successfully");
  };

  const handleDeleteStudent = (studentId: number) => {
    setStudentToDelete(studentId);
  };

  const confirmDelete = () => {
    if (studentToDelete !== null) {
      const updatedStudents = students.filter(student => student.id !== studentToDelete);
      setStudents(updatedStudents);
      toast.success("Student deleted successfully");
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Student Management">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
        </CardHeader>
        <CardContent>
          {isAdding ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roll Number</label>
                <Input
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                  placeholder="Enter roll number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                >
                  <option value="Class A">Class A</option>
                  <option value="Class B">Class B</option>
                  <option value="Class C">Class C</option>
                </select>
              </div>
              <div className="md:col-span-3 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent} className="bg-education-600 hover:bg-education-700">
                  Add Student
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsAdding(true)} className="bg-education-600 hover:bg-education-700">
              <Plus size={16} className="mr-1" /> Add New Student
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Student List</CardTitle>
          <div className="relative mt-2 sm:mt-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={studentToDelete !== null} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the student from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default StudentManagement;

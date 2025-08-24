
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for marks
const studentMarks = [
  { subject: "Science", class: 10, examType: "Final", marks: 85 },
  { subject: "English", class: 2, examType: "Final", marks: 90 },
  { subject: "English", class: 8, examType: "Final", marks: 80 },
  { subject: "Geography", class: 10, examType: "Assignment", marks: 75 },
  { subject: "English", class: 10, examType: "Final", marks: 85 },
  { subject: "History", class: 10, examType: "Final", marks: 90 },
];

const StudentMarks = () => {
  return (
    <DashboardLayout title="Marks Management">
      <p className="text-muted-foreground mb-6">View your academic results.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full max-w-[200px] grid-cols-2 mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="chart">Charts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentMarks.map((mark, index) => (
                    <TableRow key={index}>
                      <TableCell>{mark.subject}</TableCell>
                      <TableCell>{mark.class}</TableCell>
                      <TableCell>{mark.examType}</TableCell>
                      <TableCell className="font-medium">{mark.marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="chart">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Charts view will display visual representation of your academic performance
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentMarks;

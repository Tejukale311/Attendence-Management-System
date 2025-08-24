
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
}

export function AuthLayout({ children, title, description, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-education-50 to-education-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-education-800">Attendance Manager</h1>
        </div>
        <Card className="border-education-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            <CardDescription className="text-center">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </div>
    </div>
  );
}

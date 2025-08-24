
import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo: teacher@example.com / password
      // For demo: student@example.com / password
      await login(email, password, role);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Login to your account" 
      description="Enter your email below to login to your account"
      footer={
        <div className="text-center w-full text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-education-600 hover:text-education-800 font-medium">
            Register
          </Link>
        </div>
      }
    >
      <Tabs defaultValue="teacher" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="teacher" 
            onClick={() => setRole("teacher")}
          >
            Teacher
          </TabsTrigger>
          <TabsTrigger 
            value="student" 
            onClick={() => setRole("student")}
          >
            Student
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-education-600 hover:text-education-800">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full bg-education-600 hover:bg-education-700" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;

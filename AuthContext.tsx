
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'teacher' | 'student') => void;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_TEACHERS = [
  { id: 't1', name: 'John Doe', email: 'teacher@example.com', password: 'password', role: 'teacher' as const },
];

const MOCK_STUDENTS = [
  { id: 's1', name: 'Alice Smith', email: 'student@example.com', password: 'password', role: 'student' as const },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const login = (email: string, password: string, role: 'teacher' | 'student') => {
    const users = role === 'teacher' ? MOCK_TEACHERS : MOCK_STUDENTS;
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome back, ${foundUser.name}!`);
      
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } else {
      toast.error('Invalid email or password');
    }
  };

  const register = (name: string, email: string, password: string, role: 'teacher' | 'student') => {
    // In a real app, you'd call an API to register the user
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    toast.success('Registration successful!');
    
    if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

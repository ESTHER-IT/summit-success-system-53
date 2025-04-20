
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, role } = useAuth();
  const { toast } = useToast();
  
  // If already logged in, redirect to the appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === 'author') {
        navigate('/author-dashboard');
      } else if (role === 'reviewer') {
        navigate('/reviewer-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    }
  }, [isAuthenticated, role, navigate]);

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'author' as 'author' | 'reviewer' | 'admin'
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const success = await login(loginData.email, loginData.password, loginData.role);
    
    if (success) {
      // Navigation is handled by the useEffect above
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    const success = await register(registerData.name, registerData.email, registerData.password);
    
    if (success) {
      toast({
        title: "Registration successful",
        description: "Please log in with your new credentials"
      });
      // Switch to login tab
      document.getElementById('login-tab')?.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Conference Management System</h1>
          <p className="mt-2">Submit, review and manage academic papers</p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register">Register as Author</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={loginData.email}
                        onChange={handleLoginChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        value={loginData.password}
                        onChange={handleLoginChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Login as</Label>
                      <select
                        id="role"
                        name="role"
                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                        value={loginData.role}
                        onChange={(e) => setLoginData({
                          ...loginData,
                          role: e.target.value as 'author' | 'reviewer' | 'admin'
                        })}
                      >
                        <option value="author">Author</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Register as Author</CardTitle>
                  <CardDescription>
                    Create an account to submit your papers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input 
                        id="register-name" 
                        name="name" 
                        placeholder="John Doe" 
                        value={registerData.name}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        name="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={registerData.email}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        name="password" 
                        type="password" 
                        value={registerData.password}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input 
                        id="register-confirm-password" 
                        name="confirmPassword" 
                        type="password" 
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Register</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">About the Conference</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            The International Conference on Computer Science and Engineering brings together
            researchers, academics, and industry professionals to share cutting-edge research
            and innovations in the field of computer science.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate('/winner')}>
              View Conference Winners
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Conference Management System</p>
          <p className="mt-2">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

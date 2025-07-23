import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/AuthContext";
import { debugUserRole } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import { ShieldAlert, CheckCircle, UserCircle } from "lucide-react";

const AdminDebug = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [fixed, setFixed] = useState(false);
  const [userState, setUserState] = useState<any>(null);

  useEffect(() => {
    // Get current user data from localStorage for display
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const handleFixAdminRole = () => {
    const result = debugUserRole();
    setMessage(result.message);
    setFixed(result.fixed);

    // Refresh user state
    const updatedUser = localStorage.getItem('auth_user');
    if (updatedUser) {
      try {
        setUserState(JSON.parse(updatedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  };

  const handleNavigateToAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <ShieldAlert className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight mb-4">Admin Access Debug</h1>
            <p className="text-lg text-muted-foreground">
              Fix issues with admin dashboard access
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current User State</CardTitle>
              <CardDescription>
                Information about your current login session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user?.name || "User"}</div>
                      <div className="text-sm text-muted-foreground">{user?.email || "No email"}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Authenticated</span>
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Role</span>
                      <Badge className={isAdmin ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                        {isAdmin ? "Admin" : "User"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>User ID</span>
                      <span className="text-muted-foreground">{user?.id || "Unknown"}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium mb-1">Raw user data from localStorage:</p>
                    <pre className="overflow-auto text-xs p-2 bg-gray-100 rounded">
                      {userState ? JSON.stringify(userState, null, 2) : "No data"}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="mb-4">You are not logged in</p>
                  <Button onClick={() => navigate("/signin")}>Sign In</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {isAuthenticated && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Fix Admin Access</CardTitle>
                <CardDescription>
                  Force your user account to have admin role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you're having trouble accessing the admin dashboard, use this button to update your role to admin in localStorage.
                </p>

                {message && (
                  <div className={`p-3 rounded-md text-sm ${fixed ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"}`}>
                    {fixed ? <CheckCircle className="h-4 w-4 inline mr-2" /> : null}
                    {message}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleFixAdminRole}>
                    Fix Admin Role
                  </Button>
                  <Button variant="outline" onClick={handleNavigateToAdmin}>
                    Go to Admin Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>After fixing your role, you may need to refresh the page or sign in again for changes to take effect.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug; 
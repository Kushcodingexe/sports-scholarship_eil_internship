import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Wrench,
  BookOpen,
  XCircle,
  Bell,
  ThumbsUp,
  Download,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import applicationService from "@/lib/api/applicationService";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (!user) return;
        const data = await applicationService.getUserApplications(user.id);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  // Notification system - check for recently approved or rejected applications
  const getRecentStatusChanges = () => {
    // Instead of time calculation, just show all approved/rejected applications
    return applications.filter(app => 
      // Only show notifications for approved or rejected status
      app.status === 'approved' || app.status === 'rejected'
    );
  };
  
  const recentStatusChanges = getRecentStatusChanges();

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "under_review":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };
  
  // Helper to get the latest comment by type
  const getLatestComment = (app, type) => {
    if (!app.comments || app.comments.length === 0) return null;
    
    // Filter comments by the action type and sort by date (newest first)
    const filteredComments = app.comments
      .filter(comment => comment.actionType === type)
      .sort((a, b) => {
        // Compare dates safely without arithmetic
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // descending order (newest first)
      });
    
    return filteredComments.length > 0 ? filteredComments[0] : null;
  };

  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Generate stats based on actual application data
  const generateStats = () => {
    if (!applications.length) return [];
    
    const activeCount = applications.length;
    const approvedCount = applications.filter(app => app.status === 'approved').length;
    const pendingCount = applications.filter(app => app.status === 'pending' || app.status === 'under_review').length;
    
    return [
      {
        title: "Total Applications",
        value: activeCount.toString(),
        icon: Building2,
        change: `${approvedCount} approved`,
        changeType: "positive",
      },
      {
        title: "Pending Review",
        value: pendingCount.toString(),
        icon: Clock,
        change: "Awaiting decision",
        changeType: "neutral",
      },
      {
        title: "Approved Applications",
        value: approvedCount.toString(),
        icon: CheckCircle,
        change: approvedCount > 0 ? "Congratulations!" : "None yet",
        changeType: approvedCount > 0 ? "positive" : "neutral",
      },
      {
        title: "Recent Updates",
        value: recentStatusChanges.length.toString(),
        icon: Bell,
        change: recentStatusChanges.length > 0 ? "New notifications" : "No updates",
        changeType: recentStatusChanges.length > 0 ? "positive" : "neutral",
      },
    ];
  };

  const stats = generateStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Applications
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your scholarship applications and status updates
              with Engineers India Limited
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button asChild>
              <Link to="/apply">
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Notifications - show recent status changes */}
        {recentStatusChanges.length > 0 && (
          <div className="mb-8 space-y-4">
            {recentStatusChanges.map((app) => (
              <Alert 
                key={app._id}
                variant={app.status === 'approved' ? 'default' : 'destructive'}
                className={app.status === 'approved' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}
              >
                <div className="flex items-center gap-2">
                  {app.status === 'approved' ? (
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle className={app.status === 'approved' ? 'text-green-800' : 'text-red-800'}>
                    {app.status === 'approved' 
                      ? 'Application Approved!' 
                      : 'Application Not Approved'}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  <p className={app.status === 'approved' ? 'text-green-700' : 'text-red-700'}>
                    Your application <strong>{app.applicationId || app._id.substring(0, 8)}</strong> has been 
                    <strong> {app.status === 'approved' ? 'approved' : 'rejected'}</strong>.
                  </p>
                  
                  {/* Show the comment if available */}
                  {app.comments && app.comments.length > 0 && (
                    <p className="mt-2 italic">
                      {getLatestComment(
                        app, 
                        app.status === 'approved' ? 'approve' : 'reject'
                      )?.content || ""}
                    </p>
                  )}
                  
                  {app.status === 'approved' && (
                    <div className="mt-3">
                      <Button size="sm" variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
                        <Download className="h-3 w-3 mr-2" />
                        Download Approval Letter
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4 mb-8">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p
                    className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No applications state */}
        {!loading && !error && applications.length === 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>No Applications Found</CardTitle>
              <CardDescription>
                You haven't submitted any applications yet
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Start your scholarship journey by creating your first application
              </p>
              <Button asChild>
                <Link to="/apply">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!loading && !error && applications.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program Applications */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Applications</h2>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <Card
                    key={app._id}
                    className={`hover:shadow-md transition-shadow ${
                      app.status === 'approved' ? 'border-green-500' : 
                      app.status === 'rejected' ? 'border-red-500' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            Application {app.applicationId || app._id.substring(0, 8)}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{app.engineeringField || "Engineering"}</span>
                            <span>•</span>
                            <span>{app.sportsType || app.sport || "Sports"}</span>
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">
                            {app.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-semibold">
                            {app.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Submitted
                          </p>
                          <p className="font-semibold">{formatDate(app.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Last Updated
                          </p>
                          <p className="font-semibold">{formatDate(app.updatedAt)}</p>
                        </div>
                      </div>

                      {/* Show comments if they exist */}
                      {app.comments && app.comments.length > 0 && (app.status === 'approved' || app.status === 'rejected') && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-muted-foreground mb-1">
                            Feedback:
                          </p>
                          <p className="text-sm font-medium">
                            {getLatestComment(
                              app, 
                              app.status === 'approved' ? 'approve' : 'reject'
                            )?.content || "No feedback provided"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/apply?view=${app._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link to="/apply">
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Application
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                  <CardDescription>
                    Complete your engineering profile to increase match accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Academic Information</li>
                      <li>✓ Project Portfolio</li>
                      <li>✓ Technical Skills</li>
                      <li>• Research Experience (Optional)</li>
                    </ul>
                    <Button variant="outline" size="sm" className="w-full">
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* EIL Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">EIL Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Study Materials
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Project Guidelines
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    EIL Careers
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

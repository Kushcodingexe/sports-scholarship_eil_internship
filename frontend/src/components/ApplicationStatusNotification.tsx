import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import applicationService from "@/lib/api/applicationService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface ApplicationStatusNotificationProps {
  limit?: number;
  showAll?: boolean;
  className?: string;
}

const ApplicationStatusNotification = ({
  limit = 2,
  showAll = false,
  className = "",
}: ApplicationStatusNotificationProps) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (!user) {
          setLoading(false);
          return;
        }
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

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  // Get applications with status changes (approved or rejected)
  const getStatusChangedApplications = () => {
    return applications.filter(
      app => app.status === 'approved' || app.status === 'rejected'
    );
  };

  const statusChangedApplications = getStatusChangedApplications();
  const displayApplications = showAll || showMore 
    ? statusChangedApplications 
    : statusChangedApplications.slice(0, limit);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return null; // Don't show errors in the notification component
  }

  if (statusChangedApplications.length === 0) {
    return null; // Don't show anything if there are no status changes
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {displayApplications.map((app) => (
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
              Your application <strong>{app.applicationId || app._id.substring(0, 8)}</strong> 
              {app.name && ` for ${app.name}`} has been 
              <strong> {app.status === 'approved' ? 'approved' : 'rejected'}</strong>
              {app.updatedAt && ` on ${formatDate(app.updatedAt)}`}.
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
                <Button size="sm" asChild variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
                  <Link to="/download">
                    <Download className="h-3 w-3 mr-2" />
                    Download Approval Letter
                  </Link>
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}

      {/* Show more/less button if there are more than the limit */}
      {statusChangedApplications.length > limit && !showAll && (
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => setShowMore(!showMore)}
            className="text-sm"
          >
            {showMore ? "Show less" : `Show ${statusChangedApplications.length - limit} more notifications`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusNotification; 
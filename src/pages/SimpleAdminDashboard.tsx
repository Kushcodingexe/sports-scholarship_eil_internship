import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import applicationService from "@/lib/api/applicationService";
import startBackendServer from "@/lib/start-backend-server";
import React from "react"; // Added missing import for React

interface Application {
  _id: string;
  applicationId?: string;
  name: string;
  sportsType?: string;
  sport?: string;
  status: string;
  comments?: Array<{
    content: string;
    date: string;
    actionType: string;
  }>;
  email?: string;
  mobile?: string;
  engineeringField?: string;
  positionLevel?: string;
  TournamentDate?: string;
  // Add other fields as needed
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

const SimpleAdminDashboard = () => {
  const { user } = useAuth();
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [comment, setComment] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState<"checking" | "running" | "not-running">("checking");
  const [notification, setNotification] = useState<Notification | null>(null);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);

  useEffect(() => {
    const checkServerAndFetchData = async () => {
      try {
        // Check if server is running
        const isServerRunning = await applicationService.checkServerStatus();
        if (!isServerRunning) {
          setServerStatus("not-running");
          setError("Backend server is not running. Please start the server.");
          setLoading(false);
          return;
        }

        setServerStatus("running");
        
        // Server is running, fetch applications
        const applications = await applicationService.getAllApplications();
        setApplications(applications);
        setLoading(false);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Failed to fetch applications");
        setLoading(false);
      }
    };

    checkServerAndFetchData();
    document.title = "Admin Dashboard";
  }, []);

  // Hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAction = (app: Application, action: "approve" | "reject") => {
    setSelectedApplication(app);
    setActionType(action);
    setComment("");
    setActionDialogOpen(true);
  };

  const submitAction = async () => {
    if (!selectedApplication || !actionType || !comment.trim()) return;
    
    setProcessingAction(true);
    
    try {
      await applicationService.updateApplicationStatus(
        selectedApplication._id,
        actionType === "approve" ? "approved" : "rejected",
        comment
      );

      // Update local state
      setApplications(applications.map(app => 
        app._id === selectedApplication._id 
          ? { ...app, status: actionType === "approve" ? "approved" : "rejected" } 
          : app
      ));

      setActionDialogOpen(false);
      setSelectedApplication(null);
      setComment("");
      setActionType(null);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: `Application ${actionType === "approve" ? "approved" : "rejected"} successfully`
      });
    } catch (err: any) {
      console.error("Error updating application:", err);
      setNotification({
        type: 'error',
        message: err.message || `Failed to ${actionType} application`
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const refreshApplications = async () => {
    setLoading(true);
    setError("");
    
    try {
      const applications = await applicationService.getAllApplications();
      setApplications(applications);
      setNotification({
        type: 'success',
        message: 'Applications refreshed successfully'
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch applications");
      setNotification({
        type: 'error',
        message: 'Failed to refresh applications'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartServer = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Attempt to start the server
      await startBackendServer();
      
      // Check if server is now running
      const isRunning = await applicationService.checkServerStatus();
      if (isRunning) {
        setServerStatus("running");
        // Server is now running, fetch applications
        const applications = await applicationService.getAllApplications();
        setApplications(applications);
        setNotification({
          type: 'success',
          message: 'Server started successfully'
        });
      } else {
        setServerStatus("not-running");
        setError("Could not start the backend server. Please start it manually.");
        setNotification({
          type: 'error',
          message: 'Failed to start server'
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to start the server");
      setNotification({
        type: 'error',
        message: 'Failed to start server'
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the getStatusColor function with higher contrast colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#d1fae5', text: '#064e3b', border: '#10b981' }; // Darker text for better contrast
      case 'rejected':
        return { bg: '#fee2e2', text: '#7f1d1d', border: '#ef4444' }; // Darker red text
      case 'pending':
        return { bg: '#fef3c7', text: '#78350f', border: '#f59e0b' }; // Darker amber text
      case 'under_review':
        return { bg: '#dbeafe', text: '#1e3a8a', border: '#3b82f6' }; // Darker blue text
      default:
        return { bg: '#f3f4f6', text: '#111827', border: '#9ca3af' }; // Darker gray text
    }
  };

  const toggleDetails = (id: string) => {
    if (viewDetailsId === id) {
      setViewDetailsId(null);
    } else {
      setViewDetailsId(id);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading applications...</div>;
  }

  if (serverStatus === "not-running") {
    return (
      <div style={{ padding: "20px", color: "red", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2>Backend Server Not Running</h2>
        <p>The backend server at http://localhost:7777 is not running.</p>
        <p>Please start the server with one of the following methods:</p>
        
        <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "8px", margin: "15px 0", textAlign: "left" }}>
          <h3 style={{ fontSize: "16px", marginTop: 0 }}>Option 1: Use the startup script</h3>
          <p>Run the following command in your terminal:</p>
          <div style={{ backgroundColor: "#374151", color: "white", padding: "10px", borderRadius: "4px", fontFamily: "monospace" }}>
            ./Sports-scholarship1/start-backend.sh
          </div>
        </div>
        
        <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "8px", margin: "15px 0", textAlign: "left" }}>
          <h3 style={{ fontSize: "16px", marginTop: 0 }}>Option 2: Manual startup</h3>
          <ol style={{ textAlign: "left", paddingLeft: "20px" }}>
            <li>Open a terminal</li>
            <li>Navigate to the backend directory: <code>cd Sports-scholarship1/backend</code></li>
            <li>Install dependencies if needed: <code>npm install</code></li>
            <li>Start the server: <code>npm start</code></li>
          </ol>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button 
            onClick={handleStartServer}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#3b82f6", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Try to Start Server
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#6b7280", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              fontSize: "16px",
              marginLeft: "10px"
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error loading applications</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#3b82f6", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Notification */}
      {notification && (
        <div 
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: notification.type === 'success' ? '#d1fae5' : notification.type === 'error' ? '#fee2e2' : '#e0f2fe',
            color: notification.type === 'success' ? '#065f46' : notification.type === 'error' ? '#991b1b' : '#0369a1',
            padding: "12px 16px",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxWidth: "300px"
          }}
        >
          {notification.message}
        </div>
      )}

      <header style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#000000" }}>Admin Dashboard</h1>
            <p style={{ color: "#1f2937" }}>Manage scholarship applications</p>
          </div>
          <nav>
            <Link 
              to="/admin/status-history" 
              style={{ 
                marginRight: "20px", 
                textDecoration: "none", 
                color: "#1d4ed8",
                fontWeight: "bold"
              }}
            >
              Status History
            </Link>
            <Link 
              to="/" 
              style={{ 
                textDecoration: "none", 
                color: "#1d4ed8",
                fontWeight: "bold"
              }}
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section style={{ marginBottom: "25px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "15px"
          }}>
            <h2 style={{ 
              fontSize: "18px", 
              color: "#111827", 
              fontWeight: "600",
              margin: 0
            }}>Applications Summary</h2>
            <button
              onClick={refreshApplications}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f9fafb",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
            >
              <span style={{ fontSize: "16px" }}>↻</span> Refresh
            </button>
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: "15px"
          }}>
            <div style={{ 
              padding: "20px", 
              backgroundColor: "#ffffff", 
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <p style={{ margin: 0, color: "#4b5563", fontSize: "14px", fontWeight: "500" }}>Total Applications</p>
              <p style={{ fontSize: "24px", fontWeight: "700", margin: "8px 0 0 0", color: "#000000" }}>{applications.length}</p>
            </div>
            <div style={{ 
              padding: "20px", 
              backgroundColor: "#fffbeb", 
              borderRadius: "10px",
              border: "1px solid #fcd34d",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <p style={{ margin: 0, color: "#92400e", fontSize: "14px", fontWeight: "500" }}>Pending</p>
              <p style={{ fontSize: "24px", fontWeight: "700", margin: "8px 0 0 0", color: "#7c2d12" }}> 
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            <div style={{ 
              padding: "20px", 
              backgroundColor: "#eff6ff", 
              borderRadius: "10px",
              border: "1px solid #93c5fd",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <p style={{ margin: 0, color: "#1e40af", fontSize: "14px", fontWeight: "500" }}>Under Review</p>
              <p style={{ fontSize: "24px", fontWeight: "700", margin: "8px 0 0 0", color: "#1e3a8a" }}>
                {applications.filter(app => app.status === 'under_review').length}
              </p>
            </div>
            <div style={{ 
              padding: "20px", 
              backgroundColor: "#ecfdf5", 
              borderRadius: "10px",
              border: "1px solid #6ee7b7",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <p style={{ margin: 0, color: "#065f46", fontSize: "14px", fontWeight: "500" }}>Approved</p>
              <p style={{ fontSize: "24px", fontWeight: "700", margin: "8px 0 0 0", color: "#064e3b" }}>
                {applications.filter(app => app.status === 'approved').length}
              </p>
            </div>
            <div style={{ 
              padding: "20px", 
              backgroundColor: "#fef2f2", 
              borderRadius: "10px",
              border: "1px solid #fca5a5",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <p style={{ margin: 0, color: "#991b1b", fontSize: "14px", fontWeight: "500" }}>Rejected</p>
              <p style={{ fontSize: "24px", fontWeight: "700", margin: "8px 0 0 0", color: "#7f1d1d" }}>
                {applications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Applications</h2>
          {applications.length === 0 ? (
            <p>No applications found</p>
          ) : (
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
              <thead>
                <tr style={{ 
                  borderBottom: "1px solid #e5e7eb", 
                  backgroundColor: "#f3f4f6"
                }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>Email</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>Date</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <React.Fragment key={app._id}>
                    <tr style={{ 
                      borderBottom: "1px solid #e5e7eb", 
                      backgroundColor: viewDetailsId === app._id ? "#f9fafb" : "white",
                      transition: "background-color 0.2s"
                    }}>
                      <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>{app.applicationId || app._id.substring(0, 6)}</td>
                      <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "500", color: "#000000" }}>{app.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>{app.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "4px 8px", 
                          borderRadius: "4px", 
                          fontSize: "12px", 
                          fontWeight: "bold",
                          backgroundColor: getStatusColor(app.status).bg, 
                          color: getStatusColor(app.status).text,
                          border: `1px solid ${getStatusColor(app.status).border}`
                        }}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>{app.TournamentDate || 'N/A'}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => toggleDetails(app._id)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#f3f4f6",
                              color: "#111827", // Darker text for better contrast
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600", // Bolder text for better readability
                              transition: "all 0.2s",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#e5e7eb";
                              e.currentTarget.style.color = "#000000"; // Darker on hover
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#f3f4f6";
                              e.currentTarget.style.color = "#111827";
                            }}
                          >
                            {viewDetailsId === app._id ? (
                              <>
                                <span style={{ fontSize: "14px" }}>▲</span> 
                                Hide Details
                              </>
                            ) : (
                              <>
                                <span style={{ fontSize: "14px" }}>▼</span>
                                View Details
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => handleAction(app, "approve")}
                            disabled={app.status === "approved"}
                            style={{ 
                              padding: "6px 12px", 
                              backgroundColor: app.status === "approved" ? "#e5e7eb" : "#ecfdf5", 
                              color: app.status === "approved" ? "#6b7280" : "#047857", 
                              border: app.status === "approved" ? "1px solid #d1d5db" : "1px solid #10b981", 
                              borderRadius: "6px", 
                              cursor: app.status === "approved" ? "default" : "pointer",
                              fontSize: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s",
                              boxShadow: app.status === "approved" ? "none" : "0 1px 2px rgba(0,0,0,0.05)"
                            }}
                            onMouseOver={(e) => {
                              if (app.status !== "approved") {
                                e.currentTarget.style.backgroundColor = "#d1fae5";
                              }
                            }}
                            onMouseOut={(e) => {
                              if (app.status !== "approved") {
                                e.currentTarget.style.backgroundColor = "#ecfdf5";
                              }
                            }}
                          >
                            {app.status === "approved" ? "Approved" : "Approve"}
                          </button>
                          <button 
                            onClick={() => handleAction(app, "reject")}
                            disabled={app.status === "rejected"}
                            style={{ 
                              padding: "6px 12px", 
                              backgroundColor: app.status === "rejected" ? "#e5e7eb" : "#fef2f2", 
                              color: app.status === "rejected" ? "#6b7280" : "#b91c1c", 
                              border: app.status === "rejected" ? "1px solid #d1d5db" : "1px solid #ef4444", 
                              borderRadius: "6px", 
                              cursor: app.status === "rejected" ? "default" : "pointer",
                              fontSize: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s",
                              boxShadow: app.status === "rejected" ? "none" : "0 1px 2px rgba(0,0,0,0.05)"
                            }}
                            onMouseOver={(e) => {
                              if (app.status !== "rejected") {
                                e.currentTarget.style.backgroundColor = "#fee2e2";
                              }
                            }}
                            onMouseOut={(e) => {
                              if (app.status !== "rejected") {
                                e.currentTarget.style.backgroundColor = "#fef2f2";
                              }
                            }}
                          >
                            {app.status === "rejected" ? "Rejected" : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {viewDetailsId === app._id && (
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                        <td colSpan={6} style={{ padding: "20px" }}>
                          <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "1fr 1fr", 
                            gap: "20px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "white"
                          }}>
                            <div style={{ padding: "20px", borderRight: "1px solid #e5e7eb" }}>
                              <h3 style={{ fontSize: "16px", marginTop: 0, marginBottom: "15px", color: "#000000", fontWeight: "600" }}>Applicant Details</h3>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                                <strong style={{ color: "#000000", width: "140px", display: "inline-block", fontWeight: "600" }}>Name:</strong> 
                                <span style={{ color: "#000000" }}>{app.name}</span>
                              </p>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                                <strong style={{ color: "#000000", width: "140px", display: "inline-block", fontWeight: "600" }}>Email:</strong> 
                                <span style={{ color: "#000000" }}>{app.email}</span>
                              </p>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                                <strong style={{ color: "#000000", width: "140px", display: "inline-block", fontWeight: "600" }}>Mobile:</strong> 
                                <span style={{ color: "#000000" }}>{app.mobile}</span>
                              </p>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                                <strong style={{ color: "#000000", width: "140px", display: "inline-block", fontWeight: "600" }}>Engineering Field:</strong> 
                                <span style={{ color: "#000000" }}>{app.engineeringField}</span>
                              </p>
                            </div>
                            <div style={{ padding: "20px" }}>
                              <h3 style={{ fontSize: "16px", marginTop: 0, marginBottom: "15px", color: "#1f2937", fontWeight: "600" }}>Sports Details</h3>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}><strong style={{ color: "#4b5563", width: "140px", display: "inline-block" }}>Sport:</strong> {app.sportsType || app.sport}</p>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}><strong style={{ color: "#4b5563", width: "140px", display: "inline-block" }}>Position/Level:</strong> {app.positionLevel || 'N/A'}</p>
                              <p style={{ margin: "8px 0", fontSize: "14px" }}><strong style={{ color: "#4b5563", width: "140px", display: "inline-block" }}>Tournament Date:</strong> {app.TournamentDate || 'N/A'}</p>
                            </div>
                            {app.comments && app.comments.length > 0 && (
                              <div style={{ gridColumn: "span 2", padding: "20px", borderTop: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                                <h3 style={{ fontSize: "16px", marginTop: 0, marginBottom: "15px", color: "#1f2937", fontWeight: "600" }}>Comments & History</h3>
                                <div style={{ maxHeight: "200px", overflowY: "auto", padding: "4px" }}>
                                  {app.comments.map((comment, index) => (
                                    <div key={index} style={{ 
                                      backgroundColor: 
                                        comment.actionType === 'approve' ? '#ecfdf5' : 
                                        comment.actionType === 'reject' ? '#fef2f2' : '#f9fafb',
                                      padding: "12px 15px",
                                      borderRadius: "8px",
                                      marginBottom: "10px",
                                      border: `1px solid ${
                                        comment.actionType === 'approve' ? '#10b981' : 
                                        comment.actionType === 'reject' ? '#ef4444' : '#e5e7eb'
                                      }`
                                    }}>
                                      <p style={{ margin: 0, fontSize: "14px", color: "#111827", fontWeight: "400" }}>{comment.content}</p>
                                      <div style={{ 
                                        display: "flex", 
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginTop: "8px",
                                        fontSize: "12px",
                                        color: "#4b5563" // Darker gray for better contrast
                                      }}>
                                        <span>{new Date(comment.date).toLocaleString()}</span>
                                        <span style={{ 
                                          display: "inline-block",
                                          padding: "2px 8px",
                                          borderRadius: "12px",
                                          backgroundColor: 
                                            comment.actionType === 'approve' ? '#d1fae5' : 
                                            comment.actionType === 'reject' ? '#fee2e2' : '#f3f4f6',
                                          color: 
                                            comment.actionType === 'approve' ? '#065f46' : 
                                            comment.actionType === 'reject' ? '#991b1b' : '#111827',
                                          textTransform: "capitalize",
                                          fontWeight: "600" // Bolder for better readability
                                        }}>
                                          {comment.actionType}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <footer style={{ marginTop: "30px", borderTop: "1px solid #e5e5e5", paddingTop: "15px", textAlign: "center" }}>
        <p style={{ color: "#666" }}>EIL Scholar Admin Panel - Version 1.0</p>
      </footer>

      {/* Action Dialog Modal */}
      {actionDialogOpen && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "12px", 
            padding: "24px", 
            width: "90%", 
            maxWidth: "500px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "16px"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#000000" }}>
                {actionType === "approve" ? "Approve Application" : "Reject Application"}
              </h2>
              <button 
                onClick={() => setActionDialogOpen(false)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  fontSize: "20px", 
                  cursor: "pointer",
                  color: "#6b7280",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.color = "#111827";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ 
              marginBottom: "20px",
              backgroundColor: "#f9fafb",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "600", color: "#000000" }}>Applicant: <span style={{ color: "#111827" }}>{selectedApplication?.name}</span></p>
              <p style={{ margin: "0", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>ID: {selectedApplication?.applicationId || selectedApplication?._id}</p>
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: "#111827" // Darker for better contrast
              }}>
                {actionType === "approve" ? "Approval Comments:" : "Rejection Reasons:"}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={actionType === "approve" 
                  ? "Add any comments or conditions for approval..." 
                  : "Provide detailed reasons for rejection..."}
                style={{ 
                  width: "100%", 
                  minHeight: "120px", 
                  padding: "8px 12px", 
                  border: "1px solid #374151", 
                  borderRadius: "4px", 
                  marginBottom: "20px",
                  backgroundColor: "#ffffff",
                  color: "#000000"
                }}
                onFocus={(e) => e.target.style.borderColor = actionType === "approve" ? "#10b981" : "#ef4444"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setActionDialogOpen(false)}
                disabled={processingAction}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: processingAction ? "not-allowed" : "pointer",
                  opacity: processingAction ? 0.7 : 1,
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  if (!processingAction) {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                  }
                }}
                onMouseOut={(e) => {
                  if (!processingAction) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={!comment.trim() || processingAction}
                style={{
                  padding: "10px 20px",
                  backgroundColor: actionType === "approve" ? "#10b981" : "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: comment.trim() && !processingAction ? "pointer" : "not-allowed",
                  opacity: comment.trim() && !processingAction ? 1 : 0.7,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
                onMouseOver={(e) => {
                  if (comment.trim() && !processingAction) {
                    e.currentTarget.style.backgroundColor = actionType === "approve" ? "#059669" : "#dc2626";
                  }
                }}
                onMouseOut={(e) => {
                  if (comment.trim() && !processingAction) {
                    e.currentTarget.style.backgroundColor = actionType === "approve" ? "#10b981" : "#ef4444";
                  }
                }}
              >
                {processingAction ? (
                  <>
                    <span style={{ 
                      display: "inline-block", 
                      width: "16px", 
                      height: "16px", 
                      borderRadius: "50%", 
                      border: "2px solid rgba(255,255,255,0.5)", 
                      borderTopColor: "white", 
                      animation: "spin 1s linear infinite" 
                    }}>
                    </span>
                    Processing...
                  </>
                ) : (
                  actionType === "approve" ? "Approve" : "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SimpleAdminDashboard;

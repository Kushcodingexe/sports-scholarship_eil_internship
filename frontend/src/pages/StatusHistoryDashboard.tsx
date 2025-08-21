import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface StatusHistoryItem {
  _id: string;
  applicationId: string;
  applicationNumber: string;
  applicantName: string;
  previousStatus: string;
  newStatus: string;
  comment: string;
  adminId: string;
  adminName: string;
  timestamp: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
}

const StatusHistoryDashboard = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalPages: 1
  });
  const [filter, setFilter] = useState({
    status: "",
    startDate: "",
    endDate: ""
  });
  
  // State for calendar date selection
  const [startDateCalendar, setStartDateCalendar] = useState<Date | undefined>(undefined);
  const [endDateCalendar, setEndDateCalendar] = useState<Date | undefined>(undefined);

  // Function to format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#d1fae5', text: '#064e3b', border: '#10b981' };
      case 'rejected':
        return { bg: '#fee2e2', text: '#7f1d1d', border: '#ef4444' };
      case 'pending':
        return { bg: '#fef3c7', text: '#78350f', border: '#f59e0b' };
      case 'under_review':
        return { bg: '#dbeafe', text: '#1e3a8a', border: '#3b82f6' };
      default:
        return { bg: '#f3f4f6', text: '#111827', border: '#9ca3af' };
    }
  };

  // Handler for calendar date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDateCalendar(date);
    setFilter(prev => ({
      ...prev,
      startDate: date ? format(date, 'yyyy-MM-dd') : ''
    }));
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDateCalendar(date);
    setFilter(prev => ({
      ...prev,
      endDate: date ? format(date, 'yyyy-MM-dd') : ''
    }));
  };

  // Fetch status history data
  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Construct query params
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString()
        });
        
        if (filter.status) {
          params.append('status', filter.status);
        }
        
        if (filter.startDate) {
          params.append('startDate', filter.startDate);
        }
        
        if (filter.endDate) {
          params.append('endDate', filter.endDate);
        }
        
        const response = await fetch(`https://sports-scholarship1-main.vercel.app/api/status-history?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch status history data');
        }
        
        const data = await response.json();
        
        setHistoryData(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          totalPages: data.pagination.totalPages
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching status history:', err);
        setError(err.message || 'Failed to load status history');
        setLoading(false);
      }
    };
    
    fetchStatusHistory();
  }, [pagination.page, pagination.limit, filter]);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset to page 1 when filter changes
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilter({ status: "", startDate: "", endDate: "" });
    setStartDateCalendar(undefined);
    setEndDateCalendar(undefined);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading status history...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error loading status history</h2>
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
      <header style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#fbf8f8ff" }}>Status History Dashboard</h1>
            <p style={{ color: "#feffffff" }}>View application status change history</p>
          </div>
          <nav>
            <Link to="/admin" style={{ marginRight: "20px", textDecoration: "none", color: "#1d4ed8", fontWeight: "bold" }}>
              Admin Dashboard
            </Link>
            <Link to="/" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: "bold" }}>
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Filters */}
      <div style={{ 
        marginBottom: "20px", 
        padding: "15px", 
        backgroundColor: "#f9fafb", 
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", marginTop: 0, marginBottom: "15px", color: "#000000" }}>
          Filter Status History
        </h2>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#1f2937", fontWeight: "600" }}>
              Status
            </label>
            <select 
              name="status" 
              value={filter.status} 
              onChange={handleFilterChange}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "6px", 
                border: "1px solid #374151",
                fontSize: "14px",
                width: "150px",
                backgroundColor: "#ffffff",
                color: "#000000"
              }}
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>
          
          {/* Start Date Calendar */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#1f2937", fontWeight: "600" }}>
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #374151",
                    fontSize: "14px",
                    width: "160px",
                    backgroundColor: "#ffffff",
                    color: startDateCalendar ? "#000000" : "#6b7280",
                    cursor: "pointer"
                  }}
                >
                  {startDateCalendar ? format(startDateCalendar, 'PP') : "Select date"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDateCalendar}
                  onSelect={handleStartDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* End Date Calendar */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#1f2937", fontWeight: "600" }}>
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #374151",
                    fontSize: "14px",
                    width: "160px",
                    backgroundColor: "#ffffff",
                    color: endDateCalendar ? "#000000" : "#6b7280",
                    cursor: "pointer"
                  }}
                >
                  {endDateCalendar ? format(endDateCalendar, 'PP') : "Select date"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDateCalendar}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div style={{ alignSelf: "flex-end" }}>
            <button
              onClick={handleClearFilters}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                color: "#000000",
                border: "1px solid #374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Status History Table */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ 
          backgroundColor: "#ffffff", 
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb"
        }}>
          {historyData.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
              No status history records found with the current filters.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ 
                  backgroundColor: "#f3f4f6",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>
                    Date & Time
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>
                    Application
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>
                    Status Change
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>
                    Admin
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "bold", color: "#000000" }}>
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>
                      {formatDate(item.timestamp)}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>
                      <div style={{ fontWeight: "500" }}>{item.applicationNumber}</div>
                      <div style={{ color: "#4b5563", fontSize: "13px" }}>{item.applicantName}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ 
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: getStatusColor(item.previousStatus).bg,
                          color: getStatusColor(item.previousStatus).text,
                          border: `1px solid ${getStatusColor(item.previousStatus).border}`,
                          textTransform: "capitalize"
                        }}>
                          {item.previousStatus.replace('_', ' ')}
                        </span>
                        <span style={{ color: "#6b7280" }}>→</span>
                        <span style={{ 
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: getStatusColor(item.newStatus).bg,
                          color: getStatusColor(item.newStatus).text,
                          border: `1px solid ${getStatusColor(item.newStatus).border}`,
                          textTransform: "capitalize"
                        }}>
                          {item.newStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>
                      {item.adminName}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#000000" }}>
                      {item.comment || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>No comment</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "5px",
          marginBottom: "30px"
        }}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.page === 1}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f9fafb",
              color: pagination.page === 1 ? "#9ca3af" : "#000000",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: pagination.page === 1 ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f9fafb",
              color: pagination.page === 1 ? "#9ca3af" : "#000000",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: pagination.page === 1 ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            ‹
          </button>
          
          {/* Page numbers */}
          {[...Array(pagination.totalPages)].map((_, index) => {
            const pageNum = index + 1;
            // Only show 5 page numbers centered around current page
            if (
              pageNum === 1 || 
              pageNum === pagination.totalPages || 
              (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: pageNum === pagination.page ? "#1d4ed8" : "#f9fafb",
                    color: pageNum === pagination.page ? "#ffffff" : "#000000",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    cursor: pageNum === pagination.page ? "default" : "pointer",
                    fontSize: "14px",
                    fontWeight: pageNum === pagination.page ? "700" : "500",
                    minWidth: "36px"
                  }}
                >
                  {pageNum}
                </button>
              );
            } else if (
              (pageNum === pagination.page - 3 && pagination.page > 3) || 
              (pageNum === pagination.page + 3 && pagination.page < pagination.totalPages - 2)
            ) {
              // Show ellipsis
              return <span key={pageNum} style={{ padding: "8px 4px" }}>...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f9fafb",
              color: pagination.page === pagination.totalPages ? "#9ca3af" : "#000000",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f9fafb",
              color: pagination.page === pagination.totalPages ? "#9ca3af" : "#000000",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            »
          </button>
        </div>
      )}

      <footer style={{ marginTop: "30px", borderTop: "1px solid #e5e7eb", paddingTop: "15px", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>EIL Scholar Admin Panel - Version 1.0</p>
      </footer>
    </div>
  );
};

export default StatusHistoryDashboard; 

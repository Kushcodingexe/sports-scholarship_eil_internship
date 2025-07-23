const StatusHistory = require('../models/StatusHistory');

// @desc    Get all status history records
// @route   GET /api/status-history
// @access  Private/Admin
exports.getAllStatusHistory = async (req, res, next) => {
  try {
    // Default pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;
    
    // Filtering options
    const filter = {};
    
    if (req.query.status) {
      filter.newStatus = req.query.status;
    }
    
    if (req.query.applicationId) {
      filter.applicationId = req.query.applicationId;
    }
    
    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      filter.timestamp = {};
      
      if (req.query.startDate) {
        filter.timestamp.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        filter.timestamp.$lte = new Date(req.query.endDate);
      }
    }
    
    // Admin filter - only admins can see other admin's actions
    if (req.query.adminId && req.user.role === 'admin') {
      filter.adminId = req.query.adminId;
    }
    
    // Get total count for pagination
    const total = await StatusHistory.countDocuments(filter);
    
    // Execute query with pagination
    const statusHistory = await StatusHistory.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: statusHistory.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: statusHistory
    });
  } catch (error) {
    console.error('Error getting status history:', error);
    next(error);
  }
};

// @desc    Get status history for a specific application
// @route   GET /api/status-history/application/:id
// @access  Private
exports.getApplicationStatusHistory = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    
    // Check application access permissions
    // This would typically check if the user has permission to view this application
    // But for now, we'll just check if they're an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application history'
      });
    }
    
    const statusHistory = await StatusHistory.find({ applicationId })
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: statusHistory.length,
      data: statusHistory
    });
  } catch (error) {
    console.error('Error getting application status history:', error);
    next(error);
  }
};

// @desc    Get summary statistics for status changes
// @route   GET /api/status-history/stats
// @access  Private/Admin
exports.getStatusHistoryStats = async (req, res, next) => {
  try {
    // Get status counts
    const statusCounts = await StatusHistory.aggregate([
      { $group: { _id: '$newStatus', count: { $sum: 1 } } }
    ]);
    
    // Get daily counts for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyCounts = await StatusHistory.aggregate([
      { 
        $match: { 
          timestamp: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            status: '$newStatus'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Get admin activity
    const adminActivity = await StatusHistory.aggregate([
      {
        $group: {
          _id: '$adminId',
          adminName: { $first: '$adminName' },
          count: { $sum: 1 },
          lastActive: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        dailyCounts,
        adminActivity
      }
    });
  } catch (error) {
    console.error('Error getting status history stats:', error);
    next(error);
  }
}; 
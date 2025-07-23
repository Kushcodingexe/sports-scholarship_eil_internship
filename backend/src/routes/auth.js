const express = require('express');
const { register, login, getMe, logout, getAllUsers, seedUsers } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
// Debug routes - should be disabled in production
router.get('/debug/users', getAllUsers);
router.post('/debug/seed', seedUsers);


// ... existing routes ...

// Add this new route to get applications
// router.get('/applications', protect, async (req, res) => {
//   try {
//     // Replace this with your actual database query
//     const applications = await Application.find({}); 
//     res.json(applications);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// Add this route to your auth routes
// router.put('/applications/:id', protect, async (req, res) => {
//   try {
//     const { status, comment } = req.body;
    
//     const updatedApp = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status, comment },
//       { new: true }
//     );
    
//     if (!updatedApp) {
//       return res.status(404).json({ error: "Application not found" });
//     }
    
//     res.json(updatedApp);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router; 
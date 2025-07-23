const mongoose = require('mongoose');
const User = require('./models/User');
const Application = require('./models/Application');
const config = require('./config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed Users if they don't exist
const seedUsers = async () => {
  try {
    console.log('Checking for existing users...');
    
    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`Found ${userCount} existing users, skipping user seed.`);
      return await User.find();
    }
    
    console.log('No users found. Seeding database with sample users...');
    
    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: 'admin',
        phone: '+91 9876543210',
        college: 'IIT Delhi',
        engineeringField: 'Computer Science',
        yearOfStudy: '3rd Year'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'user',
        phone: '+91 9876543211',
        college: 'NIT Trichy',
        engineeringField: 'Electrical Engineering',
        yearOfStudy: '2nd Year'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'Password123!',
        role: 'user',
        phone: '+91 9876543212',
        college: 'BITS Pilani',
        engineeringField: 'Mechanical Engineering',
        yearOfStudy: '4th Year'
      }
    ]);
    
    console.log(`${users.length} sample users created successfully`);
    
    // Print user emails for reference
    users.forEach(user => {
      console.log(`- Created user: ${user.email} (${user.role})`);
    });
    
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed Applications
const seedApplications = async (users) => {
  try {
    console.log('Checking for existing applications...');
    
    // Check if applications already exist
    const appCount = await Application.countDocuments();
    if (appCount > 0) {
      console.log(`Found ${appCount} existing applications, skipping application seed.`);
      return;
    }
    
    console.log('No applications found. Seeding database with sample applications...');
    
    // Get regular users (non-admin)
    const regularUsers = users.filter(user => user.role === 'user');
    
    if (regularUsers.length === 0) {
      console.log('No regular users found to create applications for.');
      return;
    }
    
    // Sample sports data
    const sports = [
      { name: 'Cricket', position: 'Batsman', tournament: 'National Championship' },
      { name: 'Football', position: 'Forward', tournament: 'State Cup' },
      { name: 'Badminton', position: 'Singles', tournament: 'University Games' },
      { name: 'Basketball', position: 'Point Guard', tournament: 'College League' },
      { name: 'Tennis', position: 'Singles', tournament: 'Regional Championship' },
      { name: 'Kabadi', position: 'Raider', tournament: 'Pro Kabadi League' }
    ];
    
    // Sample application statuses
    const statuses = ['pending', 'under_review', 'approved', 'rejected'];
    
    // Create applications
    const applications = [];
    let appCount2 = 0;
    
    for (const user of regularUsers) {
      // Create 2-3 applications per user
      const numApps = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numApps; i++) {
        const sport = sports[Math.floor(Math.random() * sports.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const application = await Application.create({
          name: user.name,
          user: user._id,
          email: user.email,
          mobile: user.phone,
          engineeringField: user.engineeringField,
          sportsType: sport.name,
          positionLevel: sport.position,
          TournamentDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
          status: status,
          comments: status === 'approved' || status === 'rejected' ? [
            {
              content: `This application was ${status} by the system during seeding.`,
              actionType: status === 'approved' ? 'approve' : 'reject'
            }
          ] : []
        });
        
        applications.push(application);
        appCount2++;
      }
    }
    
    console.log(`${appCount2} sample applications created successfully`);
    
    // Print application details for reference
    applications.forEach(app => {
      console.log(`- Created application: ${app.applicationId} - ${app.name} (${app.sportsType}) - Status: ${app.status}`);
    });
    
  } catch (error) {
    console.error('Error seeding applications:', error);
    throw error;
  }
};

// Run the seed function and then disconnect
const seedDatabase = async () => {
  try {
    const conn = await connectDB();
    const users = await seedUsers();
    await seedApplications(users);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding
seedDatabase(); 
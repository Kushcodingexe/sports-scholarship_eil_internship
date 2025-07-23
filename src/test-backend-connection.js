import axios from 'axios';

// Function to test the backend connection
async function testBackendConnection() {
  console.log('Testing connection to backend server...');
  try {
    const response = await axios.get('http://localhost:7777/health');
    console.log('Backend connection successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed!');
    console.error('Error:', error.message);
    return false;
  }
}

// Function to test application submission
async function testApplicationSubmission() {
  console.log('Testing application submission API...');

  // Get auth token from localStorage
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('No auth token found! Please log in first.');
    return false;
  }

  try {
    // Sample application data
    const sampleData = {
      name: "Test User",
      email: "test@example.com",
      mobile: "1234567890",
      engineeringField: "Computer Science",
      sportsType: "Cricket",
      institution: "Test University",
      nationalId: "12345678",
      status: "pending"
    };

    // Make API call with auth token
    const response = await axios.post(
      'http://localhost:7777/api/applications', 
      sampleData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Application submission test successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Application submission test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Execute the tests
async function runTests() {
  const connectionOk = await testBackendConnection();
  if (connectionOk) {
    await testApplicationSubmission();
  }
}

runTests();

// Export for use in other files
export default testBackendConnection; 
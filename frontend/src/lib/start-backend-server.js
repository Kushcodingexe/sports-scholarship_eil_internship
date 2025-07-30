// Utility to start the backend server if it's not running
const startBackendServer = async () => {
  try {
    console.log('Attempting to start backend server...');
    
    // Check if server is already running
    try {
      const response = await fetch('http://localhost:7777/', { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        timeout: 2000
      });
      
      if (response.ok) {
        console.log('Backend server is already running');
        return true;
      }
    } catch (error) {
      console.log('Backend server not detected, will attempt to start it');
    }

    // Server is not running, attempt to start it
    console.log('Starting backend server...');
    
    // Use dynamic import to load the backend server code
    try {
      // Use a worker to start the server without blocking the main thread
      const worker = new Worker(URL.createObjectURL(new Blob([`
        // Worker code to start the server
        self.onmessage = async function(e) {
          try {
            // Notify parent that we're starting the server
            self.postMessage({ status: 'starting' });
            
            // We can't directly import the server code in a worker
            // So we'll use fetch to tell the main thread to start the server
            self.postMessage({ status: 'ready' });
          } catch (error) {
            self.postMessage({ status: 'error', error: error.message });
          }
        };
      `], { type: 'application/javascript' })));
      
      worker.onmessage = (e) => {
        const { status, error } = e.data;
        if (status === 'ready') {
          console.log('Server start requested');
          // At this point we would normally start the server,
          // but in a browser context we can't start a Node.js server directly
          // This would require a backend service to handle this request
        } else if (status === 'error') {
          console.error('Error starting server:', error);
        }
      };
      
      // Start the worker
      worker.postMessage({ action: 'start' });
      
      // Show message to user about starting the server manually
      alert(`The backend server is not running. Please start it manually by running:
      
1. Open a terminal
2. Navigate to the backend directory: cd Sports-scholarship1/backend
3. Start the server: npm start
      
Then refresh this page.`);
      
      return false;
    } catch (error) {
      console.error('Error starting server:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in startBackendServer:', error);
    return false;
  }
};

export default startBackendServer; 
import axios from 'axios';

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  books: `${BASE_URL}/books`,
  borrowers: `${BASE_URL}/borrowers`,
  borrows: `${BASE_URL}/borrows`
};

// Test function for API endpoints
const testAPIEndpoints = async () => {
  console.log('🧪 Testing Library Management System API Endpoints\n');
  
  try {
    // Test root endpoint
    console.log('🔍 Testing root endpoint...');
    const rootResponse = await axios.get(BASE_URL);
    console.log(`✅ Root: ${rootResponse.data}\n`);
    
    // Test all GET endpoints
    const endpoints = [
      { name: 'Books', url: API_ENDPOINTS.books },
      { name: 'Borrowers', url: API_ENDPOINTS.borrowers },
      { name: 'Borrows', url: API_ENDPOINTS.borrows },
      { name: 'Due Books', url: `${API_ENDPOINTS.borrows}/due` }
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing ${endpoint.name} endpoint...`);
        const response = await axios.get(endpoint.url);
        console.log(`✅ ${endpoint.name}: ${response.status} - ${response.data.length} records`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`⚠️  ${endpoint.name}: Endpoint not found (404)`);
        } else {
          console.log(`❌ ${endpoint.name}: ${error.response?.status || 'ERROR'} - ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 API endpoint testing completed!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ Cannot connect to server at ${BASE_URL}`);
      console.log('💡 Make sure your server is running with: npm start or npm run dev');
    } else {
      console.log(`❌ Error testing API: ${error.message}`);
    }
  }
};

// Test POST endpoints with sample data
const testCreateEndpoints = async () => {
  console.log('🧪 Testing CREATE endpoints with sample data\n');
  
  try {
    // Test creating a book
    console.log('📚 Testing book creation...');
    const bookData = {
      title: "Test Book",
      author: "Test Author",
      isbn: "978-0-000-00000-0",
      quantity: 1,
      shelfLocation: "TEST-001"
    };
    
    const bookResponse = await axios.post(API_ENDPOINTS.books, bookData);
    console.log(`✅ Book created: ID ${bookResponse.data.id}`);
    
    // Test creating a borrower
    console.log('👥 Testing borrower creation...');
    const borrowerData = {
      name: "Test User",
      email: "test@example.com"
    };
    
    const borrowerResponse = await axios.post(API_ENDPOINTS.borrowers, borrowerData);
    console.log(`✅ Borrower created: ID ${borrowerResponse.data.id}`);
    
    // Test creating a borrow record
    console.log('📋 Testing borrow creation...');
    const borrowData = {
      bookId: bookResponse.data.id,
      borrowerId: borrowerResponse.data.id,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    };
    
    const borrowResponse = await axios.post(API_ENDPOINTS.borrows, borrowData);
    console.log(`✅ Borrow record created: ID ${borrowResponse.data.id}`);
    
    console.log('\n🎉 CREATE endpoints testing completed!');
    console.log('🧹 You may want to clean up the test data created above.');
    
  } catch (error) {
    console.log(`❌ Error testing CREATE endpoints: ${error.response?.data || error.message}`);
  }
};

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'get':
    testAPIEndpoints();
    break;
  case 'post':
    testCreateEndpoints();
    break;
  case 'all':
    testAPIEndpoints().then(() => {
      console.log('\n' + '='.repeat(50) + '\n');
      return testCreateEndpoints();
    });
    break;
  default:
    console.log(`
🧪 Library Management System - API Testing Script

Usage:
  node test-api.js <command>

Commands:
  get   - Test all GET endpoints (read operations)
  post  - Test POST endpoints (create operations) 
  all   - Test both GET and POST endpoints

Examples:
  node test-api.js get
  node test-api.js post
  node test-api.js all

Make sure your server is running on ${BASE_URL} before running this script.
    `);
    process.exit(0);
}

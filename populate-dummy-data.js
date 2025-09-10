import axios from 'axios';

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  books: `${BASE_URL}/books`,
  borrowers: `${BASE_URL}/borrowers`,
  borrows: `${BASE_URL}/borrows`
};

// Dummy data
const dummyBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    quantity: 5,
    shelfLocation: "A1-001"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    quantity: 3,
    shelfLocation: "A1-002"
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    quantity: 7,
    shelfLocation: "A2-001"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    quantity: 4,
    shelfLocation: "A2-002"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    quantity: 2,
    shelfLocation: "A3-001"
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0-7475-3269-9",
    quantity: 8,
    shelfLocation: "B1-001"
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "978-0-618-00222-1",
    quantity: 3,
    shelfLocation: "B1-002"
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    isbn: "978-0-452-28424-1",
    quantity: 6,
    shelfLocation: "A2-003"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0-547-92822-7",
    quantity: 4,
    shelfLocation: "B1-003"
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "978-0-06-085052-4",
    quantity: 3,
    shelfLocation: "A3-002"
  }
];

const dummyBorrowers = [
  {
    name: "Ahmed Ali",
    email: "ahmed.ali@example.com"
  },
  {
    name: "Sara Hassan",
    email: "sara.hassan@example.com"
  },
  {
    name: "Mohamed Ibrahim",
    email: "mohamed.ibrahim@example.com"
  },
  {
    name: "Fatma Khalil",
    email: "fatma.khalil@example.com"
  },
  {
    name: "Omar Youssef",
    email: "omar.youssef@example.com"
  },
  {
    name: "Nour Mahmoud",
    email: "nour.mahmoud@example.com"
  },
  {
    name: "Karim Mostafa",
    email: "karim.mostafa@example.com"
  },
  {
    name: "Layla Abdel Rahman",
    email: "layla.abdelrahman@example.com"
  }
];

// Helper function to generate random dates
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Function to create dummy borrow records
const createDummyBorrows = (bookIds, borrowerIds) => {
  const borrows = [];
  const currentDate = new Date();
  
  // Create some current borrows
  for (let i = 0; i < 10; i++) {
    const borrowDate = getRandomDate(
      new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      currentDate
    );
    const dueDate = addDays(borrowDate, 14); // 2 weeks borrowing period
    
    borrows.push({
      bookId: bookIds[Math.floor(Math.random() * bookIds.length)],
      borrowerId: borrowerIds[Math.floor(Math.random() * borrowerIds.length)],
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString()
    });
  }
  
  // Create some overdue borrows
  for (let i = 0; i < 3; i++) {
    const borrowDate = getRandomDate(
      new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)  // 30 days ago
    );
    const dueDate = addDays(borrowDate, 14); // Already overdue
    
    borrows.push({
      bookId: bookIds[Math.floor(Math.random() * bookIds.length)],
      borrowerId: borrowerIds[Math.floor(Math.random() * borrowerIds.length)],
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString()
    });
  }
  
  return borrows;
};

// Main function to populate data
const populateDummyData = async () => {
  try {
    console.log('🚀 Starting to populate dummy data...\n');
    
    // 1. Create Books
    console.log('📚 Creating books...');
    const createdBooks = [];
    for (const book of dummyBooks) {
      try {
        const response = await axios.post(API_ENDPOINTS.books, book);
        createdBooks.push(response.data);
        console.log(`✅ Created book: ${book.title}`);
      } catch (error) {
        console.error(`❌ Failed to create book ${book.title}:`, error.response?.data || error.message);
      }
    }
    
    console.log(`\n📚 Created ${createdBooks.length} books\n`);
    
    // 2. Create Borrowers
    console.log('👥 Creating borrowers...');
    const createdBorrowers = [];
    for (const borrower of dummyBorrowers) {
      try {
        const response = await axios.post(API_ENDPOINTS.borrowers, borrower);
        createdBorrowers.push(response.data);
        console.log(`✅ Created borrower: ${borrower.name}`);
      } catch (error) {
        console.error(`❌ Failed to create borrower ${borrower.name}:`, error.response?.data || error.message);
      }
    }
    
    console.log(`\n👥 Created ${createdBorrowers.length} borrowers\n`);
    
    // 3. Create Borrow Records
    if (createdBooks.length > 0 && createdBorrowers.length > 0) {
      console.log('📋 Creating borrow records...');
      const bookIds = createdBooks.map(book => book.id);
      const borrowerIds = createdBorrowers.map(borrower => borrower.id);
      const borrowsToCreate = createDummyBorrows(bookIds, borrowerIds);
      
      const createdBorrows = [];
      for (const borrow of borrowsToCreate) {
        try {
          const response = await axios.post(API_ENDPOINTS.borrows, borrow);
          createdBorrows.push(response.data);
          console.log(`✅ Created borrow record: Book ID ${borrow.bookId} → Borrower ID ${borrow.borrowerId}`);
        } catch (error) {
          console.error(`❌ Failed to create borrow record:`, error.response?.data || error.message);
        }
      }
      
      console.log(`\n📋 Created ${createdBorrows.length} borrow records\n`);
    }
    
    console.log('🎉 Dummy data population completed!\n');
    
    // Display summary
    console.log('📊 SUMMARY:');
    console.log(`📚 Books: ${createdBooks.length}`);
    console.log(`👥 Borrowers: ${createdBorrowers.length}`);
    console.log(`📋 Borrow Records: ${createdBooks.length > 0 && createdBorrowers.length > 0 ? 'Created' : 'Skipped'}`);
    
    console.log('\n🔗 Test your APIs:');
    console.log(`GET ${API_ENDPOINTS.books} - List all books`);
    console.log(`GET ${API_ENDPOINTS.borrowers} - List all borrowers`);
    console.log(`GET ${API_ENDPOINTS.borrows} - List all borrow records`);
    console.log(`GET ${API_ENDPOINTS.borrows}/due - List overdue books`);
    
  } catch (error) {
    console.error('💥 Fatal error during data population:', error.message);
    process.exit(1);
  }
};

// Function to clear all data (useful for testing)
const clearAllData = async () => {
  try {
    console.log('🧹 Clearing all data...\n');
    
    // Get all records first
    const [booksResponse, borrowersResponse, borrowsResponse] = await Promise.all([
      axios.get(API_ENDPOINTS.books).catch(() => ({ data: [] })),
      axios.get(API_ENDPOINTS.borrowers).catch(() => ({ data: [] })),
      axios.get(API_ENDPOINTS.borrows).catch(() => ({ data: [] }))
    ]);
    
    // Delete borrows first (due to foreign key constraints)
    console.log('🗑️  Deleting borrow records...');
    for (const borrow of borrowsResponse.data) {
      try {
        await axios.post(`${API_ENDPOINTS.borrows}/return/${borrow.id}`);
        console.log(`✅ Returned/Deleted borrow ID: ${borrow.id}`);
      } catch (error) {
        console.error(`❌ Failed to delete borrow ID ${borrow.id}:`, error.response?.data || error.message);
      }
    }
    
    // Delete borrowers
    console.log('🗑️  Deleting borrowers...');
    for (const borrower of borrowersResponse.data) {
      try {
        await axios.delete(`${API_ENDPOINTS.borrowers}/${borrower.id}`);
        console.log(`✅ Deleted borrower: ${borrower.name}`);
      } catch (error) {
        console.error(`❌ Failed to delete borrower ${borrower.name}:`, error.response?.data || error.message);
      }
    }
    
    // Delete books
    console.log('🗑️  Deleting books...');
    for (const book of booksResponse.data) {
      try {
        await axios.delete(`${API_ENDPOINTS.books}/${book.id}`);
        console.log(`✅ Deleted book: ${book.title}`);
      } catch (error) {
        console.error(`❌ Failed to delete book ${book.title}:`, error.response?.data || error.message);
      }
    }
    
    console.log('\n🎉 All data cleared successfully!');
    
  } catch (error) {
    console.error('💥 Error during data clearing:', error.message);
  }
};

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'populate':
    populateDummyData();
    break;
  case 'clear':
    clearAllData();
    break;
  case 'reset':
    clearAllData().then(() => {
      console.log('\n⏳ Waiting 2 seconds before repopulating...\n');
      setTimeout(populateDummyData, 2000);
    });
    break;
  default:
    console.log(`
🔧 Library Management System - Dummy Data Script

Usage:
  node populate-dummy-data.js <command>

Commands:
  populate  - Add dummy data to the database
  clear     - Remove all data from the database
  reset     - Clear all data and then populate with fresh dummy data

Examples:
  node populate-dummy-data.js populate
  node populate-dummy-data.js clear  
  node populate-dummy-data.js reset

Make sure your server is running on ${BASE_URL} before running this script.
    `);
    process.exit(0);
}

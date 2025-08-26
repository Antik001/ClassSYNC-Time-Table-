// Test script for MongoDB connection and API endpoints
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Get reference to models
    const User = require('./models/User');
    const Timetable = require('./models/Timetable');
    const Attendance = require('./models/Attendance');
    
    // Test User model by creating a test user
    console.log('\nTesting User model...');
    const testUser = new User({
      username: 'testuser',
      password: 'password123',
      role: 'student',
      name: 'Test User',
      email: 'test@example.com'
    });
    
    // Validate the user without saving
    await testUser.validate();
    console.log('✅ User model validation successful!');
    
    // Test Timetable model
    console.log('\nTesting Timetable model...');
    const testTimetable = new Timetable({
      name: 'Test Timetable',
      department: 'Test Department',
      semester: 'Test Semester',
      classes: [
        {
          day: 'Monday',
          time: '9:00 AM',
          subject: 'Test Subject',
          room: 'Test Room',
          faculty: 'Test Faculty'
        }
      ]
    });
    
    // Validate the timetable without saving
    await testTimetable.validate();
    console.log('✅ Timetable model validation successful!');
    
    // Test Attendance model
    console.log('\nTesting Attendance model...');
    const testAttendance = new Attendance({
      student: mongoose.Types.ObjectId(),
      class: 'Test-101',
      date: new Date(),
      status: 'present',
      markedBy: mongoose.Types.ObjectId()
    });
    
    // Validate the attendance without saving
    await testAttendance.validate();
    console.log('✅ Attendance model validation successful!');
    
    console.log('\n✅ All tests passed! The MongoDB backend is set up correctly.');
    console.log('\nTo test the API endpoints, start the server with: npm start');
    console.log('Then use a tool like Postman or curl to test the API endpoints.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
  }
};

// Run the test
testConnection();
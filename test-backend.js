const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
let authToken = '';

// Test configuration
const testConfig = {
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Helper function to log test results
function logTest(testName, success, message = '') {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}${message ? ': ' + message : ''}`);
}

// Test 1: Server Health Check
async function testServerHealth() {
    try {
        const response = await axios.get('http://localhost:3000/', testConfig);
        logTest('Server Health Check', true);
        return true;
    } catch (error) {
        logTest('Server Health Check', false, error.message);
        return false;
    }
}

// Test 2: User Registration
async function testUserRegistration() {
    try {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpass123',
            name: 'Test User',
            role: 'student',
            department: 'Computer Science',
            studentId: 'TEST001'
        };

        const response = await axios.post(`${API_BASE}/auth/register`, userData, testConfig);
        
        if (response.data.success && response.data.user) {
            logTest('User Registration', true);
            return true;
        } else {
            logTest('User Registration', false, 'Invalid response format');
            return false;
        }
    } catch (error) {
        logTest('User Registration', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Test 3: User Login
async function testUserLogin() {
    try {
        const loginData = {
            username: 'admin',
            password: 'admin123'
        };

        const response = await axios.post(`${API_BASE}/auth/login`, loginData, testConfig);
        
        if (response.data.success && response.data.token) {
            authToken = response.data.token;
            testConfig.headers.Authorization = `Bearer ${authToken}`;
            logTest('User Login', true);
            return true;
        } else {
            logTest('User Login', false, 'Invalid response format');
            return false;
        }
    } catch (error) {
        logTest('User Login', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Test 4: Get User Profile
async function testGetProfile() {
    try {
        const response = await axios.get(`${API_BASE}/auth/profile`, testConfig);
        
        if (response.data.success && response.data.user) {
            logTest('Get User Profile', true);
            return true;
        } else {
            logTest('Get User Profile', false, 'Invalid response format');
            return false;
        }
    } catch (error) {
        logTest('Get User Profile', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Test 5: Get Timetables
async function testGetTimetables() {
    try {
        const response = await axios.get(`${API_BASE}/timetables`, testConfig);
        
        if (response.data.success && Array.isArray(response.data.data)) {
            logTest('Get Timetables', true, `Found ${response.data.data.length} timetables`);
            return true;
        } else {
            logTest('Get Timetables', false, 'Invalid response format');
            return false;
        }
    } catch (error) {
        logTest('Get Timetables', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Test 6: Get Users List
async function testGetUsers() {
    try {
        const response = await axios.get(`${API_BASE}/users`, testConfig);
        
        if (response.data.success && Array.isArray(response.data.data)) {
            logTest('Get Users List', true, `Found ${response.data.data.length} users`);
            return true;
        } else {
            logTest('Get Users List', false, 'Invalid response format');
            return false;
        }
    } catch (error) {
        logTest('Get Users List', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Test 7: Generate Login QR Code
async function testGenerateLoginQR() {
    try {
        const response = await axios.post(`${API_BASE}/qr/generate-login`, {}, testConfig);
        
        if (response.data.success && response.data.data.hash) {
            logTest('Generate Login QR Code', true);
            return true;
        } else {
            logTest('Generate Login QR Code', false, 'Invalid response format');
            return false;
        }
    } catch (error) {
        logTest('Generate Login QR Code', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Test 8: Get Attendance Statistics
async function testGetAttendanceStats() {
    try {
        // First get a student ID from users list
        const usersResponse = await axios.get(`${API_BASE}/users/students/list`, testConfig);
        
        if (usersResponse.data.success && usersResponse.data.data.length > 0) {
            const studentId = usersResponse.data.data[0]._id;
            
            const response = await axios.get(`${API_BASE}/attendance/statistics?studentId=${studentId}`, testConfig);
            
            if (response.data.success) {
                logTest('Get Attendance Statistics', true);
                return true;
            } else {
                logTest('Get Attendance Statistics', false, 'Invalid response format');
                return false;
            }
        } else {
            logTest('Get Attendance Statistics', false, 'No students found');
            return false;
        }
    } catch (error) {
        logTest('Get Attendance Statistics', false, error.response?.data?.message || error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Backend API Tests...\n');
    
    const tests = [
        testServerHealth,
        testUserRegistration,
        testUserLogin,
        testGetProfile,
        testGetTimetables,
        testGetUsers,
        testGenerateLoginQR,
        testGetAttendanceStats
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        try {
            const result = await test();
            if (result) passedTests++;
        } catch (error) {
            console.log(`❌ ERROR in test: ${error.message}`);
        }
    }

    console.log('\n📊 Test Results:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Backend is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the backend configuration.');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runAllTests,
    testServerHealth,
    testUserRegistration,
    testUserLogin,
    testGetProfile,
    testGetTimetables,
    testGetUsers,
    testGenerateLoginQR,
    testGetAttendanceStats
};

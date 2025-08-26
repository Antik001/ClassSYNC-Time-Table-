// Main JavaScript for AI Timetable & Attendance System

// API Configuration
const API_URL = 'http://localhost:3000/api';

// QR Code API Endpoints
const QR_ENDPOINTS = {
    generateAttendance: `${API_URL}/qr/generate-attendance`,
    verifyAttendance: `${API_URL}/qr/verify-attendance`,
    generateLogin: `${API_URL}/qr/generate-login`,
    verifyLogin: `${API_URL}/qr/verify-login`
};

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

// Theme Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        authButtons.classList.toggle('active');
    });
}

// Modal Functions
function showLoginModal() {
    console.log('🚪 Opening login modal...');
    const modal = document.getElementById('login-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listener to login form if it exists
    const loginForm = document.getElementById('login-form');
    console.log('📝 Login form found:', !!loginForm);
    
    if (loginForm) {
        console.log('🔗 Adding submit event listener to login form...');
        // Remove existing listeners to prevent duplicates
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Event listener added successfully');
    } else {
        console.error('❌ Login form not found!');
    }
}

function showQRAttendanceModal() {
    const modal = document.getElementById('qr-attendance-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showQRLoginModal() {
    const modal = document.getElementById('qr-login-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// QR Code Functions
function switchQRTab(tab) {
    // Hide all content
    document.querySelectorAll('.qr-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tabs
    document.querySelectorAll('.qr-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    
    // Activate selected tab and content
    if (tab === 'generate') {
        document.getElementById('qr-generate-content').classList.add('active');
        document.querySelector('.qr-tab:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('qr-scan-content').classList.add('active');
        document.querySelector('.qr-tab:nth-child(2)').classList.add('active');
    }
}

function switchLoginQRTab(tab) {
    // Hide all content
    document.querySelectorAll('#qr-login-modal .qr-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tabs
    document.querySelectorAll('#qr-login-modal .qr-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    
    // Activate selected tab and content
    if (tab === 'generate') {
        document.getElementById('login-qr-generate-content').classList.add('active');
        document.querySelector('#qr-login-modal .qr-tab:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('login-qr-scan-content').classList.add('active');
        document.querySelector('#qr-login-modal .qr-tab:nth-child(2)').classList.add('active');
    }
}

// API Functions
async function handleLogin(event) {
    event.preventDefault();
    console.log('🔐 Login attempt started...');
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const loginStatus = document.getElementById('login-status');
    
    console.log('📝 Username:', username);
    console.log('🔑 Password length:', password.length);
    
    try {
        console.log('🌐 Sending login request to:', `${API_URL}/auth/login`);
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (response.ok) {
            console.log('✅ Login successful!');
            
            // Store user data in localStorage - match backend response structure
            localStorage.setItem('user', JSON.stringify({
                id: data.user._id,
                username: data.user.username,
                role: data.user.role,
                name: data.user.name
            }));
            localStorage.setItem('token', data.token);
            
            console.log('💾 User data stored in localStorage');
            
            // Show success message
            loginStatus.textContent = 'Login successful! Redirecting...';
            loginStatus.className = 'status-success';
            
            // Redirect based on role
            setTimeout(() => {
                console.log('🔄 Redirecting to dashboard for role:', data.user.role);
                closeModal('login-modal');
                redirectToDashboard(data.user.role);
            }, 1500);
        } else {
            console.log('❌ Login failed:', data.message);
            loginStatus.textContent = data.message || 'Login failed';
            loginStatus.className = 'status-error';
        }
    } catch (error) {
        console.error('💥 Login error:', error);
        loginStatus.textContent = 'Server error. Please try again later.';
        loginStatus.className = 'status-error';
    }
}

function redirectToDashboard(role) {
    // In a real app, redirect to different dashboards
    // For demo, we'll just show the appropriate demo modal
    showDemoModal(role);
}

// Timetable Functions
async function fetchTimetables() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/timetables`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch timetables');
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching timetables:', error);
        return [];
    }
}

async function fetchTimetableById(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/timetables/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch timetable');
        }
        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error(`Error fetching timetable ${id}:`, error);
        return null;
    }
}

async function fetchStudentAttendance(studentId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/attendance/student/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch attendance');
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error(`Error fetching attendance for student ${studentId}:`, error);
        return [];
    }
}

async function markAttendance(studentId, classId, status) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                student: studentId,
                class: classId,
                date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                status: status
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to mark attendance');
        }
        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error('Error marking attendance:', error);
        return null;
    }
}

function showRegisterModal() {
    const modal = document.getElementById('register-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showDemoModal(role) {
    const modal = document.getElementById('demo-modal');
    const demoTitle = document.getElementById('demo-title');
    const demoContent = document.getElementById('demo-content');
    
    // Set title based on role
    if (role === 'admin') {
        demoTitle.textContent = 'Admin Dashboard Demo';
        loadAdminDemoContent(demoContent);
    } else if (role === 'faculty') {
        demoTitle.textContent = 'Faculty Portal Demo';
        loadFacultyDemoContent(demoContent);
    } else if (role === 'student') {
        demoTitle.textContent = 'Student View Demo';
        loadStudentDemoContent(demoContent);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Demo Content Loaders
function loadAdminDemoContent(container) {
    container.innerHTML = `
        <div class="demo-dashboard admin-dashboard">
            <div class="demo-sidebar">
                <div class="demo-user">
                    <div class="demo-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="demo-user-info">
                        <h4>Admin User</h4>
                        <p>Department Head</p>
                    </div>
                </div>
                <div class="demo-nav">
                    <div class="demo-nav-item active"><i class="fas fa-tachometer-alt"></i> Dashboard</div>
                    <div class="demo-nav-item"><i class="fas fa-calendar-alt"></i> Timetables</div>
                    <div class="demo-nav-item"><i class="fas fa-user-check"></i> Attendance</div>
                    <div class="demo-nav-item"><i class="fas fa-users"></i> Faculty</div>
                    <div class="demo-nav-item"><i class="fas fa-user-graduate"></i> Students</div>
                    <div class="demo-nav-item"><i class="fas fa-cog"></i> Settings</div>
                </div>
            </div>
            <div class="demo-main">
                <h3>Admin Dashboard</h3>
                <div class="demo-stats">
                    <div class="demo-stat-card">
                        <div class="demo-stat-icon">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <div class="demo-stat-info">
                            <h4>1,245</h4>
                            <p>Total Students</p>
                        </div>
                    </div>
                    <div class="demo-stat-card">
                        <div class="demo-stat-icon">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div class="demo-stat-info">
                            <h4>87</h4>
                            <p>Faculty Members</p>
                        </div>
                    </div>
                    <div class="demo-stat-card">
                        <div class="demo-stat-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="demo-stat-info">
                            <h4>92%</h4>
                            <p>Attendance Rate</p>
                        </div>
                    </div>
                    <div class="demo-stat-card">
                        <div class="demo-stat-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="demo-stat-info">
                            <h4>24</h4>
                            <p>Low Attendance Alerts</p>
                        </div>
                    </div>
                </div>
                <div class="demo-chart">
                    <h4>Attendance Overview</h4>
                    <div class="demo-chart-placeholder">
                        <div class="demo-bar" style="height: 60%;"></div>
                        <div class="demo-bar" style="height: 80%;"></div>
                        <div class="demo-bar" style="height: 65%;"></div>
                        <div class="demo-bar" style="height: 90%;"></div>
                        <div class="demo-bar" style="height: 75%;"></div>
                        <div class="demo-bar" style="height: 85%;"></div>
                        <div class="demo-bar" style="height: 70%;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add some basic styles for the demo
    const style = document.createElement('style');
    style.textContent = `
        .demo-dashboard {
            display: flex;
            height: 500px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .demo-sidebar {
            width: 250px;
            background-color: #1e40af;
            color: white;
            padding: 20px;
        }
        .demo-user {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        .demo-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
        }
        .demo-user-info h4 {
            margin: 0;
            font-size: 16px;
        }
        .demo-user-info p {
            margin: 0;
            font-size: 12px;
            opacity: 0.8;
        }
        .demo-nav-item {
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .demo-nav-item:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .demo-nav-item.active {
            background-color: rgba(255, 255, 255, 0.2);
        }
        .demo-nav-item i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }
        .demo-main {
            flex: 1;
            padding: 20px;
            background-color: #f8fafc;
            overflow-y: auto;
        }
        .demo-main h3 {
            margin-top: 0;
            margin-bottom: 20px;
        }
        .demo-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .demo-stat-card {
            background-color: white;
            border-radius: 10px;
            padding: 15px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .demo-stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            background-color: #3b82f6;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 20px;
        }
        .demo-stat-info h4 {
            margin: 0;
            font-size: 24px;
        }
        .demo-stat-info p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
        }
        .demo-chart {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .demo-chart h4 {
            margin-top: 0;
            margin-bottom: 15px;
        }
        .demo-chart-placeholder {
            height: 200px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding: 0 10px;
        }
        .demo-bar {
            width: 40px;
            background: linear-gradient(to top, #3b82f6, #60a5fa);
            border-radius: 5px 5px 0 0;
            transition: height 1s ease-out;
        }
        body.dark-mode .demo-main {
            background-color: #1f2937;
            color: white;
        }
        body.dark-mode .demo-stat-card,
        body.dark-mode .demo-chart {
            background-color: #374151;
            color: white;
        }
        body.dark-mode .demo-stat-info p {
            color: #9ca3af;
        }
    `;
    document.head.appendChild(style);
    
    // Animate the bars
    setTimeout(() => {
        const bars = document.querySelectorAll('.demo-bar');
        bars.forEach(bar => {
            const originalHeight = bar.style.height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = originalHeight;
            }, 100);
        });
    }, 300);
}

function loadFacultyDemoContent(container) {
    container.innerHTML = `
        <div class="demo-dashboard faculty-dashboard">
            <div class="demo-sidebar">
                <div class="demo-user">
                    <div class="demo-avatar">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="demo-user-info">
                        <h4>Dr. Smith</h4>
                        <p>Computer Science</p>
                    </div>
                </div>
                <div class="demo-nav">
                    <div class="demo-nav-item active"><i class="fas fa-tachometer-alt"></i> Dashboard</div>
                    <div class="demo-nav-item"><i class="fas fa-calendar-alt"></i> My Schedule</div>
                    <div class="demo-nav-item"><i class="fas fa-user-check"></i> Attendance</div>
                    <div class="demo-nav-item"><i class="fas fa-book"></i> Courses</div>
                    <div class="demo-nav-item"><i class="fas fa-bell"></i> Notifications</div>
                    <div class="demo-nav-item"><i class="fas fa-cog"></i> Settings</div>
                </div>
            </div>
            <div class="demo-main">
                <h3>Faculty Dashboard</h3>
                <div class="demo-today-classes">
                    <h4>Today's Classes</h4>
                    <div class="demo-class-list">
                        <div class="demo-class-card active">
                            <div class="demo-class-time">09:00 - 10:30</div>
                            <div class="demo-class-info">
                                <h5>Introduction to Programming</h5>
                                <p>Room 302 • CS101 • 45 Students</p>
                            </div>
                            <div class="demo-class-actions">
                                <button class="demo-btn">Take Attendance</button>
                            </div>
                        </div>
                        <div class="demo-class-card">
                            <div class="demo-class-time">11:00 - 12:30</div>
                            <div class="demo-class-info">
                                <h5>Data Structures</h5>
                                <p>Room 405 • CS201 • 38 Students</p>
                            </div>
                            <div class="demo-class-actions">
                                <button class="demo-btn">Take Attendance</button>
                            </div>
                        </div>
                        <div class="demo-class-card">
                            <div class="demo-class-time">14:00 - 15:30</div>
                            <div class="demo-class-info">
                                <h5>Database Systems</h5>
                                <p>Lab 3 • CS305 • 32 Students</p>
                            </div>
                            <div class="demo-class-actions">
                                <button class="demo-btn">Take Attendance</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="demo-attendance-summary">
                    <h4>Attendance Summary</h4>
                    <div class="demo-attendance-stats">
                        <div class="demo-attendance-stat">
                            <div class="demo-stat-value">95%</div>
                            <div class="demo-stat-label">CS101</div>
                        </div>
                        <div class="demo-attendance-stat">
                            <div class="demo-stat-value">88%</div>
                            <div class="demo-stat-label">CS201</div>
                        </div>
                        <div class="demo-attendance-stat">
                            <div class="demo-stat-value">92%</div>
                            <div class="demo-stat-label">CS305</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add some basic styles for the demo
    const style = document.createElement('style');
    style.textContent = `
        .faculty-dashboard .demo-sidebar {
            background-color: #7c3aed;
        }
        .demo-today-classes {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .demo-class-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .demo-class-card {
            display: flex;
            align-items: center;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }
        .demo-class-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .demo-class-card.active {
            border-left: 4px solid #7c3aed;
        }
        .demo-class-time {
            width: 120px;
            font-weight: 600;
            color: #7c3aed;
        }
        .demo-class-info {
            flex: 1;
        }
        .demo-class-info h5 {
            margin: 0;
            font-size: 16px;
        }
        .demo-class-info p {
            margin: 0;
            font-size: 14px;
            color: #64748b;
        }
        .demo-btn {
            background-color: #7c3aed;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .demo-btn:hover {
            background-color: #6d28d9;
        }
        .demo-attendance-summary {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .demo-attendance-stats {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }
        .demo-attendance-stat {
            text-align: center;
            flex: 1;
        }
        .demo-stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #7c3aed;
            margin-bottom: 5px;
        }
        .demo-stat-label {
            font-size: 14px;
            color: #64748b;
        }
        body.dark-mode .demo-today-classes,
        body.dark-mode .demo-attendance-summary {
            background-color: #374151;
            color: white;
        }
        body.dark-mode .demo-class-card {
            border-color: #4b5563;
        }
        body.dark-mode .demo-class-info p,
        body.dark-mode .demo-stat-label {
            color: #9ca3af;
        }
    `;
    document.head.appendChild(style);
    
    // Animate the attendance stats
    setTimeout(() => {
        const statValues = document.querySelectorAll('.demo-stat-value');
        statValues.forEach(stat => {
            const finalValue = stat.textContent;
            stat.textContent = '0%';
            let currentValue = 0;
            const targetValue = parseInt(finalValue);
            const interval = setInterval(() => {
                currentValue += 1;
                stat.textContent = currentValue + '%';
                if (currentValue >= targetValue) {
                    clearInterval(interval);
                    stat.textContent = finalValue;
                }
            }, 20);
        });
    }, 300);
}

function loadStudentDemoContent(container) {
    container.innerHTML = `
        <div class="demo-dashboard student-dashboard">
            <div class="demo-sidebar">
                <div class="demo-user">
                    <div class="demo-avatar">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="demo-user-info">
                        <h4>Alex Johnson</h4>
                        <p>Computer Science • Year 2</p>
                    </div>
                </div>
                <div class="demo-nav">
                    <div class="demo-nav-item active"><i class="fas fa-tachometer-alt"></i> Dashboard</div>
                    <div class="demo-nav-item"><i class="fas fa-calendar-alt"></i> My Schedule</div>
                    <div class="demo-nav-item"><i class="fas fa-user-check"></i> Attendance</div>
                    <div class="demo-nav-item"><i class="fas fa-book"></i> Courses</div>
                    <div class="demo-nav-item"><i class="fas fa-bell"></i> Notifications</div>
                    <div class="demo-nav-item"><i class="fas fa-cog"></i> Settings</div>
                </div>
            </div>
            <div class="demo-main">
                <h3>Student Dashboard</h3>
                <div class="demo-attendance-overview">
                    <div class="demo-attendance-circle">
                        <svg width="150" height="150" viewBox="0 0 150 150">
                            <circle cx="75" cy="75" r="60" fill="none" stroke="#e2e8f0" stroke-width="10" />
                            <circle cx="75" cy="75" r="60" fill="none" stroke="#10b981" stroke-width="10" stroke-dasharray="377" stroke-dashoffset="94" />
                            <text x="75" y="75" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="bold" fill="#10b981">75%</text>
                        </svg>
                        <p>Overall Attendance</p>
                    </div>
                </div>
                <div class="demo-upcoming-classes">
                    <h4>Today's Classes</h4>
                    <div class="demo-class-list">
                        <div class="demo-class-card completed">
                            <div class="demo-class-time">09:00 - 10:30</div>
                            <div class="demo-class-info">
                                <h5>Introduction to Programming</h5>
                                <p>Room 302 • Dr. Smith</p>
                            </div>
                            <div class="demo-class-status">
                                <span class="demo-status-badge present">Present</span>
                            </div>
                        </div>
                        <div class="demo-class-card active">
                            <div class="demo-class-time">11:00 - 12:30</div>
                            <div class="demo-class-info">
                                <h5>Data Structures</h5>
                                <p>Room 405 • Dr. Johnson</p>
                            </div>
                            <div class="demo-class-status">
                                <span class="demo-status-badge upcoming">Upcoming</span>
                            </div>
                        </div>
                        <div class="demo-class-card">
                            <div class="demo-class-time">14:00 - 15:30</div>
                            <div class="demo-class-info">
                                <h5>Database Systems</h5>
                                <p>Lab 3 • Prof. Williams</p>
                            </div>
                            <div class="demo-class-status">
                                <span class="demo-status-badge upcoming">Upcoming</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="demo-course-attendance">
                    <h4>Course Attendance</h4>
                    <div class="demo-course-list">
                        <div class="demo-course-item">
                            <div class="demo-course-info">
                                <h5>Introduction to Programming</h5>
                                <div class="demo-progress-bar">
                                    <div class="demo-progress" style="width: 90%;"></div>
                                </div>
                            </div>
                            <div class="demo-course-percentage">90%</div>
                        </div>
                        <div class="demo-course-item">
                            <div class="demo-course-info">
                                <h5>Data Structures</h5>
                                <div class="demo-progress-bar">
                                    <div class="demo-progress" style="width: 85%;"></div>
                                </div>
                            </div>
                            <div class="demo-course-percentage">85%</div>
                        </div>
                        <div class="demo-course-item warning">
                            <div class="demo-course-info">
                                <h5>Database Systems</h5>
                                <div class="demo-progress-bar">
                                    <div class="demo-progress" style="width: 65%;"></div>
                                </div>
                            </div>
                            <div class="demo-course-percentage">65%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add some basic styles for the demo
    const style = document.createElement('style');
    style.textContent = `
        .student-dashboard .demo-sidebar {
            background-color: #10b981;
        }
        .demo-attendance-overview {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .demo-attendance-circle {
            text-align: center;
        }
        .demo-attendance-circle p {
            margin-top: 10px;
            font-size: 14px;
            color: #64748b;
        }
        .demo-upcoming-classes {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .student-dashboard .demo-class-card {
            display: flex;
            align-items: center;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }
        .student-dashboard .demo-class-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .student-dashboard .demo-class-card.active {
            border-left: 4px solid #10b981;
        }
        .student-dashboard .demo-class-card.completed {
            border-left: 4px solid #6b7280;
            opacity: 0.8;
        }
        .student-dashboard .demo-class-time {
            width: 120px;
            font-weight: 600;
            color: #10b981;
        }
        .student-dashboard .demo-class-info {
            flex: 1;
        }
        .student-dashboard .demo-class-info h5 {
            margin: 0;
            font-size: 16px;
        }
        .student-dashboard .demo-class-info p {
            margin: 0;
            font-size: 14px;
            color: #64748b;
        }
        .demo-status-badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        .demo-status-badge.present {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        .demo-status-badge.absent {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        .demo-status-badge.upcoming {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        .demo-course-attendance {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .demo-course-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .demo-course-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .demo-course-info {
            flex: 1;
        }
        .demo-course-info h5 {
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        .demo-progress-bar {
            height: 8px;
            background-color: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            width: 100%;
        }
        .demo-progress {
            height: 100%;
            background-color: #10b981;
            border-radius: 4px;
            width: 0;
            transition: width 1s ease-out;
        }
        .demo-course-percentage {
            font-weight: 600;
            color: #10b981;
            margin-left: 15px;
        }
        .demo-course-item.warning .demo-progress {
            background-color: #f59e0b;
        }
        .demo-course-item.warning .demo-course-percentage {
            color: #f59e0b;
        }
        body.dark-mode .demo-upcoming-classes,
        body.dark-mode .demo-course-attendance {
            background-color: #374151;
            color: white;
        }
        body.dark-mode .demo-class-card {
            border-color: #4b5563;
        }
        body.dark-mode .demo-class-info p,
        body.dark-mode .demo-attendance-circle p {
            color: #9ca3af;
        }
        body.dark-mode .demo-progress-bar {
            background-color: #4b5563;
        }
    `;
    document.head.appendChild(style);
    
    // Animate the progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.demo-progress');
        progressBars.forEach(bar => {
            const finalWidth = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = finalWidth;
            }, 100);
        });
        
        // Animate the attendance circle
        const circle = document.querySelector('circle:nth-child(2)');
        const text = document.querySelector('text');
        if (circle && text) {
            const finalOffset = 94; // 75% attendance
            const finalText = '75%';
            
            circle.setAttribute('stroke-dashoffset', '377'); // 0%
            text.textContent = '0%';
            
            let currentPercent = 0;
            const targetPercent = 75;
            const interval = setInterval(() => {
                currentPercent += 1;
                const currentOffset = 377 - (377 * currentPercent / 100);
                circle.setAttribute('stroke-dashoffset', currentOffset);
                text.textContent = currentPercent + '%';
                
                if (currentPercent >= targetPercent) {
                    clearInterval(interval);
                }
            }, 20);
        }
    }, 300);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// QR Code Functions
function generateAttendanceQR() {
    const classId = document.getElementById('qr-class-id').value;
    const expiryTime = document.getElementById('qr-expiry-time').value;
    
    if (!classId) {
        alert('Please enter a class or event ID');
        return;
    }
    
    // Create QR code data with expiry timestamp
    const expiryTimestamp = Date.now() + (expiryTime * 60 * 1000);
    const qrData = JSON.stringify({
        type: 'attendance',
        classId: classId,
        expires: expiryTimestamp,
        timestamp: Date.now()
    });
    
    // Generate QR code using the QR library
    const qrContainer = document.getElementById('qr-code-container');
    qrContainer.innerHTML = '';
    
    try {
        // Use the qrcode library that's included in HTML
        if (typeof qrcode !== 'undefined') {
            const qr = qrcode(0, 'M');
            qr.addData(qrData);
            qr.make();
            
            const qrImage = qr.createImgTag(5);
            qrContainer.innerHTML = qrImage;
        } else {
            // Fallback if library not loaded
            qrContainer.innerHTML = `<div style="padding: 20px; background: #f0f0f0; border-radius: 10px; text-align: center;">
                <h4>QR Code Generated</h4>
                <p>Class ID: ${classId}</p>
                <p>Expires in: ${expiryTime} minutes</p>
                <div style="width: 200px; height: 200px; background: #333; margin: 20px auto; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                    QR Code
                </div>
            </div>`;
        }
        
        // Add expiry information
        const expiryInfo = document.createElement('p');
        expiryInfo.textContent = `QR code expires in ${expiryTime} minutes`;
        expiryInfo.className = 'qr-expiry-info';
        qrContainer.appendChild(expiryInfo);
        
        console.log('✅ QR Code generated successfully for class:', classId);
        
    } catch (error) {
        console.error('❌ QR generation error:', error);
        qrContainer.innerHTML = `<div style="color: red; padding: 20px;">
            <h4>Error generating QR code</h4>
            <p>${error.message}</p>
        </div>`;
    }
}

function generateLoginQR() {
    // Get current user info from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData) {
        alert('You must be logged in to generate a login QR code');
        return;
    }
    
    // Create QR code data with expiry timestamp (15 minutes)
    const expiryTimestamp = Date.now() + (15 * 60 * 1000);
    const qrData = JSON.stringify({
        type: 'login',
        userId: userData.id,
        role: userData.role,
        expires: expiryTimestamp,
        timestamp: Date.now()
    });
    
    // Generate QR code
    const qrContainer = document.getElementById('login-qr-code-container');
    qrContainer.innerHTML = '';
    
    try {
        // Use the qrcode library that's included in HTML
        if (typeof qrcode !== 'undefined') {
            const qr = qrcode(0, 'M');
            qr.addData(qrData);
            qr.make();
            
            const qrImage = qr.createImgTag(5);
            qrContainer.innerHTML = qrImage;
        } else {
            // Fallback if library not loaded
            qrContainer.innerHTML = `<div style="padding: 20px; background: #f0f0f0; border-radius: 10px; text-align: center;">
                <h4>Login QR Code Generated</h4>
                <p>User: ${userData.username}</p>
                <p>Role: ${userData.role}</p>
                <p>Expires in: 15 minutes</p>
                <div style="width: 200px; height: 200px; background: #333; margin: 20px auto; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                    QR Code
                </div>
            </div>`;
        }
        
        // Add expiry information
        const expiryInfo = document.createElement('p');
        expiryInfo.textContent = `QR code expires in 15 minutes`;
        expiryInfo.className = 'qr-expiry-info';
        qrContainer.appendChild(expiryInfo);
        
        console.log('✅ Login QR Code generated successfully for user:', userData.username);
        
    } catch (error) {
        console.error('❌ Login QR generation error:', error);
        qrContainer.innerHTML = `<div style="color: red; padding: 20px;">
            <h4>Error generating login QR code</h4>
            <p>${error.message}</p>
        </div>`;
    }
}

function startQRScanner() {
    const qrReader = document.getElementById('qr-reader');
    const resultContainer = document.getElementById('qr-scan-result');
    
    // Clear previous results
    resultContainer.textContent = '';
    resultContainer.className = 'status-message';
    
    // Simulate QR scanning for demo
    resultContainer.textContent = 'QR Scanner Started (Demo Mode)';
    resultContainer.className = 'status-message status-success';
    
    // Simulate successful scan after 2 seconds
    setTimeout(() => {
        resultContainer.textContent = 'QR Code scanned successfully! Attendance marked.';
        resultContainer.className = 'status-message status-success';
    }, 2000);
}

function startLoginQRScanner() {
    const qrReader = document.getElementById('login-qr-reader');
    const resultContainer = document.getElementById('login-qr-scan-result');
    
    // Clear previous results
    resultContainer.textContent = '';
    resultContainer.className = 'status-message';
    
    // Simulate QR scanning for demo
    resultContainer.textContent = 'Login QR Scanner Started (Demo Mode)';
    resultContainer.className = 'status-message status-success';
    
    // Simulate successful scan after 2 seconds
    setTimeout(() => {
        resultContainer.textContent = 'Login QR Code scanned successfully!';
        resultContainer.className = 'status-message status-success';
    }, 2000);
}

// Expose functions to global scope
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;
window.showDemoModal = showDemoModal;
window.switchQRTab = switchQRTab;
window.switchLoginQRTab = switchLoginQRTab;
window.generateAttendanceQR = generateAttendanceQR;
window.generateLoginQR = generateLoginQR;
window.startQRScanner = startQRScanner;
window.startLoginQRScanner = startLoginQRScanner;
window.showTimetableModal = showTimetableModal;
window.generateSmartTimetable = generateSmartTimetable;
window.saveTimetable = saveTimetable;

// Smart Timetable Generation Functions
function showTimetableModal() {
    const modal = document.getElementById('timetable-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Ensure body in modal can scroll
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
        modalBody.style.overflowY = 'auto';
        modalBody.style.maxHeight = 'calc(85vh - 64px)';
    }
    
    // Set default dates
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 4, 0);
    
    document.getElementById('start-date').value = nextMonth.toISOString().split('T')[0];
    document.getElementById('end-date').value = endMonth.toISOString().split('T')[0];
    document.getElementById('academic-year').value = `${today.getFullYear()}-${today.getFullYear() + 1}`;
}

async function generateSmartTimetable(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const formData = {
        name: document.getElementById('timetable-name').value,
        department: document.getElementById('department').value,
        semester: document.getElementById('semester').value,
        academicYear: document.getElementById('academic-year').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        subjects: document.getElementById('subjects').value.split('\n').filter(s => s.trim()),
        faculty: document.getElementById('faculty').value.split('\n').filter(f => f.trim()),
        rooms: document.getElementById('rooms').value.split('\n').filter(r => r.trim()),
        constraints: document.getElementById('constraints').value.split('\n').filter(c => c.trim())
    };

    try {
        // Loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        submitBtn.disabled = true;

        // Try backend generation first
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/timetables/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success && data.data) {
            displayGeneratedTimetable(data.data, formData);
        } else {
            // Fallback: local pseudo-AI generation
            const local = buildLocalTimetable(formData);
            displayGeneratedTimetable(local, formData);
        }
    } catch (error) {
        // Fallback anyway on any error
        const local = buildLocalTimetable(formData);
        displayGeneratedTimetable(local, formData);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        // scroll to result area for visibility
        const resultDiv = document.getElementById('timetable-result');
        if (resultDiv) resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

function buildLocalTimetable(formData) {
    // Simple local generator that structures the expected timetable object
    const classes = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        { start: '09:00', end: '10:30' },
        { start: '11:00', end: '12:30' },
        { start: '14:00', end: '15:30' },
        { start: '16:00', end: '17:30' }
    ];

    let s = 0, f = 0, r = 0;
    for (let d = 0; d < days.length; d++) {
        for (let t = 0; t < timeSlots.length; t++) {
            if (s >= formData.subjects.length) break;
            classes.push({
                day: days[d],
                startTime: timeSlots[t].start,
                endTime: timeSlots[t].end,
                subject: formData.subjects[s % formData.subjects.length],
                courseCode: `AUTO-${s + 1}`,
                faculty: formData.faculty[f % formData.faculty.length],
                room: formData.rooms[r % formData.rooms.length]
            });
            s++; f++; r++;
        }
    }

    return {
        name: formData.name || `${formData.department} - Semester ${formData.semester}`,
        department: formData.department,
        semester: formData.semester,
        academicYear: formData.academicYear,
        classes
    };
}

function displayGeneratedTimetable(timetable, formData) {
    const resultDiv = document.getElementById('timetable-result');
    const displayDiv = document.getElementById('timetable-display');
    
    // Create a visual representation of the timetable
    let html = `
        <div class="timetable-info">
            <h4>${timetable.name}</h4>
            <p><strong>Department:</strong> ${timetable.department}</p>
            <p><strong>Semester:</strong> ${timetable.semester}</p>
            <p><strong>Academic Year:</strong> ${timetable.academicYear}</p>
        </div>
        
        <div class="timetable-schedule">
            <h4>Weekly Schedule</h4>
            <div class="schedule-grid">
    `;
    
    // Create schedule grid
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00-10:30', '11:00-12:30', '14:00-15:30', '16:00-17:30'];
    
    html += '<div class="schedule-header">';
    html += '<div class="time-slot">Time</div>';
    days.forEach(day => {
        html += `<div class="day-header">${day}</div>`;
    });
    html += '</div>';
    
    timeSlots.forEach(timeSlot => {
        html += `<div class="schedule-row">`;
        html += `<div class="time-slot">${timeSlot}</div>`;
        
        days.forEach(day => {
            // Find a class for this day and time (simplified)
            const classIndex = Math.floor(Math.random() * formData.subjects.length);
            const subject = formData.subjects[classIndex];
            const facultyIndex = Math.floor(Math.random() * formData.faculty.length);
            const faculty = formData.faculty[facultyIndex];
            const roomIndex = Math.floor(Math.random() * formData.rooms.length);
            const room = formData.rooms[roomIndex];
            
            html += `
                <div class="class-slot">
                    <div class="subject">${subject}</div>
                    <div class="faculty">${faculty}</div>
                    <div class="room">${room}</div>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    html += `
            </div>
        </div>
        
        <div class="timetable-stats">
            <h4>Generation Statistics</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number">${formData.subjects.length}</span>
                    <span class="stat-label">Subjects</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${formData.faculty.length}</span>
                    <span class="stat-label">Faculty</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${formData.rooms.length}</span>
                    <span class="stat-label">Rooms</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${days.length * timeSlots.length}</span>
                    <span class="stat-label">Time Slots</span>
                </div>
            </div>
        </div>
    `;
    
    displayDiv.innerHTML = html;
    resultDiv.style.display = 'block';
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

async function saveTimetable() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/timetables`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: document.getElementById('timetable-name').value,
                department: document.getElementById('department').value,
                semester: document.getElementById('semester').value,
                academicYear: document.getElementById('academic-year').value,
                startDate: document.getElementById('start-date').value,
                endDate: document.getElementById('end-date').value
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            alert('✅ Timetable saved successfully!');
            closeModal('timetable-modal');
        } else {
            throw new Error(data.message || 'Failed to save timetable');
        }
        
    } catch (error) {
        console.error('❌ Save timetable error:', error);
        alert(`Error saving timetable: ${error.message}`);
    }
}
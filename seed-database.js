const mongoose = require('mongoose');
const User = require('./models/User');
const Timetable = require('./models/Timetable');
const Attendance = require('./models/Attendance');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classsync', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB successfully!');
    
    try {
        await seedDatabase();
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
});

async function seedDatabase() {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Timetable.deleteMany({});
    await Attendance.deleteMany({});

    // Create demo users
    console.log('Creating demo users...');
    
    const adminUser = await User.create({
        username: 'admin',
        email: 'admin@classsync.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        department: 'Administration',
        isActive: true
    });

    const facultyUser1 = await User.create({
        username: 'faculty',
        email: 'faculty@classsync.com',
        password: 'faculty123',
        name: 'Dr. Sarah Smith',
        role: 'faculty',
        department: 'Computer Science',
        facultyId: 'CS001',
        isActive: true
    });

    const facultyUser2 = await User.create({
        username: 'faculty2',
        email: 'faculty2@classsync.com',
        password: 'faculty123',
        name: 'Prof. John Johnson',
        role: 'faculty',
        department: 'Computer Science',
        facultyId: 'CS002',
        isActive: true
    });

    const studentUser1 = await User.create({
        username: 'student',
        email: 'student@classsync.com',
        password: 'student123',
        name: 'Alex Johnson',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2024001',
        isActive: true
    });

    const studentUser2 = await User.create({
        username: 'student2',
        email: 'student2@classsync.com',
        password: 'student123',
        name: 'Emma Wilson',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2024002',
        isActive: true
    });

    const studentUser3 = await User.create({
        username: 'student3',
        email: 'student3@classsync.com',
        password: 'student123',
        name: 'Michael Brown',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2024003',
        isActive: true
    });

    // Create demo timetable
    console.log('Creating demo timetable...');
    
    const timetable = await Timetable.create({
        name: 'Computer Science - Semester 1 - 2024-25',
        department: 'Computer Science',
        semester: '1',
        academicYear: '2024-25',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        createdBy: adminUser._id,
        classes: [
            {
                day: 'Monday',
                startTime: '09:00',
                endTime: '10:30',
                subject: 'Introduction to Programming',
                courseCode: 'CS101',
                faculty: facultyUser1._id,
                room: 'CS-101',
                capacity: 50,
                enrolledStudents: [studentUser1._id, studentUser2._id, studentUser3._id],
                isActive: true
            },
            {
                day: 'Monday',
                startTime: '11:00',
                endTime: '12:30',
                subject: 'Discrete Mathematics',
                courseCode: 'CS102',
                faculty: facultyUser2._id,
                room: 'CS-102',
                capacity: 45,
                enrolledStudents: [studentUser1._id, studentUser2._id, studentUser3._id],
                isActive: true
            },
            {
                day: 'Tuesday',
                startTime: '10:00',
                endTime: '11:30',
                subject: 'Computer Architecture',
                courseCode: 'CS103',
                faculty: facultyUser1._id,
                room: 'CS-103',
                capacity: 40,
                enrolledStudents: [studentUser1._id, studentUser2._id, studentUser3._id],
                isActive: true
            },
            {
                day: 'Wednesday',
                startTime: '14:00',
                endTime: '15:30',
                subject: 'Data Structures',
                courseCode: 'CS201',
                faculty: facultyUser2._id,
                room: 'CS-201',
                capacity: 35,
                enrolledStudents: [studentUser1._id, studentUser2._id, studentUser3._id],
                isActive: true
            },
            {
                day: 'Thursday',
                startTime: '09:00',
                endTime: '10:30',
                subject: 'Database Systems',
                courseCode: 'CS202',
                faculty: facultyUser1._id,
                room: 'Lab-3',
                capacity: 30,
                enrolledStudents: [studentUser1._id, studentUser2._id, studentUser3._id],
                isActive: true
            },
            {
                day: 'Friday',
                startTime: '13:00',
                endTime: '14:30',
                subject: 'Software Engineering',
                courseCode: 'CS203',
                faculty: facultyUser2._id,
                room: 'CS-203',
                capacity: 40,
                enrolledStudents: [studentUser1._id, studentUser2._id, studentUser3._id],
                isActive: true
            }
        ],
        constraints: {
            maxClassesPerDay: 6,
            breakTime: 15,
            lunchBreak: {
                start: '12:00',
                end: '13:00'
            }
        }
    });

    // Create demo attendance records
    console.log('Creating demo attendance records...');
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Mark attendance for today
    for (const classSlot of timetable.classes) {
        // Skip if class is not today
        const classDay = classSlot.day;
        const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
        
        if (classDay === todayName) {
            // Mark attendance for each student
            for (const studentId of classSlot.enrolledStudents) {
                await Attendance.create({
                    student: studentId,
                    class: classSlot._id,
                    timetable: timetable._id,
                    date: today,
                    status: Math.random() > 0.1 ? 'present' : 'absent', // 90% attendance rate
                    markedBy: facultyUser1._id,
                    method: 'manual'
                });
            }
        }
    }

    // Mark attendance for yesterday
    for (const classSlot of timetable.classes) {
        const classDay = classSlot.day;
        const yesterdayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][yesterday.getDay()];
        
        if (classDay === yesterdayName) {
            for (const studentId of classSlot.enrolledStudents) {
                await Attendance.create({
                    student: studentId,
                    class: classSlot._id,
                    timetable: timetable._id,
                    date: yesterday,
                    status: Math.random() > 0.15 ? 'present' : 'absent', // 85% attendance rate
                    markedBy: facultyUser1._id,
                    method: 'manual'
                });
            }
        }
    }

    console.log('Demo data created successfully!');
    console.log('\nDemo Users:');
    console.log('Admin: admin / admin123');
    console.log('Faculty: faculty / faculty123');
    console.log('Student: student / student123');
    console.log('\nDatabase is ready for testing!');
}

// seeders/adminSeeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./Model/Admin');
const HOD = require('./Model/HOD');
const Branch = require('./Model/Branch'); // Assuming this exists and is correctly defined

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

const connectDB = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected...');
};

const seedAdmins = async () => {
  await Admin.deleteMany();
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admins = [
    {
      name: 'admin 1',
      email: 'admin1@gmail.com',
      password: hashedPassword,
      phoneNo: '1234567890',
      gender: 'Male',
      empId: 'EMP001',
      designation: 'Principal',
    },
    {
      name: 'admin 2',
      email: 'admin2@gmail.com',
      password: hashedPassword,
      phoneNo: '9876543210',
      gender: 'Female',
      empId: 'EMP002',
      designation: 'Dean Academics',
    }
  ];

  await Admin.insertMany(admins);
  console.log('Admins seeded.');
};

const seedHODs = async () => {
  await HOD.deleteMany();

  const hashedPassword = await bcrypt.hash('hod123', 10);

  // You must replace this with a valid department (Branch) _id from your DB
  const branch = await Branch.findOne(); // Gets any existing branch
  if (!branch) {
    console.error('No branches found. Please seed branches first.');
    return;
  }

  const hods = [
    {
      name: 'Dr. Alice HOD',
      email: 'hod1@gmail.com',
      password: hashedPassword,
      phoneNo: '9998887777',
      gender: 'Female',
      empId: 'HOD001',
      department: branch._id,
      designation: 'Head of Department',
      isActive: true,
      departmentFaculty: [],
    }
  ];

  await HOD.insertMany(hods);
  console.log('HODs seeded.');
};

const runSeeders = async () => {
  try {
    await connectDB();
    await seedAdmins();
    await seedHODs();
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

runSeeders();

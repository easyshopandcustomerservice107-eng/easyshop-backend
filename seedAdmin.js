const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to DB
        mongoose.set('debug', true);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Admin Data
        const adminData = {
            name: 'System Admin',
            email: 'superadmin@easycustomerservice.online',
            password: 'superADMINpassword123@',
            phone: '1234567890',
            role: 'admin',
            isVerified: true
        };

        // Check if admin exists
        console.log('Searching for existing admin with email:', adminData.email);
        const existingAdmin = await User.findOne({ email: adminData.email });
        console.log('Query finished. Admin found:', existingAdmin ? 'Yes' : 'No');

        if (existingAdmin) {
            console.log('Admin already exists. Updating to ensure admin role...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const admin = new User(adminData);
            console.log('User instance created. Saving...');
            try {
                await admin.save();
                console.log('Admin user saved successfully.');
            } catch (saveErr) {
                console.error('Error during admin.save():', saveErr);
                throw saveErr;
            }
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit();
    } catch (err) {
        console.error('Error seeding admin:', err.message);
        process.exit(1);
    }
};

createAdmin();

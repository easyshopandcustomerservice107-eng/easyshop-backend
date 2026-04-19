const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function seedAdminRaw() {
    console.log('Starting raw admin seeding...');
    console.log('URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');
    
    if (!process.env.MONGODB_URI) {
        process.exit(1);
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected.');
        
        const db = client.db();
        const users = db.collection('users');
        
        const email = 'superadmin@easycustomerservice.online';
        
        console.log('Checking if admin exists:', email);
        const existing = await users.findOne({ email });
        
        if (existing) {
            console.log('Admin already exists. Updating role...');
            await users.updateOne({ email }, { $set: { role: 'admin', isVerified: true } });
            console.log('Admin updated.');
        } else {
            console.log('Hashing password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('superADMINpassword123@', salt);
            
            const adminData = {
                name: 'System Admin',
                email: email,
                password: hashedPassword,
                phone: '1234567890',
                role: 'admin',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            console.log('Inserting admin...');
            const result = await users.insertOne(adminData);
            console.log('Admin inserted. ID:', result.insertedId);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Finished.');
    }
}

seedAdminRaw();

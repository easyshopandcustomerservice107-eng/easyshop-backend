const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 'undefined');
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env');
        process.exit(1);
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        console.log('Connecting to MongoDB via native driver...');
        await client.connect();
        console.log('Connected!');
        const db = client.db();
        const collection = db.collection('users');
        
        const testUser = {
            name: 'Native Test',
            email: 'native-test@testing.com',
            password: 'testpassword',
            role: 'admin',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('Inserting test user...');
        const result = await collection.insertOne(testUser);
        console.log('Insert result:', result);
        
        console.log('Cleanup: deleting test user...');
        await collection.deleteOne({ email: 'native-test@testing.com' });
        console.log('Deleted.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

run();

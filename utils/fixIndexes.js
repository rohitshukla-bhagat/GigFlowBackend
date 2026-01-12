const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Defaults to .env in cwd (server)

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        // List indexes to confirm
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        // Drop the problematic index
        if (indexes.some(idx => idx.name === 'username_1')) {
            await collection.dropIndex('username_1');
            console.log('Dropped username_1 index successfully');
        } else {
            console.log('username_1 index not found');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIndexes();

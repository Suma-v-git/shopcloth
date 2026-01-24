import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * This script ensures an admin user exists in the database.
 * It uses the following environment variables:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 * - ADMIN_NAME
 * - MONGODB_URI
 */

async function ensureAdmin() {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, MONGODB_URI } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGODB_URI) {
        console.error('❌ Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, or MONGODB_URI');
        process.exit(1);
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);

        // User Schema
        const userSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, enum: ['user', 'admin'], default: 'user' },
            createdAt: { type: Date, default: Date.now }
        });

        // Use existing model if available, otherwise create
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log(`ℹ️  Admin with email ${ADMIN_EMAIL} already exists. Updating details...`);
            existingAdmin.role = 'admin';
            if (ADMIN_NAME) existingAdmin.name = ADMIN_NAME;
            existingAdmin.password = await bcryptjs.hash(ADMIN_PASSWORD, 10);
            await existingAdmin.save();
            console.log('✅ Admin updated successfully!');
        } else {
            console.log(`📝 Creating new admin: ${ADMIN_EMAIL}...`);
            const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
            const newAdmin = new User({
                name: ADMIN_NAME || 'System Admin',
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });
            await newAdmin.save();
            console.log('✅ Admin created successfully!');
        }

        // Demote any other unauthorized admins
        console.log('🛡️  Demoting unauthorized admin accounts...');
        const result = await User.updateMany(
            {
                role: 'admin',
                email: { $ne: ADMIN_EMAIL }
            },
            { $set: { role: 'user' } }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Demoted ${result.modifiedCount} unauthorized admin accounts to 'user'.`);
        } else {
            console.log('ℹ️  No other unauthorized admin accounts found.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
    }
}

ensureAdmin();

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const ADMIN_EMAIL = 'tatvafashion@gmail.com';
const ADMIN_PASSWORD = 'tatva@2026';
const ADMIN_NAME = 'Admin';

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function run() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);

        const existingUser = await User.findOne({ email: ADMIN_EMAIL });

        if (existingUser) {
            console.log(`📝 Updating existing user: ${ADMIN_EMAIL}`);
            existingUser.role = 'admin';
            existingUser.name = ADMIN_NAME;
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('✅ User updated to admin successfully!');
        } else {
            console.log(`📝 Creating new admin user: ${ADMIN_EMAIL}`);
            const adminUser = new User({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Admin user created successfully!');
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${ADMIN_EMAIL}`);
        console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

run();

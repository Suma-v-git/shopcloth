import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// User Schema (same as in models/User.js)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected successfully!\n');

        // Get admin details from user
        console.log('📝 Enter Admin Details:\n');
        const name = await question('Admin Name: ');
        const email = await question('Admin Email: ');
        const password = await question('Admin Password: ');

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('\n⚠️  User with this email already exists!');
            const update = await question('Do you want to update this user to admin? (yes/no): ');

            if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
                existingUser.role = 'admin';
                if (name) existingUser.name = name;
                if (password) {
                    existingUser.password = await bcryptjs.hash(password, 10);
                }
                await existingUser.save();
                console.log('\n✅ User updated to admin successfully!');
            } else {
                console.log('\n❌ Operation cancelled.');
            }
        } else {
            // Hash the password
            console.log('\n🔐 Hashing password...');
            const hashedPassword = await bcryptjs.hash(password, 10);

            // Create admin user
            const adminUser = new User({
                name,
                email,
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('\n✅ Admin user created successfully!');
        }

        console.log('\n📋 Admin Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🌐 Access Admin Dashboard at: http://localhost:5173/admin');
        console.log('\n⚠️  Save these credentials securely!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
        await mongoose.connection.close();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

createAdmin();

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const Order = require('./models/order');
const productSeed = require('./data/productSeed');
const userSeed = require('./data/userSeed');

const saltRounds = 10;

const connectMongo = async () => {
    if (!process.env.MONGO_DB_URL) {
        throw new Error('MONGO_DB_URL is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connected to MongoDB for seeding');
};

const clearCollections = async () => {
    await Promise.all([
        Product.deleteMany({}),
        User.deleteMany({}),
        Cart.deleteMany({}),
        Order.deleteMany({})
    ]);
    console.log('Cleared Product, User, Cart, and Order collections');
};

const buildSeedUsers = async () => {
    return Promise.all(
        userSeed.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, saltRounds)
        }))
    );
};

const seedDatabase = async () => {
    try {
        await connectMongo();
        await clearCollections();

        const hashedUsers = await buildSeedUsers();

        if (productSeed.length > 0) {
            await Product.insertMany(productSeed);
        }

        if (hashedUsers.length > 0) {
            await User.insertMany(hashedUsers);
        }

        const [productCount, userCount] = await Promise.all([
            Product.countDocuments(),
            User.countDocuments()
        ]);

        console.log(`Seed completed successfully.`);
        console.log(`- Products: ${productCount}`);
        console.log(`- Users: ${userCount}`);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;


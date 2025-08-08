import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'));
        mongoose.connection.on('error', (err) => console.log('Database Connection Error:', err));

        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
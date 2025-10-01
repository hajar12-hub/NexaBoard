import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected succefully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); //stop le serveur si la bd ne marche pas 
    }
};
export default connectDB;

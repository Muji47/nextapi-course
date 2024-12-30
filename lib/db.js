import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    // Check the connection state
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already Connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "restApi",
            bufferCommands: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected");
    } catch (err) {
        console.error("Error connecting to the database:", err);
        throw new Error("Database connection error");
    }
};

export default connect;

import mongoose from 'mongoose'

export const DB_CONN = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Database connection successful : ", conn.connection.host)
    } catch (error) {
        console.error("Db connection failed : ",error);
        process.exit(1); // 1 means failed, 0 means success
    }
}
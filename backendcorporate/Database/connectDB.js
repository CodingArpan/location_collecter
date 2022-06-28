import mongoose from 'mongoose';

const connectDB = async (Database_Url) => {
    try {
        await mongoose.connect(Database_Url)
        console.log('Connected To Database Successfully.............');

    } catch (error) {
        console.log(error.message, '...............Golmal hai Fix it....................');

    }
}
export default connectDB;
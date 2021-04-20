import mongoose from 'mongoose';

const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(process.env.DB, {
            useUnifiedTopology:true,
            useNewUrlParser:true,
            useCreateIndex:true
        });
        console.log(`MongoDb Connect:${connect.connection.host}`);
        
    } catch (err) {
        console.error(`Error:${error.message}`);
        process.exit(1);
        
    }
};

export default connectDB;


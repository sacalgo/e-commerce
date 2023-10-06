import mongoose from 'mongoose';


const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(process.env.DB, {
            useUnifiedTopology:true,
            useNewUrlParser:true,
            useCreateIndex:true
        });
        console.log(`MongoDb Connect:${connect.connection.host}`.cyan.underline);
        
    } catch (err) {
        console.error(`Error:${err.message}`.red.underline.bold);
        process.exit(1);
        
    }
};

export default connectDB;


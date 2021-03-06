const app = require('./app')

const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
const cloudianry = require("cloudinary")


// handleing uncaughtException error

process.on("uncaughtException",(err)=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting down the server due to uncaughtException error`);
    process.exit(1)
})

//config
 
dotenv.config({path:"backend/config/config.env"})


// connect database 

connectDatabase()

// cloudianry 

cloudianry.config({
    cloud_name :process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})



const server =app.listen(process.env.PORT,()=>{
    console.log(`server is working on localhost:${process.env.PORT}`);
})

//unhandled promise error

process.on("unhandledRejection",(err)=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    
    server.close(()=>{
        process.exit(1);
    })
})
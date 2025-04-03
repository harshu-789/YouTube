import 'dotenv/config';
import connectDB from "./db/connectDB.js"
import app from './app.js'


const port = process.env.PORT || 8000

connectDB()
.then(()=>{
app.listen(port,()=>{
    console.log(`Server is running at port : ${port}`)
})
})
.catch((error)=>{
    console.error("MongoDB Connection Failed",error)
    process.exit(1)
})
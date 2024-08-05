const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config()
const connect=async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Kết nối thành công')
    }
    catch (err) {
        console.log('Kết nối thất bại ')
    }
}

module.exports={connect}
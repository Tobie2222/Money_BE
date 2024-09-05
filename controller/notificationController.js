
const notificationSchema=require("../model/notificationModel")
const UsersSchema=require("../model/userModel")

class notificationController {

    async createNotification(req,res) {
        try {
            const users=await UsersSchema.find({})
            const newNotify=users.map((user)=>{
                const newNotify=new notificationSchema({
                    user: user._id,
                    ...req.body
                })
                return newNotify.save()
            })
            await Promise.all(newNotify)
            return res.status(200).json({
                message: `Tạo thông báo thành công`
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    async getNotification(req,res) {
        try {
            const {userId}=req.params
            const allNotification=await notificationSchema.find({
                user: userId
            })
            return res.status(200).json({
                message: `success`,
                allNotification
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
}


module.exports=new notificationController
const SavingSchema=require("../model/savingModel")
const accountSchema=require("../model/accountsModel")
const savingsTransactionsSchema=require("../model/savingTransactionModel")

class savingController {
    //[create saving]
    async createSaving(req,res) {
        try {
            const {userId}=req.params
            const {saving_name,desc_saving,goal_amount,deadline,saving_date}=req.body
            const day =new Date()
            const deadL=new Date(deadline)
            if (deadL<day) {
                return res.status(403).json({
                    message: "Thời gian không hợp lệ!",
                })
            }
            const newSaving =new SavingSchema({saving_name,desc_saving,goal_amount,deadline,saving_date, user: userId})
            if (req.file) {
                newSaving.saving_image= req.file.path
            }
            await newSaving.save()
            return res.status(200).json({
                message:"Tạo mới khoản tiết kiệm thành công"
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[get all saving by user]
    async getAllSavingByUser(req, res) {
        try {
            const { userId } = req.params
            let allSaving = await SavingSchema.find({ user: userId})
            allSaving=allSaving.map((saving)=>{
                console.log(saving.goal_amount-saving.current_amount)
                return {
                    ...saving.toObject(),
                    remainingAmount:saving.goal_amount-saving.current_amount
                }
            })
            return res.status(200).json({
                message: "Success",
                allSaving
            })
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            })
        }
    }
    //[get detail saving]
    async getSavingDetails(req, res) {
        try {
            const { savingId,userId } = req.params
            const saving = await SavingSchema.findOne({user: userId,_id:savingId})
            const remainingAmount=saving.goal_amount-saving.current_amount
            const today=new Date()
            const deadline=new Date(saving.deadline)
            const remainingDate=Math.ceil((deadline-today)/((1000 * 60 * 60 * 24)))

            return res.status(200).json({
                message: 'Success',
                saving: {
                    ...saving.toObject(), // Chuyển đổi document thành đối tượng
                    remainingAmount, 
                    remainingDate  
                }
            })
        } catch (err) {
            return res.status(500).json({
                message: `Error: ${err.message}`
            })
        }
    }
    //[update saving]
    async updateSaving(req,res) {
        try {
            const { savingId } = req.params
            await SavingSchema.findByIdAndUpdate(savingId,req.body)
            return res.status(200).json({
                message: "Cập nhật khoản tiết kiệm thành công",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[delete saving]
    async deleteSaving(req,res) {
        try {
            const { savingId } = req.params
            await SavingSchema.findByIdAndDelete(savingId)
            await savingsTransactionsSchema.updateMany({saving: savingId},{ $set: {saving:null}})
            return res.status(200).json({
                message: "Xóa khoản tiết kiệm thành công",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    //[deposit money saving]
    async depositMoneySaving(req,res) {
        try {
            const { savingId,accountId ,userId} = req.params
            const {amount,name_tran,transaction_date}=req.body
            const findSaving=await SavingSchema.findById(savingId)
            console.log(findSaving.current_amount)
            const findAccount=await accountSchema.findById(accountId)
            const tranDate=new Date(transaction_date)
            const deadline = new Date(findSaving.deadline)
            const savingDate = new Date(findSaving.saving_date)
            if (deadline<tranDate || savingDate  > tranDate ) {
                return res.status(403).json({
                    message: "Thời gian không hợp lệ!",
                })
            }
            if (findAccount.balance<amount) {
                return res.status(403).json({
                    message: "Bạn không đủ tiền để gửi",
                })
            }
            const currentAmount = Number(findSaving.current_amount);
            const goalAmount = Number(findSaving.goal_amount);
            
            if (currentAmount >= goalAmount) {
                return res.status(403).json({
                    message: "Bạn không thể gửi tiền nữa!",
                })
            }
            console.log(findSaving)
            findSaving.current_amount+=amount
            findAccount.balance-=amount
            await findSaving.save()
            await findAccount.save()
            const newSavingTran=new savingsTransactionsSchema({
                name_tran,
                transaction_date,
                amount,
                account: accountId,
                saving: savingId,
                user: userId
            })
            await newSavingTran.save()
            return res.status(200).json({
                message: "Gửi tiền tiết kiệm thành công",
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
    // getAll deposit money saving
    async getAllDepositMoneySaving(req,res) {
        try {
            const {userId}=req.params
            const allDeps=await savingsTransactionsSchema.find({
                user: userId
            })
            return res.status(200).json({
                message: "success",
                allDeps
            })
        } catch(err) {
            return res.status(500).json({
                message: `Lỗi ${err}`
            })
        }
    }
}


module.exports=new savingController

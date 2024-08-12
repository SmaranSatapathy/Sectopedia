const jwt=require("jsonwebtoken")
const StudentRegister=require("../models/registers")

const auth=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt
        const verifyUser=jwt.verify(token,"mynameissmaranshrielonewolfmamunisatapathy")
        console.log(verifyUser)

        const user=await StudentRegister.findOne({_id:verifyUser._id})
        console.log(`Details are: ${user}`)
        // console.log(`Details are: ${user.firstname}`)
        req.token=token
        req.user=user
        next()
    } catch (error) {
        res.status(401).send("Create your account today to explore your section.")
    }
}

module.exports=auth
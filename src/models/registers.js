require("dotenv").config()
const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    section:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        // unique:true
    },
    // dob:{
    //     type:Date,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    },
    confirm_password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generateAuthToken=async function()
{
try {
    console.log(this._id)
    const token= jwt.sign({_id:this._id.toString()},"mynameissmaranshrielonewolfmamunisatapathy")
    this.tokens=this.tokens.concat({token:token})
    await this.save()
    // console.log(token)
    return token
} catch (error) {
    res.send("the error part is: "+error)
    console.log(error)
}
}

userSchema.pre("save",async function(next){
    // hashing only occurs when the user wants to modify the password
    if(this.isModified("password"))
    {
        // console.log(`the current password is ${this.password}`)
        this.password=await bcrypt.hash(this.password,10)
        this.confirm_password=await bcrypt.hash(this.password,10)
        // console.log(`the current password is ${this.password}`)

        // confirm_password field db main store nhi hoga
        // this.confirm_password=undefined
    }
    next()
})

const StudentRegister=new mongoose.model("StudentRegister",userSchema)
module.exports=StudentRegister
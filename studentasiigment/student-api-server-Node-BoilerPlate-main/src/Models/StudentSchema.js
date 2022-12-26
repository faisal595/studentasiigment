const mongoose=require('mongoose')

const studentSchema= new mongoose.Schema({
    id:Number,
    name:String,
    currentClass:String,
    division:String
})

const StudentModel= mongoose.model("students", studentSchema)

module.exports=StudentModel
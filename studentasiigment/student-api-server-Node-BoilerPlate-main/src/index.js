const express = require('express')
const app = express()
const mongoose=require('mongoose')
const StudentModel=require('./Models/StudentSchema')
var studentArray=require('./InitialData')
var length=studentArray.length
const bodyParser = require("body-parser");
const port = 5000
app.use(express.urlencoded());


// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

mongoose.connect("mongodb://localhost:27017/school").then(()=> {
    console.log("Database Connected")
}).catch((err)=> {
    console.log(err)
})




app.get('/api/student',async (req,res)=> {

    let user= await StudentModel.find()
    if (user.length===0) {
        studentArray.map( async (val,i)=> {
            return await StudentModel.create({
                    id:val.id,
                    name: val.name,
                    currentClass: val.currentClass,
                    division: val.division
                })
            })
            length=length+1
    }
    StudentModel.find().then((data)=> {
        res.status(200).json({data})
    }).catch((err)=> {
        res.status(500).json(err)
    })
})


app.get('/api/student/:id', (req,res)=> {
    let id=req.params.id
    StudentModel.findOne({id:id}).then((data)=> {
        if(!data) {
            return res.status(404).json({message:"User Not Found"})
        }
        res.status(200).json({data})
    }).catch((err)=> {
        res.status(500).json({err})
    })
})

app.post('/api/student', (req,res)=> {
    
    let name=req.headers.name
    let currentClass= req.headers.currentclass
    let division=req.headers.division

    
    console.log(length,name,currentClass,division )
    if(!name || !currentClass || !division) {
        return res.status(400).json({message:"Plzz provide all details"})
    }

    StudentModel.create({
        id:length,
        name:name,
        currentClass:currentClass,
        division:division
    }).then((data)=> {
        length=length+1
        res.status(200).json({message:"New student Added"})
    }).catch((err)=> {
        res.status(500).json({err})
    })
})


app.put('/api/student/:id', (req,res)=> {
    let id=req.params.id

    let name=req.headers.name
    let currentClass= req.headers.currentclass
    let division=req.headers.division

    if(!name || !currentClass || !division) {
        return res.status(400).json({message:"Plzz provide all details"})
    }

    StudentModel.updateOne({id:id}, {$set: {
        id:id,
        name:name,
        currentClass:currentClass,
        division:division
    }}).then((data)=> {

        if(!data) {
            return res.status(400).json({message: "Student not found with this id "})
        }

        res.status(200).json({message : "Students details Updated"})


    }).catch((err)=> {
        res.status(500).json({err})
    })

})


app.delete('/api/student/:id', (req,res)=> {
    let id=req.params.id

    StudentModel.deleteOne({id:id}).then((data)=> {
        if(!data) {
            return res.status(400).json({message: "Student not found with this id "})
        }
        res.status(200).json({message: "Student has deleted"})
    }).catch((err)=> {
        res.status(400).json(err)
    })
})



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   
const mongoose = require('mongoose');
const StudentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        
        
        
    },
    age:{
        type:Number,
        required:true,
        
    },
    sex: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});
    

const StudentModel=mongoose.model("Students",StudentSchema)
module.exports = StudentModel;
const {Schema ,model}= require('mongoose');

const userSchema = new Schema({
  username: {
     type: String,
      required: true,
       unique: true 
    },
  password: {
     type: String,
      required: true 
    },
    
    role: { 
    type: String,
    enum: ['teacher','Supervisor', 'admin'], 

  }
});

const UserModel=model("user",userSchema);
module.exports = UserModel;
const express = require("express");
const app = express();
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const StudentModel = require('./models/Students');
const UserModel = require('./models/User');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const secretKey = 'fadak';

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
mongoose.connect("mongodb://localhost:27017/university");
app.use(express.json());


const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);


    const result = await StudentModel.insertMany(data);
    console.log("Data inserted:", result);

    res.status(200).send('File processed and data inserted.');
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('Error processing file.');
  } finally {
    fs.unlinkSync(path.join(__dirname, 'uploads', req.file.filename));
  }
});





app.get('/students', async (req, res) => {
    const students = await StudentModel.find();
    res.json(students);
});

app.post('/addStudent', async (req, res) => {
    const students = req.body;
    const newStudent = new StudentModel(students);
    await newStudent.save();
    res.json(newStudent);
});

app.delete('/deleteStudent/:id', async (req, res) => {
    const id = req.params.id;
    await StudentModel.findByIdAndDelete(id);
    res.send('deleted');
});

app.put('/updateStudent/:id', async (req, res) => {
    const id = req.params.id;
    const updatedStudent = req.body;
    await StudentModel.findByIdAndUpdate(id, updatedStudent);
    res.json(updatedStudent);
});

app.post("/register", async (req, res) => {
    const { username, password,role } = req.body;
    const user=await UserModel.findOne({ username});
     user && res.json({message:"User already exists"})
    
      const hashedPassword=bcrypt.hashSync(password,10)

    const newUser=new UserModel({
      username,
       password:hashedPassword,
       role
    });
    await newUser.save();
     return res.json({message:"User saved successfully"})
    
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user=await UserModel.findOne({ username});
     !user && res.json({message:"User doesn't exists"})

     const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.json({message:"User does not exist"})
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secretKey);
    return res.json({ token, userID: user._id, role: user.role }); 
});


app.listen(3001, () => {
    console.log("Server running on port 3001");
});

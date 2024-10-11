const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');
require('dotenv').config()

const ExpressError =  require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');



mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(async () => {
    console.log("Connected to Database")
  }
).catch(err => console.log(process.env.DB_CONNECT, "Connection Failed", err));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false,limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', catchAsync(async (req, res) => {
  res.send('hello');
}))

app.get('/test', catchAsync(async (req, res) => {
  const users = await User.find({});
  return res.json({status:200, users})
}))

app.post('/test', async (req, res) => {
  try{
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({message:"success"});
  }
  catch(e)
  {
    return res.status(400).json({message:"error", e})
  }
})

// app.post('/test', catchAsync(async (req, res) => {
//   const user = new User(req.body);
//   await user.save();
//   return res.json({ status: 200, message: "successfully saved" });
// }))

app.post('/login', catchAsync(async (req, res) => {
  const {mail, password, name} = req.body;
  const user = await User.findOne({ teamName : name  });
  if(!user) return res.json({message: "user not found"});
  if(user.teamLeaderEmail === mail && user.password === password)
  {
    return res.json({status:200, user});
  }
  else{
    return res.json({status: 200, message: "incorrect mail or password"})
  }
}))

app.post('/techStack/:id', catchAsync( async (req, res) => {
  const {id} = req.params;
  console.log(req.body)
  const {techStack} = req.body;
  const user = await User.findById(id);
  if(!user) return res.json({status: 400, message: "user not found"});
  if(user.selected) return res.status(300).json({message:"techstack already selected"});
  user.techStack = techStack;
  user.selected = true;
  await user.save();
  return res.json({status: 200, message: "successfully saved tech stack"});
}
))

app.post('/changePassword/:id', catchAsync( async (req, res) => {
  const {id} = req.params;
  const {oldPassword, newPassword, mail} = req.body;
  const user = await User.findById(id);
  if(!user) return res.json({status:200, message:"user not found"});
  if(user.password === oldPassword && user.teamLeaderEmail === mail)
  {
    user.password = newPassword;
    await user.save();
    return res.json({status:200, message: "successfully updated password"});
  }
  else{
    return res.json({status:200, message: "email or password incorrect"});
  }
} ))

app.get('/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  const user = await User.findById(id);
  if(!user) return res.status(200).json({message:"user not found"});
  return res.status(200).json({user});
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode=500,  message='somethisng not founds'} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!!'
    res.status(statusCode).send('something went wrong');
});

app.listen('3000', (req, res) => {
    console.log('listening on port 3000');
});
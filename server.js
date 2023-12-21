const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
 
const app = express();
dotenv.config();
 
const PORT = process.env.PORT || 8091;
 
// app middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
 
}));
app.use(cookieParser());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected Successfully!!');
  })
  .catch((err) => {
    console.log('MongoDB Connection Error', err.message);
  });
 
// Import routes
const userRouter = require('./routes/User/user.js');
app.use('/User', userRouter);
 
const postRouter = require('./routes/Task/task.js');
app.use('/Task', postRouter);
 
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
 
app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
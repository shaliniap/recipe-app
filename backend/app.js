const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var Request = require("request");
const recipeRoutes = require("./router");

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));
//app.use('/images', express.static(path.join('images')));  // changed path for images storage for S3

// connecting to database
mongoose.connect('mongodb+srv://sap:ZydtSIvTeXgChSGT@cluster0-93xan.mongodb.net/node-angular?retryWrites=true&w=majority',{useCreateIndex: true, useNewUrlParser: true})
  .then(() => {
    console.log('Connected to database!')
  }).catch((err) => {
    console.log(err);
    console.log('Connection Failed!');
  });

//Cross origin resource sharing to enable communication between port 4200(Angular) and port 3000(Node)
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/recipes', recipeRoutes);  // http request for /api/recipes routed to router.js

module.exports = app;

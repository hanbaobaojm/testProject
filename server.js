const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('public'));
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true}));// 请求体参数是: name=tom&pwd=123
app.use(express.json()); // 请求体参数是json结构: {name: tom, pwd: 123}

const indexRouter = require('./routers');
app.use('/', indexRouter);
app.use(express.static('build'));

const url = process.env.MONGODB_URI;
const PORT = process.env.PORT||3001;
console.log('connecting to', url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    });


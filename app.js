const express = require("express");
const app = express();

require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/api', authRoutes);
app.use('/api', postRoutes);

app.use((req, res) => {
    res.status(404).send("Not Found Page!");
});


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.DB_URI)
    .then((result) => {
        app.listen(PORT, () => console.log(`Server works at ${PORT}`));
    })
    .catch(err => {
        console.log(err)
    });


require("../src/db");
const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const fs = require('fs');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const routes = require('./router')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());
routes.apiRoutes(app);

app.listen(port, () => {
    console.log('Listening on port', `${port}`);
});
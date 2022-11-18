const http = require("http");
const express = require("express");
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
const app = express();
const server = http.createServer(app);
const PORT = 3000;

const WEBPATH = "./webpage";

app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//     fs.readFile(`${WEBPATH}/index.html`, (error, data) => {
//         if (error) {
//             console.log(error);
//             return res.status(500).send("<h1>500 Error!</h1>");
//         }
//         res.writeHead(200, { "Content-Type": "text/html" });
//         res.end(data);
//     });
// });

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
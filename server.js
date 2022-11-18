var express = require('express')
var app = express()
var http = require('http')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')

app.use(express.static("public"))
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    })
    
    app.listen(3000);
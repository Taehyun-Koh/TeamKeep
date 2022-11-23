const login = require('login.js');
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME_USER
});

let rooms = [];

function saveRoomList() {
    localStorage.setItem("roomList", JSON.stringify(rooms));
}

function loadRoomList() {
    let roomList = localStorage.getItem("roomList");
    if(!roomList) return;

    rooms = JSON.parse(roomList);
    rooms.forEach(addRoom);
}

function addRoom(room) {
    let list = document.querySelector("#roomlist");
    let li = document.createElement("li");

    li.value = room;
    list.appendChild(li);
}

window.addEventListener("load", loadRoomList);


let joinRoom = document.querySelector("#joinroombutton");

joinRoom.addEventListener("click", () => {
    let input = document.querySelector("#teamcodeinput");
    let text = input.value;

    if(!text.length) return;
    

    input.value = "";
})
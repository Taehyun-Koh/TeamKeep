/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */ 
import './comm.js';
/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */ 



const mysql = require("mysql")
const dotenv = require('dotenv') //mysql pwd숨기기
dotenv.config();
const connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME_ROOM
});

let teams = [];
connection.query('show tables', function(error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
        for (var data of results){
            teams.push(data.Tables_in_room);
        };
        localStorage.setItem("teamlist",teams);
        loadTeams();
        
    } else {              
        alert("room 아직 없음");
    }            
});
/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */
/* -------------------------------- USERNAME -------------------------------- */
let username = localStorage.getItem('username');
/* -------------------------------- USERNAME -------------------------------- */




/* ---------------------------------- TEAMS --------------------------------- */



window.addEventListener("", () => {
    /*TO DO:
        loadTeams();
    */

});
/* ---------------------------------- TEAMS --------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */




/* ---------------------------------- TEAMS --------------------------------- */
function addTeam(create, teamcode) {
    /*TO DO:
        if(create)
            createTeam(teamcode, username);
        else
            joinTeam(teamcode, username);
        loadTeams();
    */
}

function loadTeams() {
    let teamlist = localStorage.getItem("teamlist");
    console.log(typeof(teamlist));
    let teamlist_div = document.querySelector("#teamlist");
    if(!teamlist){
        alert("There is no team")
    }
    else{
        for (var i = 0; i < teams.length; i++){
            console.log(teams[i]);
            var newDiv = document.createElement('div');
            newDiv.innerHTML=teams[i];
            newDiv.setAttribute("id",teams[i]);
            teamlist_div.appendChild(newDiv);

        }
    }

    // teams = fetchTeams(username);
    // arrangeTeams();
}

function arrangeTeams() {
    let teamlist = document.querySelector("#teamlist");
    teams.forEach((team) => {
        let li = document.createElement("li");
        li.innerText = team;
        /* TO DO:
            ON li CLICK: 
                UPDATE 'teamcode' LOCAL FILE
                CHANGE CONTEXT TO index.html
        */
       /*
            li.addEventListener("click", () => {
                
            })
       */
        teamlist.appendChild(li);
    })
}
/* ---------------------------------- TEAMS --------------------------------- */




/* --------------------------- CREATE TEAM BUTTON --------------------------- */
let createteamconfirmbutton = document.querySelector("#createteamconfirmbutton");
createteamconfirmbutton.addEventListener("click", () => {
    let jointeamcodeinput = document.querySelector("#createteamcodeinput");
    let teamcode = jointeamcodeinput.value;
    /* TO DO:
       addTeam(1, teamcode);    
    */
    input.value = "";
});
/* --------------------------- CREATE TEAM BUTTON --------------------------- */




/* --------------------------- JOIN TEAM BUTTON --------------------------- */
let jointeamconfirmbutton = document.querySelector("#jointeamconfirmbutton");
jointeamconfirmbutton.addEventListener("click", () => {
    let jointeamcodeinput = document.querySelector("#jointeamcodeinput");
    let teamcode = jointeamcodeinput.value;
    /* TO DO:
        addTeam(0, teamcode);
    */
    input.value = "";
});
/* --------------------------- JOIN TEAM BUTTON --------------------------- */
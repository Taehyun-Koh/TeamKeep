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
var curr_user = localStorage.getItem("username");
var head = document.querySelector("#teamcodeheader");
head.innerHTML = "TeamKeep" +"\n"+ " hi " + curr_user + "!";

let teams = [];
//team 이름 가져오기
connection.query('show tables', function(error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
        for (var data of results){
            teams.push(data.Tables_in_room);
        };
        localStorage.setItem("teamlist",teams);
        // loadTeams();
        arrangeTeams();
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
    let teamlist_div = document.querySelector("#card");
    // 생성된 team이 DB에 없을경우
    if(!teamlist){
        var newDiv = document.createElement("div");
        newDiv.innerHTML = "No room";
    }
    // DB에 저장된 teamlist 조회 및 리스트로 저장, div 생성
    // div의 id를 team이름으로 설정
    // UI 손봐야함
    else{
        for (var i = 0; i < teams.length; i++){
            console.log(teams[i]);
            var newDiv = document.createElement('div');
            newDiv.className = "card-body";
            var newDiv_btn = document.createElement("button");
            newDiv_btn.className = "btn btn-primary";
            newDiv_btn.innerHTML = "Join";
            newDiv_btn.style = "box-shadow: 0px 0px 5px lightgrey";

            newDiv.innerHTML=teams[i];
            newDiv.setAttribute("id",teams[i]);
            newDiv_btn.onclick = function(e){
                alert("room" + "'" + e.target.parentNode.id + "'"+" select");
                // index.html로 연결 예정
            }
            newDiv.appendChild(newDiv_btn);
            teamlist_div.appendChild(newDiv);

        }
    }

    // teams = fetchTeams(username);
    // arrangeTeams();
}

function arrangeTeams() {
    let teamlist_div = document.querySelector("#card");
    console.log(teams);

    for (var i = 0; i < teams.length; i++){
        console.log(i,'번쨰 for 문')
        var curr_team = teams[i]
        console.log(curr_team);
        connection.query("SELECT * FROM "+curr_team +" WHERE user_name = ?", [curr_user], function(error, results, fields) {
            var tmp = teams[i]
            console.log(tmp)
            if (error) throw error;
            console.log(curr_team)
            if (results.length > 0) {//속한 팀이 있을경우
                var newDiv = document.createElement('div');
                newDiv.className = "card-body";
                var newDiv_btn = document.createElement("button");
                newDiv_btn.className = "btn btn-primary";
                newDiv_btn.innerHTML = "Join";
                newDiv_btn.style = "box-shadow: 0px 0px 5px lightgrey";
    
                newDiv.innerHTML=curr_team + '(내가 속한 팀)';
                newDiv.setAttribute("id",curr_team);
                newDiv_btn.onclick = function(e){
                    alert("room" + "'" + e.target.parentNode.id + "'"+" select");
                    // index.html로 연결 예정
                }
                newDiv.appendChild(newDiv_btn);
                teamlist_div.appendChild(newDiv);
                console.log('append complete')
            } else {              
                var newDiv = document.createElement('div');
                newDiv.className = "card-body";
                var newDiv_btn = document.createElement("button");
                newDiv_btn.className = "btn btn-primary";
                newDiv_btn.innerHTML = "Join";
                newDiv_btn.style = "box-shadow: 0px 0px 5px lightgrey";
    
                newDiv.innerHTML=curr_team + '(내가 속하지 않은 팀)';
                newDiv.setAttribute("id",curr_team);
                newDiv_btn.onclick = function(e){
                    alert("room" + "'" + e.target.parentNode.id + "'"+" select");
                    // index.html로 연결 예정
                }
                newDiv.appendChild(newDiv_btn);
                teamlist_div.appendChild(newDiv);
                console.log("append complete")
            }            
        });
    }
    // teams.forEach((team) => {
    //     let li = document.createElement("li");
    //     li.innerText = team;
    //     /* TO DO:
    //         ON li CLICK: 
    //             UPDATE 'teamcode' LOCAL FILE
    //             CHANGE CONTEXT TO index.html
    //     */
    //    /*
    //         li.addEventListener("click", () => {
                
    //         })
    //    */
    //     teamlist.appendChild(li);
    // })
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
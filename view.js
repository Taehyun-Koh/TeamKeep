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


let teams = []; //team list
let file_num = []; //team별 파일개수
//team 이름 가져오기
connection.query('show tables', function(error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
        for (var data of results){
            teams.push(data.Tables_in_room);
        };
        localStorage.setItem("teamlist",teams);
        // loadTeams();
        getFileNum(teams);
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
    // teams = fetchTeams(username);
    // arrangeTeams();
}
/* ---------------------------------- TEAM Card 생성 --------------------------------- */
function createTeamCard(teamname,i,belong){
    var card = document.createElement('div');
    card.className = "card";
    var card_header = document.createElement("h4");
    if (belong === true) {
        card_header.className = "card-header";
        card_header.innerHTML = "<i class='bi bi-unlock-fill'> "+teamname+"</i>";
        card.appendChild(card_header);
    }
    else if (belong === false) {
        card_header.className = "card-header";
        card_header.innerHTML = "<i class='bi bi-lock-fill'> "+teamname+"</i>";
        card.appendChild(card_header);
    }
    var card_body = document.createElement("div");
    card_body.className = "card-body";
    card_body.setAttribute("id",teamname);
    card.appendChild(card_body);

    var card_title = document.createElement("h5");
    card_title.className = "card-title";
    card_title.innerHTML = "(add something)";
    var card_text = document.createElement("p");
    card_text.className = "card-text";
    card_text.innerHTML = file_num[i]+" items";
    var btn = document.createElement("button");
    if (belong === true) {
        btn.className = "btn btn-primary";
        btn.innerHTML = "Enter";
    }
    else if (belong === false) {
        btn.className = "btn btn-dark";
        btn.innerHTML = "Join";
    }
    
    btn.onclick = function(e){
        alert("'" + e.target.parentNode.id + "'"+" select");
        // index.html로 연결 예정
    }
    card_body.appendChild(card_title);
    card_body.appendChild(card_text);
    card_body.appendChild(btn);
    return card
}

/* ---------------------------------- 팀별 파일 개수를 가져오는 함수 --------------------------------- */
function getFileNum (teams){
    for (let i = 0; i<teams.length; i++){
        var curr_team = teams[i];
        connection.query("SELECT COUNT(*) FROM "+curr_team,function(error,results,fields) {
            if (error) throw error;
            file_num.push(results[0]['COUNT(*)']);
        });
    }
}
/* ---------------------------------- 로그인한 사용자가 속해있는 그룹과 아닌 그룹 나눠서 team card 생성 --------------------------------- */
function arrangeTeams() {
    let my_team = document.querySelector("#my_team");
    let notmy_team = document.querySelector("#all_team");
    for (let i = 0; i < teams.length; i++){
        var curr_team = teams[i]
        connection.query("SELECT * FROM "+curr_team +" WHERE user_name = ?", [curr_user], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {//속한 팀이 있을경우
                let team_card = createTeamCard(teams[i],i,true)
                my_team.appendChild(team_card);
            } else {         
                let all_card = createTeamCard(teams[i],i,false)     
                notmy_team.appendChild(all_card);
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
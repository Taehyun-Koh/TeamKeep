/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */ 
import './comm.js';
/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */ 




/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */
/* -------------------------------- USERNAME -------------------------------- */
let username = localStorage.getItem('username');
/* -------------------------------- USERNAME -------------------------------- */




/* ---------------------------------- TEAMS --------------------------------- */
let teams = [];


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
    if(!teamlist)
        return;

    teams = fetchTeams(username);
    arrangeTeams();
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
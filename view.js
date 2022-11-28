/* -------------------------- ESTABLISH CONNECTION -------------------------- */
const mysql = require("mysql")
const dotenv = require('dotenv') //mysql pwd숨기기
dotenv.config();
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_ROOM
});
/* -------------------------- ESTABLISH CONNECTION -------------------------- */




/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */
/* -------------------------------- USERNAME -------------------------------- */
var curr_user = localStorage.getItem("username");
var head = document.querySelector("#teamnameheader");
head.innerHTML = "TeamKeep" + "\n" + " hi " + curr_user + "!";
let usernameinfo = document.createElement("h6");
usernameinfo.style.opacity = "50%";
usernameinfo.innerText = curr_user;
document.querySelector("#usernameinfo").appendChild(usernameinfo);
/* -------------------------------- USERNAME -------------------------------- */
/* ---------------------------------- TEAMS --------------------------------- */
let teams = []; //team list
let file_num = []; //team별 파일개수
connection.query('show tables', function (error, results, fields) { //team 이름 가져오기
    if (error) throw error;
    if (results.length > 0) {
        for (var data of results) {
            teams.push(data.Tables_in_room);
        };
        localStorage.setItem("teamlist", teams);
        getFileNum(teams);
        arrangeTeams();
    } else {
        alert("room 아직 없음");
    }
});
/* ---------------------------------- TEAMS --------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */




/* ------------------------------ TEAM 카드 생성 ------------------------------ */
function createTeamCard(teamname, i, belong) {
    var card = document.createElement('div');
    card.className = "card";
    var card_header = document.createElement("h6");
    if (belong === true) {
        card_header.className = "card-header";
        card_header.innerHTML = "<i class='bi bi-unlock-fill'></i>&nbsp;" + teamname;
        card_header.style.fontFamily = "'Arvo', serif";
        card.appendChild(card_header);
    }
    else if (belong === false) {
        card_header.className = "card-header";
        card_header.innerHTML = "<i class='bi bi-lock-fill'></i>&nbsp;" + teamname;
        card_header.style.fontFamily = "'Arvo', serif";
        card.appendChild(card_header);
    }
    var card_body = document.createElement("div");
    card_body.className = "card-body";
    card_body.setAttribute("id", teamname);
    card.appendChild(card_body);

    var card_title = document.createElement("h8");
    card_title.className = "card-title";
    card_title.innerHTML = "(add something)";
    var card_text = document.createElement("p");
    card_text.className = "card-text";
    card_text.style.fontSize = "smaller";
    card_text.style.opacity = "0.5";
    card_text.innerHTML = file_num[i] + " items";
    var btn = document.createElement("button");
    if (belong === true) {
        btn.className = "btn btn-primary";
        btn.innerHTML = "Enter";
    }
    else if (belong === false) {
        btn.className = "btn btn-dark";
        btn.innerHTML = "Join";
    }

    btn.onclick = function (e) {
        localStorage.setItem("teamname", teamname);
        document.location.href = 'index.html';
    }
    card_body.appendChild(card_title);
    card_body.appendChild(card_text);
    card_body.appendChild(btn);
    return card;
}
/* ------------------------------ TEAM 카드 생성 ------------------------------ */




/* ---------------------------- 팀별 파일 개수를 가져오는 함수 --------------------------- */
function getFileNum(teams) {
    for (let i = 0; i < teams.length; i++) {
        var curr_team = teams[i];
        connection.query("SELECT COUNT(*) FROM " + curr_team, function (error, results, fields) {
            if (error) throw error;
            file_num.push(results[0]['COUNT(*)']);
        });
    }
}
/* ---------------------------- 팀별 파일 개수를 가져오는 함수 --------------------------- */




/* ---------------- 로그인한 사용자가 속해있는 그룹과 아닌 그룹 나눠서 TEAM 카드 생성 --------------- */
function arrangeTeams() {
    let my_team1 = document.querySelector("#my_team1");
    let my_team2 = document.querySelector("#my_team2");
    let notmy_team1 = document.querySelector("#all_team1");
    let notmy_team2 = document.querySelector("#all_team2");
    let l1  = 0; let l2 = 0; let l3 = 0; let l4 = 0;
    for (let i = 0; i < teams.length; i++) {
        var curr_team = teams[i]
        
        connection.query("SELECT * FROM " + curr_team + " WHERE user_name = ?", [curr_user], function (error, results, fields) {
            if (error) 
                throw error;
            if (results.length > 0) { // 속한 팀이 있을경우
                let team_card = createTeamCard(teams[i], i, true)
                if(l1 <= l2) {
                    my_team1.appendChild(team_card);
                    l1 += 1;
                }
                else {
                    my_team2.appendChild(team_card);
                    l2 += 1;
                }
            } 
            else {
                let all_card = createTeamCard(teams[i], i, false)
                if(l3 <= l4) {
                    notmy_team1.appendChild(all_card);
                    l3 += 1;
                }
                else {
                    notmy_team2.appendChild(all_card);
                    l4 += 1;
                }
            }
        });
    }
}
/* ---------------- 로그인한 사용자가 속해있는 그룹과 아닌 그룹 나눠서 TEAM 카드 생성 --------------- */




/* --------------------------- CREATE TEAM BUTTON --------------------------- */
let createteamconfirmbutton = document.querySelector("#createteamconfirmbutton");
createteamconfirmbutton.addEventListener("click", () => {
    let jointeamnameinput = document.querySelector("#createteamnameinput");
    let teamname = jointeamnameinput.value;
    /* TO DO:
       addTeam(1, teamname);    
    */
    input.value = "";
});
/* --------------------------- CREATE TEAM BUTTON --------------------------- */




/* --------------------------- JOIN TEAM BUTTON --------------------------- */
let jointeamconfirmbutton = document.querySelector("#jointeamconfirmbutton");
jointeamconfirmbutton.addEventListener("click", () => {
    let jointeamnameinput = document.querySelector("#jointeamnameinput");
    let teamname = jointeamnameinput.value;
    /* TO DO:
        addTeam(0, teamname);
    */
    input.value = "";
});
/* --------------------------- JOIN TEAM BUTTON --------------------------- */



/* ------------------------------ LOGOUT BUTTON ----------------------------- */
let logoutbutton = document.querySelector("#logoutbutton");
logoutbutton.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("teamname");
    localStorage.removeItem("teamlist");
    document.location.href="login.html";
})
/* ------------------------------ LOGOUT BUTTON ----------------------------- */

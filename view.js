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

const connection_info = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_ROOMINFO
});
/* -------------------------- ESTABLISH CONNECTION -------------------------- */




/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */
/* -------------------------------- USERNAME -------------------------------- */
var username = localStorage.getItem("username");
var head = document.querySelector("#teamnameheader");
head.innerHTML = 'TeamKeep  ' + '<i class="bi bi-dot"></i>' + '  hi ' + username + '!';
let usernameinfo = document.createElement("h6");
usernameinfo.style.opacity = "50%";
usernameinfo.innerText = username;
document.querySelector("#usernameinfo").appendChild(usernameinfo);
/* -------------------------------- USERNAME -------------------------------- */
/* ---------------------------------- TEAMS --------------------------------- */
let teams = []; //team list
let file_num = []; //team별 파일개수
let team_update = []; //team별 last update시간
connection.query('show tables', function (error, results, fields) { //team 이름 가져오기
    if (error) throw error;

    if (results.length > 0) {
        for (var data of results) {
            teams.push(data.Tables_in_room);
        };
        localStorage.setItem("teamlist", teams);
        getFileNum(teams);
        getLastUpdate(teams);
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
    card_title.innerHTML = team_update[i];
    var card_text = document.createElement("p");
    card_text.className = "card-text";
    card_text.style.fontSize = "smaller";
    card_text.style.opacity = "0.5";
    card_text.innerHTML = file_num[i] + " items";

    var pw_input = document.createElement("input");
    pw_input.setAttribute("id", teamname+'pw');

    var btn = document.createElement("button");
    if (belong === true) {
        btn.className = "btn btn-primary";
        btn.innerHTML = "Enter";
        card_body.appendChild(card_title);
        card_body.appendChild(card_text);
        card_body.appendChild(btn);

        btn.onclick = function (e) {
            localStorage.setItem("teamname", teamname);
            document.location.href = 'index.html';
        }
    }
    else if (belong === false) {
        btn.className = "btn btn-dark";
        btn.innerHTML = "Join";
        card_body.appendChild(card_title);
        card_body.appendChild(card_text);
        card_body.appendChild(pw_input);
        card_body.appendChild(btn);
        btn.onclick = function (e) {
            localStorage.setItem("teamname", teamname);
            var tn = localStorage.getItem("teamname");
            let team_pw;
            connection_info.query("SELECT distinct pw FROM " + tn, function (error, results, fields) {
                if (error) throw error;
                team_pw = results[0].pw;
                var password = document.getElementById(teamname+'pw').value;
                console.log(password);
                console.log(team_pw);
                if (password){
                    if (password === team_pw){
                        connection_info.query('INSERT INTO ' + teamname + '(users, pw) VALUE (?, ?)', [username, password], function(error, results) {
                            if(error) throw error;
                        });
                        document.location.href = 'index.html';
                    }
                    else alert("비밀번호가 틀렸습니다.");
                }
                else{
                    alert("비밀번호를 입력하세요.");
                }
            });
        }
    }

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
/* ---------------------------- 마지막 update된 파일의 시간을 가져오는 함수 --------------------- */
function getLastUpdate(teams) {
    for (let i = 0; i < teams.length; i++) {
        var curr_team = teams[i];
        connection.query("SELECT file_date FROM " + curr_team, function (error, results, fields) {
            if (error) throw error;
            var leng = results.length;
            console.log(leng);
            var last_update = new Date(JSON.parse(results[leng-1].file_date));
            var now = new Date();
            var gap = now-last_update;
            console.log(gap);
            team_update.push(gap);
        });
    }
}

/* ---------------------------- 밀리초ㅗ 변환 --------------------- */

function timeConversion(millisec) {

    var seconds = (millisec / 1000).toFixed(1);

    var minutes = (millisec / (1000 * 60)).toFixed(1);

    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
}

/* ---------------- 로그인한 사용자가 속해있는 그룹과 아닌 그룹 나눠서 TEAM 카드 생성 --------------- */
function arrangeTeams() {
    let my_team1 = document.querySelector("#my_team1");
    let my_team2 = document.querySelector("#my_team2");
    let notmy_team1 = document.querySelector("#all_team1");
    let notmy_team2 = document.querySelector("#all_team2");
    let l1  = 0; let l2 = 0; let l3 = 0; let l4 = 0;
    for (let i = 0; i < teams.length; i++) {
        var curr_team = teams[i]
        
        connection_info.query("SELECT * FROM " + curr_team + " WHERE users = ?", [username], function (error, results, fields) {
            if (error) 
                throw error;
            if (results.length > 0) { // 속한 팀이 있을경우
                let team_card = createTeamCard(teams[i], i, true)
                if(l1 <= l2) {
                    my_team1.appendChild(team_card);
                    $(team_card).hide().fadeIn(200);
                    l1 += 1;
                }
                else {
                    my_team2.appendChild(team_card);
                    $(team_card).hide().fadeIn(200);
                    l2 += 1;
                }
            } 
            else {
                let all_card = createTeamCard(teams[i], i, false)
                if(l3 <= l4) {
                    notmy_team1.appendChild(all_card);
                    $(all_card).hide().fadeIn(200);
                    l3 += 1;
                }
                else {
                    notmy_team2.appendChild(all_card);
                    $(all_card).hide().fadeIn(200);
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

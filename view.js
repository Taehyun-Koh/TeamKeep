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
connection.query('show tables', function (error, results, fields) { //team 이름 가져오기
    if (error) throw error;

    if (results.length > 0) {
        for (var data of results) {
            teams.push(data.Tables_in_room);
        };
        arrangeTeams();
        localStorage.setItem("teamlist", teams);

    } else {
        alert("첫번째 팀을 만들어보세요");
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

    var curr_team = teams[i];

    var updatetime = document.createElement("h8");
    updatetime.className = "card-text";
    updatetime.style.fontSize = "smaller";
    updatetime.style.opacity = "0.5";
    updatetime.innerHTML = '&nbsp';

    var filecount = document.createElement("p");
    filecount.className = "card-text";
    filecount.style.fontSize = "smaller";
    filecount.style.opacity = "0.5";
    filecount.innerHTML = '&nbsp';

    if(belong == true){
        card_body.appendChild(updatetime);
        card_body.appendChild(filecount);
    }
    
    connection.query("SELECT file_date FROM " + curr_team, function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) updatetime.innerHTML = "No data";
        else{
            var leng = results.length;
            var last_update = new Date(JSON.parse(results[leng-1].file_date));
            var now = new Date();
            let gap = String(timeConversion(parseInt(now-last_update)));
            updatetime.innerHTML = gap;
        }

    });

    connection.query("SELECT COUNT(*) FROM " + curr_team, function (error, results, fields) {
        if (error) throw error;
        if(results.length == 0) filecount.innerHTML="0 업로드 " +'<i class="bi bi-cloud"></i>';
        else{
            filecount.innerHTML = results[0]['COUNT(*)'] + " 업로드 " + '<i class="bi bi-cloud"></i>';
        }
    });

    
    var pw_input_area = document.createElement("div");
    pw_input_area.className = "input-group mb-1";

    var pw_input = document.createElement("input");
    pw_input.className = "form-control";
    pw_input.type = "password";
    pw_input.style = "font-size: smaller";
    pw_input.placeholder = "암호";
    pw_input.setAttribute("id", teamname+'pw');
    pw_input_area.appendChild(pw_input);

    var joinBtn = document.createElement("button");
    joinBtn.className = "btn btn-dark";
    joinBtn.innerHTML = '<i class="bi bi-key"></i>'
    pw_input_area.appendChild(joinBtn);

    var btn = document.createElement("button");
    if (belong === true) {
        card.style.backgroundColor = "lightcyan";
        btn.className = "btn btn-secondary";
        btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i>';
        card_body.appendChild(btn);

        btn.onclick = function (e) {
            localStorage.setItem("teamname", teamname);
            document.location.href = 'index.html';
        }
    }
    else if (belong === false) {
        card_body.appendChild(pw_input_area);

        joinBtn.onclick = function (e) {
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




/* --------------------------------- 밀리초 변환 --------------------------------- */
function timeConversion(millisec) {

    var seconds = Math.floor((millisec / 1000).toFixed(1));
    var minutes = Math.floor((millisec / (1000 * 60)).toFixed(1));
    var hours = Math.floor((millisec / (1000 * 60 * 60)).toFixed(1));
    var days = Math.floor((millisec / (1000 * 60 * 60 * 24)).toFixed(1));

    if (seconds < 60) {
        return seconds + "초 전";
    } else if (minutes < 60) {
        return minutes + "분 전";
    } else if (hours < 24) {
        return hours + "시간 전";
    } else {
        return days + "일 전"
    }
}
/* --------------------------------- 밀리초 변환 --------------------------------- */




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
let createteambutton = document.querySelector("#createteambutton");
createteambutton.addEventListener("click", () => {
    $('#createteammodal').modal('show');
    let createteamconfirmbutton = document.querySelector("#createteamconfirmbutton");
    createteamconfirmbutton.addEventListener("click", () => {
        let createteamnameinput = document.querySelector("#createteamnameinput");
        let createteampwinput = document.querySelector("#createteampwinput");
        let teamname = createteamnameinput.value;
        let teampw = createteampwinput.value;
        let isExist = false;

        // 팀 만들기 구현
        connection.query('show tables', function(error, results) { //DB에 이미 팀이 존재하는지 확인
            if(error) throw error;
            //팀 이름이 이미 존재하는지 확인
            for(let i = 0; i < results.length; i++) {
                if(results[i]['Tables_in_room'] === teamname)
                {
                    alert("이미 존재하는 팀 이름");
                    isExist = true;
                }
            }

            if(!isExist)
            {
                //새로운 테이블 만든다
                connection.query('CREATE TABLE IF NOT EXISTS ' + teamname + '(file_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, room_name VARCHAR(45) NOT NULL, user_name VARCHAR(45) NOT NULL, file_type VARCHAR(45) NOT NULL, file_name VARCHAR(45) NOT NULL, file_content LONGBLOB NOT NULL, file_desc TINYTEXT NOT NULL, file_date VARCHAR(128) NOT NULL)', function(error, results) {
                    if(error) throw error;
                });

                connection_info.query('CREATE TABLE IF NOT EXISTS ' + teamname + '(users VARCHAR(45) NOT NULL, pw VARCHAR(45) NOT NULL)', function(error, results) {
                    if(error) throw error;

                });

                //새로운 테이블에 유저 정보 추가
                connection_info.query('INSERT INTO ' + teamname + ' VALUES (?, ?)', [username, teampw], function(error, results) {
                    if(error) throw error;
                    // 성공 시 localStorage의 teamname을 업데이트
                    teams.push(teamname);
                    // index.html로 진입 
                    localStorage.setItem("teamname", teamname);
                    document.location.href = 'index.html';
                });
            }
        })

        // modal 닫기
        $('#createteammodal').modal('hide');

        createteamnameinput.value = "";
        createteampwinput.value = "";

    });
});
/* --------------------------- CREATE TEAM BUTTON --------------------------- */




/* ------------------------------ LOGOUT BUTTON ----------------------------- */
let logoutbutton = document.querySelector("#logoutbutton");
logoutbutton.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("teamname");
    localStorage.removeItem("teamlist");
    document.location.href="login.html";
})
/* ------------------------------ LOGOUT BUTTON ----------------------------- */

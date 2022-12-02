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
head.innerHTML = 'TeamKeep  ' + '<i class="bi bi-dot"></i>' + '  hi ' + trimString(username, 30) + '!';
let usernameinfo = document.createElement("h6");
usernameinfo.style.opacity = "50%";
usernameinfo.innerText = trimString(username, 20);
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

    else {
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

    if (belong == true) {
        card_body.appendChild(updatetime);
        card_body.appendChild(filecount);
    }

    connection.query("SELECT file_date FROM " + curr_team, function (error, results, fields) {
        if (belong)
            card.style.backgroundColor = "lightcyan";
        if (error) throw error;
        if (results.length == 0)
            updatetime.innerHTML = "No data";
        else {
            var leng = results.length;
            var last_update = new Date(JSON.parse(results[leng - 1].file_date));
            var now = new Date();
            let gap = parseInt(now - last_update);
            if (belong) {
                if (gap / 1000 < 60)
                    card.style.backgroundColor = "peachpuff";
                else if (gap / 1000 < 600)
                    card.style.backgroundColor = "lemonchiffon";
            }
            updatetime.innerHTML = String(timeConversion(gap));
        }
    });

    connection.query("SELECT COUNT(*) FROM " + curr_team, function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) filecount.innerHTML = "0 업로드 " + '<i class="bi bi-cloud"></i>';
        else
            filecount.innerHTML = results[0]['COUNT(*)'] + " 업로드 " + '<i class="bi bi-cloud"></i>';
    });

    var pw_input_area = document.createElement("div");
    pw_input_area.className = "input-group mb-1";

    var pw_input = document.createElement("input");
    pw_input.className = "form-control";
    pw_input.type = "password";
    pw_input.style = "font-size: smaller";
    pw_input.placeholder = "비밀번호";
    pw_input.setAttribute("id", teamname + 'pw');
    pw_input_area.appendChild(pw_input);

    var joinBtn = document.createElement("button");
    joinBtn.className = "btn btn-dark";
    joinBtn.innerHTML = '<i class="bi bi-key"></i>'
    pw_input_area.appendChild(joinBtn);

    var btn = document.createElement("button");
    btn.className = "btn btn-outline-dark";

    if (belong === true) {
        btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i>';
        card_body.appendChild(btn);

        btn.onclick = function (e) {
            localStorage.setItem("teamname", teamname);
            document.location.href = 'index.html';
        }
    }

    else {
        card_body.appendChild(pw_input_area);
        joinBtn.onclick = function (e) {
            localStorage.setItem("teamname", teamname);
            var tn = localStorage.getItem("teamname");
            let team_pw;
            connection_info.query("SELECT distinct pw FROM " + tn, function (error, results, fields) {
                if (error) throw error;
                team_pw = results[0].pw;
                var password = document.getElementById(teamname + 'pw').value;
                if (password) {
                    if (password === team_pw) {
                        connection_info.query('INSERT INTO ' + teamname + '(users, pw) VALUE (?, ?)', [username, password], function (error, results) {
                            if (error) throw error;
                        });
                        document.location.href = 'index.html';
                    }
                    else {
                        localStorage.setItem("teamname", "");
                        alert("비밀번호가 틀렸어요.");
                    }
                }
                else {
                    localStorage.setItem("teamname", "");
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
    var my_team1 = document.querySelector("#my_team1");
    var my_team2 = document.querySelector("#my_team2");
    var my_team3 = document.querySelector("#my_team3");
    let notmy_team1 = document.querySelector("#all_team1");
    let notmy_team2 = document.querySelector("#all_team2");
    let notmy_team3 = document.querySelector("#all_team3");
    let isMyteam = 0;
    let isAllteam = 0;
    for (let i = 0; i < teams.length; i++) {
        var curr_team = teams[i]
        var flagM = 0;
        var flagA = 0;
        connection_info.query("SELECT * FROM " + curr_team + " WHERE users = ?", [username], function (error, results, fields) {
            if (error)
                throw error;
            if (results.length > 0) { // 속한 팀이 있을경우
                let team_card = createTeamCard(teams[i], i, true)
                if (flagM % 3 === 0) {
                    my_team1.appendChild(team_card);
                    $(team_card).hide().fadeIn(200);
                    flagM += 1;
                    isMyteam += 1;
                }
                else if (flagM % 3 === 1) {
                    my_team2.appendChild(team_card);
                    $(team_card).hide().fadeIn(200);
                    flagM += 1;
                    isMyteam += 1;
                }
                else if (flagM % 3 === 2) {
                    my_team3.appendChild(team_card);
                    $(team_card).hide().fadeIn(200);
                    flagM += 1;
                    isMyteam += 1;
                }
            }
            else {
                let all_card = createTeamCard(teams[i], i, false)
                if (flagA % 3 === 0) {
                    notmy_team1.appendChild(all_card);
                    $(all_card).hide().fadeIn(200);
                    flagA += 1;
                    isAllteam += 1;
                }
                else if (flagA % 3 === 1) {
                    notmy_team2.appendChild(all_card);
                    $(all_card).hide().fadeIn(200);
                    flagA += 1;
                    isAllteam += 1;
                }
                else if (flagA % 3 === 2) {
                    notmy_team3.appendChild(all_card);
                    $(all_card).hide().fadeIn(200);
                    flagA += 1;
                    isAllteam += 1;
                }
            }


            if (i === teams.length - 1) {
                var mt = document.getElementById("MyteamText");
                var at = document.getElementById("AllteamText");
                //내 팀 없으면
                if (isMyteam === 0) {
                    var p = document.createElement("p");
                    p.innerHTML = "새로운 팀을 만들거나 팀에 참가해보세요!";
                    p.style.color = "lightgray";
                    p.style.fontSize = "15px";
                    p.style.paddingTop = "20px";
                    mt.appendChild(p);

                }
                //All team 없으면
                else if (isAllteam === 0) {
                    var p2 = document.createElement("p");
                    p2.innerHTML = "새로운 팀을 만들어보세요!";
                    p2.style.color = "lightgray";
                    p2.style.fontSize = "15px";
                    p2.style.paddingTop = "20px";
                    at.appendChild(p2);

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

        if (teamname.length == 0 || teampw.length == 0)
            return;

        if (teamname.includes(" ") || teampw.includes(" ")) {
            alert("팀 이름이나 비밀번호는 공백을 포함할 수 없어요.")
            return;
        }

        // 팀 만들기 구현
        let exists = false;
        connection.query('show tables', function (error, results) { //DB에 이미 팀이 존재하는지 확인
            if (error) throw error;
            //팀 이름이 이미 존재하는지 확인
            for (let i = 0; i < results.length; i++) {
                if (results[i]['Tables_in_room'] === teamname) {
                    alert("이미 존재하는 팀 이름이예요.");
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                //새로운 테이블 만든다
                connection.query('CREATE TABLE IF NOT EXISTS ' + teamname + '(file_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, room_name VARCHAR(45) NOT NULL, user_name VARCHAR(45) NOT NULL, file_type VARCHAR(45) NOT NULL, file_name VARCHAR(45) NOT NULL, file_content LONGBLOB NOT NULL, file_desc TINYTEXT NOT NULL, file_date VARCHAR(128) NOT NULL)', function (error, results) {
                    if (error) throw error;
                });

                connection_info.query('CREATE TABLE IF NOT EXISTS ' + teamname + '(users VARCHAR(45) NOT NULL, pw VARCHAR(45) NOT NULL)', function (error, results) {
                    if (error) throw error;

                });

                //새로운 테이블에 유저 정보 추가
                connection_info.query('INSERT INTO ' + teamname + ' VALUES (?, ?)', [username, teampw], function (error, results) {
                    if (error) throw error;
                    // 성공 시 localStorage의 teamname을 업데이트
                    teams.push(teamname);
                    // index.html로 진입 
                    localStorage.setItem("teamname", teamname);
                    document.location.href = 'index.html';
                });

                $('#createteammodal').modal('hide');
                createteamnameinput.value = "";
                createteampwinput.value = "";
            }
        })
    });
});
/* --------------------------- CREATE TEAM BUTTON --------------------------- */




/* ------------------------------ LOGOUT BUTTON ----------------------------- */
let logoutbutton = document.querySelector("#logoutbutton");
logoutbutton.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("teamname");
    localStorage.removeItem("teamlist");
    document.location.href = "login.html";
})
/* ------------------------------ LOGOUT BUTTON ----------------------------- */




/* ------------------------------ STRING MODIFY ----------------------------- */
function trimString(str, num) {
    if (str.length > num)
        return str.substring(0, num) + "...";
    else
        return str;
}
/* ------------------------------ STRING MODIFY ----------------------------- */
/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */ 
/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */



/* ESTABLISH CONNECTION */
const mysql = require("mysql")
const dotenv = require('dotenv') //mysql pwd숨기기
dotenv.config();
const connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME_ROOM
});
/* ESTABLISH CONNECTION */




/* ENTRIES */
export function fetchEntries(teamcode) {
    /*
        (app).get('teams', (req, res) => {
            res.send(JSON.stringify(teams));
        })
    */

    /*teamcode 찾기*/
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //모든 방 정보 저쟝
        let entries = [];

        //모든 방 이름을 불러온다
        connection.query('SELECT * FROM ' + teamcode, (err, rows) => {
            if(err) throw err;

            if(!rows.length) return;

            //정보 하나씩 다 entries에 저장
            for(let i = 0; i < rows.length; i++) {
                let tempentry = {};
                tempentry['filename'] = rows[i].file_name; 
                tempentry['filecontent'] = rows[i].file_content;
                entries.append(tempentry);
            }
        });
    });

    return entries;

} // entry 리스트를 반환 (entry 구조는 visuals.js.336에서 찾을 수 있습니다.)

export function uploadFile(teamcode, username, entry) {
    connection.connect((err) => {
        if(err) return;

        connection.query('SELECT * FROM ' + teamcode + ' WHERE user_name = ?', [username], function(error, results) {
            if(error) throw error;
            if(results.length > 0){
                results['filename'].append(entry.file_name);
                results['filecontent'].append(entry.file_content);
            }
        });
    });
} // entry에 해당하는 파일을 업로드

export function deleteFile(teamcode, entry) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //teamcode에 
        connection.query('SELECT * FROM ' + teamcode, function(error, results) {
            if(error) throw error;
            if(results.length > 0) {
                results['filename'].remove(entry.file_name);
                results['filecontent'].remove(entry.file_content);
            }
        });
    });
} // entry에 해당하는 파일을 삭제
/* ENTRIES */




/* TEAMS */
export function fetchTeams(username) {
    /*
        (app).get('teams', (req, res) => {
            res.send(JSON.stringify(teams));
        })
    */
   
    /*username connection */
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //모든 방 정보 저쟝
        let rooms = [];

        //모든 방 이름을 불러온다
        connection.query('SELECT room_name FROM room WHERE user_name = ?', [username], (err, rows) => {
            if(err) throw err;

            if(!rows.length) return;
            
            console.log(rows);
            rooms.append(rows);
        });
    });

    return rooms;
    

} // 팀 멤버 리스트를 반환

export function createTeam(teamcode, username) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //모든 룸 정보를 불러온다
        connection.query('SELECT * FROM room', function(error, results) {
            if(error) throw error;
            //room 정보 추가
            if(results.length > 0) {
                results.append(teamcode);
            }
        });

        connection.query('SELECT * FROM ' + teamcode, function(error, results) {
            if(error) throw error;
            //user 정보 추가
            if(results.length > 0) {
                results[user_name].append(username);
            }
        });
    });
} // 새로운 팀을 생성


export function joinTeam(teamcode, username) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //팀의 유저 정보 불러온다
        connection.query('SELECT user_name FROM ' + teamcode, function(error, results) {
            if(error) throw error;
            if(results.length > 0) {
                //유저 정보에 username 추가
                results.append(username);
            }
        });
    });
} // 이미 있는 팀의 멤버 목록에 자신을 추가

export function leaveTeam(teamcode, username) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //팀의 유저 정보  불러온다
        connection.query('SELECT user_name FROM ' + teamcode, function(error, results) {
            if(error) throw error;
            
            if(results.length > 0 && results.includes(username)) {
                //username을 지운다
                results.remove(username);
            }
        });
    });
} // 팀의 멤버 목록에서 자신을 제외
/* TEAMS */

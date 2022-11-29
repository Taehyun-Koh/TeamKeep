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
    /*teamcode 찾기*/
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //모든 방 정보 저장
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
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //user_name 있는지 확인한다
        connection.query('SELECT * FROM ' + teamcode + ' WHERE user_name = ?', [username], function(err, results) {
            if(err) throw err;

            //file 추가한다
            connection.query('INSERT INTO ' + teamcode + ' (filename, filecontent) VALUES (?, ?)', [entry.file_name, entry.file_content], function(error, results) {
                if(error) throw error;
            });
        });
    });
} // entry에 해당하는 파일을 업로드

export function deleteFile(teamcode, entry) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //team을 찾아서 file 있는 행을 삭제한다
        connection.query('DELETE FROM ' + teamcode + ' WHERE filename = ?', [entry.file_name], function(error, results) {
            if(error) throw error;
        });
    });
} // entry에 해당하는 파일을 삭제
/* ENTRIES */




/* TEAMS */
export function fetchTeams(username) {
   
    /*username connection */
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //모든 방 정보 저장
        let rooms = [];

        //모든 방 이름을 불러온다
        connection.query('SELECT room_name FROM room WHERE user_name = ?', [username], (err, rows) => {
            if(err) throw err;

            if(!rows.length) return;
            
            rooms.append(rows);
        });
    });

    return rooms;
    

} // 팀 멤버 리스트를 반환

export function createTeam(teamcode, username) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //새로운 테이블 만든다
        connection.query('CREATE TABLE IF NOT EXISTS ' + teamcode + '(room_name VARCHAR(45) NOT NULL, user_name VARCHAR(45) NOT NULL, file_name VARCHAR(45) NOT NULL, file_content VARCHAR(45) NOT NULL)', function(error, results) {
            if(error) throw error;
        });

        //새로운 테이블에 유저 정보 추가
        connection.query('INSERT INTO ' + teamcode + '(user_name) VALUES (?)', [username], function(error, results) {
            if(error) throw error;
        });
    });
} // 새로운 팀을 생성


export function joinTeam(teamcode, username) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //유저 정보 추가
        connection.query('INSERT INTO ' + teamcode + ' (user_name) VALUES (?)', [username], function(error, results) {
            if(error) throw error;
        });
    });
} // 이미 있는 팀의 멤버 목록에 자신을 추가

export function leaveTeam(teamcode, username) {
    //db 연결
    connection.connect((err) => {
        if(err) return;

        //팀의 유저 정보 삭제한다
        connection.query('DELETE FROM ' + teamcode + ' WHERE user_name = ?', [username], function(error, results) {
            if(error) throw error;
        });
    });
} // 팀의 멤버 목록에서 자신을 제외
/* TEAMS */

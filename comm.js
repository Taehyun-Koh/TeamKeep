/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */ 
/* 세 html 파일의 스크립트, 모듈을 잘 점검해주세요. */



/* ESTABLISH CONNECTION */
/* ESTABLISH CONNECTION */




/* ENTRIES */
export function fetchEntries(teamcode) {
    /*
        (app).get('teams', (req, res) => {
            res.send(JSON.stringify(teams));
        })
    */
} // entry 리스트를 반환 (entry 구조는 visuals.js.336에서 찾을 수 있습니다.)

export function uploadFile(teamcode, username, entry) {

} // entry에 해당하는 파일을 업로드

export function deleteFile(teamcode, entry) {

} // entry에 해당하는 파일을 삭제
/* ENTRIES */




/* TEAMS */
export function fetchTeams(username) {
    /*
        (app).get('teams', (req, res) => {
            res.send(JSON.stringify(teams));
        })
    */
} // 팀 멤버 리스트를 반환

export function createTeam(teamcode, username) {
} // 새로운 팀을 생성

export function joinTeam(teamcode, username) {
} // 이미 있는 팀의 멤버 목록에 자신을 추가

export function leaveTeam(teamcode, username) {

} // 팀의 멤버 목록에서 자신을 제외
/* TEAMS */

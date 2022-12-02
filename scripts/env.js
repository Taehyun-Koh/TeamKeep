const mysql = require('mysql');
const remote = require("@electron/remote");
const { dialog } = remote;

window.addEventListener("load", () => {
    document.getElementsByClassName("show-signin")[0].click();
    if (localStorage.getItem("env"))
        document.location.href = "login.html";
})

document.querySelector("#signin-btn").addEventListener("click", () => {
    let host = document.querySelector("#hostname").value;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    
    if(host === "" || username === "" || password === "")
        return;

    else {
        let env = {
            HOST: host,
            USERNAME: username,
            PASSWORD: password,
        }

        const connection = mysql.createConnection({
            host: env.HOST,
            user: env.USERNAME,
            password: env.PASSWORD,
            database: 'my_db',
        });
        
        connection.ping( (err) => {
            if(err) {
                localStorage.removeItem("env");
                dialog.showMessageBox(null,{type:'info',buttons:['확인'], message:'DB에 연결할 수 없어요.'});
                return;
            }

            else {
                localStorage.setItem("env", JSON.stringify(env));
                document.location.href = "login.html";  
            }
        });
    }
})
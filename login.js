const mysql = require("mysql")
const dotenv = require('dotenv') //mysql pwd숨기기
dotenv.config();
const connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME_USER
});

function resetClass(element, classname){
    element.classList.remove(classname);
  }
  document.getElementsByClassName("show-signup")[0].addEventListener("click",function(){
    let form = document.getElementsByClassName("form")[0];
    document.getElementById("username").value=""
    document.getElementById("pwd").value=""
    document.getElementById("confirm_pwd").value = ""
    resetClass(form, "signin");
    resetClass(form, "reset");
    form.classList.add("signup");
    document.querySelector(".submitBtn").setAttribute("id","signup-btn")
    document.getElementById("signup-btn").innerText = "Sign Up";
  });
  document.getElementsByClassName("show-signin")[0].addEventListener("click",function(){
    let form = document.getElementsByClassName("form")[0];
    document.getElementById("username").value=""
    document.getElementById("pwd").value=""
    resetClass(form, "signup");
    resetClass(form, "reset");
    form.classList.add("signin");
    document.querySelector(".submitBtn").setAttribute("id","signin-btn")
    document.getElementById("signin-btn").innerText = "Sign In";

  });
  document.getElementsByClassName("show-reset")[0].addEventListener("click",function(){
    let form = document.getElementsByClassName("form")[0];
    resetClass(form, "signup");
    resetClass(form, "signin");
    form.classList.add("reset");
    document.querySelector(".submitBtn").setAttribute("id","reset-btn")
    document.getElementById("reset-btn").innerText = "Reset password";

  });

  document.getElementsByClassName("submitBtn")[0].addEventListener("click",function(){

    var class_id = document.getElementsByClassName("submitBtn")[0].id;
    console.log(class_id + "clicked");
    if (class_id === "signup-btn"){
        var username = document.getElementById("username").value;
        var password = document.getElementById("pwd").value;
        var password2 = document.getElementById("confirm_pwd").value;
        if (username && password && password2) {
            connection.query('SELECT * FROM Users WHERE id = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
                if (error) throw error;
                if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                    connection.query('INSERT INTO Users (id, password) VALUES(?,?)', [username, password], function (error, data) {
                        if (error) throw error2;
                        alert("회원가입 성공")
                        document.getElementsByClassName("show-signin")[0].click();
                    });
                } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                    alert("비밀번호가 일치하지 않음")
                    document.getElementsByClassName("show-signup")[0].click();

                }
                else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                    alert("이미 존재하는 아이디")
                    document.getElementsByClassName("show-signup")[0].click();
                }            
            });
    
        } else {        // 입력되지 않은 정보가 있는 경우
            alert("입력되지 않은 정보가 잇음")
            document.getElementsByClassName("show-signup")[0].click();

        }

    }
    else if(class_id === "signin-btn"){
        var id = document.getElementById("username").value;
        var pwd = document.getElementById("pwd").value;
        if (id && pwd) {             // id와 pw가 입력되었는지 확인
                // if (err) throw err;
                connection.query('SELECT * FROM Users WHERE id = ? AND password = ?', [id, pwd], function(error, results, fields) {
                    if (error) throw error;
                    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                        console.log("user information")
                        console.log(results)
                        window.localStorage.setItem("user",id);
                        document.location.href = 'index.html';
                    } else {              
                        alert("로그인 정보가 일치하지 않습니다.")
                        // connection.end();
                        document.getElementsByClassName("show-signin")[0].click();
                    }            
                });
        

    
        } else {
            alert("아이디와 비밀번호를 입력하세요!")    
        }
    }
    else if (class_id === "reset-btn"){
        var id = document.getElementById("username").value;
        if (id) {             // id가
            // if (err) throw err;
            connection.query('SELECT * FROM Users WHERE id = ? AND password = ?', [id, pwd], function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                    console.log("user information")
                    console.log(results)
                    document.location.href = 'index.html';
                } else {              
                    alert("로그인 정보가 일치하지 않습니다.")
                    // connection.end();
                    document.getElementsByClassName("show-signin")[0].click();
                }            
            });
    } else {
        alert("아이디를 입력하세요")    
    }
    }
  });

// let signupBtn = document.getElementById("signup-btn");

// signupBtn.addEventListener("click", () => {
//     alert("sign up button clicked");
// });
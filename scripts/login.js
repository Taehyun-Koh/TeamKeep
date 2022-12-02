const mysql = require('mysql');
const dotenv = require('dotenv'); //mysql pwd숨기기
dotenv.config();
const connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME_USER
});

window.addEventListener("load", () => {
    document.getElementsByClassName("show-signin")[0].click();
})

// 비밀번호 찾기 함수에 사용
// 문자열 검색해서 중간 글자 *로 만들기
// 2글자면 마지막 글자만
var maskingName = function(strName) {
    if (strName.length > 2) {
      var originName = strName.split('');
      originName.forEach(function(name, i) {
        if (i === 0 || i === originName.length - 1) return;
        originName[i] = '*';
      });
      var joinName = originName.join();
      return joinName.replace(/,/g, '');
    } else {
      var pattern = /.$/; // 정규식
      return strName.replace(pattern, '*');
    }
  };
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
    document.getElementById("signup-btn").innerText = "회원가입";

    //enter키로 버튼 클릭
    var input = document.getElementById("confirm_pwd");
    input.onkeypress=function(e){
        if(e.keyCode == 13){
            document.getElementsByClassName("submitBtn")[0].click();
        }
    }

  });
  document.getElementsByClassName("show-signin")[0].addEventListener("click",function(){
    let form = document.getElementsByClassName("form")[0];
    document.getElementById("username").value=""
    document.getElementById("pwd").value=""
    resetClass(form, "signup");
    resetClass(form, "reset");
    form.classList.add("signin");
    document.querySelector(".submitBtn").setAttribute("id","signin-btn")
    document.getElementById("signin-btn").innerText = "로그인";
    //enter키로 버튼 클릭
    var input = document.getElementById("pwd");
    input.onkeypress=function(e){
        if(e.keyCode == 13){
            document.getElementsByClassName("submitBtn")[0].click();
        }
    }
  });
  document.getElementsByClassName("show-reset")[0].addEventListener("click",function(){
    let form = document.getElementsByClassName("form")[0];
    document.getElementById("confirm_pwd").value=""
    resetClass(form, "signup");
    resetClass(form, "signin");
    form.classList.add("reset");
    document.querySelector(".submitBtn").setAttribute("id","reset-btn")
    document.getElementById("reset-btn").innerText = "찾기";
    //enter키로 버튼 클릭
    var input = document.getElementById("username");
    input.onkeypress=function(e){
        if(e.keyCode == 13){
            document.getElementsByClassName("submitBtn")[0].click();
        }
    }

  });

  document.getElementsByClassName("submitBtn")[0].addEventListener("click",function(){

    var class_id = document.getElementsByClassName("submitBtn")[0].id;
    if (class_id === "signup-btn"){
        var username = document.getElementById("username").value;
        var password = document.getElementById("pwd").value;
        var password2 = document.getElementById("confirm_pwd").value;
        if (username && password && password2) {
            connection.query('SELECT * FROM Users WHERE id = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
                if (error) throw error;
                if (results.length <= 0 && password === password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                    connection.query('INSERT INTO Users (id, password) VALUES(?,?)', [username, password], function (error, data) {
                        if (error) throw error;
                        alert("회원가입에 성공했어요! 이제 로그인해주세요.");
                        document.getElementsByClassName("show-signin")[0].click();
                    });
                } else if (password !== password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                    alert("비밀번호가 일치하지 않아요.");
                    document.getElementsByClassName("show-signup")[0].click();
                }
                else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                    alert("이미 존재하는 아이디예요.");
                    document.getElementsByClassName("show-signup")[0].click();
                }            
            });
    
        } else {        // 입력되지 않은 정보가 있는 경우
            alert("입력되지 않은 정보가 있음");
            document.getElementsByClassName("show-signup")[0].click();

        }

    }
    else if(class_id === "signin-btn"){
        var id = document.getElementById("username").value;
        var pwd = document.getElementById("pwd").value;
        if (id && pwd) {             // id와 pw가 입력되었는지 확인
                connection.query('SELECT * FROM Users WHERE id = ? AND password = ?', [id, pwd], function(error, results, fields) {
                    if (error) throw error;
                    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                        localStorage.setItem("username",id);
                        document.location.href = 'view.html';
                    } else {              
                        alert("로그인 정보가 일치하지 않아요.");
                        document.getElementsByClassName("show-signin")[0].click();
                    }            
                });
        

    
        } else {
            alert("아이디와 비밀번호를 입력하세요.")    
        }
    }
    else if (class_id === "reset-btn"){
        var id = document.getElementById("username").value;

        if (id) {             // id가
            // if (err) throw err;
            connection.query('SELECT password FROM Users WHERE id = ?', [id], function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                    alert("비밀번호는\n"+ maskingName(results[0].password) + "\n이예요.")
                    document.getElementsByClassName("show-signin")[0].click();

                } else {              
                    document.getElementById("username").value = "";
                    document.getElementsByClassName("show-reset")[0].click();
                    alert("해당 ID는 가입되어 있지 않아요.")
                }            
            });
    } else {
        alert("아이디를 입력해주세요.")    
    }
    }
  });
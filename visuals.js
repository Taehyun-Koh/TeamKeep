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
connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
});
/* -------------------------- ESTABLISH CONNECTION -------------------------- */



/* ---------------------------------- TYPES --------------------------------- */
const CardType = {
    Temp: 0, // CARD BEFORE UPLOAD
    Image: 1,
    File: 2,
    URL: 3,
};

const FileType = {
    Image: 1,
    File: 2,
    URL: 3
}
/* ---------------------------------- TYPES --------------------------------- */




/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */
/* --------------------------- USERNAME & TEAMNAME -------------------------- */
let username = localStorage.getItem("username"); // LOGINED USER
let teamname = localStorage.getItem("teamname"); // CURRENT TEAM


document.querySelector("#teamnameheader").appendChild(document.createTextNode("#" + teamname));


let teamnameinfo = document.createElement("h6");
teamnameinfo.style.opacity = "50%";
teamnameinfo.innerText = teamname;
document.querySelector("#teamnameinfo").appendChild(teamnameinfo);


window.addEventListener("load", () => {
    loadEntries();
})
/* --------------------------- USERNAME & TEAMNAME -------------------------- */




/* --------------------------------- ENTRIES -------------------------------- */
let entries = []; // UPLOADED CARDS
let tempentries = []; // CARDS BEFORE UPLOAD
let activetab = [document.querySelector("#pills-all"), CardType.Temp];
/* --------------------------------- ENTRIES -------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                INITIALIZTION                               */
/* -------------------------------------------------------------------------- */



/* --------------------------------- ENTRIES -------------------------------- */
function addTempEntry(entry) {
    tempentries.push(entry);
    let card = createCard(entry);
    entry.card = card;
    arrangeCards();
}

function addEntry(entry) {
    let now = new Date();
    entry.date = now.toLocaleString();
    connection.query('INSERT INTO ' + teamname + '(room_name, user_name, file_type, file_name, file_content, file_desc, file_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [teamname, username, entry.filetype, entry.filename, entry.file, entry.desc, entry.date], function(error, results) {
        if(error) throw error;
    });

    fetchEntries(arrangeCards);
}

function loadEntries() {
    fetchEntries(arrangeCards);
}

function fetchEntries(callback) {
    while(entries.length > 0)
        entries.pop();
    

    let q = "SELECT * FROM " + teamname;
    connection.query(q, (err, rows) => {
        if (err) throw err;
        if (!rows.length) return;

        for (let row of rows) {
            let entry = {
                cardtype: row.file_type,

                file: row.file_content,
                filename: row.file_name,
                filetype: row.file_type,
                date: row.file_date,

                username: row.user_name,
                desc: row.file_desc,
            }

            entry.card = createCard(entry);
            entries.push(entry);
        }

        callback();
    });   
}
/* --------------------------------- ENTRIES -------------------------------- */




/* ---------------------------------- CARDS --------------------------------- */
function createCard(entry) {
    // CARD BASE
    let card = document.createElement("div");
    card.className = "card";


    // CARD IMAGE
    if (entry.filetype === FileType.Image) {
        let img = document.createElement("img");
        img.className = "card-img-top";
        img.src = entry.file;
        card.appendChild(img);

        const fac = new FastAverageColor();
        fac.getColorAsync(img.src).then(color => {
            if (color.isDark)
                card.style.color = "white";
            card.style.backgroundColor = color.rgba;
        })
    }


    // CARD BODY FOR PADDING
    let cardbody = document.createElement("div");
    cardbody.className = "card-body";
    card.appendChild(cardbody);


    // CARD TITLE
    let title = document.createElement("h6");
    title.className = "card-title";

    if(entry.filetype == FileType.URL)
        title.innerHTML = '<img src = https://s2.googleusercontent.com/s2/favicons?domain_url=' + entry.file + '>&nbsp;' + trimString(entry.filename, 40);
    
    else
        title.innerHTML = trimString(entry.filename, 43);
        
    cardbody.appendChild(title);


    // CARD URL
    if (entry.filetype == FileType.URL) {
        let url = document.createElement("a");
        url.className = "link-primary";
        url.href = absoluteURL(entry.file);
        url.innerText = trimString(entry.file, 25);
        url.style = "font-size: smaller;";
        cardbody.appendChild(url);

        let divider = document.createElement("hr");
        cardbody.appendChild(divider);
    }


    // CARD BEFORE UPLOAD
    if (entry.cardtype == CardType.Temp) {
        // DESC INPUT
        let inputarea = document.createElement("div");
        inputarea.className = "input-group mb-1";
        cardbody.appendChild(inputarea);

        let descinput = document.createElement("input");
        descinput.className = "form-control";
        descinput.type = "text";
        descinput.style = "font-size: smaller;";
        descinput.placeholder = "파일 설명";
        inputarea.appendChild(descinput);

        // UPLOAD BUTTON
        let uploadbutton = document.createElement("button");
        uploadbutton.className = "btn btn-primary";
        uploadbutton.type = "button";
        uploadbutton.innerHTML = '<i class="bi bi-file-earmark-arrow-up-fill"></i>';
        inputarea.appendChild(uploadbutton);

        uploadbutton.addEventListener("click", () => {
            entry.desc = descinput.value; // ADD PROVIDED DESC
            tempentries = tempentries.filter(element => element !== entry); // REMOVE FROM TEMPENTIRES
            card.remove(); // REMOVE FROM THE PAGE
            addEntry(entry);
        });

        return card;
    }

    // CARD DESC
    if (entry.desc != '') {
        let desc = document.createElement("h8");
        desc.style = "font-size: smaller; opacity: 0.75";
        desc.innerText = entry.desc;
        cardbody.appendChild(desc);
    }


    // USER NAME & DATE
    let namedate = document.createElement("h8");
    namedate.style = "padding-bottom: 10px; font-size: smaller; font-style: italic; opacity: 0.5;";
    namedate.innerText = '@' + entry.username + ', ' + entry.date;
    cardbody.appendChild(namedate);


    // CARD OPERATION OPTIONS
    let optionsarea = document.createElement("div");
    optionsarea.style = "display: flex; flex-direction: row-reverse; column-gap: 5px;";
    cardbody.appendChild(optionsarea);


    // DOWNLOAD BUTTON
    if (entry.cardtype != CardType.URL) {
        let downloadbutton = document.createElement("button");
        downloadbutton.className = "btn btn-light";
        downloadbutton.style.opacity = "50%";
        downloadbutton.innerHTML = '<i class = "bi bi-cloud-arrow-down-fill"></i>';
        optionsarea.appendChild(downloadbutton);
    }


    // COPY BUTTON
    if (entry.cardtype == CardType.URL) {
        let copybutton = document.createElement("button");
        copybutton.className = "btn btn-light";
        copybutton.style.opacity = "50%";
        copybutton.innerHTML = '<i class = "bi bi-clipboard-fill"></i>';
        optionsarea.appendChild(copybutton);

        copybutton.addEventListener("click", () => {
            navigator.clipboard.writeText(entry.file);
        });
    }


    // DELETE BUTTON
    let deletebutton = document.createElement("button");
    deletebutton.className = "btn btn-light";
    deletebutton.style.opacity = "50%";
    deletebutton.innerHTML = '<i class = "bi bi-trash3-fill"></i>';
    optionsarea.appendChild(deletebutton);

    deletebutton.addEventListener("click", () => {   
        // TO DO: REMOVE THESE
        card.remove();
        entries = entries.filter(element => element !== entry);
        arrangeCards();
        // TO DO: REMOVE THESE
    });

    deletebutton.addEventListener("mouseover", () => {
        deletebutton.style.color = "red";
        deletebutton.style.opacity = "100%";
    })

    deletebutton.addEventListener("mouseout", () => {
        deletebutton.style.color = "black";
        deletebutton.style.opacity = "50%";
    })


    return card;
}

function arrangeCards() {
    let type = activetab[1];
    let cardlists = activetab[0].querySelectorAll("div.cardlist"); // CARDLISTS[0]: ~CARDS1, CARDLISTS[1]: ~CARDS2

    cardlists[0].innerHTML = "";
    cardlists[1].innerHTML = "";
    let sum1 = 0;
    let sum2 = 0;

    let filtered = entries;

    if (type == CardType.Temp) {
        tempentries.forEach(entry => {
            if(sum1 <= sum2) {
                cardlists[0].appendChild(entry.card);
                $(entry.card).hide().fadeIn(200);
                sum1 += entry.card.offsetHeight;
            }

            else {
                cardlists[1].appendChild(entry.card);
                $(entry.card).hide().fadeIn(200);
                sum2 += entry.card.offsetHeight;
            }
        });
    }

    else
        filtered = entries.filter(entry => entry.cardtype == type);
   
    filtered.forEach(entry => {
        if(sum1 <= sum2) {
            cardlists[0].appendChild(entry.card);
            $(entry.card).hide().fadeIn(200);
            sum1 += entry.card.offsetHeight;
        }

        else {
            cardlists[1].appendChild(entry.card);
            $(entry.card).hide().fadeIn(200);
            sum2 += entry.card.offsetHeight;
        }
    });
}
/* ---------------------------------- CARDS --------------------------------- */




/* ----------------------------- FILE TYPE TABS ----------------------------- */
let alltab = document.querySelector("#pills-all-tab");
let imagestab = document.querySelector("#pills-images-tab");
let filestab = document.querySelector("#pills-files-tab");
let urltab = document.querySelector("#pills-url-tab");


alltab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-all"), CardType.Temp];
    loadEntries();
});

imagestab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-images"), CardType.Image];
    loadEntries();
});

filestab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-files"), CardType.File];
    loadEntries();
});

urltab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-url"), CardType.URL];
    arrangeCards();
});
/* ----------------------------- FILE TYPE TABS ----------------------------- */




/* ----------------------------- ADD FILE BUTTON ---------------------------- */
let addfilebutton = document.querySelector("#addfilebutton");
addfilebutton.addEventListener("click", () => {
    document.querySelector("#fileinput").click(); // TRIGGER FILE SELECT DIALOGUE
});

let fileinput = document.querySelector("#fileinput");
fileinput.addEventListener("change", (event) => {
    let file = event.target.files[0];
    let tok = file.name.lastIndexOf(".");
    let filetype = file.name.substring(tok + 1, file.length).toLowerCase();

    switch (filetype) {
        case '':
            filetype = FileType.File;
            break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            filetype = FileType.Image;
            break;
        default:
            filetype = FileType.File;
    }

    let filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = function () {
        let entry = {
            // defines tile viewing option
            cardtype: CardType.Temp,

            // file metadata
            file: filereader.result,
            filename: file.name,
            filetype: filetype,
            date: '',

            // user information
            username: username,
            desc: '',
        }
        addTempEntry(entry);
        document.querySelector("#pills-all-tab").click();
        fileinput.value = '';
    }
});
/* ----------------------------- ADD FILE BUTTON ---------------------------- */




/* ----------------------------- ADD URL BUTTON ----------------------------- */
let addurlbutton = document.querySelector("#addurlbutton");
addurlbutton.addEventListener("click", () => {
    document.querySelector("addurlmodal")
    $('#addurlmodal').modal('show');

    let addurlconfirmbutton = document.querySelector("#addurlconfirmbutton");
    addurlconfirmbutton.addEventListener("click", () => {
        let addurladdressinput = document.querySelector("#addurladdressinput");
        let url = addurladdressinput.value;
        if (url === "")
            return;
        addurladdressinput.value = "";

        let addurltitleinput = document.querySelector("#addurltitleinput");
        let title = addurltitleinput.value;
        if (title == "") {
            title = url;
        }
        addurltitleinput.value = "";

        let addurldescinput = document.querySelector("#addurldescinput");
        let desc = addurldescinput.value;
        addurldescinput.value = "";

        let entry = {
            cardtype: CardType.URL,

            file: url,
            filename: title,
            filetype: FileType.URL,
            date: '',

            username: username,
            desc: desc
        }

        addEntry(entry);
        document.querySelector("#pills-url-tab").click();
        $('#addurlmodal').modal('hide');
    });
});
/* ----------------------------- ADD URL BUTTON ----------------------------- */




/* ----------------------------- REFRESH BUTTON ----------------------------- */
let refreshbutton = document.querySelector("#refreshbutton");
refreshbutton.addEventListener("click", () => {
    loadEntries();
});
/* ----------------------------- REFRESH BUTTON ----------------------------- */




/* ------------------------------ RETURN BUTTON ----------------------------- */
let returnbutton = document.querySelector("#returnbutton");
returnbutton.addEventListener("click", () => {
    localStorage.setItem("teamname", "");
    document.location.href = 'view.html';
})
/* ------------------------------ RETURN BUTTON ----------------------------- */



/* ------------------------------ STRING MODIFY ----------------------------- */
function trimString(str, num) {
    if (str.length > num)
        return str.substring(0, num) + "...";
    else
        return str;
}

function absoluteURL(url) {
    if (url.indexOf('https://') != 0 && url.indexOf("http://") != 0)
        url = "https://" + url;
    return url;
}
/* ------------------------------ STRING MODIFY ----------------------------- */
import './comm.js';




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




let username = 'admin'; // LOGINED USER
let teamcode = 'teamtest'; // CURRENT TEAM
// TO DO: GET TEAM INFO FROM SERVER AT COMM.JS THEN IMPORT TO THIS HTML


document.querySelector("#teamcodeheader").appendChild(document.createTextNode(teamcode));

let teamcodeinfo = document.createElement("h6");
teamcodeinfo.style.opacity = "50%";
teamcodeinfo.innerText = teamcode;
document.querySelector("#teamcodeinfo").appendChild(teamcodeinfo);




let entries = []; // UPLOADED CARDS
let tempentries = []; // CARDS BEFORE UPLOAD
let activetab = [document.querySelector("#pills-all"), CardType.Temp];




/* ADD ENTRIES */
function addTempEntry(entry) {
    tempentries.push(entry);
    let card = createCard(entry);
    entry.card = card;
    arrangeCards();
}


function addEntry(entry) {
    entries.push(entry);
    let card = createCard(entry);
    entry.card = card;
    arrangeCards();
}
/* ADD ENTRIES */




/* GENERATE AND DISPLAY CARDS */
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
    title.innerText = trimString(entry.filename, 43);
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
            entry.cardtype = entry.filetype; // CARD READY TO UPLOAD

            tempentries = tempentries.filter(element => element !== entry); // REMOVE FROM TEMPENTIRES
            card.remove(); // REMOVE FROM THE PAGE
            addEntry(entry); // UPLOAD CARD
        });

        return card;
    }

    // CARD DESC
    if (entry.desc != '') {
        let desc = document.createElement("h8");
        desc.style = "font-size: smaller; opacity: 0.75";
        desc.innerText = entry.desc;
        cardbody.appendChild(desc);

        //let divider = document.createElement("hr");
        //cardbody.appendChild(divider);
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
        card.remove();
        entries = entries.filter(element => element !== entry);
        arrangeCards();
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

    let sum1 = 0;
    let sum2 = 0;

    let filtered = entries;

    if (type == CardType.Temp) {
        for (let i = tempentries.length - 1; i >= 0; i--) {
            if (sum1 <= sum2) {
                cardlists[0].appendChild(tempentries[i].card);
                sum1 += tempentries[i].card.offsetHeight;
            }

            else {
                cardlists[1].appendChild(tempentries[i].card);
                sum2 += tempentries[i].card.offsetHeight;
            }
        }
    }

    else
        filtered = entries.filter(entry => entry.cardtype == type);

    for (let i = filtered.length - 1; i >= 0; i--) {
        if (sum1 <= sum2) {
            cardlists[0].appendChild(filtered[i].card);
            sum1 += filtered[i].card.offsetHeight;
        }

        else {
            cardlists[1].appendChild(filtered[i].card);
            sum2 += filtered[i].card.offsetHeight;
        }
    }
}
/* GENERATE AND DISPLAY CARDS */




/* FILE TYPE TABS */
let alltab = document.querySelector("#pills-all-tab");
let imagestab = document.querySelector("#pills-images-tab");
let filestab = document.querySelector("#pills-files-tab");
let urltab = document.querySelector("#pills-url-tab");

alltab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-all"), CardType.Temp];
    arrangeCards();
});

imagestab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-images"), CardType.Image];
    arrangeCards();
});

filestab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-files"), CardType.File];
    arrangeCards();
});

urltab.addEventListener("click", () => {
    activetab = [document.querySelector("#pills-url"), CardType.URL];
    arrangeCards();
});
/* FILE TYPE TABS */




/* ADD FILE BUTTON */
let addfilebutton = document.querySelector("#addfilebutton");
addfilebutton.addEventListener("click", () => {
    document.querySelector("#fileinput").click(); // TRIGGER FILE SELECT DIALOGUE
    document.querySelector("#pills-all-tab").click(); // FORCE VIEW ALL TAB
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
            filesize: file.size,
            date: '',

            // user information
            username: username,
            desc: '',
        }
        addTempEntry(entry);
        fileinput.value = '';
    }
});
/* ADD FILE BUTTON */




/* ADD URL BUTTON */
let addurlbutton = document.querySelector("#addurlbutton");
addurlbutton.addEventListener("click", () => {
    document.querySelector("#pills-all-tab").click();
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
        $('#addurlmodal').modal('hide');
    });
});
/* ADD URL BUTTON */




/* RETURN BUTTON */
let returnbutton = document.querySelector("#returnbutton");
returnbutton.addEventListener("click", () => {
    // TO DO: SET CURRENT PAGE TO NULL
    document.location.href = 'view.html';
})




function trimString(str, num) {
    if (str.length > num)
        return str.substring(0, num) + "...";
    else
        return str;
}

function absoluteURL(url) {
    console.log(url);
    if (url.indexOf('https://') != 0 && url.indexOf("http://") != 0)
        url = "https://" + url;
    return url;
}




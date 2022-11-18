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



let entries = []; // UPLOADED CARDS
let tempentries = []; // CARDS BEFORE UPLOAD
let activetab = [document.querySelector("#pills-group1-all"), CardType.Temp];




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
    if (entry.filetype === FileType.Image) {
        let img = document.createElement("img");
        img.className = "card-img-top";
        img.src = entry.file;
        card.appendChild(img);

        const fac = new FastAverageColor();
        fac.getColorAsync(img.src).then(color => {
            if(color.isDark)
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
    let titletext = document.createTextNode(entry.filename);
    title.appendChild(titletext);
    cardbody.appendChild(title);


    // CARD URL
    if (entry.filetype == FileType.URL) {
        let urlarea = document.createElement("div");
        cardbody.appendChild(urlarea);

        let url = document.createElement("a");
        url.className = "link-primary";
        url.href = entry.file;
        url.target = "_blank";
        url.style = "font-size: smaller;";
        urlarea.appendChild(url);

        let urltext = document.createTextNode(entry.file);
        url.appendChild(urltext);
    }


    // CARD BEFORE UPLOAD
    if (entry.cardtype == CardType.Temp) {
        // DESC INPUT
        let inputarea = document.createElement("div");
        inputarea.className = "input-group mb-1";
        cardbody.appendChild(inputarea);

        let inputtext = document.createElement("input");
        inputtext.className = "form-control";
        inputtext.type = "text";
        inputtext.style = "font-size: smaller;";
        inputtext.placeholder = "파일 설명";
        inputarea.appendChild(inputtext);        

        // UPLOAD BUTTON
        let uploadbutton = document.createElement("button");
        uploadbutton.className = "btn btn-primary";
        uploadbutton.type = "button";
        uploadbutton.innerHTML = '<i class = "bi bi-file-earmark-arrow-up"></i>';
        inputarea.appendChild(uploadbutton);

        uploadbutton.addEventListener("click", () => {
            entry.desc = inputtext.value; // ADD PROVIDED DESC
            entry.cardtype = entry.filetype; // CARD READY TO UPLOAD

            tempentries = tempentries.filter(element => element !== entry); // REMOVE FROM TEMPENTIRES
            card.remove(); // REMOVE FROM THE PAGE
            addEntry(entry); // UPLOAD CARD
        });

        return card;
    }


    // CARD DESC
    let descarea = document.createElement("div");
    cardbody.appendChild(descarea);

    let desc = document.createElement("h7");
    desc.className = "card-text";
    desc.style = "font-size: smaller; opacity: 0.6";
    desc.innerText = entry.desc;
    descarea.appendChild(desc);


    // CARD OPERATION OPTIONS
    let optionsarea = document.createElement("div");
    optionsarea.style = "display: flex; column-gap: 5px; float: right; margin: 2px;";
    cardbody.appendChild(optionsarea);
    

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


    // COPY BUTTON
    if(entry.cardtype == CardType.URL) {
        let copybutton = document.createElement("button");
        copybutton.className = "btn btn-light";
        copybutton.style.opacity = "50%";
        copybutton.innerHTML = '<i class = "bi bi-clipboard-fill"></i>';
        optionsarea.appendChild(copybutton);

        copybutton.addEventListener("click", () => {
            navigator.clipboard.writeText(entry.file);
        });
    }

    
    // DOWNLOAD BUTTON
    let downloadbutton = document.createElement("button");
    downloadbutton.className = "btn btn-light";
    downloadbutton.style.opacity = "50%";
    downloadbutton.innerHTML = '<i class = "bi bi-cloud-arrow-down-fill"></i>';
    optionsarea.appendChild(downloadbutton);

    return card;
}

function arrangeCards() {
    let type = activetab[1];
    let cardlists = activetab[0].querySelectorAll("div.cardlist"); // CARDLISTS[0]: ~CARDS1, CARDLISTS[1]: ~CARDS2

    let sum1 = 0;
    let sum2 = 0;

    let filtered = entries;

    if(type == CardType.Temp) {
        for(let i = tempentries.length - 1; i >=0; i--) {        
            if(sum1 <= sum2) {
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
    
    for(let i = filtered.length - 1; i >=0; i--) {        
        if(sum1 <= sum2) {
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
    activetab[0] = document.querySelector("#pills-group1-all");
    activetab[1] = CardType.Temp;
    arrangeCards();
});

imagestab.addEventListener("click", () => {
    activetab[0] = document.querySelector("#pills-group1-images");
    activetab[1] = CardType.Image;
    arrangeCards();
});

filestab.addEventListener("click", () => {
    activetab[0] = document.querySelector("#pills-group1-files");
    activetab[1] = CardType.File;
    arrangeCards();
});

urltab.addEventListener("click", () => {
    activetab[0] = document.querySelector("#pills-group1-url");
    activetab[1] = CardType.URL;
    arrangeCards();
});
/* FILE TYPE TABS */




/* FILE ADD BUTTON */
let addentrybutton = document.querySelector("#addentrybutton");
addentrybutton.addEventListener("click", () => {
    document.querySelector("#fileinput").click(); // TRIGGER FILE SELECT DIALOGUE
    document.querySelector("#pills-all-tab").click(); // FORCE VIEW ALL TAB
    
    //$('#addnotesmodal').modal('show'); //show modal
    //$('#btn-n-save').hide();
    //$('#btn-n-add').show();
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
        case 'png':
        case 'gif':
        case 'jpeg':
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
            user: '',
            desc: '',
        }
        addTempEntry(entry);
        fileinput.value = '';
    }
    // to do : view input tile, add event listner to them to upload, cancel, ... 
});
/* FILE ADD BUTTON */




/* ADD THIS PAGE BUTTON */
let addthispagebutton = document.querySelector("#addthispagebutton");
addthispagebutton.addEventListener("click", () => {
    document.querySelector("#pills-all-tab").click();

    let url = window.location.href;
    let entry = {
        cardtype: CardType.Temp,

        file: url,
        filename: document.title,
        filetype: FileType.URL,
        date: '',

        user: '',
        desc: ''
    }

    addTempEntry(entry);
});
/* ADD THIS PAGE BUTTON */
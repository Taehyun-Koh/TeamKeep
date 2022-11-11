//firebase 이벤트리스너
let entries = [];
let tempentries = [];

const CardType = {
    Temp: 0, // Confirm tile before uploading
    Image: 1,
    File: 2,
    URL: 3,
};

const FileType = {
    Image: 1,
    File: 2,
    URL: 3
}

function addTempEntry(entry) {
    tempentries.push(entry);
    let card = createCard(entry);
    entry.card = card;
    arrangeCards(CardType.Temp,"pills-group1-all");
}

function addEntry(entry) {
    entries.push(entry);
    let card = createCard(entry);
    entry.card = card;
    arrangeCards(CardType.Temp,"pills-group1-all");
}

function createCard(entry) {
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

    let cardbody = document.createElement("div");
    cardbody.className = "card-body";
    card.appendChild(cardbody);

    let title = document.createElement("h6");
    title.className = "card-title";
    let titletext = document.createTextNode(entry.filename);
    title.appendChild(titletext);
    cardbody.appendChild(title);

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

    if (entry.cardtype == CardType.Temp) {
        let inputarea = document.createElement("div");
        inputarea.className = "input-group mb-1";
        cardbody.appendChild(inputarea);

        let inputtext = document.createElement("input");
        inputtext.className = "form-control";
        inputtext.type = "text";
        inputtext.style = "font-size: smaller;";
        inputtext.placeholder = "파일 설명";
        inputarea.appendChild(inputtext);        

        let uploadbutton = document.createElement("button");
        uploadbutton.className = "btn btn-primary";
        uploadbutton.type = "button";
        inputarea.appendChild(uploadbutton);

        let uploadicon = document.createElement("i");
        uploadicon.className = "bi bi-file-earmark-arrow-up";
        uploadbutton.appendChild(uploadicon);

        uploadicon.addEventListener("click", () => {
            entry.desc = inputtext.value;
            entry.cardtype = entry.filetype;

            tempentries = tempentries.filter(element => element !== entry);
            card.remove();
            addEntry(entry);
        });

        return card;
    }

    let descarea = document.createElement("div");
    cardbody.appendChild(descarea);

    let desc = document.createElement("h7");
    desc.className = "card-text";
    desc.style = "font-size: smaller; opacity: 0.6;";
    descarea.appendChild(desc);

    let desctext = document.createTextNode(entry.desc);
    desc.appendChild(desctext);

    let optionsarea = document.createElement("div");
    optionsarea.style = "display: flex; column-gap: 5px; float: right; margin: 2px;";
    cardbody.appendChild(optionsarea);

    let deletebutton = document.createElement("button");
    deletebutton.className = "btn btn-light";
    deletebutton.style.opacity = "50%";
    optionsarea.appendChild(deletebutton);

    let deleteicon = document.createElement("i");
    deleteicon.className = "bi bi-trash3-fill";
    deletebutton.appendChild(deleteicon);

    deletebutton.addEventListener("click", () => {
        card.remove();
        entries = entries.filter(element => element !== entry);
    });

    deletebutton.addEventListener("mouseover", () => {
        deletebutton.className = "btn btn-danger";
        deletebutton.style.opacity = "100%";
    })

    deletebutton.addEventListener("mouseout", () => {
        deletebutton.className = "btn btn-light";
        deletebutton.style.opacity = "50%";
    })

    if(entry.cardtype == CardType.URL) {
        let copybutton = document.createElement("button");
        copybutton.className = "btn btn-light";
        copybutton.style.opacity = "50%";
        optionsarea.appendChild(copybutton);

        let copyicon = document.createElement("i");
        copyicon.className = "bi bi-clipboard-fill";
        copybutton.appendChild(copyicon);

        copybutton.addEventListener("click", () => {
            navigator.clipboard.writeText(entry.file);
        });
    }

    let downloadbutton = document.createElement("button");
    downloadbutton.className = "btn btn-light";
    downloadbutton.style.opacity = "50%";
    optionsarea.appendChild(downloadbutton);

    let downloadicon = document.createElement("i");
    downloadicon.className = "bi bi-cloud-arrow-down-fill";
    downloadbutton.appendChild(downloadicon);

    return card;
}

function arrangeCards(arg1, arg2) {
    let activetab = document.getElementById(arg2);
    let cardlists = activetab.querySelectorAll("div.cardlist");

    let sum1 = 0;
    let sum2 = 0;

    if(arg1 == CardType.Temp) {
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

    filtered = entries;
    if(arg1 == CardType.Image)
        filtered = filtered.filter(entry => entry.cardtype == CardType.Image);
    
    if(arg1 == CardType.File)
        filtered = filtered.filter(entry => entry.cardtype == CardType.File);
    
    if(arg1 == CardType.URL)
        filtered = filtered.filter(entry => entry.cardtype == CardType.URL);


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

let alltab = document.querySelector("#pills-all-tab");
let imagestab = document.querySelector("#pills-images-tab");
let filestab = document.querySelector("#pills-files-tab");
let urltab = document.querySelector("#pills-url-tab");

alltab.addEventListener("click", () => {
    arrangeCards(CardType.Temp, "pills-group1-all");
});

imagestab.addEventListener("click", () => {
    arrangeCards(CardType.Image, "pills-group1-images");
});

filestab.addEventListener("click", () => {
    arrangeCards(CardType.File, "pills-group1-files");
});

urltab.addEventListener("click", () => {
    arrangeCards(CardType.URL, "pills-group1-url");
});

function uploadServer(entry) {
    
}

let addentrybutton = document.querySelector("#addentrybutton");
let addthispagebutton = document.querySelector("#addthispagebutton");

addentrybutton.addEventListener("click", () => {
    document.querySelector("#fileinput").click();
    document.querySelector("#pills-all-tab").click();
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
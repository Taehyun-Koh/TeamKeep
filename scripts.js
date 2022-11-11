let entries=[];

const TileType = {
    Temp: 0, // Confirm tile before uploading
    Image : 1,
    File : 2,
    URL : 3,
};

const FileType = {
    Image : 1,
    File : 2,
    URL : 3
}

function addEntry(entry) {
    console.log(entries);
    entries.push(entry);

    let card = createCard(entry);
    let tilecontainer = document.querySelector("#alltiles");
    tilecontainer.appendChild(card);

    if(entry.tiletype != TileType.Temp) {
        if(entry.filetype == FileType.Image) {
            tilecontainer = document.querySelector("#imagetiles");
            let dupcard = card.cloneNode(true);
            tilecontainer.appendChild(dupcard); // to do : need to append tile to the html
        }
        if(entry.filetype == FileType.File) {
            tilecontainer = document.querySelector("#filetiles");
            let dupcard = card.cloneNode(true);
            tilecontainer.appendChild(dupcard); // to do : need to append tile to the html
        }
        if(entry.filetype == FileType.URL) {
            tilecontainer = document.querySelector("#urltiles");
            let dupcard = card.cloneNode(true);
            tilecontainer.appendChild(dupcard); // to do : need to append tile to the html
        }
    }
}

function createCard(entry) {
    let card = document.createElement("div");
    card.className = "card";
    
    let img = document.createElement("img");
    img.class = "card-img-top";
    img.src = entry.file;
    console.log(entry);
    if(entry.filetype === FileType.Image)
        card.appendChild(img);

    let cardbody = document.createElement("div");
    cardbody.className = "card-body";
    card.appendChild(cardbody);

    let title = document.createElement("h6");
    title.className = "card-title";
    let titletext = document.createTextNode(entry.filename);
    title.appendChild(titletext);
    cardbody.appendChild(title);

    if(entry.tiletype == TileType.Temp) {
        let inputarea = document.createElement("div");
        inputarea.className = "input-group mb-3";
        cardbody.appendChild(inputarea);

        let inputtext = document.createElement("input");
        inputtext.className = "form-control";
        inputtext.type = "text";
        inputtext.style = "font-size: smaller";
        inputtext.placeholder = "Provide a description of the file";
        inputarea.appendChild(inputtext);

        let appendarea = document.createElement("div");
        appendarea.className = "input-group-append";
        inputarea.appendChild(appendarea);

        let uploadbutton = document.createElement("button");
        uploadbutton.className = "btn btn-outline-secondary";
        uploadbutton.type = "button";
        let uploadicon = document.createElement("i");
        uploadicon.className="bi bi-file-earmark-arrow-up";
        uploadbutton.appendChild(uploadicon);
        appendarea.appendChild(uploadbutton);
    
        uploadicon.addEventListener("click", () => {
            entry.desc = inputtext.value;
            entry.tiletype = entry.filetype;
            card.remove();
            addEntry(entry);
        });

        return card;
    }

    let desc = document.createElement("h7");
    desc.className = "card-text";
    desc.style = "color: grey; font-size: smaller;"
    let desctext = document.createTextNode(entry.desc);
    desc.appendChild(desctext);
    cardbody.appendChild(desc);

    return card;
}

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

    switch(filetype) {
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

    filereader.onload = function() {
        let entry = {
            // defines tile viewing option
            tiletype: TileType.Temp,
        
            // file metadata
            file: filereader.result,
            filename: file.name,
            filetype: filetype,
            date: '', 

            // user information
            user: '',
            desc: '',
        }
        addEntry(entry);
        fileinput.value=''; 
    }
    // to do : view input tile, add event listner to them to upload, cancel, ... 
});

addthispagebutton.addEventListener("click", () => {
    let url = window.location.href;
    let entry = {
        tiletype: TileType.Temp,

        file: url,
        filename: document.title,
        filetype: FileType.URL,
        date: '',

        user: '',
        desc: ''
    }

    addEntry(entry);
});
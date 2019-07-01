let url = document.location.href + "api/";
let dirname;
let onfilenow;

//USER NAME
let user = "Anonymous";
if (localStorage.getItem("username")) {
    document.getElementById("username").innerText = localStorage.getItem("username");
    user = localStorage.getItem("username")
}
if(user !== "Anonymous"){addchangename(user)}
function addchangename(theuser) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: theuser })
    }
    fetch(url + "users", options)
}
function changeUserName() {
    if (document.getElementById("username").className !== "openuser") {
        document.getElementById("inputusername").innerHTML = `<div id="inamestyle">
            <div id="contentinputbtn"><form id="formname" onsubmit="okchangeuser()"><input id="inputuser" type="text" placeholder="enter username"><button title="change username">ok</button></form></div>
        </div>`
        document.getElementById("inputuser").focus();
        document.getElementById("username").title = "close change username"
        document.getElementById("username").className = "openuser"
    }
    else {
        document.getElementById("username").classList.remove("openuser");
        document.getElementById("username").title = "open change username"
        document.getElementById("inputusername").innerHTML = "";
    }
}
function okchangeuser() {
    event.preventDefault();
    user = document.getElementById('inputuser').value;
    if (user === "") { return }
    localStorage.setItem("username", user);
    document.getElementById("username").innerText = user;
    addchangename(user);
    document.getElementById('username').click();
}

//NAME OF FOLDER ON
ajaxFetch('GET', url + "dirname", entdname);
function entdname(xhr) {
    document.getElementById("pathinfile").innerHTML = xhr.responseText;
    let dirarray = xhr.responseText.split('\\');
    if (dirarray[dirarray.length - 1] === "") {
        document.getElementById("namefolderon").innerHTML = `<div id="namefname">${dirarray[dirarray.length - 2]}</div><div id="closeallf" onclick="closeAllF()" title="Collapse Folders">=</div>`
    }
    else {
        document.getElementById("namefolderon").innerHTML = `<div id="namefname">${dirarray[dirarray.length - 1]}</div><div id="closeallf" onclick="closeAllF()" title="Collapse Folders">=</div>`
    }
}

//COLLAPSE FOLDERS
function closeAllF() {
    foldersopen = document.getElementsByClassName("foldersopen")
    for (i = foldersopen.length - 1; i >= 0; i--) {
        foldersopen[i].click();
    }
}

//OPEN FOLDER
function openFolders(iddiv = "foldersnav", pathi = "", space = 12, ttarget = null) {
    ajaxFetch('GET', url + "folders?pathi=" + pathi, fresp);
    function fresp(xhr) {
        if (xhr.status === 0) {
            document.getElementById("contentfile").innerHTML = " <h1>Live Server Sources not open</h1>";
            ttarget.classList.add("firstclick");
            document.getElementById(iddiv).hidden = true;
            ttarget.children[0].innerHTML = "▷"
            ttarget.classList.remove("foldersopen");
            return
        }
        let resp = JSON.parse(xhr.responseText);
        if (resp.error) {
            document.getElementById(iddiv).innerHTML += `<div class='notfileclass' style="padding-left:${space}px;color:#c14545;">(impossible to open)<div>`;
            return
        }
        let buffer = "";
        for (i = 0; i < resp.folders.length; i++) {
            buffer += `<button class="folderclass firstclick folderfile ff${space/12}" onclick="hidediv(event,'${Object.entries(resp.folders[i])[0][1]}',${space + 12})" style="padding-left:${space}px;"><span>▷</span> ${Object.entries(resp.folders[i])[0][0]}</button><div hidden id="${Object.entries(resp.folders[i])[0][1]}"></div>`
        }
        for (i = 0; i < resp.files.length; i++) {
            let sizefile = calculatesizefile(Object.entries(resp.files[i])[1][1]);
            buffer += `<button onclick="openFile(event,'${(Object.entries(resp.files[i])[0][1]).replace(/\'/g, "%p%s")}')" class="fileclass folderfile ff${space/12}" style="padding-left:${space}px;">❖ ${Object.entries(resp.files[i])[0][0]}<span class="thesizes"> [ ${sizefile} ]</span></button>`
        }
        if (buffer === "") { buffer = `<div class="notfileclass" style="padding-left:${space}px;color:#67ce73">the file is empty</div>`; }
        if (iddiv === "foldersnav") {
            document.getElementById("infdnav").innerHTML += buffer;
        }
        else {
            document.getElementById(iddiv).innerHTML = buffer;
        }
    }
}

function calculatesizefile(size){
    if(size>=100000000){//0.10GB
        return (size/1000000000).toFixed(2) + ' GB'
    }
    else if(size>=100000){//0.10MB
        return (size/100000).toFixed(2) + ' MB'
    }
    else if(size>=100){//0.10KB
        return (size/1000).toFixed(2) +' KB'
    }
    else{
        return size + ' Bytes'
    }
}

//OPEN FILE
function openFile(e, pathi) {
    if (onfilenow) {
        onfilenow.style.backgroundColor = "";
    }
    if(e.target.classList.contains("thesizes")){
        onfilenow = e.target.parentElement;
    }
    else{
        onfilenow = e.target;
    }
    
    onfilenow.style.backgroundColor = "rgb(43, 66, 82)";
    let patharray = pathi.split('/');
    let filepa = (patharray[patharray.length - 1]).split('.');
    let ext = filepa[filepa.length - 1].toLowerCase();
    document.getElementById("nameoffile").innerHTML = `<div class="lds-css ng-scope"><div style="width:100%;height:100%" class="lds-dual-ring"><div></div></div></div>`+patharray[patharray.length - 1].replace(/%p%s/g, "\'");
    document.getElementById("pathinfile").innerHTML = (pathi.replace(/\//g, "\\")).replace(".", dirname).replace(/%p%s/g, "\'");

    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === "gif" || ext === "ico" || ext === "svg" || ext === "tif" || ext === "tiff" || ext === "webp") {
        document.getElementById("contentfile").innerHTML = `<img src='${url}files?pathi=${pathi}'>`
        document.getElementById("nameoffile").innerHTML = `<div id="spacebeforenof"></div>`+patharray[patharray.length - 1].replace(/%p%s/g, "\'");
        return
    }
    if (ext === "mp4" || ext === "avi" || ext === "mpeg" || ext === "ogv" || ext === "webm" || ext === "3gp" || ext === "3g2") {
        document.getElementById("contentfile").innerHTML = `<video controls>
            <source src="${url}files?pathi=${pathi}">
            Your browser does not support the video element <a href="${url}files?pathi=${pathi}">download here</a>
        </video>`
        document.getElementById("nameoffile").innerHTML =`<div id="spacebeforenof"></div>`+ patharray[patharray.length - 1].replace(/%p%s/g, "\'");
        return
    }
    if (ext === "aac" || ext === "mp3" || ext === "mid" || ext === "midi" || ext === "oga" || ext === "wav" || ext === "weba") {
        document.getElementById("contentfile").innerHTML = `<audio controls>
            <source src="${url}files?pathi=${pathi}">
            Your browser does not support the audio element <a href="${url}files?pathi=${pathi}">download here</a>
        </audio>`
        document.getElementById("nameoffile").innerHTML =`<div id="spacebeforenof"></div>`+ patharray[patharray.length - 1].replace(/%p%s/g, "\'");
        return
    }
    var apparray = ["zip", "exe", "7z", "abw", "arc", "azw", "bin", "bz", "bz2", "csh", "doc", "docx", "eot", "epub", "jar", "mpkg", "odp", "ods", "odt", "ogx", "pdf", "ppt", "pptx", "rar", "rtf", "sh", "swf", "tar", "vsd", "xls", "xlsx", "xul", "otf", "ttf", "woff", "woff2"];
    let appext = false;
    for (i = 0; i < apparray.length; i++) { if (apparray[i] === ext) { appext = true } }
    if (appext) {
        document.getElementById("contentfile").innerHTML = `<a href="${url}files?pathi=${pathi}"><div id="zipdownload">${patharray[patharray.length - 1]}<br><br>download ${onfilenow.children[0].innerText}</div></a>`
        document.getElementById("nameoffile").innerHTML = `<div id="spacebeforenof"></div>`+patharray[patharray.length - 1].replace(/%p%s/g, "\'");
        return
    }
    ajaxFetch('GET', url + "files?pathi=" + pathi, ffresp);
    function ffresp(xhr) {
        if (xhr.status === 0) {
            document.getElementById("contentfile").innerHTML = " <h1>Live Server Sources not open</h1>";
        }
        else {
            document.getElementById("contentfile").innerHTML = `<pre id="tpre"><code ondblclick="selectElementText(event.target,event)" id="scode" class="language-${ext}">${xhr.responseText.replace(/</g, "&lt;")}</code></pre>`;
            Prism.highlightAll();
        }
        document.getElementById("nameoffile").innerHTML =`<div id="spacebeforenof"></div>`+ patharray[patharray.length - 1].replace(/%p%s/g, "\'");
    }
}

//HIDE OR OPEN FOLDER
function hidediv(e, iddiv, space) {
    ttarget = e.target
    if (e.target.innerHTML === "▼" || e.target.innerHTML === "▷") {
        ttarget = e.target.parentElement;
    }
    if (ttarget.classList.contains("firstclick") && document.getElementById(iddiv).hidden) {
        let namefolder = ttarget.innerHTML;
        ttarget.innerHTML += "<span> ...<span>";
        if (document.getElementById("contentfile").innerHTML === " <h1>Live Server Sources not open</h1>") {
            document.getElementById("contentfile").innerHTML = ""
        }
        openFolders(iddiv, iddiv, space, ttarget);
        ttarget.classList.remove("firstclick");
        ttarget.innerHTML = namefolder;
    }
    if (document.getElementById(iddiv).hidden) {
        document.getElementById(iddiv).hidden = false;
        ttarget.children[0].innerHTML = "▼"
        ttarget.classList.add("foldersopen");
        let fofi = document.getElementById(iddiv).childNodes;
        for(j=0;j<fofi.length;j++){
            if(fofi[j].nodeName.toLowerCase() == 'button'){
                fofi[j].classList.add("folderfile");
            }
        }
    }
    else {
        let fofi = document.getElementById(iddiv).childNodes;
        for(k=0;k<fofi.length;k++){
            if(fofi[k].nodeName.toLowerCase() == 'button'){
                fofi[k].classList.remove("folderfile");
            }
        }
        document.getElementById(iddiv).hidden = true;
        ttarget.children[0].innerHTML = "▷"
        ttarget.classList.remove("foldersopen");
    }
}

//SIZES IN PAGE
window.onload = () => {
    document.getElementsByTagName("section")[0].style.height = (window.innerHeight - 54) + "px";
    document.getElementById("rightpage").style.width = (window.innerWidth - 280) + "px";
    document.getElementById("rootfile").style.height = (window.innerHeight - 88) + "px";
    document.getElementById("oninfdnav").style.height = (window.innerHeight - 122) + "px";
    setTimeout(function () {
        dirname = document.getElementById("pathinfile").innerText;
    }, 1000)
    openFolders();
}
window.onresize = () => {
    document.getElementsByTagName("section")[0].style.height = (window.innerHeight - 54) + "px";
    document.getElementById("rightpage").style.width = (window.innerWidth - 280) + "px";
    document.getElementById("rootfile").style.height = (window.innerHeight - 88) + "px";
    document.getElementById("oninfdnav").style.height = (window.innerHeight - 122) + "px";
}

//DOUBLECLICK TO COPY AND CTRL+A
function selectElementText(el, e = null, andcopy = true) {
    while (andcopy === true && (el.id !== "scode" && el.id !== "pathinfile")) { el = el.parentElement }
    var range = document.createRange();
    range.selectNodeContents(el);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    if (andcopy) {
        document.execCommand("copy");
        infocopy = document.createElement('div');
        infocopy.style.cssText = 'position:absolute; background:lightgray; color:black; padding:4px;z-index:10000;'
            + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);'
            + 'opacity:0;transition:opacity 0.3s';
        infocopy.innerHTML = 'Copied';
        document.body.appendChild(infocopy);
        infocopy.style.left = e.pageX - 10 + 'px'
        infocopy.style.top = e.pageY + 15 + 'px'
        infocopy.style.opacity = 1
        setTimeout(function () {
            infocopy.remove();
        }, 1000)
    }
}
//KEYBOARD CTRL+A AND UP DOWN ARROW
$(window).bind('keydown', function (event) {
    if (event.ctrlKey || event.metaKey) {
        if (String.fromCharCode(event.which).toLowerCase() === 'a' || String.fromCharCode(event.which).toLowerCase() === 'A') {
            event.preventDefault();
            selectElementText(document.getElementById("contentfile"), null, false);
        }
    }
    if (event.keyCode === 38 || event.keyCode === 40) {
        if(!document.activeElement.classList.contains("folderfile")){return}
        event.preventDefault();
        let a = document.getElementsByClassName("folderfile");
        let c = [];
        for(i=0; i<a.length;i++){
            let d=a[i]
            let bo = true;
            while(d){
                d = d.parentElement;
                if(d && d.hidden){bo=false}
            }
            if(bo){c.push(a[i])}
        }
        let b = document.querySelector('*:focus');
        for(i=0;i<c.length;i++){
            if(c[i]===b){
                if(event.keyCode===38){
                    if(i===0){c[c.length-1].focus();return}
                    c[i-1].focus();
                }
                else if(event.keyCode===40){
                    if(i===c.length-1){c[0].focus();return}
                    c[i+1].focus();
                }
                return
            }
        }
    }
});
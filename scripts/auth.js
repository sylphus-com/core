/**
 * Firebase configuration and initialization.
 * Configures the Firebase SDK with the provided credentials.
 */
var config = {
    apiKey: "AIzaSyC-3XDB0vSiQlbGL-Sa9rOiteFYitYfstw",
    authDomain: "firescrypt-web.firebaseapp.com",
    databaseURL: "https://firescrypt-web-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "firescrypt-web",
    storageBucket: "firescrypt-web.appspot.com",
    messagingSenderId: "276701233302",
    appId: "1:276701233302:web:5e513b1d8c681e830082b7",
    measurementId: "G-T12DZ6GPNN"
};
firebase.initializeApp(config);
var db = firebase.database();

/**
 * Uploads the content of the editor to Firebase Realtime Database.
 * @param {string} e - The path to the Firebase location.
 * @param {string} i - The name of the file.
 */


/**
 * Adds a new file to the Firebase database and displays it in the UI.
 */
function generateString(e) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let t = " ",
    r = characters.length;
  for (let i = 0; i < e; i++) t += characters.charAt(Math.floor(Math.random() * r));
  return t
}
function addsubfile(k) {
    let e = firebase.auth().currentUser;
    // Prompt for file name
    var i = prompt("File Name");
   
    // Add the new file to the Firebase database
    db.ref("subfolder-files-to-add/" + e.uid + "/" + k).push({
        name: i,
      path:k+"/"+i,
        type: "file",
       sha:  generateString(20)
    });

    // Update the UI with the new file
    db.ref("subfolder-files-added/" + e.uid + "/" + k + "/" + btoa(i)).set({
        filepath: i,
        value: ""
    });

    
    document.getElementById(k).innerHTML += `<ul class="subfolder"><li id="newly-added-file-${i}" type="file">
        <p onclick="gotofile('${k+"/"+i}','newly-added-folder-${i}');">
            <i class="material-icons mdc-button__icon" aria-hidden="true"> insert_drive_file </i>${i}
        </p>
    </li></ul>`;
}
function addsubfolder(k) {
    let e = firebase.auth().currentUser;
    // Prompt for file name
    var i = prompt("Folder Name");

    // Add the new file to the Firebase database
    db.ref("subfolder-files-to-add/" + e.uid + "/" + k).push({
        name: i,
      path:k+"/"+i,
        type: "dir",
       sha:  generateString(20)
    });

    // Update the UI with the new file
    db.ref("subfolder-files-added/" + e.uid + "/" + k + "/" + btoa(i)).set({
        filepath: i,
        value: ""
    });

    
    document.getElementById(k).innerHTML += `<ul class="subfolder"><li id="newly-added-folder-${i}" type="dir">
        <p onclick="getSubFolder('${i}');">
            <i class="material-icons mdc-button__icon" aria-hidden="true"> folder </i>${i}
            <i class="material-icons mdc-button__icon sub_folder_icon" aria-hidden="true" onclick="addsubfile('${i}')"> note_add </i>
            
        </p>
    </li></ul>`;
}
function addfile() {
    let e = firebase.auth().currentUser;
    // Prompt for file name
    var i = prompt("File Name");
    
    // Add the new file to the Firebase database
    db.ref("files-to-add/" + e.uid + "/" + repoName).push({
        file: i,
        type: "file"
    });

    // Update the UI with the new file
    db.ref("files-added/" + e.uid + "/" + repoName + "/" + btoa(i)).set({
        filepath: i,
        value: ""
    });

    // let t = document.getElementById("root");
    // t.remove();
    document.getElementById("root").innerHTML += `<li id="newly-added-file-${i}" type="file">
        <p onclick="gotofile('${i}','newly-added-folder-${i}');">
            <i class="material-icons mdc-button__icon" aria-hidden="true"> insert_drive_file </i>${i}
        </p>
    </li>`;
}
function addfolder() {
    let e = firebase.auth().currentUser;
    // Prompt for file name
    var i = prompt("Folder Name");
    
    // Add the new file to the Firebase database
    db.ref("folders-to-add/" + e.uid + "/" + repoName).push({
        file: i,
        type: "folder"
    });

    // Update the UI with the new file
    db.ref("folders-added/" + e.uid + "/" + repoName + "/" + btoa(i)).set({
        filepath: i,
        value: ""
    });

    // let t = document.getElementById("root");
    // t.remove();
    document.getElementById("root").innerHTML += `<li id="newly-added-folder-${i}" type="dir">
        <p onclick="getSubFolder('${i}');">
            <i class="material-icons mdc-button__icon" aria-hidden="true"> folder </i>${i}
            <i class="material-icons mdc-button__icon sub_folder_icon" aria-hidden="true" onclick="addsubfile('${i}')"> note_add </i>
            
        </p>
    </li>`;
  
}
// ...
// (Remaining code, including authentication state change listener and event handlers)
// ...
firebase.auth().onAuthStateChanged(function(e) {
    if (e) {
        var t = e.uid;
        if (db.ref("users/" + t + "repos/").on("value", e => {
                let t = e.val();
                for (let n in t)
                    for (let i in t[n]) {
                        let r = t[n][i].repo;
                        document.getElementById("search-repo-contents").innerHTML += `<div class="repo-info" onclick="km('${r}')"><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
"> commit </i><p>${r.split("/")[0]+" / "+r.split("/")[1]}</p></div>`
                    }
            }), new URL(location.href).searchParams.get("repo")) {
            var n = new URL(location.href).searchParams.get("repo");
            db.ref("users/" + t + "repos/" + n).set({
                repo: n,
                created: new Date
            }), getRepoFiles(n)
          document.getElementById("no-repo-chosen").style.display = "none"
        } else document.getElementById("get-repo").style.display = "block",document.getElementById("repos_btn").style.display = "none",document.getElementById("firepad-container").style.display = "none",document.getElementById("no-repo-chosen").style.display = "flex";
        document.querySelector(".main--editor").style.display = "block", init();
        var i = document.querySelector(".monaco-editor");
        void 0 !== i && null != i && (window.onresize = function() {
            editor.layout()
        }), null !== e && e.providerData.forEach(e => {
            document.getElementById("user-image-editor").src = e.photoURL
        })
    } else document.getElementById("no-repo-shadow").style.display = "flex", document.getElementById("sign-in").style.display = "flex",document.getElementById("no-repo-chosen").style.display = "none"
});

const signInForm = document.getElementById("sign-in"),
    loginBtn = document.getElementById("login-btn"),
    signupBtn = document.getElementById("signup-btn"),
    githubSignupBtn = document.getElementById("github-signup"),
    googleSignupBtn = document.getElementById("google-signup");

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("signed out")
    }).catch(e => {
        console.error(e)
    })
}

function logout() {
    firebase.auth().signOut()
}
signInForm.addEventListener("submit", e => {
    e.preventDefault(), console.log("sub");
    let t = document.getElementById("email").value,
        n = document.getElementById("password").value;
    e.submitter === loginBtn ? (console.log("log"), firebase.auth().signInWithEmailAndPassword(t, n).then(e => {
        let t = e.user;
        console.log("Logged in:", t), window.location.href = "https://firescryptgithubio.adhvaithprasad.repl.co/"
    }).catch(e => {
        let t = e.code,
            n = e.message;
        alert("Error:", t, n)
    })) : e.submitter === signupBtn && (console.log("sign"), firebase.auth().createUserWithEmailAndPassword(t, n).then(e => {
        let t = e.user;
        console.log("Signed up:", t), window.location.href = "https://firescryptgithubio.adhvaithprasad.repl.co/"
    }).catch(e => {
        let t = e.code,
            n = e.message;
        alert("Error:", t, n)
    }))
}), githubSignupBtn.addEventListener("click", () => {
    var e = new firebase.auth.GithubAuthProvider;
    firebase.auth().signInWithRedirect(e), firebase.auth().getRedirectResult().then(e => {
        if (e.credential) var t, n = e.credential.accessToken;
        var i = e.user
    }).catch(e => {
        var t = e.code,
            n = e.message,
            i = e.email,
            r = e.credential
    })
}), googleSignupBtn.addEventListener("click", () => {
    var e = new firebase.auth.GoogleAuthProvider;
    firebase.auth().signInWithRedirect(e), firebase.auth().getRedirectResult().then(e => {
        if (e.credential) var t, n = e.credential.accessToken;
        var i = e.user
    }).catch(e => {
        var t = e.code,
            n = e.message,
            i = e.email,
            r = e.credential
    })
});
var k = new URL(location.href).searchParams.get("repo");

var threadref = firebase.database().ref('threads/'+k);
threadref.on('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data)
  addthread(data)
});


var chatref = firebase.database().ref('chats/'+k);
chatref.on('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data)
  addchat(data)
});

let current_group;

function gotochat(k){
  document.getElementById("chat-data-container").innerHTML =""
    current_group = k
  console.log(current_group,k)
  var chatref = firebase.database().ref('chatdata/'+k);
chatref.on('value', (snapshot) => {
  const da = snapshot.val();
  var n = Object.keys(da);
   n.forEach((data) => {
    
     document.getElementById("chat-data-container").innerHTML += `<li><img class="message-photo" src='${da[data].url}'/>
     <div class="message-body">
     <div class="message-info"><p class="message-info-sender">${da[data].sender}</p><p class="message-info-date">${da[data].date}</p></div>
     <p class="message-message">${da[data].message}</p>
     </div></li>`
   });
  
});
}
function getDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const dateTimeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return dateTimeString;
}
function sendmessage(){
  let e = firebase.auth().currentUser;
  var value = document.getElementById('chat_value').value;
  var thread = { "sender": e.displayName ,"message":value,"url":e.photoURL,"date":getDateTime()}
  firebase.database().ref("chatdata/"+ current_group).push(thread);
  gotochat(current_group)
}
function addchat(data){
  
  var n = Object.keys(data);
  n.forEach((name) => {
    document.getElementById("chat_cont").innerHTML += `<li><p class="chat_file_name" onclick=expand('${name}')><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
">tag</i>${name}<i onclick=add_channel('${name}') class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-left: 10px;
">add</i></p><ul style=display:none id=${name}></ul></li>`
    
    Object.keys(data[name]).forEach((d) => {
      console.log(data[name][d],name)
      var threadval= data[name][d];
      document.getElementById(name).innerHTML += `<li><p onclick="gotochat('${threadval.id}')">  ${threadval.name} </p>
   </li>`
    })
    
    
    
  })
  console.log(n)
}
function addthread(data){
  document.getElementById("review_cont").innerHTML="";
  var n = Object.keys(data);
  n.forEach((name) => {
    document.getElementById("review_cont").innerHTML += `<li><p class="thread_file_name" onclick=expand('${name}')><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
">insert_drive_file</i>${atob(name)}</p><ul style=display:none id=${name}></ul></li>`
    Object.keys(data[name]).forEach((d) => {
      console.log(data[name][d],name)
      var threadval= data[name][d];
      document.getElementById(name).innerHTML += `<li><p style="
    display: flex;
    justify-content: space-between;
    align-items: center;
">${d}  <i 
 class="material-icons mdc-button__icon iconm" aria-hidden=true type="button" > chat </i>0 <i onclick=deletethread('${d}','${threadval.file}') class="material-icons mdc-button__icon iconm" aria-hidden=true type="button" > task_alt </i></p>
    <pre><code>#${threadval.lineNumber}: </code><code>${threadval.content}</code></pre><p>${threadval.thread}</p></li>`
    })
    
    
  })
  console.log(n)
}

function expand(m){

  var n = document.getElementById(m).style.display;
  
if (n === "none") {
  document.getElementById(m).style.display="block";
}  else {
  document.getElementById(m).style.display="none";
}
}
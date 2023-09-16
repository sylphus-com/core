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
function addsubfile(k,m) {
    let e = firebase.auth().currentUser;
    // Prompt for file name
    var i = prompt("File Name");
   var sha = generateString(20);
  const repoQueryParam = new URL(location.href).searchParams.get("repo");
    // Add the new file to the Firebase database
    db.ref("content-added/"+repoQueryParam+"/" + e.uid + "/" + k).push({
        name: i,
      path:k+"/"+i,
        type: "file",
       sha:  sha
    });
db.ref(e.uid + "/" + repoQueryParam + "/" + btoa(k+"/"+i)).set({
    filepath: k+"/"+i,
    value: ""
  });
    // Update the UI with the new file
  
    if(!document.getElementById(m).querySelector(".subfolder")){
      document.getElementById(m).innerHTML += `<ul class="subfolder"></ul>`
    }
    document.getElementById(m).querySelector(".subfolder").innerHTML += `<li id="${sha}" type="file">
        <p onclick="gotofile('${k+"/"+i}')">
            <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>
            
            ${i}
            
        </p>
    </li>`;
}
function addsubfolder(k,m) {
    let e = firebase.auth().currentUser;
    // Prompt for file name
    var i = prompt("Folder Name");
   var sha = generateString(20);
  var path = k+"/"+i ;
  const repoQueryParam = new URL(location.href).searchParams.get("repo");
    // Add the new file to the Firebase database
    db.ref("content-added/"+repoQueryParam+"/" + e.uid + "/" + k).push({
        name: i,
      path:k+"/"+i,
        type: "dir",
       sha:  sha
    });

    // Update the UI with the new file
   

     if(!document.getElementById(m).querySelector(".subfolder")){
      document.getElementById(m).innerHTML += `<ul class="subfolder"></ul>`
    }
    document.getElementById(m).querySelector(".subfolder").innerHTML += `<li id="${sha}" type="dir">
        <p onclick="jello('${path}','${sha}')">
            <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>  
            
            ${i}
            
             <svg onclick="addsubfile('${path}','${sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${path}','${sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
        </p>
        <ul class="subfolder"></ul>
    </li>`;
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
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const uid = user.uid;
      


        const repoQueryParam = new URL(location.href).searchParams.get("repo");

        // Function to render repositories
        function renderRepos(repos) {
            const repoContentsElement = document.getElementById("search-repo-contents");
            repoContentsElement.innerHTML = "";

            for (const repoKey in repos) {
                for (const innerKey in repos[repoKey]) {
                    const repo = repos[repoKey][innerKey].repo;
                    const repoInfoHTML = `<div class="repo-info" onclick="km('${repo}')">
                                            <i class="material-icons mdc-button__icon" aria-hidden="true" style="margin-right: 10px;">commit</i>
                                            <p>${repo.split("/")[0]} / ${repo.split("/")[1]}</p>
                                          </div>`;
                    repoContentsElement.innerHTML += repoInfoHTML;
                }
            }
        }

        // Fetch repository data from Firebase
        db.ref(`users/${uid}repos/`).on("value", snapshot => {
            const reposData = snapshot.val();
            if (reposData) {
                // Call renderRepos function to display repositories
                renderRepos(reposData);
            }
        });

        // Check for repoQueryParam
        if (repoQueryParam) {
          
          var threadref = firebase.database().ref(uid+'/'+repoQueryParam);
threadref.on('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data)
  addthread(data)
});
            db.ref(`users/${uid}/repos/${repoQueryParam}`).set({
                repo: repoQueryParam,
                created: new Date(),
            });
            getRepoFiles(repoQueryParam);
            document.getElementById("no-repo-chosen").style.display = "none";
            
                  document.querySelector(".main--editor").style.display = "block";
        init();
       
        } else {
          document.getElementById("logo").onclick = "";
          document.querySelector(".main--editor").style.display = "block";
            document.getElementById("get-repo").style.display = "block";
            document.getElementById("repos_btn").style.display = "none";
            document.getElementById("editor-main-container").style.display = "none !important";
            document.getElementById("no-repo-chosen").style.display = "flex";
        }

        // Display user image


        if (user !== null) {
            user.providerData.forEach(providerData => {
                document.getElementById("user-image-editor").src = providerData.photoURL;
            });
        }
    } else {
        document.getElementById("no-repo-shadow").style.display = "flex";
        document.getElementById("sign-in").style.display = "flex";
        document.getElementById("no-repo-chosen").style.display = "none";
    }
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




let current_group;



function addthread(data){
  document.getElementById("git_files_cont").innerHTML=""
  var n = Object.keys(data);
  n.forEach((name) => {
    document.getElementById("git_files_cont").innerHTML += `<li><p class="thread_file_name"><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
">insert_drive_file</i>${data[name].filepath.split("/")[data[name].filepath.split("/").length - 1]}</p></li>`
  
    
    
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
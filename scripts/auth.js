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
function cloudUpload(e, i) {
    // Set the content of the editor in the Firebase database
    db.ref(e + "/" + repoName + "/" + btoa(i)).set({
        filepath: i,
        value: window.editor.getValue()
    });
}

/**
 * Adds a new file to the Firebase database and displays it in the UI.
 */
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

    let t = document.getElementById("root");
    t.remove();
    document.getElementById("root").innerHTML += `<li id="newly-added-file-${i}" type="file">
        <p onclick="gotofile('${i}');">
            <i class="material-icons mdc-button__icon" aria-hidden="true"> insert_drive_file </i>${i}
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
                        document.getElementById("search-repo-contents").innerHTML += `<div class="repo-info" onclick="k('${r}')"><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
"> commit </i><p>${r.split("/")[0]+" / "+r.split("/")[1]}</p></div>`
                    }
            }), new URL(location.href).searchParams.get("repo")) {
            var n = new URL(location.href).searchParams.get("repo");
            db.ref("users/" + t + "repos/" + n).set({
                repo: n,
                created: new Date
            }), getRepoFiles(n)
        } else document.getElementById("no-repo-shadow").style.display = "flex";
        document.querySelector(".main--editor").style.display = "block", init();
        var i = document.querySelector(".monaco-editor");
        void 0 !== i && null != i && (window.onresize = function() {
            editor.layout()
        }), null !== e && e.providerData.forEach(e => {
            document.getElementById("user-image-editor").src = e.photoURL
        })
    } else document.getElementById("no-repo-shadow").style.display = "flex", document.getElementById("sign-in").style.display = "flex", document.getElementById("get-repo").style.display = "none"
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

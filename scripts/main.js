/**
 * Initializes the Monaco editor and sets up its configuration.
 */
function init() {
    // Configure the paths for Monaco editor
    require.config({
        paths: {
            vs: "https://unpkg.com/monaco-editor@latest/min/vs"
        }
    });

    // Define the Monaco environment and worker URL
    window.MonacoEnvironment = {
        getWorkerUrl: () => workerURL
    };

    // Create a worker URL for Monaco editor
    let workerURL = URL.createObjectURL(new Blob([`
        self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `], {
        type: "text/javascript"
    }));

    // Load Monaco editor and set up its configuration
    require(["vs/editor/editor.main"], function() {
        window.editor = monaco.editor.create(document.getElementById("firepad-container"), {
            language: "python",
            minimap: {
                enabled: false
            },
            theme: "vs-dark"
        });

        // Get the current user and bind content change event
        let currentUser = firebase.auth().currentUser;
        window.editor.getModel().onDidChangeContent(e => {
            cloudUpload(currentUser.uid, fileName);
        });
    });
}


/**
 * This script contains a series of functions that interact with the GitHub API and perform various actions related to repositories, files, and deployment.
 * It allows users to retrieve repository contents, display them in a tree-like structure, view and edit file contents, and deploy files to Netlify.
 * The script is tightly integrated with Firebase for user authentication and data storage.
 */

// Global variables to store repository name, file name, and a list of files
let repoName, fileName, files = [];

/**
 * Retrieves and displays subfolders/files within a given repository directory.
 * @param {string} e - The URL of the GitHub API endpoint for the directory.
 * @param {string} t - The ID of the HTML element where subfolders/files should be displayed.
 */
function getSubFolder(e, t) {
    // ... (code for showing subfolders/files)
    
    let r = document.getElementById(t),
        i = r.querySelector(".subfolder");
    null !== i ? "none" == i.style.display ? i.style.display = "block" : i.style.display = "none" : fetch(e, {
        method: "GET",
        headers: {
            Authorization: "Bearer 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"
        }
    }).then(e => e.json()).then(e => displayFiles(e, t)).catch(e => console.error(e))

}

/**
 * Retrieves repository files and displays them as a tree-like structure.
 * @param {string} e - The name of the repository.
 */
function getRepoFiles(e) {
    // ... (code for fetching and displaying repository files)

    repoName = e, fetch(`https://api.github.com/repos/${e}/contents`, {
        method: "GET",
        headers: {
            Authorization: "Bearer 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"
        }
    }).then(e => e.json()).then(e => createTree(e, "root")).catch(e => console.error(e))

}

/**
 * Creates a tree-like structure to display repository contents.
 * @param {Array} e - An array containing repository content objects.
 * @param {string} t - The ID of the HTML element where the tree should be displayed.
 */
function createTree(e, t) {
    // ... (code for creating a tree structure to display repository contents)

    if (void 0 !== e.length) {
        let r = document.getElementById("root");
        r.remove()
    }
    document.getElementById("reponame").innerHTML = repoName.split("/")[1];
    var i = document.getElementById("output"),
        a = document.createElement("ul");
    a.setAttribute("id", t), e.forEach(function(e) {
        var t = document.createElement("li");
        t.setAttribute("id", e.sha), t.setAttribute("type", e.type);
        var r = document.createElement("p");
        "dir" == e.type ? (r.innerHTML = " <i class='material-icons mdc-button__icon' aria-hidden='true'> folder </i>" + e.name, r.setAttribute("onclick", `getSubFolder('${e.url}','${e.sha}');`)) : (r.innerHTML = " <i class='material-icons mdc-button__icon' aria-hidden='true'> insert_drive_file </i>" + e.name, r.setAttribute("onclick", `gotofile('${e.path}');`), files.push(e.path)), t.appendChild(r), a.appendChild(t)
    }), i.appendChild(a);
    let n = firebase.database().ref(),
        o = firebase.auth().currentUser;
    n.child("files-to-add/" + o.uid + "/" + repoName).get().then(e => {
        e.exists() && additionalfiles(e.val())
    }).catch(e => {
        console.error(e)
    })

}

/**
 * Displays repository files and subfolders in a given HTML element.
 * @param {Array} e - An array containing repository content objects.
 * @param {string} t - The ID of the HTML element where the content should be displayed.
 */
function displayFiles(e, t) {
    // ... (code for displaying repository files and subfolders)

    console.log(e, t);
    var r = document.getElementById(t),
        i = document.createElement("ul");
    i.setAttribute("class", "subfolder"), e.forEach(function(e) {
        var t = document.createElement("li");
        t.setAttribute("id", e.sha);
        var r = document.createElement("p");
        "dir" == e.type ? (r.innerHTML = " <i class='material-icons mdc-button__icon' aria-hidden='true'> folder </i>" + e.name, r.setAttribute("onclick", `getSubFolder('${e.url}','${e.sha}');`)) : (r.innerHTML = " <i class='material-icons mdc-button__icon' aria-hidden='true'> insert_drive_file </i>" + e.name, r.setAttribute("onclick", `gotofile('${e.path}');`), files.push(e.path)), t.appendChild(r), i.appendChild(t)
    }), r.appendChild(i)

}

/**
 * Retrieves the content of a specific file from a repository.
 * @param {string} e - The path of the file within the repository.
 */
function gotofile(e) {
    // ... (code for retrieving and displaying file content)

    fileName = e;
    let t = firebase.auth().currentUser,
        r = firebase.database().ref();
    r.child(t.uid).child(repoName).child(btoa(e)).get().then(t => {
        t.exists() ? window.editor.getModel().setValue(t.val().value) : fetch("https://api.github.com/repos/" + repoName + "/contents/" + e, {
            method: "GET"
        }).then(e => e.json()).then(e => window.editor.getModel().setValue(atob(e.content))).catch(e => console.error(e))
    }).catch(e => {
        console.error(e)
    })

}

/**
 * Retrieves repositories belonging to a specific user and displays them.
 */
function getrepos() {
    // ... (code for fetching and displaying user repositories)

    document.getElementById("search-repo-contents").innerHTML = "";
    var e = document.getElementById("ghuser").value;
    fetch(`https://api.github.com/users/${e}/repos`, {
        method: "GET",
        headers: {
            Authorization: "Bearer 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"
        }
    }).then(e => e.json()).then(t => {
        for (let r in t) document.getElementById("search-repo-contents").innerHTML += `<div class="repo-info" onclick="k('${e}/${t[r].name}')"><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
"> commit </i><p>${t[r].full_name.split("/")[0]+" / "+t[r].full_name.split("/")[1]}</p></div>`
    }).catch(e => console.error(e))

}

/**
 * Redirects to a URL containing repository information.
 * @param {string} e - The repository identifier in the format "username/repository".
 */
function k(e) {
    // ... (code for redirecting to a URL with repository information)

    window.location.replace("https://firescryptgithubio.adhvaithprasad.repl.co/?repo=" + e)

}

/**
 * Displays additional files associated with the user and repository.
 * @param {Object} e - An object containing additional file information.
 */
function additionalfiles(e) {
    // ... (code for displaying additional files)

    Object.keys(e).forEach(function(t) {
        console.log(e[t].file);
        var r = e[t].file;
        document.getElementById("root").innerHTML += `<li id="newly-added-file-${r}" type="file"><p onclick="gotofile('${r}');"> <i class="material-icons mdc-button__icon" aria-hidden="true"> insert_drive_file </i>${r}</p></li>`
    })

}

/**
 * Recursively fetches files from a GitHub repository.
 * @param {string} e - The URL of the GitHub API endpoint for the repository.
 * @param {Object} t - An object to store fetched file content.
 * @param {string} r - The name of the repository.
 */
async function fetchFilesRecursively(e, t, r) {
    // ... (code for recursively fetching files from a repository)

    console.log("preparing files for deployment .. ");
    try {
        let i = await fetch(e, {
                method: "GET",
                headers: {
                    Authorization: "Bearer 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"
                }
            }),
            a = await i.json(),
            n = firebase.auth().currentUser.uid;
        for (let o of a)
            if ("file" === o.type) {
                let l = await fetch(o.download_url),
                    s = await l.text(),
                    c = firebase.database().ref(n + "/" + r + "/" + btoa(o.path));
                c.once("value", function(e) {
                    e.exists() ? t[o.path] = e.val().value : t[o.path] = s
                })
            } else "dir" === o.type && await fetchFilesRecursively(o.url, t)
    } catch (d) {
        console.error("Error fetching data:", d)
    }

}

/**
 * Prepares and deploys repository files to Netlify.
 */
async function dov() {
    // ... (code for preparing and deploying files to Netlify)

    let e = new URL(location.href).searchParams.get("repo"),
        t = `https://api.github.com/repos/${e}/contents`;
    try {
        let r = {};
        await fetchFilesRecursively(t, r, e), console.log("file prepared for deployment", r);
        let i = await predeployToNetlify(generateString(10), r);
        i.success ? console.log(i) : console.log(i.error)
    } catch (a) {
        console.error("Error fetching data:", a)
    }

}

// ... (remaining functions for generating hash, deploying to Netlify, etc.)
async function generateSHA1Hash(e) {
    let t = new TextEncoder,
        r = t.encode(e),
        i = await crypto.subtle.digest("SHA-1", r),
        a = Array.from(new Uint8Array(i)),
        n = a.map(e => e.toString(16).padStart(2, "0")).join("");
    return n
}
async function deployToNetlify(e, t) {
    console.log("starting to deploy ..."), fetch("https://api.netlify.com/api/v1/sites/", {
        method: "GET",
        headers: {
            Authorization: "Bearer zu4xScy3hcSK_yLyAVqu0welMZRimGmMrGTn3NqDXOk"
        }
    }).then(e => e.json()).then(r => r.forEach(async r => {
        if (r.name === e) {
            siteid = r.id;
            let i = "https://api.netlify.com/api/v1/sites/" + siteid + "/deploys";
            var a = {};
            for (let n in t) {
                let o = t[n],
                    l = await generateSHA1Hash(o);
                a[`/${n}`] = l
            }
            let s = {
                files: a
            };
            try {
                let c = {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer zu4xScy3hcSK_yLyAVqu0welMZRimGmMrGTn3NqDXOk",
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(s)
                };
                console.log("site put up for deployment", {
                    f: s
                }), fetch(i, c).then(e => e.json()).then(e => uploadRequiredFiles(e.id, e.required, t)).catch(e => console.error(e))
            } catch (d) {
                return {
                    success: !1,
                    error: d.message
                }
            }
        }
    })).catch(e => console.error(e))
}
function generateString(e) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let t = " ",
        r = characters.length;
    for (let i = 0; i < e; i++) t += characters.charAt(Math.floor(Math.random() * r));
    return t
}
async function predeployToNetlify(e, t) {
    console.log("Creating site to deploy ...");
    let r = new Headers({
            Authorization: "Bearer zu4xScy3hcSK_yLyAVqu0welMZRimGmMrGTn3NqDXOk",
            "Content-Type": "application/json"
        }),
        i = {
            body: JSON.stringify({
                name: e
            })
        };
    try {
        let a = await fetch("https://api.netlify.com/api/v1/sites", {
                method: "POST",
                headers: r,
                body: i.body
            }),
            n = await a.json();
        return deployToNetlify(e, t), console.log("Site Created ...", e), {
            success: !0,
            name: n.name,
            url: n.url
        }
    } catch (o) {
        return {
            success: !1,
            error: o.message
        }
    }
}
async function uploadFile(e, t, r) {
    let i = `https://api.netlify.com/api/v1/deploys/${e}/files/${t}`,
        a = new Headers({
            Authorization: "Bearer zu4xScy3hcSK_yLyAVqu0welMZRimGmMrGTn3NqDXOk",
            "Content-Type": "application/octet-stream"
        });
    try {
        let n = await fetch(i, {
            method: "PUT",
            headers: a,
            body: r
        });
        if (n.ok) return !0;
        return console.error("File upload failed:", n.statusText), !1
    } catch (o) {
        return console.error("Error uploading file:", o), !1
    }
}
async function uploadRequiredFiles(e, t, r) {
    for (let i of t) {
        let a = findFilePathByHash(i, r);
        if (a) {
            let n = r[a],
                o = await uploadFile(e, a, n);
            o ? console.log(`Uploaded ${a}`) : console.log(`Failed to upload ${a}`)
        } else console.log(`No matching file found for hash ${i}`)
    }
}
function findFilePathByHash(e, t) {
    for (let r in t) {
        let i = t[r],
            a = calculateSHA1Hash(i);
        if (a === e) return r
    }
    return null
}
async function calculateSHA1Hash(e) {
    let t = new TextEncoder,
        r = t.encode(e),
        i = await crypto.subtle.digest("SHA-1", r),
        a = new Uint8Array(i),
        n = Array.from(a, e => e.toString(16).padStart(2, "0")).join("");
    return n
}

/**
 * Initializes the Monaco editor and sets up its configuration.
 */
let editorModels = {};
let filen;
let repoName, fileName, files = [];
let current_file = null;
let m1, m2, m3, m4;
function updatePosition() {

  const position = window.editor.getPosition();

  // Update the button text
  const button = document.getElementById('positionButton');
  button.innerHTML = `Line: ${position.lineNumber}, Column: ${position.column}`;
}
let parameters = [];
let addOrSwitchTab;
function init() {
  filetab()
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
      minimap: {
        enabled: false
      },
      theme: "vs-dark"
    });

    const tabContainer = document.getElementById('editor-header');


    // Function to create a new model for a file
    function createModel(fileName, content) {
      const model = monaco.editor.createModel(content, undefined, monaco.Uri.file(fileName));
      editorModels[fileName] = model;
      return model;
    }

    // Function to switch between tabs or add a new one if it doesn't exist
    addOrSwitchTab = function(fileName, content) {

      if (typeof fileName === "string") {
        filen = fileName
        if (!editorModels[fileName]) {
          const tab = document.createElement('div');
          tab.className = 'tab';
          tab.id = fileName + "--tab";
          tab.textContent = fileName.split("/")[fileName.split("/").length - 1];
          tab.addEventListener('click', () => {
            switchTab(fileName, fileName + "--tab");
          });

          tabContainer.appendChild(tab);
          createModel(fileName, content);
        }
        switchTab(fileName, fileName + "--tab");
      }
      else {

        if (!editorModels[fileName.name]) {
          filen = fileName.name
          const tab = document.createElement('div');
          tab.className = 'tab';
          tab.id = fileName.name + "--tab";
          tab.textContent = fileName.name.split("/")[fileName.name.split("/").length - 1];
          tab.addEventListener('click', () => {
            switchTab(fileName.name, fileName.name + "--tab");
          });

          tabContainer.appendChild(tab);
          createModel(fileName.name, content);
        }
        switchTab(fileName.name, fileName.name + "--tab");
      }


    };

    // Function to switch between tabs
    function switchTab(fileName, m) {
      const model = editorModels[fileName];
      filen = fileName
      if (model) {
        const activeTabs = document.querySelectorAll('.active-file-tab');

        // Iterate through the selected elements and remove the class
        activeTabs.forEach(tab => {
          tab.classList.remove('active-file-tab');
        });
        document.getElementById(m).classList.add("active-file-tab");
        window.editor.setModel(model);
      }
    };

    monaco.languages.register({ id: 'custom-lang' });

    // Add an event listener to update the button text on cursor position change
    window.editor.onDidChangeCursorPosition(updatePosition);

    // Initial update
    updatePosition();
    let currentUser = firebase.auth().currentUser;
    window.editor.onDidChangeModelContent((event) => {
      render(currentUser.uid, filen)
      console.log(currentUser.uid, filen)
    });




  });
}
const editorElement = document.querySelector(".monaco-editor");
if (editorElement !== undefined && editorElement !== null) {
  window.onresize = function() {
    wieditor.layout();
  };
}
function render(e, i) {
  // Debugging: Print out values for debugging
  console.log('e:', e);
  console.log('repoName:', repoName);
  console.log('i:', i);

  const editorValue = window.editor.getValue();
  console.log('editorValue:', editorValue);

  // Set the content of the editor in the Firebase database
  db.ref(e + "/" + repoName + "/" + btoa(i)).set({
    filepath: i,
    value: editorValue
  });
}
/**
 * This script contains a series of functions that interact with the GitHub API and perform various actions related to repositories, files, and deployment.
 * It allows users to retrieve repository contents, display them in a tree-like structure, view and edit file contents, and deploy files to Netlify.
 * The script is tightly integrated with Firebase for user authentication and data storage.
 */

// Global variables to store repository name, file name, and a list of files

/**
 * Retrieves and displays subfolders/files within a given repository directory.
 * @param {string} e - The URL of the GitHub API endpoint for the directory.
 * @param {string} t - The ID of the HTML element where subfolders/files should be displayed.
 */

function getSubFolder(u, n, e, t) {
  if (u === "u") {
    let r = document.getElementById(t),
      i = r.querySelector(".subfolder");
    null !== i ? "none" == i.style.display ? i.style.display = "block" : i.style.display = "none" : fetch(e, {
      method: "GET",

    }).then(e => e.json()).then(e => displayFiles(e, t, n)).catch(e => console.error(e))
  }

  else {
    const targetElement = document.getElementById(t);
    const subfolderElement = targetElement.querySelector(".subfolder");

    if (subfolderElement !== null) {
      if (subfolderElement.style.display === "none") {
        subfolderElement.style.display = "block";
      } else {
        subfolderElement.style.display = "none";
      }
    } else {
      jello(u, e, t, n);
    }
  }
}
function jello(n, t) {

  const targetElement = document.getElementById(t);
  const subfolderElement = targetElement.querySelector(".subfolder");

  if (subfolderElement !== null) {
    if (subfolderElement.style.display === "none") {
      subfolderElement.style.display = "block";
    } else {
      subfolderElement.style.display = "none";
    }
  } else {
    let k = firebase.database().ref(),
      o = firebase.auth().currentUser;
    k.child("content-added/" + repoName + "/" + o.uid + "/" + n).get().then(e => {
      console.log("content-added/" + repoName + "/" + o.uid + "/" + n)
      displaydbfiles(e.val(), n, t)
    })
  }


}


function displaydbfiles(m, n, t) {

  var j = Object.keys(m);
  console.log(j, n, t)
  var p = document.getElementById(t).querySelector(".subfolder");

  if (p) {
    console.log("subfolder present")
    j.forEach((f) => {
      if (typeof m[f].sha != "undefined") {
        if (m[f].path != "undefined") {


          var e = m[f];
          console.log(e.path);



          var t = document.createElement("li");
          t.setAttribute("id", e.sha);
          var r = document.createElement("p");
          if (e.type === "dir") {
            r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` + e.name + `
     
      <svg onclick="addsubfile('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `;
            r.setAttribute("onclick", `jello('${e.path}','${e.sha}');`)
          }
          else {

            r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>` + e.name; r.setAttribute("onclick", `gotofile('${e.path}');`);
            files.push(e.path)
          }

          t.appendChild(r)

          p.appendChild(t)
          console.log(r)




        }
      }
    })




  } else {




    console.log("subfolder not present")
    i = document.createElement("ul");
    i.setAttribute("class", "subfolder");
    j.forEach((f) => {
      if (typeof m[f].sha != "undefined") {
        if (m[f].path != "undefined") {

          var e = m[f];
          console.log(m[f].path);



          var y = document.createElement("li");
          y.setAttribute("id", e.sha);
          var r = document.createElement("p");
          if (e.type === "dir") {
            r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` + e.name + `
     
     <svg style="
    margin-right: 0px;
    margin-left: 10px;
" onclick="addsubfile('${e.path}','${e.sha}')" class=" sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `;
            r.setAttribute("onclick", `jello('${e.path}','${e.sha}');`)
          }
          else {
            r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>` + e.name; r.setAttribute("onclick", `gotofile('${e.path}');`);
            files.push(e.path)
          }

          y.appendChild(r)
          i.appendChild(y);
          document.getElementById(t).appendChild(i)
          console.log(r)



        }
      }
    })




  }
  // document.getElementById(n).innerHTML = ""




}
/**
 * Retrieves repository files and displays them as a tree-like structure.
 * @param {string} e - The name of the repository.
 */
function getRepoFiles(e) {
  // ... (code for fetching and displaying repository files)

  repoName = e, fetch(`https://api.github.com/repos/${e}/contents`, {
    method: "GET"
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


  var i = document.getElementById("output"),
    a = document.createElement("ul");
  a.innerHTML += `<div class="file-selector">
<div type=text id=repository onclick=download_zip()>
            <p id=reponame>${repoName.split("/")[1]}</p>
          </div>
<div>
<svg onclick="addfile()" class=" with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
        
           
<svg onclick="addfolder()" class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
</div>

           
           </div>`;
  a.setAttribute("id", t), e.forEach(function(e) {
    var t = document.createElement("li");
    t.setAttribute("id", e.sha), t.setAttribute("type", e.type);
    var r = document.createElement("p");
    "dir" == e.type ? (r.innerHTML = ` <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` + e.name + `
      
     <svg style="
    margin-right: 0px;
    margin-left: 10px;
" onclick="addsubfile('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg> 
      <svg onclick="addsubfolder('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `, r.setAttribute("onclick", `getSubFolder('u','${e.path}','${e.url}','${e.sha}');`)) : (r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>` + e.name, r.setAttribute("onclick", `gotofile('${e.path}');`), files.push(e.path)), t.appendChild(r), a.appendChild(t)
  }), i.appendChild(a);
  let n = firebase.database().ref(),
    o = firebase.auth().currentUser;
  n.child("files-to-add/" + o.uid + "/" + repoName).get().then(e => {
    e.exists() && additionalfiles(e.val(), "root")
  }).catch(e => {
    console.error(e)
  })
  n.child("folders-to-add/" + o.uid + "/" + repoName).get().then(e => {
    e.exists() && additionalfolders(e.val(), "root")
  }).catch(e => {
    console.error(e)
  })
}

/**
 * Displays repository files and subfolders in a given HTML element.
 * @param {Array} e - An array containing repository content objects.
 * @param {string} t - The ID of the HTML element where the content should be displayed.
 */
function displayFiles(e, t, n) {


  var r = document.getElementById(t),
    i = document.createElement("ul");
  i.setAttribute("class", "subfolder"), e.forEach(function(e) {
    var t = document.createElement("li");
    t.setAttribute("id", e.sha);
    var r = document.createElement("p");
    "dir" == e.type ? (r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` + e.name + `
    
<svg style="
    margin-right: 0px;
    margin-left: 10px;
" onclick="addsubfile('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${e.path}','${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `, r.setAttribute("onclick", `getSubFolder('u','${e.path}','${e.url}','${e.sha}');`)) : (r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>` + e.name, r.setAttribute("onclick", `gotofile('${e.path}');`), files.push(e.path)), t.appendChild(r), i.appendChild(t)
  }), r.appendChild(i)


  let j = firebase.database().ref(),
    o = firebase.auth().currentUser;
  j.child("content-added/" + repoName + "/" + o.uid + "/" + n).get().then(k => {

    displaydbfiles(k.val(), n, t)
  })

}

function gotofile(e) {
  // ... (code for retrieving and displaying file content)

  let fileName = e;
  console.log(fileName);
  let currentUser = firebase.auth().currentUser;
  let databaseRef = firebase.database().ref();

  databaseRef.child(currentUser.uid).child(repoName).child(btoa(e)).get().then(snapshot => {
    if (snapshot.exists()) {
      setval(e, snapshot.val().value);
    } else {
      fetch("https://api.github.com/repos/" + repoName + "/contents/" + e, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => setval(e, atob(data.content)))
        .catch(error => setval(e, ""));
    }
  }).catch(error => {
    console.error(error);
  });
}



function setval(fn, fv) {
  addOrSwitchTab(fn, fv);
  console.log(fn, fv)
}



/**
 * Retrieves repositories belonging to a specific user and displays them.
 */
function getrepos() {
  // ... (code for fetching and displaying user repositories)

  document.getElementById("search-repo-contents").innerHTML = "";
  var e = document.getElementById("ghuser").value;
  fetch(`https://api.github.com/users/${e}/repos`, {
    method: "GET"

  }).then(e => e.json()).then(t => {
    for (let r in t) document.getElementById("search-repo-contents").innerHTML += `<div class="repo-info" onclick="km('${e}/${t[r].name}')"><i class="material-icons mdc-button__icon" aria-hidden="true" style="
    margin-right: 10px;
"> commit </i><p>${t[r].full_name.split("/")[0] + " / " + t[r].full_name.split("/")[1]}</p></div>`
  }).catch(e => console.error(e))

}

/**
 * Redirects to a URL containing repository information.
 * @param {string} e - The repository identifier in the format "username/repository".
 */


/**
 * Displays additional files associated with the user and repository.
 * @param {Object} e - An object containing additional file information.
 */
function additionalfiles(e, m) {
  // ... (code for displaying additional files)

  Object.keys(e).forEach(function(t) {
    console.log(e[t].file);
    var r = e[t].file;
    document.getElementById(m).innerHTML += `<li id="newly-added-file-${r}" type="file"><p onclick="gotofile('${r}');"> <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>${r}</p></li>`
  })


}
function additionalfolders(e, m) {
  // ... (code for displaying additional files)

  Object.keys(e).forEach(function(t) {
    console.log(e[t].file);
    var r = e[t].file;
    document.getElementById(m).innerHTML += `<li id="newly-added-folder-${r}" type="dir"><p onclick="jello('${r}','newly-added-folder-${r}','newly-added-folder-${r}')"> <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>${r}
<svg style="
    margin-right: 0px;
    margin-left: 10px;
"  onclick="addsubfile('${r}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>

<svg onclick="addsubfolder('${r}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
</p></li>`
  })

}

/**
 * Recursively fetches files from a GitHub repository.
 * @param {string} e - The URL of the GitHub API endpoint for the repository.
 * @param {Object} t - An object to store fetched file content.
 * @param {string} r - The name of the repository.
 */


/**
 * Prepares and deploys repository files to Netlify.
 */





function redirecttorepo(e) {
  // ... (code for redirecting to a URL with repository information)

  window.location.replace("/?repo=" + e)

}
function switchTab(element) {
  // Remove the 'activetab' class from all elements with the class 'activetab'
  const activeTabs = document.querySelectorAll('.activetab');
  activeTabs.forEach(tab => tab.classList.remove('activetab'));

  // Add the 'activetab' class to the calling element
  element.classList.add('activetab');
}


function filetab() {
  const element = document.querySelector('.filetab');
  switchTab(element);
  document.getElementById("root").style.display = "block";
 
  document.getElementById("git_cont").style.display = "none";

  document.getElementById("editor-main-container").style.display = "block";

}

function gittab() {
  const element = document.querySelector('.gittab');
  switchTab(element);
  document.getElementById("root").style.display = "none";
 
  document.getElementById("git_cont").style.display = "block";

  document.getElementById("editor-main-container").style.display = "block";

}



function gotoline() {
  editor?.focus();
  const action = editor?.getAction("editor.action.gotoLine");
  void action?.run();
}
function format() {
  editor?.focus();
  const action = editor?.getAction("editor.action.formatDocument");
  void action?.run();
}
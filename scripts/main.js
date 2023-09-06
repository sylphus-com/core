/**
 * Initializes the Monaco editor and sets up its configuration.
 */
 function updatePosition() {
            
            const position = window.editor.getPosition();
            
            // Update the button text
            const button = document.getElementById('positionButton');
            button.innerHTML = `Line: ${position.lineNumber}, Column: ${position.column}`;
        }
let parameters=[];
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
     const editorModels = {};

    // Function to create a new model for a file
    function createModel(fileName, content) {
        const model = monaco.editor.createModel(content, 'javascript');
        editorModels[fileName] = model;
        return model;
    }

    // Function to switch between tabs or add a new one if it doesn't exist
    addOrSwitchTab = function (fileName, content) {
        if (!editorModels[fileName]) {
            const tab = document.createElement('div');
            tab.className = 'tab';
            tab.textContent = fileName.split("/")[fileName.split("/").length - 1];
            tab.addEventListener('click', () => {
                switchTab(fileName);
            });

            tabContainer.appendChild(tab);
            createModel(fileName, content);
        }
        switchTab(fileName);
    };

    // Function to switch between tabs
    function switchTab(fileName) {
        const model = editorModels[fileName];
        if (model) {
            editor.setModel(model);
        }
    };
    monaco.languages.register({ id: 'custom-lang' });

  // Add an event listener to update the button text on cursor position change
            window.editor.onDidChangeCursorPosition(updatePosition);

            // Initial update
            updatePosition();
    let currentUser = firebase.auth().currentUser;
    window.editor.getModel().onDidChangeContent((event) => {
      render(currentUser.uid, fileName)
    });

    window.editor.addAction({
      // An unique identifier of the contributed action.
      id: "add-review-label",

      // A label of the action that will be presented to the user.
      label: "Add thread",

      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
        // chord
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK
        ),
      ],

      // A precondition for this action.
      precondition: null,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,

      contextMenuGroupId: "navigation",

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convenience
      run: function(ed) {
        createThread(ed)
      },
    });
    // Function to add overlay widget

    // Get the current user and bind content change event


  });
}

function render(e, i) {
  // Set the content of the editor in the Firebase database
  console.log(e, i)
  db.ref(e + "/" + repoName + "/" + btoa(i)).set({
    filepath: i,
    value: window.editor.getValue()
  });
}
/**
 * This script contains a series of functions that interact with the GitHub API and perform various actions related to repositories, files, and deployment.
 * It allows users to retrieve repository contents, display them in a tree-like structure, view and edit file contents, and deploy files to Netlify.
 * The script is tightly integrated with Firebase for user authentication and data storage.
 */

// Global variables to store repository name, file name, and a list of files
let repoName, fileName, files = [];
let current_file = null;
let m1,m2,m3,m4 ;
/**
 * Retrieves and displays subfolders/files within a given repository directory.
 * @param {string} e - The URL of the GitHub API endpoint for the directory.
 * @param {string} t - The ID of the HTML element where subfolders/files should be displayed.
 */

function getSubFolder(u,e,t){
  if(u === "u"){
  let r = document.getElementById(t),
    i = r.querySelector(".subfolder");
  null !== i ? "none" == i.style.display ? i.style.display = "block" : i.style.display = "none" : fetch(e, {
    method: "GET",
   
  }).then(e => e.json()).then(e => displayFiles(e, t)).catch(e => console.error(e))
}
    
  else{
     let r = document.getElementById(t),
    i = r.querySelector(".subfolder");
  null !== i ? "none" == i.style.display ? i.style.display = "block" : i.style.display = "none" : jello(u,e,t)
  }
}
function jello(u,e,t){
  let n = firebase.database().ref(),
    o = firebase.auth().currentUser;
  n.child("subfolder-files-to-add/" + o.uid + "/" + t).get().then(e => {
   
    displaydbfiles(e.val(),t)
  })
}


function displaydbfiles(m,n){
  var j = Object.keys(m);
  var p = document.getElementById(n).querySelector(".subfolder");
  if(p){
    console.log("subfolder present")
    j.forEach((f) => {
    var e = m[f];
    console.log(e,n);
    
     
   
    var t = document.createElement("li");
    t.setAttribute("id", e.sha);
    var r = document.createElement("p");
    if(e.type === "dir"){
      r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` + e.name +`
     
      <svg onclick="addsubfile('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `;
      r.setAttribute("onclick", `getSubFolder('d',' ','${e.sha}');`)
    }
    else{
     
      r.innerHTML = " <i class='material-icons mdc-button__icon' aria-hidden='true'> description </i>" + e.name; r.setAttribute("onclick", `gotofile('${e.path}');`);
      files.push(e.path)
    }
    
    t.appendChild(r)
    
    p.appendChild(t)
    console.log(r)
    
     
  })
  }else{
     console.log("subfolder not present")
  i = document.createElement("ul");
  i.setAttribute("class", "subfolder");
    j.forEach((f) => {
    var e = m[f];
    console.log(e,n);
    
     
   
    var t = document.createElement("li");
    t.setAttribute("id", e.sha);
    var r = document.createElement("p");
    if(e.type === "dir"){
      r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>`+ e.name +`
     
     <svg style="
    margin-right: 0px;
    margin-left: 10px;
" onclick="addsubfile('${e.sha}')" class=" sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `;
      r.setAttribute("onclick", `getSubFolder('d',' ','${e.sha}');`)
    }
    else{
      r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>` + e.name; r.setAttribute("onclick", `gotofile('${e.path}');`);
      files.push(e.path)
    }
    
    t.appendChild(r)
    i.appendChild(t);
    document.getElementById(n).appendChild(i)
    console.log(r)
    
     
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
    method: "GET").then(e => e.json()).then(e => createTree(e, "root")).catch(e => console.error(e))

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
 a.innerHTML +=`<div class="file-selector">

<svg onclick="addfile()" class=" with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
        
           
<svg onclick="addfolder()" class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>

           
           </div>`;
  a.setAttribute("id", t), e.forEach(function(e) {
    var t = document.createElement("li");
    t.setAttribute("id", e.sha), t.setAttribute("type", e.type);
    var r = document.createElement("p");
    "dir" == e.type ? (r.innerHTML = ` <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` + e.name+`
      
     <svg style="
    margin-right: 0px;
    margin-left: 10px;
" onclick="addsubfile('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg> 
      <svg onclick="addsubfolder('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `, r.setAttribute("onclick", `getSubFolder('u','${e.url}','${e.sha}');`)) : (r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>`+ e.name, r.setAttribute("onclick", `gotofile('${e.path}');`), files.push(e.path)), t.appendChild(r), a.appendChild(t)
  }), i.appendChild(a);
  let n = firebase.database().ref(),
    o = firebase.auth().currentUser;
  n.child("files-to-add/" + o.uid + "/" + repoName).get().then(e => {
    e.exists() && additionalfiles(e.val(),"root")
  }).catch(e => {
    console.error(e)
  })
  n.child("folders-to-add/" + o.uid + "/" + repoName).get().then(e => {
    e.exists() && additionalfolders(e.val(),"root")
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
  
console.log(e, t);
  var r = document.getElementById(t),
    i = document.createElement("ul");
  i.setAttribute("class", "subfolder"), e.forEach(function(e) {
    var t = document.createElement("li");
    t.setAttribute("id", e.sha);
    var r = document.createElement("p");
    "dir" == e.type ? (r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>` +e.name+`
    
<svg style="
    margin-right: 0px;
    margin-left: 10px;
" onclick="addsubfile('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
      <svg onclick="addsubfolder('${e.sha}')" class="sub_folder_icon with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
      `, r.setAttribute("onclick", `getSubFolder('u','${e.url}','${e.sha}');`)) : (r.innerHTML = `<svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>` + e.name, r.setAttribute("onclick", `gotofile('${e.path}');`), files.push(e.path)), t.appendChild(r), i.appendChild(t)
  }), r.appendChild(i)
  
 
     let n = firebase.database().ref(),
    o = firebase.auth().currentUser;
  n.child("subfolder-files-to-add/" + o.uid + "/" + t).get().then(k => {
    console.log(k.val(),t)
    displaydbfiles(k.val(),t)
  }) 

}

function gotofile(e) {
  // ... (code for retrieving and displaying file content)

  fileName = e;
  console.log(fileName)
  let t = firebase.auth().currentUser,
    r = firebase.database().ref();
  r.child(t.uid).child(repoName).child(btoa(e)).get().then(t => {
    t.exists() ? setval(e, t.val().value) : fetch("https://api.github.com/repos/" + repoName + "/contents/" + e, {
      method: "GET"
    }).then(e => e.json()).then(e => setval(e, atob(e.content))).catch(e => console.error(e))
  }).catch(e => {
    console.error(e)
  })

}


function setval(fn, fv) {
  addOrSwitchTab(fn, fv);
  console.log(fileName)
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
function additionalfiles(e,m) {
  // ... (code for displaying additional files)

  Object.keys(e).forEach(function(t) {
    console.log(e[t].file);
    var r = e[t].file;
    document.getElementById(m).innerHTML += `<li id="newly-added-file-${r}" type="file"><p onclick="gotofile('${r}');"> <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>${r}</p></li>`
  })


}
function additionalfolders(e,m) {
  // ... (code for displaying additional files)

  Object.keys(e).forEach(function(t) {
    console.log(e[t].file);
    var r = e[t].file;
    document.getElementById(m).innerHTML += `<li id="newly-added-folder-${r}" type="dir"><p onclick="getSubFolder('d','','newly-added-folder-${r}','newly-added-folder-${r}')"> <svg class="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style="color:var(--geist-foreground);width:24px;height:24px"><path d="M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662"/></svg>${r}
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
async function fetchFilesRecursively(e, t, r) {
  // ... (code for recursively fetching files from a repository)

  console.log("preparing files for deployment .. ");
  try {
    let i = await fetch(e, {
      method: "GET"
     
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
  console.log("starting to deploy ...");
  fetch("https://api.netlify.com/api/v1/sites/", {
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
      const c = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer zu4xScy3hcSK_yLyAVqu0welMZRimGmMrGTn3NqDXOk',
          'Content-Type': ''
        },
        body: JSON.stringify(s)
      };

      fetch(i, c)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    }
  })).catch(e => console.error(e))
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
    deployToNetlify(e, t)
    return console.log("Site Created ...", e, t), {
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
async function download_zip() {
  let r = {};
  let e = new URL(location.href).searchParams.get("repo"),
    t = `https://api.github.com/repos/${e}/contents`;
  await fetchFilesRecursively(t, r, e), console.log("files to zip ", r);
  downloadZip(r)
}
// Function to create and download the zip file
function downloadZip(jsonData) {
  var zip = new JSZip();

  // Loop through the JSON data and add files to the zip
  for (var filepath in jsonData) {
    if (jsonData.hasOwnProperty(filepath)) {
      var content = jsonData[filepath];
      var parts = filepath.split('/');
      var currentFolder = zip;

      // Create folders if necessary
      for (var i = 0; i < parts.length - 1; i++) {
        currentFolder = currentFolder.folder(parts[i]);
      }

      // Add the file to the current folder
      currentFolder.file(parts[parts.length - 1], content);
    }
  }
  var e = new URL(location.href).searchParams.get("repo").split("/")[1] + ".zip";
  // Generate the zip blob and initiate download
  zip.generateAsync({ type: "blob" }).then(function(content) {
    saveAs(content, e);
  });
}
function show_repos() {
  var x = document.getElementById('get-repo');
  var y = document.getElementById('logo').classList;
  if (x.style.display === 'none') {
    x.style.display = 'block';
    y.add("repo-btn-active")
  } else {
    x.style.display = 'none';
    y.remove("repo-btn-active")
  }

}
let thread_function;
function createThread(ed) {
  document.getElementById("thread_content").value = "";
  document.getElementById("create_thread_cont").style.display = "flex";
  thread_function = ed
}
function cancelThread() {
  document.getElementById("thread_content").value = "";
  document.getElementById("create_thread_cont").style.display = "none";
}
function sendthread() {
  console.log(fileName)
  var ed = thread_function;
  var thread = document.getElementById("thread_content").value;
  var file = fileName;
  console.log("p:", ed, "t", thread, "f", file)
  var linenumber = ed.getPosition().lineNumber;
  var threadid = generateString(8);
  var thread = { "file": file, "lineNumber": linenumber, "content": getContentOfLine(linenumber), "thread": thread }
  firebase.database().ref("threads/" + repoName + "/" + btoa(file)).push(thread);
  console.log(thread)
  cancelThread()
}
function deletethread(id, file) {
  var ref = "threads/" + repoName + "/" + btoa(file) + "/" + id;
  firebase.database().ref(ref).remove()
}
function getContentOfLine(lineNumber) {
  var model = window.editor.getModel();
  if (model) {
    var lineContent = model.getLineContent(lineNumber);
    return lineContent;
  }
}
function km(e) {
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

function reviewtab() {
   const element = document.querySelector('.reviewtab');
  switchTab(element);
  document.getElementById("root").style.display = "none";
  document.getElementById("review_cont").style.display = "block";
  document.getElementById("chat_cont").style.display = "none";
  // document.getElementById("filetab").classList.remove("file-tab-active");
  // document.getElementById("chattab").classList.remove("file-tab-active");
  // document.getElementById("reviewtab").classList.add("file-tab-active");
}
function filetab() {
  const element = document.querySelector('.filetab');
  switchTab(element);
  document.getElementById("root").style.display = "block";
  document.getElementById("review_cont").style.display = "none";
  document.getElementById("chat_cont").style.display = "none";
  // document.getElementById("filetab").classList.add("file-tab-active");
  // document.getElementById("reviewtab").classList.remove("file-tab-active");
  // document.getElementById("chattab").classList.remove("file-tab-active");
  document.getElementById("editor-main-container").style.display = "block";
  document.getElementById("api-editor").style.display = "none";
   document.getElementById("chat-container").style.display = "none";
}
function chattab(){
  const element = document.querySelector('.chattab');
  switchTab(element);
    document.getElementById("root").style.display = "none";
  document.getElementById("review_cont").style.display = "none";
  document.getElementById("chat_cont").style.display = "block";

  document.getElementById("editor-main-container").style.display = "none";
  document.getElementById("chat-container").style.display = "flex";
}
function apitab() {
  const element = document.querySelector('.apitab');
  switchTab(element);
   document.getElementById("chat-container").style.display = "none";
  if(document.getElementById("api-editor").style.display === "flex"){
    document.getElementById("api-editor").style.display="none";
    
     document.getElementById("firepad-container").style.display = "block";
  }
  else{
    
document.getElementById("api-editor").style.display = "flex";
    document.getElementById("firepad-container").style.display = "none";
  // Configure the paths for Monaco editor
  require.config({
    paths: {
      vs: "https://unpkg.com/monaco-editor@latest/min/vs"
    }
  });
  window.MonacoEnvironment = {
    getWorkerUrl: () => workerURL
  };
  let workerURL = URL.createObjectURL(new Blob([`
        self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `], {
    type: "text/javascript"
  }));
  if(window.parameter_editor){
    //h
  }
  else{
      
    require(["vs/editor/editor.main"], function() {

    window.parameter_editor = monaco.editor.create(document.getElementById("parameter-editor"), {
      minimap: {
        enabled: false
      },
      theme: "vs-dark"
    });

   
    m3 = monaco.editor.createModel("","json");
  
   parametertab()
  });
  
  }

  

  }
}

function parametertab(){
  document.getElementById("body-tab").classList.remove("file-tab-active");
  document.getElementById("auth-tab").classList.remove("file-tab-active");
  document.getElementById("header-tab").classList.remove("file-tab-active");
  document.getElementById("parameter-tab").classList.add("file-tab-active");
  document.getElementById("parameter-editor").style.display = "none";
  document.getElementById("header-editor").style.display = "block";
}
function bodytab(){
    document.getElementById("parameter-editor").style.display = "block";
    document.getElementById("body-tab").classList.add("file-tab-active");
  document.getElementById("auth-tab").classList.remove("file-tab-active");
  document.getElementById("header-tab").classList.remove("file-tab-active");
  document.getElementById("parameter-tab").classList.remove("file-tab-active");
  document.getElementById("header-editor").style.display = "none";
  window.parameter_editor.setModel(m3)
}
function headertab(){
    document.getElementById("body-tab").classList.remove("file-tab-active");
  document.getElementById("auth-tab").classList.remove("file-tab-active");
  document.getElementById("header-tab").classList.add("file-tab-active");
  document.getElementById("parameter-tab").classList.remove("file-tab-active");
    document.getElementById("parameter-editor").style.display = "none";
 document.getElementById("header-editor").style.display = "none";
}
function authtab(){
    document.getElementById("body-tab").classList.remove("file-tab-active");
  document.getElementById("auth-tab").classList.add("file-tab-active");
  document.getElementById("header-tab").classList.remove("file-tab-active");
  document.getElementById("parameter-tab").classList.remove("file-tab-active");
    document.getElementById("parameter-editor").style.display = "none";
  document.getElementById("header-editor").style.display = "none";
}
function add_parameter(){
    var id = generateString(10).split(" ").join("");
  var keyid="key-"+id;
  var valid="value-"+id;
  var model = document.createElement('div');
  model.setAttribute("id", id);
  model.setAttribute("class", "parameter-content");
  model.innerHTML =`
        <input id="${keyid}" type="text" placeholder="Parameter" style="
   
    border: 1px solid #80808075;
">
    <input id="${valid}" type="text" placeholder="value" style="
    border: 1px solid #80808075;
   
">`

  parameters.push(id);
  document.getElementById("header-editor").appendChild(model);
  console.log(parameters);
}
function get_api(){
  var j = parameters;
  var n ="?";
  var c=0
  var m = j.length
  j.forEach((m) => {
    var parameter = document.getElementById("key-"+m).value;
    var value = document.getElementById("value-"+m).value;
    c += 1;
    if(parameter && value){
      if(1 === c){
      n=n+parameter+"="+value
    }else{
      n=n+"&"+parameter+"="+value
    }
    }

  })
   console.log(n)
}
function add_category(){
  var m_channel_name = "General";
  var f_channel_name = prompt("Category");
  var thread = { "name": m_channel_name , "id":generateString(9)}
  firebase.database().ref("chats/" + repoName + "/"+f_channel_name).push(thread);
  console.log(thread)
}
function add_channel(m){
  var f_channel_name = m;
  var m_channel_name = prompt("Channel");
  var thread = { "name": m_channel_name ,"id":generateString(9)}
  firebase.database().ref("chats/" + repoName + "/"+f_channel_name).push(thread);
  console.log(thread)
}
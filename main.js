var OtherP4 = require("p4-oo"); // use both libs because neither quite does what we need
const { P4 } = require("p4api");
const { app, BrowserWindow, ipcMain } = require('electron');

let p4 = new P4();
let AltP4 = new OtherP4();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  ipcMain.on("get-diff", (event, arg) => {
    let diffData;
    // console.log("describe -df " + arg);
    p4.cmd("describe -df " + arg)
      .then(function (out) {
          let describeResult = out.stat[0];
          // console.log(describeResult);
          let allDiffs = [];
          let suffix = 0;
          let completedCommands = 0;
          let fileToDiff = describeResult["depotFile" + suffix];
          // console.log("depotFile" + suffix)
          while (fileToDiff) {
            let revision = parseInt(describeResult['rev' + suffix]);
            if (revision && revision > 0)
            {
              let compareVersionsCommand = "diff2 " + fileToDiff + "#" + revision + " " + fileToDiff + "#" + (revision-1);
              // console.log(compareVersionsCommand);
              // use the alternative p4 wrapper
              AltP4.runCommand(compareVersionsCommand, function(err, diffResult) {
                  diffResult = diffResult.replace(/(^\<\s)/gm, "- ")
                  diffResult = diffResult.replace(/(^\>\s)/gm, "+ ")
                  diffResult = diffResult.replace(/\(text\)\s\-/gm, "b/");
                  diffResult = diffResult.replace("==== ", "a/");
                  diffResult = diffResult.replace("====", "");
                  diffResult = diffResult.replace(/\(text\)\s/gm, "\n--- a/" + this + "\n+++ b/" + this);
                  diffResult = diffResult.replace("content", "");
                  //diffResult = diffResult.replace(/\s\-\-/gm, "")
                  diffResult = "diff --git " + diffResult;
                  allDiffs.push(diffResult);
                  completedCommands++;
              }.bind(fileToDiff)); 
            }

            suffix++;
            fileToDiff = describeResult["depotFile" + suffix];
          }

          let pollCompletion = () => {
            if (completedCommands < suffix)
            {
              setTimeout(pollCompletion, 100);
            }
            else {
              win.webContents.send('send-diff', {changeNumber: arg, diffs: allDiffs});
              console.log(allDiffs)
            }
          }
          pollCompletion();
      });
  });

  p4.cmd("changelists")
  .then(function (out) {
    if (out.stat && out.stat.length) {
      win.webContents.send('store-data', out.stat);
    }
  }, function (err) {
    throw ("p4 not found");
  });

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
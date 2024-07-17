var vscode = require("vscode");
var beeScript = require("./source/beeMovieScript.js");

var scriptLine = beeScript.scriptLine;
var scriptPara = beeScript.scriptPara;

function activate(context) {
  var commands = [
    vscode.commands.registerCommand("jazz.line", insertLine),
    vscode.commands.registerCommand("jazz.para", insertPara),
    vscode.commands.registerCommand("jazz.multiplePara", insertMultiPara),
    vscode.commands.registerCommand("jazz.snippet", insertSnippet) // New command(ADDED CHANGES)
  ];

  // Register all commands
  commands.forEach(function (command) {
    context.subscriptions.push(command);
  });

  // Register an event listener for document save
  vscode.workspace.onDidSaveTextDocument(detectAndReplacePrefixes); // New event listener(ADDED CHANGES)
}

function insertText(value, totalParas) {
  var editor = vscode.window.activeTextEditor;
  editor.edit((edit) =>
    editor.selections.forEach((selection) => {
      edit.delete(selection);
      // Pick a line at random
      if (value === "line") {
        let randomLine =
          scriptLine[Math.floor(Math.random() * scriptLine.length)];
        edit.insert(selection.start, randomLine);
      }
      // Pick a para at random
      if (value === "para") {
        let randomPara =
          scriptPara[Math.floor(Math.random() * scriptPara.length)];
        edit.insert(selection.start, randomPara);
      }
      // Pick multiple random paras
      if (value === "multiPara") {
        for (let i = 0; i < totalParas; i++) {
          let randomPara =
            scriptPara[Math.floor(Math.random() * scriptPara.length)] + "\n\n";
          edit.insert(selection.start, randomPara);
        }
      }
    })
  );
}

function insertLine() {
  insertText("line");
}

function insertPara() {
  insertText("para");
}

async function insertMultiPara() {
  const countList = [];
  for (let i = 2; i <= 5; i++) {
    countList.push(i.toString());
  }

  const totalParas = await vscode.window.showQuickPick(countList, {
    placeHolder: "Select number of paras to insert",
  });

  insertText("multiPara", totalParas);
}

function insertSnippet() {
  detectAndReplacePrefixes(vscode.window.activeTextEditor.document);
}

function detectAndReplacePrefixes(document) {
  var editor = vscode.window.activeTextEditor;
  var text = document.getText();

  editor.edit((editBuilder) => {
    var regexLine = /!jazzline/g;
    var regexPara = /!jazzpara/g;
    var match;

    // Replace all !jazzline with a random line
    while ((match = regexLine.exec(text)) !== null) {
      let randomLine = scriptLine[Math.floor(Math.random() * scriptLine.length)];
      let range = new vscode.Range(
        document.positionAt(match.index),
        document.positionAt(match.index + match[0].length)
      );
      editBuilder.replace(range, randomLine);
    }

    // Replace all !jazzpara with a random paragraph
    while ((match = regexPara.exec(text)) !== null) {
      let randomPara = scriptPara[Math.floor(Math.random() * scriptPara.length)];
      let range = new vscode.Range(
        document.positionAt(match.index),
        document.positionAt(match.index + match[0].length)
      );
      editBuilder.replace(range, randomPara);
    }
  });
}

exports.activate = activate;

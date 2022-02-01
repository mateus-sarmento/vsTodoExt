// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

const decorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: "green",
	border: "1px solid white"
  });

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = "$(beaker) Add todo";
	item.command = 'vstoDo.addTodo';
	item.show();

  	context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      	"vstodo-sidebar",
      	sidebarProvider
    	)
  	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vstoDo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello from vsTodo!!');
		HelloWorldPanel.createOrShow(context.extensionUri);
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('vstoDo.askQuestion', async () => { 

		const asnwer = await vscode.window.showInformationMessage("How was your day?", "Good", "Bad");
		
		let ansMsg = "";

		if(asnwer === "Bad"){
			ansMsg = "Sorry to hear that";
		}
		else if(asnwer === "Good"){
			ansMsg = "Good, keep it going";
		}
		
		vscode.window.showInformationMessage(ansMsg);
	});

	context.subscriptions.push(disposable2);

	context.subscriptions.push(
		vscode.commands.registerCommand("vstoDo.addTodo", () => {
			const {activeTextEditor} = vscode.window
			if(!activeTextEditor) {
				vscode.window.showInformationMessage("No active selection");
				return;
			}

			const text = activeTextEditor.document.getText(activeTextEditor.selection);
			decorate(activeTextEditor)
			sidebarProvider._view?.webview.postMessage({type: 'new-todo', value: text},)
		});
	);
	
}

function decorate(editor: vscode.TextEditor) {
	let sourceCode = editor.document.getText();
	let regex = /(console\.log)/;
  
	let decorationsArray: vscode.DecorationOptions[] = [];

	let myRange = new vscode.Range(
		new vscode.Position(1, 0),
		new vscode.Position(1, 100)
	  );
	let deco = { myRange };
	

	const sourceCodeArr = sourceCode.split("\n");
  
	for (let line = 0; line < sourceCodeArr.length; line++) {
	  let match = sourceCodeArr[line].match(regex);
  
	  if (match !== null && match.index !== undefined) {
		let range = new vscode.Range(
		  new vscode.Position(line, match.index),
		  new vscode.Position(line, match.index + 100)
		);
		
		
		let decoration = { range };
		
		decorationsArray.push(decoration);
	  }
	}
	
	decorationsArray.push(deco);
	console.log({decorationsArray});
	editor.setDecorations(decorationType, decorationsArray);
}

// this method is called when your extension is deactivated
export function deactivate() {}

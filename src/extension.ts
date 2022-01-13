// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const sidebarProvider = new SidebarProvider(context.extensionUri);
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
	
}

// this method is called when your extension is deactivated
export function deactivate() {}

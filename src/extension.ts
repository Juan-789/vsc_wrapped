// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

async function saveDiagnosticsStat(context: vscode.ExtensionContext, newEntry: any) {
	const fileUri = vscode.Uri.joinPath(context.globalStorageUri, 'codestats.json');

	await vscode.workspace.fs.createDirectory(context.globalStorageUri);
	let existing: any[] = [];

	try {
		const data = await vscode.workspace.fs.readFile(fileUri);
		existing = JSON.parse(data.toString());
	} catch (e) {
		console.log('No existing file foung. Creating new one.');
	}
	
	existing.push(newEntry);

	await vscode.workspace.fs.writeFile(fileUri, Buffer.from(JSON.stringify(existing, null, 2)));
}

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscwrapped" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscwrapped.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	context.subscriptions.push(disposable);

	const writingToFile = vscode.commands.registerCommand('vscwrapped.saveStats', () =>{
		const currentFile = vscode.window.activeTextEditor;
		console.log(currentFile?.document.fileName);
		if (currentFile) {
			// const uri = currentFile.document.uri;
			const diagnostics = vscode.languages.getDiagnostics();
			diagnostics.forEach(([uri, diagnosticArray]) => {
				diagnosticArray.forEach(diagnostic => {
					vscode.window.showInformationMessage(diagnostic.message);
					saveDiagnosticsStat(context, diagnostic.message);
				});
				// const dis2 = vscode.commands.registerCommand('vscwrapped.helloWorld', () => {
				// 	vscode.window.showInformationMessage(diagnostic.message);
			});
		}
	});
	
}

// This method is called when your extension is deactivated
export function deactivate() {}

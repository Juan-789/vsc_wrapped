// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { timeStamp } from 'console';
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
		console.log('No existing file found. Creating new one.');
	}
	
	existing.push(newEntry);
	console.log('pushed', newEntry);
	await vscode.workspace.fs.writeFile(fileUri, Buffer.from(JSON.stringify(existing, null, 2)));
}

export function activate (context: vscode.ExtensionContext) {

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

	const saveStatsCommand = vscode.commands.registerCommand('vscwrapped.saveStats', async () =>{
		const currentFile = vscode.window.activeTextEditor;
		console.log(currentFile?.document.fileName);
		if (currentFile) {
			// const uri = currentFile.document.uri;
			const diagnostics = vscode.languages.getDiagnostics();
			for (const [uri, diagnosticArray] of diagnostics){
				for (const diagnostic of diagnosticArray){
					vscode.window.showInformationMessage(diagnostic.message);
						await saveDiagnosticsStat(context, {
							timeStamp: new Date().toISOString(),
							message: diagnostic.message,
							uri: uri.toString(),
							severity: diagnostic.severity,
							language: currentFile.document.languageId
						});
				}
			}
		}});
	context.subscriptions.push(saveStatsCommand);

	const wrapped = vscode.commands.registerCommand('vscwrapped.wrapped', () => {
		const panel = vscode.window.createWebviewPanel(
		'codeWrapped',
		'Your Code Wrapped',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
		);
		panel.webview.html = webviewContent(context, panel.webview);
	});
	context.subscriptions.push(wrapped);
}

function webviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
	const devExperience = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'devExperienceCat.png'));
	const n3Solutions = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'n3_solutions.jpg'));

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VSC Wrapped</title>
	<style>
		body {
			font-family: 'Segoe UI', sans-serif;
			margin: 0;
			overflow: hidden;
			background: #111;
			color: white;
		}
		.slide {
			height: 100vh;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 2em;
			animation: fadeIn 1s ease;
      	}
	</style>
</head>
<body>
	<div class="slide">
		<h1>🎉 You coded 120 hours in C++! </h1>
		<img src="${n3Solutions}" style=" width:25%; border-radius:20px;" />
	</div>
    <div class="slide">
	🔥 Most common bug: “missing ;”
		<img src="${devExperience}" style="width:80%; border-radius:20px;" />
	</div>
    <div class="slide">😬 4 hours spent on segfaults</div>
    <div class="slide">🚀 You pushed code in 7 projects</div>
    <div class="slide">✨ Keep going, legend.</div>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}

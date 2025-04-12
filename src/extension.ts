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
	const segfaults = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'segfault.jpg'));
	const cppShredded = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'shreddedHead.jpg'));
	const cppClasses = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'noClass.jpg'));
	const wereSoBack = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'wereBack.gif'));
	const yippieCat = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'yippee-Cat.gif'));
	const touchGrass = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'touch-grass.gif'));
	const lost = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/assets', 'lost_}.gif'));

    

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VSC Wrapped</title>
	<style>
		body {
				margin: 0;
				background: #111;
				color: white;
				font-family: 'Segoe UI', sans-serif;
				overflow: hidden;
		}
		.carousel {
			position: relative;
			width: 100%;
			height: 100vh;
			display: flex;
			overflow: hidden;
		}
		.slide {
			min-width: 100%;
			transition: transform 0.5s ease;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.slide img {
			max-width: 70%;
			height: auto;
			border-radius: 12px;
		}
		.nav-button {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			background: rgba(255, 255, 255, 0.2);
			border: none;
			color: white;
			font-size: 2rem;
			padding: 0.5rem 1rem;
			cursor: pointer;
			z-index: 10;
		}
		.slides-container {
			display: flex;
			width: 100%;
			transition: transform 0.5s ease;
		}
		.image-layer {
			position: relative;
			width: 100%;
			height: 100%;
		}

		.image-layer img {
			position: absolute;
			border-radius: 20px;
		}

		.n3Sols {
			top: 1%;
			left: 40%;
			width: 25%;
		}

		.cppShredded {
			top: 20%;
			right: 15%;
		}

		.cppClasses {
			top: 40%;
			left: 10%;

		}


		#prev { left: 10px; }
		#next { right: 10px; }
	</style>
</head>
<body>
	<div class="carousel">
		<div class="slides-container" id="carousel">
			<div class="slide">
				<h1> Your VSCode wrapped of the week!!!</h1>
				<img src="${yippieCat}" style="width:20%; border-radius:20px;" />				
			</div>
			<div class="slide">
				<h1>🎉 You coded for 7,563 minutes this week!!!</h1>
				<img src="${wereSoBack}" style="width:20%; border-radius:20px;" />				
				<img src="${touchGrass}" style="width:20%; border-radius:20px;" />				
			
			</div>
			<div class="slide" style="position: relative;">
				<h1>🎉 You wrote 527 lines in C++! </h1>
				<div class="image-layer">
					<img src="${cppShredded}" style=" width:20%; border-radius:20px;" class="cppShredded"/>
					<img src="${cppClasses}" style=" width:30%; border-radius:20px;" class="cppClasses"/>
					<img src="${n3Solutions}" style=" width:25%; border-radius:20px;" class="n3Sols"/>
				</div>
				<h5>Or chat did </h5>
			</div>
			<div class="slide">
				<h1>😬 4 hours spent on segfaults</h1>
				<img src="${segfaults}" style=" width:20%; border-radius:20px;" />
			</div>	
			<div class="slide">
				<h1>Most common bug: “missing }”</h1>
				<img src="${lost}" style="width:20%; border-radius:20px;" />
				<img src="${devExperience}" style="width:20%; border-radius:20px;" />
			</div>		
		</div>
	</div>
	<button class="nav-button" id="prev">&#8592;</button>
	<button class="nav-button" id="next">&#8594;</button>
	
	<script>
		const carousel = document.getElementById('carousel');
		const slides = carousel.children;
		let index = 0;

		function showSlide(i) {
			carousel.style.transform = 'translateX(' + (-i * 100) + '%)';
		}

		document.getElementById('next').onclick = () => {
			index = (index + 1) % slides.length;
			showSlide(index);
		};
		document.getElementById('prev').onclick = () => {
			index = (index - 1 + slides.length) % slides.length;
			showSlide(index);
		};

		showSlide(index); // show initial
	</script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}

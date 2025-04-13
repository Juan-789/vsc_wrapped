"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function saveDiagnosticsStat(context, newEntry) {
    const fileUri = vscode.Uri.joinPath(context.globalStorageUri, 'codestats.json');
    await vscode.workspace.fs.createDirectory(context.globalStorageUri);
    let existing = [];
    try {
        const data = await vscode.workspace.fs.readFile(fileUri);
        existing = JSON.parse(data.toString());
    }
    catch (e) {
        console.log('No existing file found. Creating new one.');
    }
    existing.push(newEntry);
    console.log('pushed', newEntry);
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(JSON.stringify(existing, null, 2)));
}
function activate(context) {
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
    const saveStatsCommand = vscode.commands.registerCommand('vscwrapped.saveStats', async () => {
        const currentFile = vscode.window.activeTextEditor;
        console.log(currentFile?.document.fileName);
        if (currentFile) {
            // const uri = currentFile.document.uri;
            const diagnostics = vscode.languages.getDiagnostics();
            for (const [uri, diagnosticArray] of diagnostics) {
                for (const diagnostic of diagnosticArray) {
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
        }
    });
    context.subscriptions.push(saveStatsCommand);
    const wrapped = vscode.commands.registerCommand('vscwrapped.wrapped', () => {
        const panel = vscode.window.createWebviewPanel('codeWrapped', 'Your Code Wrapped', vscode.ViewColumn.One, {
            enableScripts: true,
            // retainContextWhenHidden: true
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist')]
        });
        // const scriptUri = panel.webview.asWebviewUri(
        // 	vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets', 'index.js')
        // );
        const assetDir = path.join(context.extensionPath, 'webview-ui', 'dist', 'assets');
        const files = fs.readdirSync(assetDir);
        const jsFile = files.find(file => file.endsWith('.js'));
        const cssFile = files.find(file => file.endsWith('.css'));
        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets', jsFile));
        const styleUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets', cssFile));
        // const styleUri = panel.webview.asWebviewUri(
        // 	vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets', 'index.css')
        // );
        panel.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="stylesheet" href="${styleUri}">
				<title>VSC Wrapped</title>
				</head>
				<body>
				<div id="root"></div>
				<script type="module" src="${scriptUri}"></script>
				</body>
			</html>
		`;
    });
    context.subscriptions.push(wrapped);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map
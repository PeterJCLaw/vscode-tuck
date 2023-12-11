import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { PythonExtension } from '@vscode/python-extension';

// Language Server Protocol Types
type Position = { line: number; character: number; };
type Range = { start: Position, end: Position };
type TextEdit = { range: Range, newText: string };
type Result = { edits: Array<TextEdit> };
type Error = { code: string, message: string, detail: string | undefined };
type ErrorResult = { error: Error };

const PYTHON_LANGUAGE = 'python';

function positionToString(cursorPosition: Position): string {
    const line = cursorPosition.line + 1;
    const character = cursorPosition.character;
    return `${line}:${character}`;
}

function cursorPositions(editor: vscode.TextEditor): string[] {
    return editor.selections.map(s => positionToString(s.active));
}

async function getPythonPath(): Promise<string | undefined> {
    // Boilerplate from https://www.npmjs.com/package/@vscode/python-extension

    // Load the Python extension API
    const pythonApi: PythonExtension = await PythonExtension.api();

    // This will return something like /usr/bin/python
    const environmentPath = pythonApi.environments.getActiveEnvironmentPath();

    // `environmentPath.path` carries the value of the setting. Note that this
    // path may point to a folder and not the python binary. Depends entirely on
    // how the env was created. E.g., `conda create -n myenv python` ensures the
    // env has a python binary `conda create -n myenv` does not include a python
    // binary. Also, the path specified may not be valid, use the following to
    // get complete details for this environment if need be.

    const environment = await pythonApi.environments.resolveEnvironment(environmentPath);

    return environment?.executable.uri?.fsPath;
}

export async function wrapCommand(context: vscode.ExtensionContext): Promise<undefined> {
    console.log('Running wrapCommand');

    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.languageId !== PYTHON_LANGUAGE) {
        vscode.window.showErrorMessage('Please open a Python file to format.');
        return;
    }

    const document = activeEditor.document;

    const tuckPath: string | undefined = vscode.workspace.getConfiguration('tuck', document).get('tuckPath');

    // We pass the content of the file to be sorted via stdin. This avoids
    // saving the file (as well as a potential temporary file), but does mean
    // that we need another way to tell the python tool where to look for
    // configuration. We do that by setting the working directory to the
    // directory which contains the file.
    const wrapperScript = context.asAbsolutePath(
        path.join('pythonFiles', 'extension-entrypoint.py'),
    );
    const args = ['-', '--edits', '--positions'].concat(cursorPositions(activeEditor));
    const spawnOptions = {
        env: tuckPath ? {TUCK_PATH: tuckPath} : undefined,
        input: document.getText(),
        cwd: path.dirname(document.uri.fsPath)
    };

    let runner: string;
    const pythonPath = await getPythonPath();
    if (pythonPath && fs.existsSync(pythonPath)) {
        console.log(`Using explicit python path '${pythonPath}'`);
        runner = pythonPath;
        args.unshift(wrapperScript);
    } else {
        console.log('Using implicit python');
        runner = wrapperScript;
    }

    const returned = spawnSync(runner, args, spawnOptions);

    if (returned.error) {
        vscode.window.showErrorMessage(returned.error.message);
        console.error(returned.error.message);
        return;
    }

    const errorString = returned.stderr.toString();
    if (returned.status || errorString) {
        try {
            const errorResult = JSON.parse(errorString) as ErrorResult;
            let { message, code } = errorResult.error;
            if (code === 'target_syntax_error') {
                message = message.replace('<stdin>', path.basename(document.uri.fsPath));
            }
            vscode.window.showWarningMessage(message);
            if (errorResult.error.detail) {
                message += "\n" + errorResult.error.detail;
            }
            console.warn(message);
        }
        catch (error) {
            console.error(error);
            console.error(errorString);
        }
        return;
    }

    const result = JSON.parse(returned.stdout.toString()) as Result;
    const workspaceEdit = new vscode.WorkspaceEdit();
    result.edits.forEach(edit => {
        const range = new vscode.Range(
            edit.range.start.line,
            edit.range.start.character,
            edit.range.end.line,
            edit.range.end.character,
        );
        workspaceEdit.replace(document.uri, range, edit.newText);
    });

    vscode.workspace.applyEdit(workspaceEdit);
}

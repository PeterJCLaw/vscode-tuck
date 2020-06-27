import { spawnSync } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

// Lnaguae Server Protocol Types
type Position = { line: number; character: number; };
type Range = { start: Position, end: Position };
type TextEdit = { range: Range, newText: string };
type Result = { edits: Array<TextEdit> };
type Error = { code: string, message: string };
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

export function wrapCommand(context: vscode.ExtensionContext): undefined {
    console.log('Running wrapCommand');

    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.languageId !== PYTHON_LANGUAGE) {
        vscode.window.showErrorMessage('Please open a Python file to format.');
        return;
    }

    const document = activeEditor.document;

    // We pass the content of the file to be sorted via stdin. This avoids
    // saving the file (as well as a potential temporary file), but does mean
    // that we need another way to tell the python tool where to look for
    // configuration. We do that by setting the working direcotry to the
    // directory which contains the file.
    const wrapperScript = context.asAbsolutePath(
        path.join('pythonFiles', 'extension-entrypoint.py'),
    );
    const args = ['-', '--edits', '--positions'].concat(cursorPositions(activeEditor));
    const spawnOptions = {
        input: document.getText(),
        cwd: path.dirname(document.uri.fsPath)
    };

    const returned = spawnSync(wrapperScript, args, spawnOptions);

    if (returned.error) {
        vscode.window.showErrorMessage(returned.error.message);
        console.error(returned.error.message);
        return;
    }

    if (returned.status || returned.stderr.toString()) {
        const errorResult = JSON.parse(returned.stderr.toString()) as ErrorResult;
        let { message, code } = errorResult.error;
        if (code === 'target_syntax_error') {
            message = message.replace('<stdin>', path.basename(document.uri.fsPath));
        }
        vscode.window.showWarningMessage(message);
        console.warn(message);
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

import { spawnSync } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

// Lnaguae Server Protocol Types
type Position = { line: number; character: number; };
type Range = { start: Position, end: Position };
type TextEdit = { range: Range, newText: string };

const PYTHON_LANGUAGE = 'python';

function cursorPosition(editor: vscode.TextEditor): string {
    const cursorPosition = editor.selection.active;
    const line = cursorPosition.line + 1;
    const character = cursorPosition.character;
    return `${line}:${character}`;
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
    const args = ['-', '--edits', '--position', cursorPosition(activeEditor)];
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

    if (returned.status) {
        vscode.window.showErrorMessage(returned.stderr.toString());
        console.error(returned.stderr.toString());
        return;
    }

    const edits = JSON.parse(returned.stdout.toString()) as Array<TextEdit>;
    const workspaceEdit = new vscode.WorkspaceEdit();
    edits.forEach(edit => {
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

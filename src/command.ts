import { spawnSync } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

import { EditorUtils } from './patch-utils';

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
    // const wrapperScript = context.asAbsolutePath(path.join('pythonFiles', 'wrapper.py'));
    const wrapperScript = '/home/peter/.virtualenvs/python-wrapper/bin/python';  // TODO
    let args = ['-', '--diff', '--position', cursorPosition(activeEditor)];
    args = ['/home/play/python-wrapper/wrapper.py'].concat(args); // TODO
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

    const diff = returned.stdout.toString();
    const edit = new EditorUtils().getWorkspaceEditsFromPatch(
        document.getText(),
        diff,
        document.uri,
    );
    vscode.workspace.applyEdit(edit);
}

import * as vscode from 'vscode';

import { wrapCommand } from "./command";

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "python-wrapper" is now active!');

    // Note: the commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerTextEditorCommand(
        'py-wrapper.wrap-at-cursor',
        () => {
            wrapCommand(context);
        },
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}

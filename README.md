# VSCode Tuck

VSCode extension for [tuck][] -- semi-automated Python formatting.

[tuck]: https://github.com/PeterJCLaw/tuck

## Features

This extension current provides a single command, equivalent to calling tuck
against the current file and using the cursor position as the position to wrap.

The command can most easily be run using the keyboard shortcut
<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd>.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md).

## Attribution

Tuck uses [`asttokens`][asttokens] to aid its handling of the Python AST.
`asttokens` is included in the extension, licensed under Apache 2.0.

[asttokens]: https://pypi.org/project/asttokens/

# VSCode Tuck

VSCode extension for [tuck][] -- semi-automated Python formatting.

[tuck]: https://github.com/PeterJCLaw/tuck

## Install

Install from the [Extension Marketplace][marketplace] using this extensions full
name: `peterjclaw.tuck`.

[marketplace]: https://marketplace.visualstudio.com/items?itemName=peterjclaw.tuck

## Features

This extension current provides a single command, equivalent to calling tuck
against the current file and using the cursor position as the position to wrap.

The command can most easily be run using the keyboard shortcut
<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd>.

### Examples

#### Function definition

Place cursor on `foo` or within the parentheses, then run the command:

``` python
def foo(bar: str, quox: int = 0) -> float:
    return 4.2
```

wraps to:

``` python
def foo(
    bar: str,
    quox: int = 0,
) -> float:
    return 4.2
```

#### List comprehension

Place cursor on `for`, then run the command:

``` python
[x for x in 'aBcD' if x.isupper()]
```

wraps to:

``` python
[
    x
    for x in 'aBcD'
    if x.isupper()
]
```

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md).

## Attribution

Tuck uses [`asttokens`][asttokens] to aid its handling of the Python AST.
`asttokens` is included in the extension, licensed under Apache 2.0.

[asttokens]: https://pypi.org/project/asttokens/

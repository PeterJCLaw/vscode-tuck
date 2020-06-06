# Change Log

All notable changes to the "tuck" extension will be documented in this file.

## 0.0.7

- Update tuck library to 0.0.8:
  - Handle wrapping implicit tuples, including in subscripts

## 0.0.6

- Update tuck library to 0.0.7:
  - Cope with existing trailing commas in unwrapped formats
  - Support some forms of already partially wrapped statement

## 0.0.5

- Update tuck library to 0.0.6:
  - Better support for generator expressions within the expression being wrapped
- Add keyboard shortcut <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd>

## 0.0.4

- Update tuck library to 0.0.3:
  - Account for **kwargs appearing in a dict literal
  - Support for wrapping if expressions
  - Wrap the test of an if statement if asked to wrap the if statement
  - Don't wrap an if statement or function definition from their bodies

## 0.0.3

- Update tuck library to 0.0.2:
  - Fix behaviour when the code block being wrapped is already indented
  - Don't wrap method calls chained from the current attribute, i.e:
    `foo.bar.baz(arg=value)` will no longer wrap the method arguments with the
    cursor on `foo` or `bar`, but will still wrap on `baz`
  - Initial support for wrapping boolean expressions
  - Support for wrapping class definition headers
  - Support wrapping multiple cursor positions at once, as long as the resulting
    edits don't overlap

## 0.0.2

- Attribute `asttokens`.

## 0.0.1

- Initial release

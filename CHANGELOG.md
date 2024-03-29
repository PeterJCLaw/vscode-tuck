# Change Log

All notable changes to the "tuck" extension will be documented in this file.

## 0.3.0

- Move to using `@vscode/python-extension` API to get the current Python
  interpreter rather than querying the (long deprecated) setting directly.
  Fixes an `EACCESS` error when used alongside the latest versions of
  `ms-python.python`.

## 0.2.0

- Update tuck library to 0.2.4:
  - Drop support for Python <3.7. This had been expected for a while, however
    this is the first release which uses features not present in earlier Python
    versions.
  - Allow wrapping of an AST node where several requested cursor positions would
    select the same node. Previously this was disallowed due to potential
    ambiguity, however this turned out to be annoying and there's really only
    one reasonable thing that could be intended in this case.
  - Fix handling of cursor positions not in file order. This issue was unlikely
    to have affected extension users.

## 0.1.7

- Improve handling of internal errors. Previously an error in the `tuck` library
  would result in silence, now a warning message will be shown.
- Update tuck library to 0.2.1:
  - Cope with wrapping parenthesised generator conditionals
  - Improve handling of `if` expressions already partially wrapped

## 0.1.6

- Update tuck library to 0.1.5:
  - Fix various cases where extra newlines would be inserted when wrapping
    already wrapped statements
  - Prevent unexpected wrapping of a parent statement (such as a function or
    class definition) when the cursor is within the body of that statement and
    not within another statement
  - Fix handling of f-strings, no wrapping is performed however previously this
    would crash `tuck`

## 0.1.5

- Introduce a `tuck.tuckPath` setting to allow use of the extension with an
  arbitrary version of the `tuck` library.
- Update tuck library to 0.1.4:
  - Fix various issues stemming from wrapping partially or fully already wrapped
    functions (previously would add redundant newlines and newlines in bad places)
  - Fix various cases where intervening lines would be over-indented when
    wrapping a containing expression
  - Fix wrapping conditional expressions within parentheses (previously would
    add a redundant newline)
  - Support wrapping ternary expressions with the cursor on the `else` portion

## 0.1.4

- Update tuck library to 0.1.3:
  - Drop explicit support for Python < 3.7 (likely still works though)
  - Surround wrapped ternary expressions with parentheses for neatness
  - Improve wrapping of generators when they're the only argument to a call

## 0.1.3

- Update tuck library to 0.1.2:
  - Improve handling for trailing commas already existing within wrapped syntax
  - Improve support for wrapping nested conditional expressions

## 0.1.2

- Use an explicit Python by fetching the workspace's Python where possible, this
  aims to support Windows and or other environments where the workspace python
  is not on $PATH

## 0.1.1

- Update tuck library to 0.1.1:
  - Fix wrapping function definitions where the last argument has a tuple as its
    default value

## 0.1.0

- Update tuck library to 0.1.0, which formally licenses it as Apache 2.0

## 0.0.10

- Update tuck library to 0.0.12:
  - Fully support Python 3.8 and 3.9
  - Support set literals and comprehensions

## 0.0.9

- Update tuck library to 0.0.10:
  - Support async function definitions
  - Cope with existing trailing commas in class and function definitions
  - Improve heuristics for what to wrap when positioned on an attribute
  - Improve check for not being in a body block
  - Fix wrapping of generators on Python 3.8+

## 0.0.8

- Update tuck library to 0.0.9:
  - Improve handling of parenthesized boolean expressions which are children of
    the expression being wrapped
  - Fix location of inserted trailing commas when the statement being wrapped is
    already partially wrapped
- Improve error messages

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

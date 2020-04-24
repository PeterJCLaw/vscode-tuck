# Change Log

All notable changes to the "tuck" extension will be documented in this file.

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

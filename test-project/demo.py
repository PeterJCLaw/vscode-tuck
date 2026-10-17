## Function definition

# Place cursor on `foo` or within the parentheses, then run the command:

def foo(bar: str, quox: int = 0) -> float:
    return 4.2

# wraps to:

def foo(
    bar: str,
    quox: int = 0,
) -> float:
    return 4.2

## List comprehension

# Place cursor on `for`, then run the command:

[x for x in 'aBcD' if x.isupper()]

# wraps to:

[
    x
    for x in 'aBcD'
    if x.isupper()
]

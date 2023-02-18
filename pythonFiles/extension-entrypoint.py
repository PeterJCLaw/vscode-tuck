#!/usr/bin/env python3

import os
import sys

TUCK_PATH = os.environ.get('TUCK_PATH')

if not TUCK_PATH:
    MY_DIR = os.path.dirname(os.path.abspath(__file__))
    TUCK_PATH = os.path.join(MY_DIR, 'lib')

sys.path.insert(0, TUCK_PATH)

try:
    import tuck
except ImportError:
    import json
    import traceback
    exit(json.dumps({'error': {
        'code': 'tuck_import_error',
        'message': f"Import error using tuck from {TUCK_PATH!r}",
        'detail': traceback.format_exc(),
    }}))

try:
    tuck.main()
except Exception as e:
    import json
    import traceback
    summary = traceback.format_exception_only(e)[0]
    exit(json.dumps({'error': {
        'code': 'tuck_internal_error',
        'message': f"Internal error in tuck: {summary}",
        'detail': traceback.format_exc(),
    }}))

#!/usr/bin/env python3

import os
import sys

MY_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(MY_DIR, 'lib'))
sys.path.insert(0, os.path.join(MY_DIR, 'tuck'))

from wrapper import main, parse_args

main(parse_args())

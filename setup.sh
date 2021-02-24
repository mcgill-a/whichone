#!/bin/bash
cd ../
python3 -m venv ve-whichone
source ve-whichone/Scripts/activate
pip install -r whichone/requirements.txt
cd whichone/config
cp defaults_example.py defaults.py
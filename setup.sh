#!/bin/bash
git pull
cd ../
py -m venv ve-whichone

case "$OSTYPE" in
  msys*)    source ve-whichone/Scripts/activate ;;
  *)        . $PWD/venv-whichone/bin/activate ;;
esac

pip install -r whichone/requirements.txt
cd whichone/whichone/
cp config/defaults_example.py config/defaults.py
cd ../
py run.py
#!/bin/bash
git pull
cd ../
if [[ "$(py -V)" =~ "Python 3" ]]; then
  echo "Python 3 is installed"
else
  exit
fi
py -m venv ve-whichone

case "$OSTYPE" in
  msys*)    source ve-whichone/Scripts/activate ;;
  *)        . $PWD/venv-whichone/bin/activate ;;
esac

pip install -r whichone/requirements.txt -q
cd whichone/whichone/
if [ -f "config/defaults.py" ]; then
  echo "Configuration file found."
else
  echo "Generating configuration file based on defaults_example.py"
  cp config/defaults_example.py config/defaults.py
fi

cd ../
py run.py
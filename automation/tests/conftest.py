import pytest
import json
from pathlib import Path

from selenium import webdriver


@pytest.fixture(params=["firefox"], scope="class")
def driver_init(request):
    if request.param == "chrome":
        web_driver = webdriver.Chrome()
    if request.param == "firefox":
        web_driver = webdriver.Firefox()
    web_driver.maximize_window()
    request.cls.driver = web_driver
    yield
    web_driver.close()


@pytest.fixture(scope="function")
def test_data():
    filename = str(
        Path(__file__).parent.parent.absolute() / "settings" / "formtest.json"
    )
    with open(filename) as json_file:
        data = json.load(json_file)
        """
        data = {
            "email": "test@sl.com",
            "text": "this is a test"
        }
        """
        return data

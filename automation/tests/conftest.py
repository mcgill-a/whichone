import pytest
from selenium import webdriver


@pytest.fixture(params=["chrome"], scope="class")
def driver_init(request):
    if request.param == "chrome":
        web_driver = webdriver.Chrome()
    if request.param == "firefox":
        web_driver = webdriver.Firefox()
    web_driver.maximize_window()
    request.cls.driver = web_driver
    yield
    web_driver.close()
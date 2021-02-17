import pytest
import pytest_html
from time import sleep

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

from settings import username
from settings import password

@pytest.fixture(scope="class")
def firefox_driver_init(request):
    web_driver = webdriver.Firefox()
    request.cls.driver = web_driver
    yield
    web_driver.close()

@pytest.mark.usefixtures("firefox_driver_init")
class Basic_Firefox_Test:
    pass
class Test_URL_Firefox(Basic_Firefox_Test):
    def test_open_url(self):
        self.driver.get("http://127.0.0.1:8080/")
        assert self.driver.title == "Which One"

        self.driver.find_element_by_class_name("spotify-login").click()
        WebDriverWait(self.driver, 10).until(EC.title_contains("Spotify"))
        self.driver.find_element_by_name("username").send_keys(username)
        self.driver.find_element_by_name("password").send_keys(password)
        self.driver.find_element_by_id("login-button").click()

        WebDriverWait(self.driver, 10).until(EC.title_contains("Which"))
        assert self.driver.current_url == "http://127.0.0.1:8080/play"
import pytest
import pytest_html
from time import sleep

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

import settings


@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass

@pytest.mark.incremental      
class Test_Login(BasicTest):
    
    def test_url(self):
        self.driver.get(settings.baseaddress)
        assert self.driver.title == "Which One"

    
    def test_login(self):

        self.driver.find_element_by_class_name("spotify-login").click()
        WebDriverWait(self.driver, 10).until(EC.title_contains("Spotify"))
        self.driver.find_element_by_name("username").send_keys(settings.username)
        self.driver.find_element_by_name("password").send_keys(settings.password)
        self.driver.find_element_by_id("login-button").click()

        WebDriverWait(self.driver, 10).until(EC.title_contains("Which"))
        assert self.driver.current_url == "http://127.0.0.1:8080/play"
        assert self.driver.title == "Which One"
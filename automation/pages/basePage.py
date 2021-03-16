from abc import ABC

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class basePage(ABC):
    def __init__(self, driver):
        self.driver = driver
        self.baseURL = "http://127.0.0.1:8080"

    def open(self, URL):
        self.driver.get(self.baseURL + URL)
        WebDriverWait(self.driver, 10).until(EC.title_contains("Which One"))

    def findElement(self, *loc):
        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located(loc))
        return self.driver.find_element(*loc)

    def clickElement(self, *loc):
        WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable(loc))
        self.driver.find_element(*loc).click()

    def checkButtonDisplayed(self, *loc):
        WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable(loc))
        return self.driver.find_element(*loc).is_displayed()

    def getURL(self):
        return self.driver.current_url

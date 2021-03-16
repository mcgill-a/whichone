from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import basePage
from pages.playPage import playPage

import time

class formPage(basePage):
    # Locators
    emailInput_loc = (By.ID, "exampleEmailInput")
    textInput_loc = (By.ID, "exampleMessage")
    submitButton_loc = (By.CLASS_NAME, "submit-feedback")
    backToGameButton_loc = (By.CLASS_NAME, "gotham-extra-small btn-stat")


    
    def __init__(self, driver):
        super().__init__(driver)
        self.feedbackURL = "/feedback"

    def feedbackForm(self):
        play_Page = playPage(self.driver)
        play_Page.goToFeedback()
        self.checkPage()
        self.testForm("alex@sucks.com", "hello, this is a test form")

    def checkPage(self):
        assert self.feedbackForm in super().getURL
        assert super().checkButtonDisplayed(*self.submitButton_loc)

    def testForm(self, email, text):
        

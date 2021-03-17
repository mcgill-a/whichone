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
    backToGameButton_loc = (By.ID, "backToGame")

    def __init__(self, driver, baseURL):
        super().__init__(driver)
        self.baseURL = baseURL
        self.feedbackURL = f"{baseURL}/feedback"

    def feedbackForm(self, data):
        play_Page = playPage(self.driver, self.baseURL)
        play_Page.goToFeedback()
        self.checkPage()
        self.testForm(data["email"], data["text"])
        self.backToGame()
        play_Page.checkPage()

    def checkPage(self):
        assert self.feedbackURL in super().getURL()
        assert super().checkButtonDisplayed(*self.submitButton_loc)

    def testForm(self, email, text):
        super().findElement(*self.emailInput_loc).send_keys(email)
        super().findElement(*self.textInput_loc).send_keys(text)
        super().clickElement(*self.submitButton_loc)
        WebDriverWait(self.driver, 10).until(EC.title_contains("Formspree"))
        super().open(self.feedbackURL)

    def backToGame(self):
        time.sleep(0.5)
        super().clickElement(*self.backToGameButton_loc)

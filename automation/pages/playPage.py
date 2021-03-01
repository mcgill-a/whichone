from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import Page

class playPage(Page):
    # Elements

    # Locators
    modeText_loc = (By.ID, "mode_text")
    leftChoiceButton_loc = (By.ID, "button-choice-1")
    rightChoiceButton_loc = (By.ID, "button-choice-2")
    playAgainButton_loc = (By.ID, "play-again")
    leftChoiceText_loc = (By.ID, "text1a")
    rightChoiceText_loc = (By.ID, "text2a")

    def __init__(self, driver):
        Page.__init__(self, driver)

    def clickLeftChoice(self):
        self.findElement(*self.leftChoiceButton_loc).click()
        WebDriverWait(self.driver, 30).until(EC.element_to_be_clickable(self.leftChoiceButton_loc))

    def clickRightChoice(self):
        self.findElement(*self.rightChoiceButton_loc).click()
        WebDriverWait(self.driver, 30).until(EC.element_to_be_clickable(self.rightChoiceButton_loc))

    def getModeAndChoiceText(self):
        text = [self.findElement(*self.modeText_loc).text]
        text.append(self.findElement(*self.leftChoiceText_loc).text)
        text.append(self.findElement(*self.rightChoiceText_loc).text)
        return text

    def checkPlayAgain(self):
        return self.findElement(*self.playAgainButton_loc).is_displayed()


    def wait(self):
        WebDriverWait(self.driver, 30).until(EC.element_to_be_clickable(self.leftChoiceButton_loc))
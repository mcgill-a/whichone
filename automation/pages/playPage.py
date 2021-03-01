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
    danceabilityCheck_loc = (By.XPATH, '//*[@id="danceBox"]') 
    danceabilityButton_loc = (By.XPATH, "/html/body/div/div/div[5]/div[1]/label")

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
        text.append(self.findElement(*self.leftChoiceButton_loc).text)
        text.append(self.findElement(*self.rightChoiceButton_loc).text)
        return text

    def findLeftChoice(self):
        return self.findElement(*self.leftChoiceButton_loc)

    def findPlayAgain(self):
        return self.findElement(*self.playAgainButton_loc)

    def findDanceBoxButton(self):
        return self.findElement(*self.danceabilityButton_loc)

    def getLives(self):
        return self.driver.execute_script('return lives;')

    def wrongAnswer(self):
        self.driver.execute_script('wrongAnswer();')

    def loseGame(self):
        self.driver.execute_script('lives = 0; wrongAnswer();')

    def waitChoice(self):
        WebDriverWait(self.driver, 30).until(EC.element_to_be_clickable(self.leftChoiceButton_loc))

    def waitPlayAgain(self):
        WebDriverWait(self.driver, 30).until(EC.element_to_be_clickable(self.playAgainButton_loc))
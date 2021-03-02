from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import basePage

import time

class playPage(basePage):
    # Elements

    # Locators
    modeText_loc= (By.ID, "mode_text")
    leftChoiceButton_loc = (By.ID, "button-choice-1")
    rightChoiceButton_loc = (By.ID, "button-choice-2")
    playAgainButton_loc = (By.ID, "play-again")
    currentScore_loc = (By.ID, "current_score")
    highScore_loc = (By.ID, "high_score")
    
    def __init__(self, driver):
        super().__init__(driver)
        self.landingURL = "/play"

    def checkPage(self):
        assert self.landingURL in super().getURL()
        assert super().checkButtonDisplayed(*self.leftChoiceButton_loc)

    def playGame(self):
        assert super().findElement(*self.playAgainButton_loc).is_displayed() == False
        highScore_1 = self.getHighScore()
        self.checkButtons()
        self.checkCorrectAnswer()
        self.checkWrongAnswer()
        self.checkLoseGame()
        self.playAgain()
        highScore_2 = self.getHighScore()
        print(highScore_1)
        print(highScore_2)
        assert highScore_2 != highScore_1

    def checkButtons(self):
        text_1 = self.getModeAndChoiceText()
        super().clickElement(*self.leftChoiceButton_loc)
        text_2 = self.getModeAndChoiceText()
        assert text_2 != text_1
        super().clickElement(*self.rightChoiceButton_loc)
        text_3 = self.getModeAndChoiceText()
        assert text_3 != text_2

    def getModeAndChoiceText(self):
        text = [super().findElement(*self.modeText_loc).text]
        text.append(super().findElement(*self.leftChoiceButton_loc).text)
        text.append(super().findElement(*self.rightChoiceButton_loc).text)
        return text

    def checkCorrectAnswer(self):
        score_1 = self.getCurrentScore()
        self.driver.execute_script('correctAnswer();')
        score_2 = self.getCurrentScore()
        assert score_1 != score_2
    
    def checkWrongAnswer(self):
        currentLives = ('return lives;')
        lives_1 = self.driver.execute_script(currentLives)
        self.driver.execute_script('wrongAnswer();')
        lives_2 = self.driver.execute_script(currentLives)
        assert lives_1 != lives_2

    def checkLoseGame(self):
        self.driver.execute_script('lives = 1; wrongAnswer();')
        assert super().checkButtonDisplayed(*self.playAgainButton_loc)
        
    def playAgain(self):
        super().clickElement(*self.playAgainButton_loc)
        assert super().checkButtonDisplayed(*self.leftChoiceButton_loc)
        assert self.getCurrentScore() == "0"

    def getCurrentScore(self):
        return super().findElement(*self.currentScore_loc).text

    def getHighScore(self):
        return super().findElement(*self.highScore_loc).text

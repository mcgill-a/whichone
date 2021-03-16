from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import basePage
from pages.spotifyPage import spotifyPage
from pages.playPage import playPage

class landingPage(basePage):
    #Elements

    #Locators
    loginButton_loc = (By.CLASS_NAME, "spotify-login")
    
    def __init__(self, driver):
        super().__init__(driver)
        self.landingURL = "/"

    def load(self):
        super().open(self.landingURL)
        assert super().checkButtonDisplayed(*self.loginButton_loc)

    def login(self, username, password):
        super().clickElement(*self.loginButton_loc)
        spotify_Page = spotifyPage(self.driver)
        spotify_Page.login(username, password)
        play_Page = playPage(self.driver)
        play_Page.checkPage()
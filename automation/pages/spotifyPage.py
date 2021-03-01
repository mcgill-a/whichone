from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import Page

class spotifyPage(Page):
    # Elements

    # Locators
    emailField_loc = (By.ID, "login-username")
    passwordField_loc = (By.ID, "login-password")
    spotifyLoginButton_loc = (By.ID, "login-button")

    def __init__(self, driver):
        Page.__init__(self, driver)

    def spotifyLogin(self, Username, Password):
        WebDriverWait(self.driver, 10).until(EC.title_contains("Spotify"))
        self.findElement(*self.emailField_loc).send_keys(Username)
        self.findElement(*self.passwordField_loc).send_keys(Password)
        self.findElement(*self.spotifyLoginButton_loc).click()
        WebDriverWait(self.driver, 10).until(EC.title_contains("Which One"))

        

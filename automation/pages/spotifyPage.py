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

    def spotify_login(self, Username, Password):
        self.Username = Username
        self.Password = Password
        WebDriverWait(self.driver, 10).until(EC.title_contains("Spotify"))
        self.find_element(*self.emailField_loc).send_keys(self.Username)
        self.find_element(*self.passwordField_loc).send_keys(self.Password)
        self.find_element(*self.spotifyLoginButton_loc).click()
        WebDriverWait(self.driver, 10).until(EC.title_contains("Which One"))

        

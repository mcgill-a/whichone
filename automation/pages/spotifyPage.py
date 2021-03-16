from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import basePage


class spotifyPage(basePage):
    # Elements

    # Locators
    emailField_loc = (By.ID, "login-username")
    passwordField_loc = (By.ID, "login-password")
    spotifyLoginButton_loc = (By.ID, "login-button")

    def __init__(self, driver):
        super().__init__(driver)

    def login(self, username, password):
        WebDriverWait(self.driver, 10).until(EC.title_contains("Spotify"))
        super().findElement(*self.emailField_loc).send_keys(username)
        super().findElement(*self.passwordField_loc).send_keys(password)
        super().clickElement(*self.spotifyLoginButton_loc)
        WebDriverWait(self.driver, 10).until(EC.title_contains("Which One"))

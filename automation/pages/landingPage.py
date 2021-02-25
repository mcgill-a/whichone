from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.basePage import Page

class landingPage(Page):
    #Elements

    #Locators
    loginButton_loc = (By.CLASS_NAME, "spotify-login")
    
    def __init__(self, driver):
        Page.__init__(self, driver)
        self.URL = "/"

    def load(self):
        self.open()

    def click_login(self):
        self.find_element(*self.loginButton_loc).click()
        
        
        
        
    

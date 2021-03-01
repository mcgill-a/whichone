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
        self.landingURL = "/"

    def load(self, BaseURL):
        URL = BaseURL + self.landingURL
        self.open(URL)
        WebDriverWait(self.driver, 10).until(EC.title_contains("Which One"))

    def findLogin(self):
        return self.findElement(*self.loginButton_loc)

        
        
        
        
    

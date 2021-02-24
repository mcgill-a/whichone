from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from pages.basePage import Page

class landingPage(Page):
    #Elements

    #Locators
    
    def __init__(self, driver):
        Page.__init__(self, driver)
        self.URL = "/"

    def load(self):
        #URL = "/"
        base_Page = Page
        #self.URL = URL
        base_Page.open(self)
        #self.driver.get("http://127.0.0.1:8080/")
        assert self.driver.title == "Which One"
        
        
    

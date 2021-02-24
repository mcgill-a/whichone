import sys
from pathlib import Path
print(Path)
sys.path.append(str(Path(__file__).parent.parent.absolute()))

import pytest
import pytest_html

from pages import landingPage
from pages import basePage

import time

#BaseURL = basePage.BaseURL
#test = landingPage
#def test_url():
#    #assert basePage.BaseURL == "http://127.0.0.1:8080"
#    assert test.landingPage.URL == "/"
BaseURL = "http://127.0.0.1:8080"

@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass
      
#class Test_1(BasicTest):
    
    #@pytest.mark.dependency(name="url")
    #def test_url(self):
        #self.driver.get(basePage.URL + "/")
        #assert self.driver.title == "Which One"

class Test_Login(BasicTest):
    
    def test_url(self):
        #print("###########this is " + self.driver + " ################")
        self.BaseURL = BaseURL
        landing_Page = landingPage.landingPage(self.driver)
        landing_Page.load()
        time.sleep(5)
        
        
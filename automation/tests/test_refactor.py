import sys
from pathlib import Path
print(Path)
sys.path.append(str(Path(__file__).parent.parent.absolute()))

import pytest
import pytest_html

from pages import landingPage
from pages import basePage

from settings import settings

import time

@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass

class Test_Login(BasicTest):
    
    def test_url(self):
        landing_Page = landingPage.landingPage(self.driver)
        landing_Page.load()
        assert landing_Page.get_Title() == "Which One"
    

    #def test_login(self):
        #landing_Page.click_login()
        #time.sleep(3)
        
        
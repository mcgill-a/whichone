import sys
from pathlib import Path
print(Path)
sys.path.append(str(Path(__file__).parent.parent.absolute()))

import pytest
import pytest_html

from pages import landingPage
from pages import basePage
from pages import spotifyPage

from settings import settings

import time

@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass

class Test_Login(BasicTest):
    
    def setup(self):
        self.landing_Page = landingPage.landingPage(self.driver)
        self.spotify_Page = spotifyPage.spotifyPage(self.driver)
    
    def test_url(self):
        self.landing_Page.load()
        assert self.landing_Page.get_Title() == "Which One"
    

    def test_login(self):
        self.landing_Page.click_login()
        self.spotify_Page.spotify_login(settings.username, settings.password)
        assert "/play" in self.spotify_Page.get_URL()

    def test_leavePage(self):
        self.landing
        
        
        
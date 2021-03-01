import sys
from pathlib import Path
print(Path)
sys.path.append(str(Path(__file__).parent.parent.absolute()))

import pytest
import pytest_html

from pages import basePage
from pages import landingPage
from pages import spotifyPage
from pages import playPage

from settings import settings

import time

# Test Parameters
BaseURL = "http://127.0.0.1:8080"
GoogleURL = "https://www.google.com/"

@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass

class Test_Login(BasicTest):
    
    def setup(self):
        self.BaseURL = BaseURL
        self.landing_Page = landingPage.landingPage(self.driver)
        self.spotify_Page = spotifyPage.spotifyPage(self.driver)
        self.play_Page = playPage.playPage(self.driver)
    
    @pytest.mark.dependency(name="url")
    def test_url(self):
        self.landing_Page.load(BaseURL)
        assert self.landing_Page.getTitle() == "Which One"
        assert self.landing_Page.findLogin().text == "Log in with Spotify"
    
    @pytest.mark.dependency(name = "login", depends=["url"])
    def test_login(self):
        self.landing_Page.findLogin().click()
        assert "spotify" in self.spotify_Page.getURL()
        self.spotify_Page.spotifyLogin(settings.username, settings.password)
        assert "/play" in self.play_Page.getURL()

    @pytest.mark.dependency(name = "persist", depends=["login"])
    def test_persistance(self):
        self.landing_Page.open(GoogleURL)
        self.landing_Page.load(BaseURL)
        assert "/play" in self.play_Page.getURL()

    #def test_localstoragePersists(self):
    #    self.landing_Page.open(GoogleURL)
    #    self.landing_Page.load()
    #    assert "/play" in self.play_Page.get_URL()

    @pytest.mark.dependency(name = "gameplay", depends=["persist"])
    def test_gameplay(self):
        self.play_Page.wait()
        assert self.play_Page.checkPlayAgain() == False
        text_1 = self.play_Page.getModeAndChoiceText()
        self.play_Page.clickLeftChoice()
        text_2 = self.play_Page.getModeAndChoiceText()
        assert text_1 != text_2

        assert 1 == 2
        self.play_Page.clickRightChoice()
        time.sleep(2)


        
        
        
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
        # not implemented yet self.play_Page.findDanceBoxButton().click()
        self.landing_Page.open(GoogleURL)
        self.landing_Page.load(BaseURL)
        #assert self.play_Page.findDanceBoxButton().is_selected()
        assert "/play" in self.play_Page.getURL()

    @pytest.mark.dependency(name = "gameplay", depends=["persist"])
    def test_gameplay(self):
        
        self.play_Page.waitChoice()
        assert self.play_Page.findPlayAgain().is_displayed() == False
        text_1 = self.play_Page.getModeAndChoiceText()
        self.play_Page.clickLeftChoice()
        text_2 = self.play_Page.getModeAndChoiceText()
        assert text_1 != text_2
        self.play_Page.clickRightChoice()
        text_3 = self.play_Page.getModeAndChoiceText()
        assert text_2 != text_3
        
        lives_1 = self.play_Page.getLives()
        self.play_Page.wrongAnswer()
        lives_2 = self.play_Page.getLives()
        assert lives_1 != lives_2
        self.play_Page.loseGame()
        self.play_Page.waitPlayAgain()
        assert self.play_Page.findPlayAgain().is_displayed()
        
        self.play_Page.findPlayAgain().click()
        self.play_Page.waitChoice()
        assert self.play_Page.findLeftChoice().is_displayed()


        
        
        
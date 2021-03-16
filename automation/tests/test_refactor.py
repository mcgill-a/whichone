import sys
from pathlib import Path
print(Path)
sys.path.append(str(Path(__file__).parent.parent.absolute()))

import pytest
import pytest_html

from pages.landingPage import landingPage
from pages.playPage import playPage
from pages.formPage import formPage

from settings import settings

@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass

class Test_1(BasicTest):

    @pytest.mark.dependency(name="url")
    def test_url(self):
        loadTest = landingPage(self.driver)
        loadTest.load()
    
    @pytest.mark.dependency(name = "login", depends=["url"])
    def test_login(self):
        loginTest = landingPage(self.driver)
        loginTest.login(settings.username, settings.password)
    """
    @pytest.mark.dependency(name = "gameplay", depends=["login"])
    def test_gameplay(self):
        playGame = playPage(self.driver)
        playGame.playGame()
    """
    @pytest.mark.dependency(name = "feedback", depends=["login"])
    def test_form(self):
        feedbackForm = formPage(self.driver)
        feedbackForm.feedbackForm()
        assert 1==2
    """
    @pytest.mark.dependency(name = "persist", depends=["feedback"])
    def test_persistance(self):
        persistTest = landingPage(self.driver)
        persistTest.persistenceCheck()
    """

        
        
        
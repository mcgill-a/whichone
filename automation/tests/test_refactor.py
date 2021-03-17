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

baseURL = "http://127.0.0.1:8080"


@pytest.mark.usefixtures("driver_init")
class BasicTest:
    pass


class Test_1(BasicTest):
    @pytest.mark.dependency(name="url")
    def test_url(self):
        loadTest = landingPage(self.driver, baseURL)
        loadTest.load()

    @pytest.mark.dependency(name="login", depends=["url"])
    def test_login(self):
        loginTest = landingPage(self.driver, baseURL)
        loginTest.login(settings.username, settings.password)

    @pytest.mark.dependency(name="gameplay", depends=["login"])
    def test_gameplay(self):
        playGame = playPage(self.driver, baseURL)
        playGame.playGame()

    @pytest.mark.dependency(name="feedback", depends=["login"])
    def test_form(self):
        feedbackForm = formPage(self.driver, baseURL)
        feedbackForm.feedbackForm()

    @pytest.mark.dependency(name="persist")
    def test_persistance(self):
        persistTest = playPage(self.driver, baseURL)
        persistTest.persistenceCheck()

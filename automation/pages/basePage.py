class Page(object):

    def __init__(self, driver):
        self.BaseURL = "http://127.0.0.1:8080"
        self.driver = driver

    def open(self):
        URL = self.BaseURL + self.URL
        self.driver.get(URL)
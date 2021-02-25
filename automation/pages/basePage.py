class Page(object):

    def __init__(self, driver):
        self.BaseURL = "http://127.0.0.1:8080"
        self.driver = driver

    def open(self):
        URL = self.BaseURL + self.URL
        self.driver.get(URL)

    def get_Title(self):
        return self.driver.title
    
    def find_element(self, loc):
        return self.driver.find_element(loc)
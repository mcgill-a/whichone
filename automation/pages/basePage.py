class Page(object):
    def __init__(self, driver):
        self.driver = driver

    def open(self,URL):
        self.driver.get(URL)

    def getTitle(self):
        return self.driver.title
    
    def findElement(self, *loc):
        return self.driver.find_element(*loc)

    def getURL(self):
        return self.driver.current_url
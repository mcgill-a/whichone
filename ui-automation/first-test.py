from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

from settings import username
from settings import password

driver = webdriver.Chrome('./chromedriver')

driver.get("http://127.0.0.1:8080/")

print(driver.current_url)
print("title found: '" + driver.title + "'")

driver.find_element_by_class_name("spotify-login").click()
WebDriverWait(driver, 10).until(EC.title_contains("Spotify"))

driver.find_element_by_name("username").send_keys(username)
driver.find_element_by_name("password").send_keys(password)
driver.find_element_by_id("login-button").click()

WebDriverWait(driver, 10).until(EC.title_contains("Which"))
print(driver.current_url)

driver.close()

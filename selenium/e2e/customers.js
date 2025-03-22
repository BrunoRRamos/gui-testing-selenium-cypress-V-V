const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

// Justificativa: Se fez necessario gerar nomes de email aleatorios
  // pois o sylius sempre mantem registro de guests para controle
  // e para que o teste de criar customer funcione deve ser 
  // utilizado um email que não esteja em uso.
function genEmail() {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${randomStr}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrollRight(driver) {
  const segmentElement = await driver.findElement(By.css('.segment'));
  await driver.executeScript('arguments[0].scrollLeft = arguments[0].scrollWidth', segmentElement);
}

describe('customers', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    // await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    await driver.findElement(By.linkText('Customers')).click();
    // await driver.sleep(1000);
  });

  it('update a customer phone number', async () => {
    await driver.findElement(By.id('criteria_search_value')).sendKeys('@gmail');

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();

    const inputName = await driver.findElement(By.id('sylius_customer_phoneNumber'));
    inputName.click();
    inputName.clear();
    inputName.sendKeys('999.999.9999');

    await driver.findElement(By.id('sylius_save_changes_button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Customer has been successfully updated.'));
  });

  it("2- Create new customer", async () => {
    await driver.findElement(By.css('[class="ui right floated buttons"]')).click();
    await driver.findElement(By.id("sylius_customer_firstName")).sendKeys("Jobson");
    await driver.findElement(By.id("sylius_customer_lastName")).sendKeys("Silva");
    await driver.findElement(By.id("sylius_customer_email")).sendKeys(`${genEmail()}@gmail.com`);
    await driver.findElement(By.id("sylius_customer_group")).sendKeys("Retail");
    await driver.findElement(By.id("sylius_customer_gender")).sendKeys("Male");
    await driver.findElement(By.id("sylius_customer_birthday")).sendKeys("1987-12-12");
    await driver.findElement(By.id("sylius_customer_phoneNumber")).sendKeys("99999999");
    await driver.findElement(By.css('[class="ui labeled icon primary button"]')).click();

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    assert(bodyText.includes("Customer has been successfully created."));
  });

  it("3- Search for a user", async () => {
    await driver.findElement(By.id("criteria_search_type")).sendKeys("equal");
    await driver.findElement(By.id("criteria_search_value")).sendKeys("Jobson");
    await driver.findElement(By.css('[data-choice-name="name"]')).click();
    await sleep(2000);
    await driver.findElement(By.css('[data-value="retail"]')).click();
    await driver.findElement(By.css('[class="ui blue labeled icon button"]')).click();

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    assert(bodyText.includes("Jobson"));
    assert(bodyText.includes("Silva"));
  });

  it("4- Grant account credentials", async () => {
    await scrollRight(driver);
    await driver.findElement(By.css('[class="icon pencil"]')).click();
    await driver.findElement(By.css('[for="sylius_customer_createUser"]')).click();
    await driver.findElement(By.id("sylius_customer_user_plainPassword")).sendKeys("pass123");
    await driver.findElement(By.css('[for="sylius_customer_user_enabled"]')).click();
    await driver.findElement(By.css('[for="sylius_customer_user_verifiedAt"]')).click();
    await driver.findElement(By.css('[type="submit"]')).click();

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    assert(bodyText.includes("Customer has been successfully updated."));
  });

  it("5- Delete customer", async () => {
    await scrollRight(driver);
    const searchButton = await driver.findElements(By.css('.ui.buttons > .ui.labeled.icon.button .icon.search'));
    await searchButton[1].click();
    const searchBody = await driver.findElement(By.tagName("body")).getText();
    assert(searchBody.includes("Jobson Silva"));
    await driver.findElement(By.css('[type="submit"]')).click();
    await driver.findElement(By.css('[class="ui green ok inverted button"]')).click();

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    assert(bodyText.includes("Shop user has been successfully deleted."));
  });
});

const { Builder, By, Key, until, Browser} = require("selenium-webdriver");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const chrome = require("selenium-webdriver/chrome");

let driver;
describe("Selenium Tests", () => {
    beforeAll(async () => {
        try {
            console.log("Initializing WebDriver...");
            const chromeDriverPath = path.resolve(process.env.SELENIUM_CHROMEDRIVER_PATH); // Update this path to your ChromeDriver location
            const myService = new chrome.ServiceBuilder(chromeDriverPath);

            const options = new chrome.Options();
            // 1️⃣ Completely disable Safe Browsing (removes protection settings)
            options.addArguments("--disable-features=SafeBrowsingEnhancedProtection");

            // 2️⃣ Disable password manager popups
            options.setUserPreferences({
                "credentials_enable_service": false,  // Disables password saving
                "profile.password_manager_enabled": false, // Disables password prompts
                "safebrowsing.enabled": false, // Turns off Safe Browsing completely
            });

            // 3️⃣ Use a fresh Chrome profile (ensures no saved settings override this)
            options.addArguments("--guest"); 

            driver = await new Builder().forBrowser("chrome").setChromeService(myService).setChromeOptions(options).build();
            console.log("WebDriver initialized successfully.");
        } catch (error) {
            console.error("Error initializing WebDriver:", error);
            throw error; // Rethrow the error to fail the test setup
        }
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("User can log in and see the home page", async () => {
        // Navigate to the login page
        
        await driver.get(process.env.FRONTEND_BASE_URL);

        await driver.sleep(500);
        // Click the login button
        let loginButton = await driver.findElement(By.xpath("//*[text()='SIGN IN']"));
        await loginButton.click();        
        await driver.sleep(500);

        // Wait for the SignInDialog form to appear
        const signInForm = await driver.wait(
            until.elementLocated(By.css('[data-testid="signInForm"]')), // Locate the form using data-testid
            5000
        );        

        // Locate the email input field and enter a test email
        const emailInput = await driver.findElement(By.css('input[aria-label="Email address"]'));
        await emailInput.sendKeys('taylor@gmail.com');

        // Locate the password input field and enter a test password
        const passwordInput = await driver.findElement(By.css('input[aria-label="Password"]'));
        await passwordInput.sendKeys('taylor');
        await driver.sleep(500);

        // Locate and click the sign-in button
        const signInButton = await driver.findElement(By.id('signInButton'));
        await signInButton.click();

        const homePage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Dashboard')]")),
            10000 // Wait up to 10s
        );
        // Assert that the form is displayed
        expect(await homePage.isDisplayed()).toBe(true);
        await driver.sleep(500);
    });

    test("User can navigate to the Track page", async () => {
        //const trackButton = await driver.findElement(By.xpath("//a[@href='/track']"));
        await driver.executeScript(`
            document.querySelector('div[role="dialog"] button:last-child')?.click();
        `);
        const trackButton = await driver.wait(
            until.elementLocated(By.xpath("//a[@href='/track']")),
            10000
        );
        await trackButton.click();
        const searchInput = await driver.wait(
            until.elementLocated(By.xpath("//input[contains(@placeholder, 'Search Food Item')]")),
            5000
        );
        expect(await searchInput.isDisplayed()).toBe(true);
    },10000);

    test("User can navigate to the Meals Consumed page", async () => {
        const mealsConsumedButton = await driver.wait(
            until.elementLocated(By.xpath("//a[@href='/mealsConsumed']")),
            10000
        );
        await mealsConsumedButton.click();
        await driver.wait(until.urlContains("mealsConsumed"), 5000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(process.env.FRONTEND_BASE_URL + "/mealsConsumed");
    },10000);

    test("User can navigate to the Custom Food page", async () => {
        const customButton = await driver.wait(
            until.elementLocated(By.xpath("//a[@href='/customFood']")),
            10000
        );
        await customButton.click();
        const customPage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Create Your Own Meal')]")),
            10000
        );
        expect(await customPage.isDisplayed()).toBe(true);
    },10000);

    test("User can navigate to the Daily Dashboard page", async () => {
        const dailyDashButton = await driver.wait(
            until.elementLocated(By.xpath("//a[@href='/dailydashboard']")),
            10000
        );
        await dailyDashButton.click();
        const dailyDashPage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Nutrient Intake')]")),
            10000
        );
        expect(await dailyDashPage.isDisplayed()).toBe(true);
    },10000);

    test("User can navigate to the Historical page", async () => {
        const historicalButton = await driver.wait(
            until.elementLocated(By.xpath("//a[@href='/historical']")),
            10000
        );
        await historicalButton.click();
        const historicalPage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Historical Nutrient Intake')]")),
            10000
        );
        expect(await historicalPage.isDisplayed()).toBe(true);
    },10000);
});
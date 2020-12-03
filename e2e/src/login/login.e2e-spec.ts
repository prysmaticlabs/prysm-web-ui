import {LoginPage} from './login.po';
import {GainsPage} from '../gains/gains.po';
import {browser, logging} from 'protractor';

/**
 * Login page tests
 */
describe('Login page', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo();
  });

  it(`Page title is [${LoginPage.pageTitle}]`, () => {
    expect(browser.getTitle()).toEqual(LoginPage.pageTitle);
  });

  it('Login form is displayed', () => {
    expect(loginPage.hasLoginForm()).toBeTruthy();
  });

  it('Password input is displayed', () => {
    expect(loginPage.hasPasswordInput()).toBeTruthy();
  });

  it('[Sign in to dashboard] button is displayed', () => {
    expect(loginPage.hasSignInBtn()).toBeTruthy();
  });

  it('cannot login without a password', () => {
    loginPage.clickOnSignInBtn();
    expect(loginPage.hasLoginError()).toBeTruthy();
    expect(browser.getCurrentUrl()).toBe(LoginPage.completeUrl);
  });

  it(`cannot login with a less than 8 characters password [${LoginPage.lessThanEightCharsPwd}]`, () => {
    loginPage.typeInPasswordInput(LoginPage.lessThanEightCharsPwd);
    loginPage.clickOnSignInBtn();
    expect(loginPage.hasLoginError()).toBeTruthy();
    expect(browser.getCurrentUrl()).toBe(LoginPage.completeUrl);
  });

  it(`cannot login without a special character in the password [${LoginPage.noSpecialCharsPwd}]`, () => {
    loginPage.typeInPasswordInput(LoginPage.noSpecialCharsPwd);
    loginPage.clickOnSignInBtn();
    expect(loginPage.hasLoginError()).toBeTruthy();
    expect(browser.getCurrentUrl()).toBe(LoginPage.completeUrl);
  });

  it(`can login with a valid format password [${LoginPage.validFormatPwd}]`, () => {
    loginPage.typeInPasswordInput(LoginPage.validFormatPwd);
    loginPage.clickOnSignInBtn();
    browser.waitForAngularEnabled(false);
    expect(browser.getCurrentUrl()).toBe(GainsPage.completeUrl);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

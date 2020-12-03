import {browser, by, element} from 'protractor';

/**
 * This represents the Login Page POM
 */
export class LoginPage {

  private static readonly PAGE_RELATIVE_URL = 'login';
  private static readonly PAGE_TITLE        = 'PrysmWebUi';

  /**
   * An invalid format password (less than 8 characters, contains letters and numbers)
   */
  private static readonly LESS_THAN_EIGHT_CHARS_PWD = 'test123';

  /**
   * An invalid format password (8 characters, contains letters and numbers but no special characters)
   */
  private static readonly NO_SPECIAL_CHARS_PWD = 'test123';

  /**
   * A valid format password (at least 8 characters, 1 letter, 1 number and 1 special character)
   */
  private static readonly VALID_FORMAT_PWD = 'tester1#';

  private static readonly LOGIN_FORM_CSS     = 'app-login form.signup-form-container';
  private static readonly PASSWORD_INPUT_CSS = 'app-login form.signup-form-container input[name=\'password\']';
  private static readonly SIGN_IN_BTN_CSS    = 'app-login form.signup-form-container button[name=\'submit\']';
  private static readonly PASSWORD_ERROR_CSS = 'app-login form.signup-form-container div[name=\'passwordReq\']';

  static get relativeUrl(): string {
    return LoginPage.PAGE_RELATIVE_URL;
  }

  static get completeUrl(): string {
    return `${browser.baseUrl}${LoginPage.PAGE_RELATIVE_URL}`;
  }

  static get pageTitle(): string {
    return LoginPage.PAGE_TITLE;
  }

  static get lessThanEightCharsPwd(): string {
    return LoginPage.LESS_THAN_EIGHT_CHARS_PWD;
  }

  static get noSpecialCharsPwd(): string {
    return LoginPage.NO_SPECIAL_CHARS_PWD;
  }

  static get validFormatPwd(): string {
    return LoginPage.VALID_FORMAT_PWD;
  }

  navigateTo(): Promise<unknown> {
    return browser.get(LoginPage.relativeUrl) as Promise<unknown>;
  }

  hasLoginForm(): Promise<boolean> {
    return element(by.css(LoginPage.LOGIN_FORM_CSS)).isDisplayed() as Promise<boolean>;
  }

  hasPasswordInput(): Promise<boolean> {
    return element(by.css(LoginPage.PASSWORD_INPUT_CSS)).isDisplayed() as Promise<boolean>;
  }

  typeInPasswordInput(password: string): Promise<unknown> {
    return element(by.css(LoginPage.PASSWORD_INPUT_CSS)).sendKeys(password) as Promise<unknown>;
  }

  hasSignInBtn(): Promise<boolean> {
    return element(by.css(LoginPage.SIGN_IN_BTN_CSS)).isDisplayed() as Promise<boolean>;
  }

  clickOnSignInBtn(): Promise<unknown> {
    return element(by.css(LoginPage.SIGN_IN_BTN_CSS)).click() as Promise<unknown>;
  }

  hasLoginError(): Promise<boolean> {
    return browser.isElementPresent(by.css(LoginPage.PASSWORD_ERROR_CSS)) as Promise<boolean>;
  }
}

import {browser, by, element} from 'protractor';

/**
 * This represents the Gains and Losses Page POM
 */
export class GainsPage {

  private static readonly PAGE_RELATIVE_URL = 'dashboard/gains-and-losses';
  private static readonly PAGE_TITLE        = 'PrysmWebUi';

  static get relativeUrl(): string {
    return GainsPage.PAGE_RELATIVE_URL;
  }

  static get completeUrl(): string {
    return `${browser.baseUrl}${GainsPage.PAGE_RELATIVE_URL}`;
  }
}

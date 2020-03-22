import { OneAdminPage } from './app.po';

describe('one-admin App', () => {
  let page: OneAdminPage;

  beforeEach(() => {
    page = new OneAdminPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

import { AngularClientPage } from './app.po';

describe('angularclient App', function() {
  let page: AngularClientPage;

  beforeEach(() => {
    page = AngularClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

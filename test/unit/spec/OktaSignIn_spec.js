/* eslint max-params:[0, 2] */
define([
  'okta',
  'widget/OktaSignIn',
  'helpers/util/Expect',
  'util/Logger'
],
function (Okta, Widget, Expect, Logger) {
  var signIn;
  var url = 'https://foo.com';
  var { $ } = Okta;

  beforeEach(function () {
    spyOn(Logger, 'warn');
    signIn = new Widget({
      baseUrl: url
    });
  });

  Expect.describe('Debug Mode', function () {
    it('logs a warning message on page load', function () {
      var debugMessage = '\n' +
        'The Okta Sign-In Widget is running in development mode.\n' +
        'When you are ready to publish your app, embed the minified version to turn on production mode.\n' +
        'See: https://developer.okta.com/code/javascript/okta_sign-in_widget#cdn\n';

      expect(Logger.warn).toHaveBeenCalledWith(debugMessage);
    });
  });

  Expect.describe('OktaSignIn initialization', function () {
    Expect.describe('At the root level', function () {
      it('has a renderEl method', function () {
        expect(signIn.renderEl).toBeDefined();
      });
      it('has a showSignInToGetTokens method', function () {
        expect(signIn.showSignInToGetTokens).toBeDefined();
      });
      it('has a signOut method', function () {
        expect(signIn.signOut).toBeDefined();
      });
      it('has a tokenManager method', function () {
        expect(signIn.tokenManager).toBeDefined();
      });
      it('has a hide method', function () {
        expect(signIn.hide).toBeDefined();
      });
      it('has a show method', function () {
        expect(signIn.show).toBeDefined();
      });
      it('has a remove method', function () {
        expect(signIn.remove).toBeDefined();
      });
      it('has a getTransaction method', function () {
        expect(signIn.getTransaction).toBeDefined();
      });
    });

    Expect.describe('IdToken', function () {
      it('has an idToken method', function () {
        expect(signIn.idToken).toBeDefined();
      });
      it('has an idToken.refresh method', function () {
        expect(signIn.idToken.refresh).toBeDefined();
      });
    });

    Expect.describe('Session', function () {
      it('has a session method', function () {
        expect(signIn.session).toBeDefined();
      });
      it('has a session.close method', function () {
        expect(signIn.session.close).toBeDefined();
      });
      it('has a session.exists method', function () {
        expect(signIn.session.exists).toBeDefined();
      });
      it('has a session.get method', function () {
        expect(signIn.session.get).toBeDefined();
      });
      it('has a session.refresh method', function () {
        expect(signIn.session.refresh).toBeDefined();
      });
    });

    Expect.describe('Token', function () {
      it('has a token method', function () {
        expect(signIn.token).toBeDefined();
      });
      it('has a token.hasTokensInUrl method', function () {
        expect(signIn.token.hasTokensInUrl).toBeDefined();
      });
      it('has a token.parseTokensFromUrl method', function () {
        expect(signIn.token.parseTokensFromUrl).toBeDefined();
      });
    });

    Expect.describe('Token Manager', function () {
      beforeEach(function () {
        spyOn(localStorage, 'getItem').and.callThrough();
        spyOn(sessionStorage, 'getItem').and.callThrough();
      });
  
      afterEach(function() {
        localStorage.getItem.calls.reset();
        sessionStorage.getItem.calls.reset();
      });
  
      it('attempts to access sessionStorage if configured', function () {
        const widget = new Widget({
          baseUrl: url,
          tokenManager: {
            storage: 'sessionStorage'
          }
        });
        widget.tokenManager.get('foo');
        expect(localStorage.getItem.calls.any()).toEqual(false);
        expect(sessionStorage.getItem).toHaveBeenCalled();
      });

      it('attempts to access localStorage if token manager is not configured', function () {
        const widget = new Widget({
          baseUrl: url,
          tokenManager: { }
        });
        widget.tokenManager.get('foo');
        expect(localStorage.getItem).toHaveBeenCalled();
        expect(sessionStorage.getItem.calls.any()).toEqual(false);
      });      
    });    

    Expect.describe('getTransaction', function () {
      beforeEach(function () {
        spyOn($, 'ajax').and.callThrough();
      });
      it('throws an error if a state token is not provided', function () {
        expect(function () {
          signIn.getTransaction();
        }).toThrow(new Error('A state token is required.'));
      });
      it('calls the authentication api with a stateToken', function (done) {
        $.ajax.calls.reset();
        signIn.getTransaction('fooToken')
        .then(function(){/* Should never reach this */})
        .catch(function() {
          expect($.ajax).toHaveBeenCalledWith({
            type: 'POST',
            url: 'https://foo.com/api/v1/authn',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Okta-User-Agent-Extended': 'okta-signin-widget-9.9.99'
            },
            data: '{"stateToken":"fooToken"}',
            xhrFields: { withCredentials: true }
          });
          done();
        });
      });
    });
  });
});

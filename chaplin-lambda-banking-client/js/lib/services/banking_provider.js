define([
    'underscore',
    'chaplin',
    'lib/utils',
    'lib/services/service_provider'
], function(_, Chaplin, utils, ServiceProvider) {
    'use strict';

    var mediator = Chaplin.mediator;

    var BankingProvider = (function (_super) {

        utils.extends(BankingProvider, _super);

        function BankingProvider() {
            var serviceProvider = this;

            _.bindAll(serviceProvider, "loadHandler", "processUserData", "bankingLogout"
                , "loginHandler", "loginStatusAfterAbort", "triggerLogin"
                , "loginStatusHandler", "getLoginStatus", "saveAuthResponse"
                , "logoutHandler", "triggerLogout");

            BankingProvider.__super__.constructor.apply(serviceProvider, arguments);

//            utils.deferMethods({
//                deferred: serviceProvider,
//                methods: ['parse', 'subscribe', 'postToGraph', 'getAccumulatedInfo', 'getInfo'],
//                onDeferral: serviceProvider.load
//            });

        }

        _(BankingProvider.prototype).extend({

            // Storing here only for passing it into user
            accessToken: null,

            load: function() {
                var serviceProvider = this;
                if (serviceProvider.state() === 'resolved' || serviceProvider.loading) {
                    return;
                }
                serviceProvider.loading = true;

                // NOTE: $, _ and Backbone MUST present at this moment
                utils.loadLib('js/banking_service.js', serviceProvider.loadHandler, serviceProvider.reject);
            },

            loadHandler: function() {
                var serviceProvider = this;

                serviceProvider.loading = false;

                lambdaBanking.init();

                serviceProvider.registerHandlers();
                serviceProvider.resolve();
            },

            registerHandlers: function() {
                var serviceProvider = this;

                serviceProvider.subscribe('auth.logout', serviceProvider.bankingLogout);
            },

            unregisterHandlers: function() {
                var serviceProvider = this;

                serviceProvider.unsubscribe('auth.logout', serviceProvider.bankingLogout);
            },

            isLoaded: function() {
                return Boolean(window.lambdaBanking && lambdaBanking.login);
            },

            saveAuthResponse: function(response) {
                var serviceProvider = this;

                var authResponse = response.authResponse;
                if (authResponse) {
                    serviceProvider.accessToken = authResponse.AuthenticationToken;
                } else {
                    serviceProvider.accessToken = null;
                }
            },

            getLoginStatus: function(callback) {
                var serviceProvider = this;

                if (!callback) {
                    callback = serviceProvider.loginStatusHandler;
                }
                lambdaBanking.getLoginStatus(callback);
            },

            loginStatusHandler: function(response) {
                var serviceProvider = this;

                serviceProvider.saveAuthResponse(response);

                var authResponse = response.authResponse;
                if (authResponse) {
                    serviceProvider.publishSession(authResponse);
                    serviceProvider.getUserData();
                } else {
                    serviceProvider.logoutHandler();
                }
            },

            triggerLogin: function(loginData) {
                var serviceProvider = this;

                lambdaBanking.login(loginData, serviceProvider.loginHandler);
            },

            loginHandler: function(response) {
                var serviceProvider = this,
                    eventPayload = {
                        provider: serviceProvider
                    };

                serviceProvider.saveAuthResponse(response);

                var authResponse = response.authResponse;
                if (authResponse) {
                    mediator.publish('loginSuccessful', eventPayload);
                    serviceProvider.publishSession(authResponse);
//                    serviceProvider.getUserData();
                } else {
                    mediator.publish('loginAbort', eventPayload);
                    var loginStatusHandler = serviceProvider.loginStatusAfterAbort;
                    serviceProvider.getLoginStatus(loginStatusHandler);
                }
            },

            loginStatusAfterAbort: function(response) {
                var serviceProvider = this,
                    eventPayload = {
                        provider: serviceProvider
                    };

                serviceProvider.saveAuthResponse(response);

                var authResponse = response.authResponse;
                if (authResponse) {
                    mediator.publish('loginSuccessful', eventPayload);
                    serviceProvider.publishSession(authResponse);
                } else {
                    mediator.publish('loginFail', eventPayload);
                }
            },

            publishSession: function(authResponse) {
                mediator.publish('serviceProviderSession', {
                    provider: this,
                    userId: authResponse.userID,
                    userRole: authResponse.Role,
                    accessToken: authResponse.AuthenticationToken
                });
            },

            bankingLogout: function() {
                this.logoutHandler();
            },

            triggerLogout: function(callback) {
                var serviceProvider = this;

                if (!callback) {
                    callback = serviceProvider.logoutHandler;
                }
                lambdaBanking.logout(callback);
            },

            logoutHandler: function() {
                var serviceProvider = this;

                // NOTE: currently redundant because of saveAuthResponse calls
                serviceProvider.accessToken = null;

                mediator.publish('logout');
            },

            subscribe: function(eventType, handler) {
                lambdaBanking.on(eventType, handler);
            },

            unsubscribe: function(eventType, handler) {
                lambdaBanking.off(eventType, handler);
            },

            getInfo: function(id, callback) {
//                FB.api(id, callback);
            },

            getUserData: function() {
                var serviceProvider = this;

//                serviceProvider.getInfo('/me', serviceProvider.processUserData);
            },

            processUserData: function(response) {
                mediator.publish('userData', response);
            },

            dispose: function() {
                var serviceProvider = this;

                if (serviceProvider.disposed) {
                    return;
                }
                serviceProvider.unregisterHandlers();
                delete serviceProvider.accessToken;
                BankingProvider.__super__.dispose.apply(serviceProvider, arguments);
            }
        });

        return BankingProvider;

    })(ServiceProvider);

    return BankingProvider;
});
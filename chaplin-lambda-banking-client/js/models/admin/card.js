define([
    'chaplin',
    'moment',
    'models/base/model',
    'models/admin/user',
    'models/admin/accounts'
], function(Chaplin, moment, Model, UserModel, AccountsCollection) {
    'use strict';

    var mediator = Chaplin.mediator;

    var Card = Model.extend({

        initialize: function(attributes, options) {
            var model = this;

            _.bindAll(model, 'fetchSuccessfulHandler', 'saveSuccessfulHandler'
                , 'saveErrorHandler', 'destroySuccessfulHandler');

            Card.__super__.initialize.apply(model, arguments);

        },

        parse: function(response) {
            var attributesHash = {
                id: response['ID'],
                number: response['Number'],
                type: response['Type'],
                holder: new UserModel(UserModel.prototype.parse(response['User'])),
                expirationDate: moment(response['ExpirationDate']).format('YYYY-MM-DD'),
                state: response['CardState'],
                accounts: (function() {
                    var retVal = new AccountsCollection();
                    retVal.fetchHandler(response['Accounts']);
                    return retVal;
                })()
                // TODO: add fetchable attributes parsers here
            };

            _(attributesHash).each(function(attrValue, attrName) {
                if (typeof attrValue === "undefined") {
                    delete attributesHash[attrName];
                }
            });

            return attributesHash;
        },

        fetch: function(options) {
            var model = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/get',
                data: {
                    cardId: model.id
                },
                success: function(response) {
                    model.fetchSuccessfulHandler(response);
                    options.success.call(this, response);
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        save: function(options) {
//            var model = this,
//                attributesToSave = {
//                    FirstName: options.attributesToSave.firstName,
//                    LastName: options.attributesToSave.lastName,
//                    PassportNumber: options.attributesToSave.passportNumber,
//                    Address: options.attributesToSave.address
//                };

//            if (model.id && model.id !== 0) {
//                mediator.user.get('provider').apiRequest({
//                    url: 'admin/users/update',
//                    data: {
//                        user: _.extend({ ID: model.id }, attributesToSave)
//                    },
//                    success: function(response) {
//                        model.saveSuccessfulHandler.call(this, response);
//                        options.success.call(this, response);
//                    },
//                    error: function(jqXHR) {
//                        model.saveErrorHandler.call(this, jqXHR);
//                        options.error.call(this, jqXHR);
//                    }
//                });
//            } else {
//                mediator.user.get('provider').apiRequest({
//                    url: 'admin/users/create',
//                    data: {
//                        user: attributesToSave
//                    },
//                    success: function(response) {
//                        model.saveSuccessfulHandler.call(this, response);
//                        options.success.call(this, response);
//                    },
//                    error: function(jqXHR) {
//                        model.saveErrorHandler.call(this, jqXHR);
//                        options.error.call(this, jqXHR);
//                    }
//                });
//            }
        },

        destroy: function(options) {
            var model = this;

            mediator.user.get('provider').apiRequest({
                url: 'admin/cards/delete',  // TODO: verify this
                data: {
                    cardId: model.id
                },
                success: function() {
                    model.destroySuccessfulHandler();
                    options.success.call(this);
                },
                error: function(jqXHR) {
                    // TODO: implementation needed
                }
            });
        },

        fetchSuccessfulHandler: function(response) {
            var model = this;

            model.set(model.parse(response));
        },

        saveSuccessfulHandler: function(response) {
            var model = this;

            // For setting id, got from server (and all other auto-generated attributes)
            model.set(model.parse(response));
        },

        saveErrorHandler: function() {

        },

        destroySuccessfulHandler: function() {

        }

    });

    return Card;
});
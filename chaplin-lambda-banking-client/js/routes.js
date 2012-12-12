define(function() {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    var routes = function(match) {
        match('', 'users#index');
        match('index', 'users#index');
        match('users', 'users#index');
        match('users/:id', 'users#show');
        match('users/create', 'users#create');
        match('users/:id/edit', 'users#edit');

    };

    return routes;
});

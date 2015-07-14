/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  var nutella = NUTELLA.init('127.0.0.1', 'wallcology', 'default', 'wallcology_admin',
    function(success) {
      if (success) {
        console.log('Successfully connected nutella!');
      } else {
        console.log('Error connecting!');
      }
  });


  nutella.setResourceId('r_id');

  nutella.location.ready( function() {
    //console.log(nutella.location.resources);
  });

  nutella.net.subscribe('wallcology_admin_channel', function(message, channel) {
    //console.log(message +  ' on ' + channel);
  });

  nutella.net.publish('wallcology_admin_channel', 'I WORK');


  app.toggleWallscopes = function(event) {
    if( event.target.checked ) {

      nutella.net.publish('wallcology_admin_channel', {
        event: 'start'
      });

    } else {
      nutella.net.publish('wallcology_admin_channel', {
        event: 'stop'
      });
    }
  };

  app.addScope = function(scope) {
    var mylist = document.querySelector('#lister');
    mylist.addScope(scope);
  };

  app.addBugToScope = function(bug, scopeIndex)  {
    var mylist = document.querySelector('#lister');

    mylist.addBugToScope(bug, scopeIndex);
  };

  app.createScope = function(scopeName) {
    //console.log('we have it'+ scopeName);
    var mylist = document.querySelector('#lister');


    mylist.addScope(scopeObj(scopeName));
    //console.log('MYLIST: ' + mylist.scopes);
    //mylist.fire('updateItemsList',scopeName);
    //console.log('WEEEEE SAID HELLO' + scopeName);
    //app.scopes.push(scopeName);
    //console.log(app.scopes);
  };

  function scopeObj(scopeName) {

    var mylist = document.querySelector('#lister');
    var newId = mylist.scopes.length + 1;


    return {
      id: newId,
      name: scopeName,
      lastupdated: new Date().getTime(),
      bugs: [

      ],
    };
  }

  //app.statesLoaded = function(e) {
  //  console.log('STATESLOAD' + e);
  //};
  //
  //app.lastResponse = function(e) {
  //  console.log('STATES' + e);
  //};
  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {

    var ironAjax = document.querySelector('iron-ajax');
    ironAjax.addEventListener('response', function() {
      var configurations = ironAjax.lastResponse[0].configurations;
      app.className = configurations[0].name;
      var scopes = configurations[0].scopes;
      //console.log('scopppp' + scopes);
      for (var i = 0; i < scopes.length; i++) {
        var scope = scopes[i];
        //console.log('fuuuuk' + scope);
        app.addScope(scope);
        console.log(scope.name);
      }

      //console.log(ironAjax.lastResponse[0]['configurations'][0]);
    });

    // imports are loaded and elements have been registered
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

})(document);

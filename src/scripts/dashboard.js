'use strict';

//------------- GLOBAL VARIABLES -------------//

/**
* loadScripts() - Calls the according functions to load the page.
*/
async function loadScripts() {
  await loadHeader();
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
};

window.addEventListener('load', loadScripts);

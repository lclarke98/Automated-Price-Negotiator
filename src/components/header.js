/**
* loadHeader() - Loads and renders the pages header component.
*/
async function loadHeader() {
  const url = '/api/user/avatar';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const userAvatar = await response.text();
  const header = React.createElement(HeaderBar, {
    avatar: userAvatar
  });
  ReactDOM.render(header, document.getElementById('universal-header'));
}

;
/**
* HeaderBar() - Contains the HTML for the header component.
* @return returns the HTML for the header component
*/

function HeaderBar(props) {
  return React.createElement("div", {
    className: "header-container transition-03"
  }, React.createElement("section", {
    className: "header-container"
  }, React.createElement("div", {
    className: "header-menu"
  }, React.createElement("div", {
    onClick: openBuyUI,
    id: "buy-ui-btn",
    className: "header-menu-btn r-btn transition-02"
  }, "Buy"), React.createElement("div", {
    onClick: openSellUI,
    id: "sell-ui-btn",
    className: "header-menu-btn l-btn transition-02"
  }, "Sell")), React.createElement("div", {
    className: "header-btns"
  }, React.createElement("div", {
    className: "btn-container"
  }, React.createElement("img", {
    id: "avatar-img",
    src: props.avatar,
    alt: "Profile Image Placeholder"
  })), React.createElement("div", {
    id: "avatar-menu"
  }, React.createElement("h1", {
    id: "logout",
    onClick: gLogout
  }, "Logout")))));
}

;

function openBuyUI() {
  const sellUI = document.getElementById('sell-container');
  sellUI.style.display = 'none';
  const sellBtn = document.getElementById('sell-ui-btn');
  sellBtn.style.color = '#1478fa';
  sellBtn.style.backgroundColor = '#fff';
  const buyUI = document.getElementById('buy-container');
  buyUI.style.display = 'flex';
  const buyBtn = document.getElementById('buy-ui-btn');
  buyBtn.style.color = '#fff';
  buyBtn.style.backgroundColor = '#4293fb';
}

function openSellUI() {
  const buyUI = document.getElementById('buy-container');
  buyUI.style.display = 'none';
  const buyBtn = document.getElementById('buy-ui-btn');
  buyBtn.style.color = '#1478fa';
  buyBtn.style.backgroundColor = '#fff';
  const sellUI = document.getElementById('sell-container');
  sellUI.style.display = 'flex';
  const sellBtn = document.getElementById('sell-ui-btn');
  sellBtn.style.color = '#fff';
  sellBtn.style.backgroundColor = '#4293fb';
}
/**
* gLogout() - Logs the current user out of the application via their google account.
*/


function gLogout() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    logout();
  });
}

;
/**
* logout() - Logs the current user out and redirects them to the '/'.
*/

async function logout() {
  const url = '/auth/logout';
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    redirect: 'follow'
  });
  window.location.href = '/';
}

;
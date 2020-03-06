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
  const header = <HeaderBar avatar={userAvatar} />

  ReactDOM.render(
    header,
    document.getElementById('universal-header')
  );

  const content = <ListLayout />;
  ReactDOM.render(
    content,
    document.getElementById('main')
  );
};

// ntoe to self make logout available
/**
* HeaderBar() - Contains the HTML for the header component.
* @return returns the HTML for the header component
*/
function HeaderBar(props) {
  return (
    <div className="header-container transition-03">
      <section className="header-btns">
        <div className="btn-container">
          <img id="avatar-img" src={props.avatar} alt="Profile Image Placeholder"></img>
        </div>
        <div id="avatar-menu">
          <h1 id="logout" onClick={gLogout}>Logout</h1>
        </div>
      </section>
    </div>
  );
};

/**
* gLogout() - Logs the current user out of the application via their google account.
*/
function gLogout() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    logout();
  });
};
  
/**
* logout() - Logs the current user out and redirects them to the '/'.
*/
async function logout() {
  const url = '/auth/logout';
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    redirect: 'follow'
  })
  window.location.href = '/';
};

  class ListLayout extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        product: [],

      };
    }
  
    render () {
      return (
        <div id="list" className="list-layout">
        {this.state.product.map((name, i) =>
          <div key={i.toString()} className="cmpnt-container-l padding-0810">
          <section className="cmpnt-name">
          <h1>{this.state.assignments[i].title}</h1>
          </section>
          <div className="cmpnt-seperator"></div>
          <section className="cmpnt-info-l">
          <p>Work Due: {this.state.product[i].}</p>
          <p>Submitted: {this.state.product[i].}</p>
          <p>Reviews Due: {this.state.product[i].}</p>
          <p>Completed: {this.state.product[i].}</p>
          </section>
          <div className="cmpnt-seperator"></div>
          <section className="cmpnt-btn-container-l">
          <div className="default-btns-l">
          <a href="" className="cmpnt-btn-l">
          <span><p>Open</p></span>
          </a>
          </div>
          </section>
          </div>
        )}
        </div>
      );
    }
  };
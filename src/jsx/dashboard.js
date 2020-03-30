async function dashboardOrchestrator() {
  const getProducts = await fetch('/api/products', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const products = await getProducts.json();

  const buyUI = <BuyListUI products={products} />
  const sellUI = <AddItemForm/>

  ReactDOM.render(
    buyUI,
    document.getElementById('buy-container')
  );
  ReactDOM.render(
    sellUI,
    document.getElementById('sell-container')
  );
}

class BuyListUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.products,
    };
  }

  render () {
    return (
      <div id="list" className="list-layout">
      {this.state.product.map((name, i) =>
        <div key={i.toString()} className="cmpnt-container-l padding-0810">
        <section className="cmpnt-name">
        <h1>{this.state.product[i].product_name}</h1>
        </section>
        <div className="cmpnt-seperator"></div>
        <section className="cmpnt-info-l">
        <p>RRP: £{this.state.product[i].product_rrp}</p>
        <p>Quantity: {this.state.product[i].product_qty} in stock</p>
        </section>
        <div className="cmpnt-seperator"></div>
        <section className="cmpnt-btn-container-l">
        <div className="default-btns-l">
        <a onClick={() => renderNegotiation(this.state.product[i].product_id, this.state.product[i].product_name)} className="cmpnt-btn-l">
        <span><p>Negotiate!</p></span>
        </a>
        </div>
        </section>
        </div>
      )}
      </div>
    );
  }
};

class AddItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      productRRP: '',
      productQty: '',
      productLowestPrice: ''
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async submitHandler(event) {
    event.preventDefault();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          product: this.state,
        })
      })
      const data = await response.json();
      console.log("This is the submission result for the product")
      console.log(data)
  }

  changeHandler(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() { // Complete me
    return (
      <form onSubmit={this.submitHandler} onChange={this.changeHandler}>
      <input className="modal-input-max" type="text" name="productName" value={this.state.value} placeholder="Enter Product Name" minLength="10" maxLength="64" required />
      <input className="modal-input-max" type="number" name="productRRP" value={this.state.value} placeholder="Enter the starting price" minLength="0.01" step="0.01" maxLength="5000" required />
      <input className="modal-input-max" type="number" name="productLowestPrice" value={this.state.value} placeholder="Enter the lowest price" minLength="0.01" step="0.01" maxLength="5000" required />
      <input className="modal-input-max" type="number" name="productQty" value={this.state.value} placeholder="Enter product quantity" minLength="1" maxLength="100" required />
      <input className="modal-btn" type="submit" value="Submit" />
      </form>
    );
  }
};

function openModal() {
  document.getElementById('modal-container').style.display = "flex";
};
function closeModal() {
  ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
  document.getElementById('modal-container').style.display = "none";
};
function ModalBackBtn(props) {
  return (
    <div className="modal-back-btn">
    <span onClick={closeModal} className="fas fa-chevron-left"><p className="modal-back-btn-txt">back</p></span>
    </div>
  );
};

function ModalContainer(props) {
  return (
    <React.Fragment>
    <div className="overlay"></div>
    <div className="modal-wrapper padding-default">
    <div className="modal default-size padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">Negotiation for {props.productName}</h2>
    <p>{props.productId}</p>
    <div className="message-window">
    <div className="chat" id="chat"></div>
    </div>
    <div className="input">
    <input id="negotiation-user-input" type="text" placeholder="Enter offer" />
    <button onClick={() => sendOffer()}>Send offer</button>
    </div>
    <button onClick={() => acceptOffer()} className="">Accept</button>
    </div>
    </div>
    </React.Fragment>
  );
};

async function sendOffer() {
  const userOffer = document.getElementById("negotiation-user-input");
  const offer = userOffer.value;
  console.log(offer)
  userOffer.value = "";
}

async function acceptOffer() {
  console.log("I am the accept button")
}

async function renderNegotiation(productId, productName) {
  // create or check a negotiation exists
  const checkNegotiation = await fetch('/api/negotiation', {
    method: 'post',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({
      productId: productId,
    })
  });
  const result = await checkNegotiation.json();
  console.log(result)
  // Load the negotiaiton data here then render
  const modal = <ModalContainer productId={productId} productName={productName} />
  ReactDOM.render(
    modal,
    document.getElementById('modal-container')
  );
  openModal();
}
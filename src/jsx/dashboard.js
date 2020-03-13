async function dashboardOrchestrator() {
  const getProducts = await fetch('/api/products', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const products = await getProducts.json();

  const buyUI = <BuyListUI products={products} />

  ReactDOM.render(
    buyUI,
    document.getElementById('buy-container')
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
        <a className="cmpnt-btn-l">
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

    this.validate = this.validate.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async submitHandler(event) {
    event.preventDefault();
    const result = await this.validate(this.state);
    if (result === true) {
      const response = await fetch('/api/upload/product', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          product: this.state,
        })
      })
      const data = await response.json();
      if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        await dashboardContents();
      }
      renderMessage(data)
    } else {
      // ERROR DISPLAYED
    }
  }

  validate(data) { // Chnage me to check everything needed
    const err = document.getElementById('modal-msg');
    err.style.display = "none";
    if (/^[a-zA-Z0-9]*$/.test(data.classCode) === false) {
      err.textContent = "The name you have entered must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }
    return true;
  }

  changeHandler(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() { // Complete me
    return (
      <form onSubmit={this.submitHandler}>
      <input className="modal-input-max" type="text" name="classCode" value={this.state.value} onChange={this.changeHandler} placeholder="Enter Class ID Here" minLength="8" maxLength="8" required />
      <input className="modal-btn" type="submit" value="Submit" />
      </form>
    );
  }
};

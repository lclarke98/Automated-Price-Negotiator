async function dashboardOrchestrator() {
  const getProducts = await fetch('/api/products', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const products = await getProducts.json();
  const buyUI = React.createElement(BuyListUI, {
    products: products
  });
  ReactDOM.render(buyUI, document.getElementById('buy-container'));
  const sellUI = React.createElement(AddItemForm);
  ReactDOM.render(sellUI, document.getElementById('sell-container'));
}

class BuyListUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.products
    };
  }

  render() {
    return React.createElement("div", {
      id: "list",
      className: "list-layout"
    }, this.state.product.map((name, i) => React.createElement("div", {
      key: i.toString(),
      className: "cmpnt-container-l padding-0810"
    }, React.createElement("section", {
      className: "cmpnt-name"
    }, React.createElement("h1", null, this.state.product[i].product_name)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "RRP: \xA3", this.state.product[i].product_rrp), React.createElement("p", null, "Quantity: ", this.state.product[i].product_qty, " in stock")), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-btn-container-l"
    }, React.createElement("div", {
      className: "default-btns-l"
    }, React.createElement("a", {
      className: "cmpnt-btn-l"
    }, React.createElement("span", null, React.createElement("p", null, "Negotiate!"))))))));
  }

}

;

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: this.state
        })
      });
      const data = await response.json();

      if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        await dashboardContents();
      }

      renderMessage(data);
    } else {// ERROR DISPLAYED
    }
  }

  validate(data) {
    // Chnage me to check everything needed
    const err = document.getElementById('modal-msg');
    err.style.display = "none";

    if (/^[a-zA-Z0-9]*$/.test(data.classCode) === false) {
      err.textContent = "The name you have entered must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }

    return true;
  }

  changeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    // Complete me
    return React.createElement("form", {
      onSubmit: this.submitHandler
    }, React.createElement("input", {
      className: "modal-input-max",
      type: "text",
      name: "productName",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter Product Name",
      minLength: "10",
      maxLength: "64",
      required: true
    }), React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productRrpPrice",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter the starting price",
      minLength: "0.01",
      step: "0.01",
      maxLength: "5000",
      required: true
    }),React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productLowestPrice",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter the lowest price",
      minLength: "0.01",
      step: "0.01",
      maxLength: "5000",
      required: true
    }),React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productQuantity",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter Product quantity",
      minLength: "100",
      maxLength: "1",
      required: true
    }),React.createElement("input", {
      className: "modal-btn",
      type: "submit",
      value: "Submit"
    }));
  }

}

;
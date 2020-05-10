async function dashboardOrchestrator() {
  const getProducts = await fetch('/api/products', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const products = await getProducts.json();
  console.log(products);
  const buyUI = React.createElement(BuyListUI, {
    products: products
  });
  const sellUI = React.createElement(AddItemForm, null);
  ReactDOM.render(buyUI, document.getElementById('buy-container'));
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
    }, React.createElement("p", null, "RRP: \xA3", this.state.product[i].product_rrp), React.createElement("p", null, "Quantity: ", this.state.product[i].product_qty, " in stock"), React.createElement("p", null, "People Negotiating Now!: ", this.state.product[i].negotiations, " (", this.state.product[i].negotiations, "% Extra Group Discount)")), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-btn-container-l"
    }, React.createElement("div", {
      className: "default-btns-l"
    }, React.createElement("a", {
      onClick: () => renderNegotiation(this.state.product[i].product_id, this.state.product[i].product_name),
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
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async submitHandler(event) {
    event.preventDefault();
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: this.state
      })
    });
    const data = await response.json();
    console.log("This is the submission result for the product");
    console.log(data);
  }

  changeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    // Complete me
    return React.createElement("form", {
      onSubmit: this.submitHandler,
      onChange: this.changeHandler
    }, React.createElement("input", {
      className: "modal-input-max",
      type: "text",
      name: "productName",
      value: this.state.value,
      placeholder: "Enter Product Name",
      minLength: "10",
      maxLength: "64",
      required: true
    }), React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productRRP",
      value: this.state.value,
      placeholder: "Enter the starting price",
      minLength: "0.01",
      step: "0.01",
      maxLength: "5000",
      required: true
    }), React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productLowestPrice",
      value: this.state.value,
      placeholder: "Enter the lowest price",
      minLength: "0.01",
      step: "0.01",
      maxLength: "5000",
      required: true
    }), React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productQty",
      value: this.state.value,
      placeholder: "Enter product quantity",
      minLength: "1",
      maxLength: "100",
      required: true
    }), React.createElement("input", {
      className: "modal-btn",
      type: "submit",
      value: "Submit"
    }));
  }

}

;

function openModal() {
  document.getElementById('modal-container').style.display = "flex";
}

;

function closeModal() {
  ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
  document.getElementById('modal-container').style.display = "none";
}

;

function ModalBackBtn(props) {
  return React.createElement("div", {
    className: "modal-back-btn"
  }, React.createElement("span", {
    onClick: closeModal,
    className: "fas fa-chevron-left"
  }, React.createElement("p", {
    className: "modal-back-btn-txt"
  }, "back")));
}

;

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      negotiationId: props.negotiationId,
      productId: props.productId,
      productName: props.productName,
      messages: props.messages,
      class: ["user-chat", "bot-chat"]
    };
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: "overlay"
    }), React.createElement("div", {
      className: "modal-wrapper padding-default"
    }, React.createElement("div", {
      className: "modal default-size padding-default"
    }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
      id: "modal-title",
      className: "modal-title"
    }, "Negotiation for ", this.state.productName), React.createElement("p", null, this.state.productId), React.createElement("div", {
      className: "message-window"
    }, React.createElement("div", {
      className: "chat",
      id: "chat"
    }, this.state.messages.map((val, i) => React.createElement("div", {
      className: this.state.class[i % 2]
    }, this.state.messages[i].message)))), React.createElement("div", {
      className: "input"
    }, React.createElement("input", {
      id: "negotiation-user-input",
      type: "text",
      placeholder: "Enter offer"
    }), React.createElement("button", {
      onClick: () => sendOffer(this.state.negotiationId, this.state.productId)
    }, "Send offer")), React.createElement("button", {
      onClick: () => acceptOffer(),
      className: ""
    }, "Accept"))));
  }

}

;

async function sendOffer(negotiationId, productId) {
  const userOffer = document.getElementById("negotiation-user-input");
  const offer = userOffer.value;
  console.log(offer);
  console.log(productId)
  userOffer.value = "";
  const sendOffer = await fetch('/api/negotiation', {
    method: 'post',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({
      productId: productId,
      negotiationId: negotiationId,
      offerValue: offer,
    })
  });
  const result = await sendOffer.json();
}

async function acceptOffer() {
  console.log("I am the accept button");
}

async function renderNegotiation(productId, productName) {
  // create or check a negotiation exists
  const checkNegotiation = await fetch('/api/negotiation', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productId: productId
    })
  });
  const result = await checkNegotiation.json();
  console.log(result); // Load the negotiaiton data here then render

  const modal = React.createElement(ModalContainer, {
    negotiationId: result.negotiationId,
    productId: result.productId,
    productName: result.productName,
    messages: result.chat
  });
  ReactDOM.render(modal, document.getElementById('modal-container'));
  openModal();
}
async function dashboardOrchestrator() {
  const getProducts = await fetch('/api/products', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const products = await getProducts.json();
  console.log(products);
  const buyUI = /*#__PURE__*/React.createElement(BuyListUI, {
    products: products
  });
  const sellUI = /*#__PURE__*/React.createElement(AddItemForm, null);
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
    return /*#__PURE__*/React.createElement("div", {
      id: "list",
      className: "list-layout"
    }, this.state.product.map((name, i) => /*#__PURE__*/React.createElement("div", {
      key: i.toString(),
      className: "cmpnt-container-l padding-0810"
    }, /*#__PURE__*/React.createElement("section", {
      className: "cmpnt-name"
    }, /*#__PURE__*/React.createElement("h1", null, this.state.product[i].product_name)), /*#__PURE__*/React.createElement("div", {
      className: "cmpnt-seperator"
    }), /*#__PURE__*/React.createElement("section", {
      className: "cmpnt-info-l"
    }, /*#__PURE__*/React.createElement("p", null, "RRP: \xA3", this.state.product[i].product_rrp), /*#__PURE__*/React.createElement("p", null, "Quantity: ", this.state.product[i].product_qty, " in stock"), /*#__PURE__*/React.createElement("p", null, "People Negotiating Now!: ", this.state.product[i].negotiations, " (", this.state.product[i].negotiations, "% Extra Group Discount)")), /*#__PURE__*/React.createElement("div", {
      className: "cmpnt-seperator"
    }), /*#__PURE__*/React.createElement("section", {
      className: "cmpnt-btn-container-l"
    }, /*#__PURE__*/React.createElement("div", {
      className: "default-btns-l"
    }, /*#__PURE__*/React.createElement("a", {
      onClick: () => renderNegotiation(this.state.product[i].product_id, this.state.product[i].product_name),
      className: "cmpnt-btn-l"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("p", null, "Negotiate!"))))))));
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
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.submitHandler,
      onChange: this.changeHandler
    }, /*#__PURE__*/React.createElement("input", {
      className: "modal-input-max",
      type: "text",
      name: "productName",
      value: this.state.value,
      placeholder: "Enter Product Name",
      minLength: "10",
      maxLength: "64",
      required: true
    }), /*#__PURE__*/React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productRRP",
      value: this.state.value,
      placeholder: "Enter the starting price",
      minLength: "0.01",
      step: "0.01",
      maxLength: "5000",
      required: true
    }), /*#__PURE__*/React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productLowestPrice",
      value: this.state.value,
      placeholder: "Enter the lowest price",
      minLength: "0.01",
      step: "0.01",
      maxLength: "5000",
      required: true
    }), /*#__PURE__*/React.createElement("input", {
      className: "modal-input-max",
      type: "number",
      name: "productQty",
      value: this.state.value,
      placeholder: "Enter product quantity",
      minLength: "1",
      maxLength: "100",
      required: true
    }), /*#__PURE__*/React.createElement("input", {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-back-btn"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: closeModal,
    className: "fas fa-chevron-left"
  }, /*#__PURE__*/React.createElement("p", {
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
      class: ["user-chat", "bot-chat"],
      startResponse: ["I would like a group buying deal for", "For"],
      endResponse: ["to purchase this item at £", "How about £"]
    };
    console.log("modal");
    console.log(this.state);
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "overlay"
    }), /*#__PURE__*/React.createElement("div", {
      className: "modal-wrapper padding-default"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal default-size padding-default"
    }, /*#__PURE__*/React.createElement(ModalBackBtn, null), /*#__PURE__*/React.createElement("h2", {
      id: "modal-title",
      className: "modal-title"
    }, "Negotiation for ", this.state.productName), /*#__PURE__*/React.createElement("p", null, this.state.productId), /*#__PURE__*/React.createElement("p", null, "Welcome, please enter your offer using the two input boxes displayed below."), /*#__PURE__*/React.createElement("div", {
      className: "message-window"
    }, /*#__PURE__*/React.createElement("div", {
      className: "chat",
      id: "chat"
    }, this.state.messages.map((val, i) => /*#__PURE__*/React.createElement("div", {
      className: this.state.class[i % 2]
    }, this.state.startResponse[i % 2], " ", this.state.messages[i].qty, " buying clients ", this.state.endResponse[i % 2], this.state.messages[i].message, " per item")))), /*#__PURE__*/React.createElement("div", {
      className: "input"
    }, /*#__PURE__*/React.createElement("input", {
      id: "negotiation-user-qty",
      type: "text",
      placeholder: "Enter the minimum number of buying clients"
    }), /*#__PURE__*/React.createElement("input", {
      id: "negotiation-user-price",
      type: "text",
      placeholder: "Enter price"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => sendOffer(this.state.negotiationId, this.state.productId)
    }, "Send offer"), /*#__PURE__*/React.createElement("button", {
      onClick: () => acceptOffer(),
      className: ""
    }, "Accept"))));
  }

}

;

async function sendOffer(negotiationId, productId) {
  const userOfferQty = document.getElementById("negotiation-user-qty");
  const userOfferPrice = document.getElementById("negotiation-user-price");
  const qty = userOfferQty.value;
  const price = userOfferPrice.value;
  userOfferPrice.value = "";
  const sendOffer = await fetch('/api/response', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productId: productId,
      negotiationId: negotiationId,
      offerValue: price,
      offerQty: qty
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
  console.log("results from server");
  console.log(result); // Load the negotiaiton data here then render

  const modal = /*#__PURE__*/React.createElement(ModalContainer, {
    negotiationId: result.negotiationId,
    productId: result.product_id,
    productName: result.product_name,
    messages: result.messages
  });
  ReactDOM.render(modal, document.getElementById('modal-container'));
  openModal();
}
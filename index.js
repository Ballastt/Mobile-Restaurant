import { menuArray } from "./data.js";

const menuContainer = document.getElementById("menu-container");
const orderSummaryContainer = document.getElementById("order-summary");
const paymentModal = document.getElementById("payment-modal");

// Order state
let orderItems = [];
console.log(orderItems);

function getMenuHtml() {
  let menuHtml = "";

  menuArray.forEach(function (item) {
    menuHtml += `
            <div class="menu-item">
                <img src="Icons/${item.icon}" alt="${
      item.name
    }" class="menu-item-image"/>
                <div class="menu-description">
                        <h2 class="menu-item-name">${item.name}</h2>
                        <p class="menu-item-ingredients">${item.ingredients.join(
                          ", "
                        )}</p>
                        <p class="menu-item-price">$${item.price}</p>
                </div>  
                    <img 
                        src="Icons/add-btn.png" 
                        alt="Add to Order" 
                        class="add-to-order-btn"
                        data-id="${item.id}"
                    />
            </div>
            <div class="menu-item-divider"></div>
        `;
  });

  return menuHtml;
}

menuContainer.innerHTML = getMenuHtml();

function addItemToOrder(menuItem) {
  // Check if item already exists in order
  const existingItem = orderItems.find((item) => item.id === menuItem.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    orderItems.push({ ...menuItem, quantity: 1 });
  }

  // Show order summary if it's the first item
  if (orderItems.length === 1 && orderItems[0].quantity === 1) {
    orderSummaryContainer.style.display = "block";
  }

  renderOrderSummary();
}

function removeItemFromOrder(itemId) {
  //find item in orderItems
  const item = orderItems.find((item) => item.id == itemId);
  console.log(item);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      orderItems = orderItems.filter((orderItem) => orderItem.id != itemId);
    }
  }
  if (orderItems.length == 0) {
    orderSummaryContainer.style.display = "none";
  }
  renderOrderSummary();
}

function renderOrderSummary() {
  let orderHtml = "<h3>Your Order</h3>";
  let totalPrice = 0;

  orderItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    orderHtml += `
            <div class="order-item">
                <div class="order-item-left">
                    <span class="order-item-name">${item.name}</span>
                    <span class="remove-item-btn" data-id="${item.id}">remove</span>
                </div>
                <div class="order-item-right">
                    <span class="order-item-price">$${itemTotal}</span>
                </div>
            </div>
        `;
  });

  orderHtml += `
        <div class="order-divider"></div>
        <div class="order-total">
            <span>Total price: </span>
            <span>$${totalPrice}</span>
        </div>
        <button class="complete-order-btn">Complete Order</button>
    `;

  orderSummaryContainer.innerHTML = orderHtml;
}

function showPaymentModal() {
  // Implementation for rendering payment modal
  paymentModal.innerHTML = `
    <div class="modal-content">
      <h4>Enter card details</h4>
      <form id="payment-form">
        <input type="text" name="fullName" id="name-input" placeholder="Enter your name" required />
        <input type="text" name="cardNumber" id="card-input" placeholder="Enter card number" required maxlength="16" />
        <input type="text" name="cvv" id="cvv-input" placeholder="Enter CVV" required maxlength="3" />
        <button id="pay-btn">Pay</button>
      </form>
    </div>
  `;
}

// Event Listener for Add to Order Buttons using event delegation
menuContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-order-btn")) {
    const itemId = e.target.getAttribute("data-id");
    const menuItem = menuArray.find((item) => item.id == itemId);
    addItemToOrder(menuItem);
  }
});

// Event Listener for Remove Item Buttons using event delegation
orderSummaryContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-item-btn")) {
    const itemId = e.target.getAttribute("data-id");
    // Using filter - creates a NEW array without the item
    removeItemFromOrder(itemId);
  }

  if (e.target.classList.contains("complete-order-btn")) {
    // Show payment modal
    showPaymentModal();
    paymentModal.style.display = "block";
  }
  console.log("modal click detected");
  console.log(orderItems);
});


// Event Listener for Payment Form Submission using event delegation
paymentModal.addEventListener("submit", function (e) {
  e.preventDefault(); 
  
  // Get the customer name from the form
  const customerName = document.getElementById("name-input").value;
  
  // Close modal
  paymentModal.style.display = "none";
  paymentModal.innerHTML = ""; // Clear modal content
  
  // Show thank you message
  orderSummaryContainer.innerHTML = `<h3 class="order-confirmation">Thanks, ${customerName}! Your order is on its way!</h3>`;
  
  orderItems = []; // Clear the order
});
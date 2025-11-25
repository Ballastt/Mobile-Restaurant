import { menuArray } from "./data.js";

const menuContainer = document.getElementById("menu-container");
const orderSummaryContainer = document.getElementById("order-summary");

// Order state
let orderItems = [];

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
                    <span class="remove-item-btn">remove</span>
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

// Event Listener for Add to Order Buttons using event delegation
menuContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-order-btn")) {
    const itemId = e.target.getAttribute("data-id");
    const menuItem = menuArray.find((item) => item.id == itemId);
    addItemToOrder(menuItem);
  }
});

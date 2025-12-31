// DOM Elements
const orderSummarySection = document.getElementById("orderSummarySection");
const summaryItems = document.getElementById("summaryItems");
const subtotalElement = document.getElementById("subtotal");
const discountElement = document.getElementById("discount");
const totalAmountElement = document.getElementById("totalAmount");
const loadingSpinner = document.getElementById("loadingSpinner");
const checkoutForm = document.getElementById("checkoutForm");
const formSection = document.getElementById("formSection");
const successSection = document.getElementById("successSection");

// API URL
const API_BASE_URL = "http://localhost:3000";

// Order data storage
let orderData = {
  sessionId: null,
  items: [],
  subtotal: 0,
  deliveryCharges: 300,
  total: 0,
};
// Fetching Cart Data
async function fetchCartData() {
  try {
    showLoading();

    console.log("Fetching cart from:", `${API_BASE_URL}/cart`);

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    console.log("Response Status:", response.status);

    if (response.status === 404) {
      showEmptyCart();
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const responseText = await response.text();
    console.log("Raw Response:", responseText);

    let cartData;
    try {
      cartData = JSON.parse(responseText);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("Invalid response format");
    }

    console.log("Cart Data:", cartData);

    processCartData(cartData);
  } catch (error) {
    console.error("Error:", error);
    showError(`Could not load cart: ${error.message}`);
  }
}
// Processing Cart Data
function processCartData(cartData) {
  orderData = {
    sessionId: null,
    items: [],
    subtotal: 0,
    deliveryCharges: 300,
    total: 0,
  };

  if (Array.isArray(cartData)) {
    orderData.items = cartData;
    orderData.subtotal = calculateSubtotal(cartData);
  } else if (cartData && typeof cartData === "object") {
    // Get SESSION ID
    orderData.sessionId = cartData.sessionId || cartData.session_id || null;

    if (Array.isArray(cartData.items)) {
      orderData.items = cartData.items;
    } else if (Array.isArray(cartData.cartItems)) {
      orderData.items = cartData.cartItems;
    } else if (Array.isArray(cartData.products)) {
      orderData.items = cartData.products;
    } else if (Array.isArray(cartData.data)) {
      orderData.items = cartData.data;
    }

    orderData.subtotal =
      parseFloat(cartData.subtotal) ||
      parseFloat(cartData.total) ||
      parseFloat(cartData.grandTotal) ||
      0;
  }

  if (orderData.subtotal === 0 && orderData.items.length > 0) {
    orderData.subtotal = calculateSubtotal(orderData.items);
  }

  orderData.total = orderData.subtotal + orderData.deliveryCharges;

  console.log("Calculated:");
  console.log("- Items:", orderData.items.length);
  console.log("- Subtotal:", orderData.subtotal);
  console.log("- Delivery:", orderData.deliveryCharges);
  console.log("- Total:", orderData.total);

  updateOrderSummary();
}

function calculateSubtotal(items) {
  return items.reduce((total, item) => {
    const price =
      parseFloat(item.price) ||
      parseFloat(item.product_price) ||
      parseFloat(item.productId?.price) ||
      0;
    const quantity = parseInt(item.quantity) || parseInt(item.qty) || 1;
    return total + price * quantity;
  }, 0);
}

//updating UI
function updateOrderSummary() {
  loadingSpinner.style.display = "none";

  if (orderData.items.length === 0) {
    showEmptyCart();
    return;
  }

  let itemsHTML = "";
  orderData.items.forEach((item, index) => {
    const itemPrice =
      parseFloat(item.price) ||
      parseFloat(item.product_price) ||
      parseFloat(item.productId?.price) ||
      0;
    const itemName =
      item.name ||
      item.product_name ||
      item.productId?.name ||
      `Item ${index + 1}`;
    const itemQuantity = parseInt(item.quantity) || parseInt(item.qty) || 1;
    const itemTotal = itemPrice * itemQuantity;

    itemsHTML += `
            <div class="item-row">
                <div class="item-name">${itemName}</div>
                <div class="item-quantity">x${itemQuantity}</div>
                <div class="item-price">Rs. ${itemPrice.toLocaleString()}</div>
                <div class="item-total">Rs. ${itemTotal.toLocaleString()}</div>
            </div>
        `;
  });

  summaryItems.innerHTML = itemsHTML;

  subtotalElement.textContent = `Rs. ${orderData.subtotal.toLocaleString()}`;
  discountElement.textContent = `Rs. 0`;
  totalAmountElement.textContent = `Rs. ${orderData.total.toLocaleString()}`;
}

function showEmptyCart() {
  loadingSpinner.style.display = "none";
  summaryItems.innerHTML = `
        <div class="error-message">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
            <p style="font-size: 14px; margin-top: 5px;">Add items to proceed with checkout.</p>
        </div>
    `;

  subtotalElement.textContent = `Rs. 0`;
  discountElement.textContent = `Rs. 0`;
  totalAmountElement.textContent = `Rs. 300`;
}

function showLoading() {
  loadingSpinner.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading cart items...</p>
    `;
  loadingSpinner.style.display = "block";
}

function showError(message) {
  loadingSpinner.style.display = "none";
  summaryItems.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="fetchCartData()" style="margin-top: 10px; padding: 8px 15px; background: #a6957d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-redo"></i> Try Again
            </button>
        </div>
    `;
}
// form submission
checkoutForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const submitBtn = document.querySelector(".submit-btn");

  let isValid = true;
  [fullName, email, phone, address].forEach((field) => {
    field.style.borderColor = "#e8dfd1";
  });

  if (!fullName.value.trim()) {
    fullName.style.borderColor = "#e74c3c";
    isValid = false;
  }

  const emailValue = email.value.trim();
  if (!emailValue || !emailValue.includes("@") || !emailValue.includes(".")) {
    email.style.borderColor = "#e74c3c";
    isValid = false;
  }

  const phoneValue = phone.value.replace(/\D/g, "");
  if (!phoneValue || phoneValue.length !== 11 || !phoneValue.startsWith("03")) {
    phone.style.borderColor = "#e74c3c";
    isValid = false;
  }

  if (!address.value.trim() || address.value.trim().length < 10) {
    address.style.borderColor = "#e74c3c";
    isValid = false;
  }

  if (!isValid) {
    alert("Please fill all fields correctly");
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
  submitBtn.disabled = true;

  try {
   const checkoutData = {
  // Matches Schema: name, email, phone, address
  username: fullName.value.trim(),
  sessionId:orderData.sessionId,
  email: email.value.trim(),
  phone: phone.value.replace(/\D/g, ""),
  shippingAddress: address.value.trim(),

  // Matches Schema: products (not items)
  products: orderData.items.map((item) => ({
    productId: item.productId?._id || null, // Matches Schema: productId
    name: item.productId?.name || "Product",
    price: parseFloat(item.productId?.price) || parseFloat(item.product_price) || 0,
    quantity: parseInt(item.quantity) || parseInt(item.qty) || 1
  })),

  totalAmount: orderData.total, // Matches Schema: totalAmount
  orderDate: new Date().toISOString(),
  status: "Pending" // Note: Schema uses capital "Pending"
};
    console.log("Sending to checkout:", checkoutData);

    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials:"include",
      body: JSON.stringify(checkoutData),
    });

    console.log("Checkout response status:", response.status);

    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Order successful:", result);

    formSection.style.display = "none";
    orderSummarySection.style.display = "none";
    successSection.style.display = "block";

    successSection.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Order error:", error);
    alert(`Order failed: ${error.message}. Please try again.`);

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Phone Formatting
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.substring(0, 11);

  let formatted = "";
  for (let i = 0; i < value.length; i++) {
    if (i === 4) formatted += " ";
    if (i === 7) formatted += " ";
    formatted += value[i];
  }

  e.target.value = formatted;
});
// Input Effects
document.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("focus", function () {
    this.style.borderColor = "#a6957d";
  });

  input.addEventListener("blur", function () {
    if (!this.value.trim()) {
      this.style.borderColor = "#e8dfd1";
    }
  });
});
// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, fetching cart...");
  fetchCartData();
});

/* ===================== ADMIN PANEL JS ===================== */
const API_URL = "http://localhost:3000";

/* ---------- HELPER ---------- */
function showAlert(msg) {
  alert(msg);
}

/* ===================== CATEGORIES ===================== */

// CREATE CATEGORY
async function createCategory() {
  const name = document.getElementById("categoryName").value.trim();
  if (!name) {
    alert("Category name is required");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/category/create-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message)
      location.reload();
    } else {
      alert(data.message || "Failed to add category");
    }
  } catch (err) {
    console.error(err);
  }
}

/* ===================== PRODUCTS ===================== */

// CREATE PRODUCT
async function createProduct() {
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const category = document.getElementById("prodCategory").value;
  const quantity = document.getElementById("prodQuantity").value; // Added
  const description = document.getElementById("prodDescription").value; // Added
  const imageInput = document.getElementById("prodImage");

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("quantity", quantity);
  formData.append("description", description);

  if (imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }

  try {
    const res = await fetch(`${API_URL}/products/create-products`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Product created!");
      location.reload();
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Create error:", err);
    alert("Server connection failed");
  }
}

// DELETE PRODUCT
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product deleted successfully");
      location.reload(); // Refresh the table
    } else {
      alert(data.message || "Failed to delete product");
    }
  } catch (err) {
    console.error("Delete Error:", err);
    alert("Connection error to backend");
  }
}

/* ===================== ORDERS ===================== */

// UPDATE ORDER STATUS
async function updateOrderStatus(orderId, status) {
  console.log("Updating Order ID:", orderId);
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(data.message || "Order status updated");
      location.reload();
    } else {
      showAlert(data.message || "Update failed");
    }
  } catch (err) {
    console.error(err);
  }
}

// DELETE ORDER
async function deleteOrder(orderId) {
  if (!confirm("Delete this order?")) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(data.message || "Order deleted");
      location.reload();
    } else {
      showAlert(data.message || "Delete failed");
    }
  } catch (err) {
    console.error(err);
  }
}
function handleStatusUpdate(id, status) {
  if (confirm(`Change status to ${status}?`)) {
    updateOrderStatus(id, status);
  }
}

function handleDeleteOrder(id) {
  if (confirm("Are you sure you want to delete this order?")) {
    deleteOrder(id);
  }
}

/* ===================== PAGINATION ===================== */

function changePage(page, section) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  url.searchParams.set("section", section);
  window.location.href = url.toString();
}

/* ===================== DASHBOARD LOAD ===================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin panel loaded successfully");
});

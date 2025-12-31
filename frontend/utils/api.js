const API_URL = "http://localhost:3000";

//get for all products
async function getProducts() {
  console.log("Fetching products...");
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    // console.log(data)
    if (data.success) {
      return data.products;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

//get for details
async function getProductId(id) {
  console.log("Fetching product by id for details...");
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (data.success) {
      return data.product;
    }
  } catch (err) {
    console.error("Error fetching product by id:", err);
  }
}

//get for product search
async function getProductName(query) {
  console.log("Fetching product by category...");
  try {
    const response = await fetch(
      `${API_URL}/products/search?search=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    if (data.success) {
      return data.products;
    } else {
      console.error("Search API returned no success:", data);
      return [];
    }
  } catch (err) {
    console.error("Error searching products:", err);
  }
}

// Get all categories
async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/category`);
    const data = await response.json();
    return data.categories;
    
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}


// Get all orders (ADMIN)
async function getOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed:", response.status);
      return [];
    }

    const data = await response.json();

    if (response.ok) {
      console.log("Orders fetched successfully");
      return data.orders || [];
    }

    return [];
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

//get for  cart items
async function getCartItems(req) {
  console.log("Fetching cart items...");
  try {
    const cookieHeader = req ? req.headers.cookie : "";
    const response = await fetch("http://localhost:3000/cart", {
      method: "GET",
      headers: { Cookie: cookieHeader },
    });

    const data = await response.json();
    console.log("RAW DATA:", data);
    return data.items || [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

module.exports = {
  getProducts,
  getProductId,
  getProductName,
  getCartItems,
  getCategories,
  getOrders,
};

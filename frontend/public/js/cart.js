document.querySelectorAll(".addCart-form").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Get the data from the form
    const productId = form.querySelector('input[name="productId"]').value;
    const quantity = form.querySelector(".qty-input").value;

    try {
      // 2. Send the POST request
      const response = await fetch(
        "http://localhost:3000/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId: productId,
            quantity: Number(quantity),
          }),
        }
      );

      const result = await response.json();
      console.log("Full API Response:", result); // Add this for debugging
      if (response.ok) {
        alert("Product added to cart successfully!");
//  window.location.href = "/cart";
         console.log("Success:", result);
      } else {
        alert("Error: " + (result.message || "Could not add to cart"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});

//update 

async function updateQty(productId, delta) {
    const qtySpan = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtySpan.innerText);
    let newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
        const res = await fetch(`http://localhost:3000/cart/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ quantity: newQty })
        });

        const data = await res.json();
        if (res.ok) {
          console.log(data.message)
            qtySpan.innerText = newQty;
            updateSummary(data.cart); // recalc totals
        } else {
            console.error(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

async function removeItem(productId) {
    try {
        const res = await fetch(`http://localhost:3000/cart/${productId}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await res.json();
        if (res.ok) {
           console.log(data.message)
            const itemDiv = document.getElementById(`cart-item-${productId}`);
            if (itemDiv) itemDiv.remove();
            updateSummary(data.cart);

            if (!data.cart.items || data.cart.items.length === 0) {
                document.querySelector(".cart-items").innerHTML = "<p>Your cart is empty</p>";
            }
        } else {
            console.error(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

// Recalculate subtotal & total dynamically
function updateSummary(cart) {
    let subtotal = 0;
    const items = cart.items || cart.products;
    if (items && items.length > 0) {
        items.forEach(item => {
            const price = Number(item.price || item.productId?.price) || 0;
            const qty = Number(item.quantity) || 0;
            subtotal += price * qty;
        });
    }
    document.getElementById('subtotal-value').innerText = "$" + subtotal.toFixed(2);
    document.getElementById('total-value').innerText = "$" + subtotal.toFixed(2);
}



          
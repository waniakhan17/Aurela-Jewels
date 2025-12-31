function increaseQty(btn) {
    const input = btn.previousElementSibling;
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(btn) {
    const input = btn.nextElementSibling;
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}
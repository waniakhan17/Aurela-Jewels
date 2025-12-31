const searchInp=document.getElementById("searchInput");
searchInp.addEventListener('keypress',(e)=>{
if(e.key==="Enter"){
    const query=searchInp.value.trim()
    const url=query?`/products/search?search=${encodeURIComponent(query)}` : `/products/search`;
    window.location.href=url;

}
})

//clicks
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const query = btn.dataset.query;
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // navigation
        const url = query === "all"
            ? "/products"
            : `/products/search?search=${encodeURIComponent(query)}`;

        window.location.href = url;
    });
});
 // 2️⃣ activate on page load (from URL)
    const currentPath = window.location.pathname;
    const currentSearch = new URLSearchParams(window.location.search).get("search");

    filterButtons.forEach(btn => {
        btn.classList.remove("active");

        if (
            (btn.dataset.query === "all" && currentPath === "/products") ||
            btn.dataset.query === currentSearch
        ) {
            btn.classList.add("active");
        }
    });
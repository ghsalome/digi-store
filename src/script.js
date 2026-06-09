const apiUrl = "http://127.0.0.1:5000/products";

async function LoadProducts() {
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        const container = document.getElementById("products");
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = `
                        <div class="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p>Geen producten gevonden. Voeg je eerste product toe!</p>
                        </div>
                    `;
            return;
        }

        data.forEach((product) => {
            const div = document.createElement("div");
            div.className = "product";
            div.innerHTML = `
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">€ ${product.price.toFixed(2)}</div>
                        </div>
                        <div class="product-actions">
                            <button class="btn-edit" onclick="window.location.href='edit.html?id=${product.id}'">✏️ Aanpassen</button>
                            <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️ Verwijderen</button>
                        </div>
                    `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Fout bij laden van producten:", error);
    }
}

document.getElementById("button").addEventListener("click", addProduct)

async function addProduct() {
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);

    // if (!name || isNaN(price) || price < 0) {
    //     alert("⚠️ Vul een geldige naam en prijs in.");
    //     return;
    // }

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price }),
        });

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        LoadProducts();
    } catch (error) {
        console.error("Fout bij toevoegen:", error);
        alert("❌ Er ging iets mis bij het toevoegen van het product.");
    }
}

async function deleteProduct(id) {
    if (confirm("Weet je zeker dat je dit product wilt verwijderen?")) {
        try {
            await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
            LoadProducts();
        } catch (error) {
            console.error("Fout bij verwijderen:", error);
        }
    }
}

LoadProducts();




 const apiUrl = "http://127.0.0.1:5000/products";
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        async function loadProduct() {
            if (!productId) {
                alert("Geen product ID gevonden!");
                window.location.href = "index.html";
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/${productId}`);
                const product = await res.json();

                document.getElementById("name").value = product.name;
                document.getElementById("price").value = product.price;
            } catch (error) {
                console.error("Fout bij laden van product:", error);
                alert("Product kon niet worden geladen!");
                window.location.href = "index.html";
            }
        }

        document.getElementById("update_button").addEventListener("click", updateProduct)

        async function updateProduct() {
            const name = document.getElementById("name").value;
            const price = parseFloat(document.getElementById("price").value);

            if (!name || isNaN(price) || price < 0) {
                alert("⚠️ Vul een geldige naam en prijs in.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/${productId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, price })
                });

                if (response.ok) {
                    alert("✅ Product succesvol bijgewerkt!");
                    window.location.href = "index.html";
                } else {
                    alert("❌ Er ging iets mis bij het bijwerken.");
                }
            } catch (error) {
                console.error("Fout bij bijwerken:", error);
                alert("❌ Er ging iets mis bij het bijwerken van het product.");
            }
        }

        document.getElementById("back_button").addEventListener("click", goBack)

        function goBack() {
            window.location.href = "index.html";
        }

        loadProduct();
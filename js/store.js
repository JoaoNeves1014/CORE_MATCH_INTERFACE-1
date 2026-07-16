document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
        
        const estaLogado = localStorage.getItem("usuarioLogado");

        if (estaLogado === "true") {
            authButtons.style.display = "none";
            
        }
    
    function logout() {
        localStorage.removeItem("usuarioLogado");
        window.location.reload();
    }

    const modal = document.getElementById("productModal");
    const closeModalBtn = document.querySelector(".close-modal");
    
    const modalImg = document.getElementById("modalProductImg");
    const modalName = document.getElementById("modalProductName");
    const modalPrice = document.getElementById("modalProductPrice");
    const modalDesc = document.getElementById("modalProductDesc");
    const modalSpecs = document.getElementById("modalProductSpecs");
    const modalRedirectBtn = document.getElementById("modalRedirectBtn");

    let cardAtivo = null;

    const botoesComprar = document.querySelectorAll(".btn-buy");
    
    botoesComprar.forEach(botao => {
        botao.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();

            cardAtivo = botao.closest(".card");''
            if (!cardAtivo) return;

            const titulo = cardAtivo.querySelector("h3").innerText;
            const imagem = cardAtivo.querySelector(".card-image img").getAttribute("src");
            const precoTexto = cardAtivo.querySelector(".price").innerText;
            
            const productDesc = cardAtivo.getAttribute("data-desc") || "Descrição detalhada em breve.";
            const productSpecs = cardAtivo.getAttribute("data-specs") || "Especificações técnicas não informadas.";

            modalImg.src = imagem;
            modalImg.alt = titulo;
            modalName.innerText = titulo;
            modalPrice.innerText = precoTexto;
            modalDesc.innerText = productDesc;
            modalSpecs.innerText = productSpecs;

            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
        });
    });

    if (modalRedirectBtn) {
        modalRedirectBtn.addEventListener("click", (event) => {
            event.preventDefault();
            if (!cardAtivo) return;

            const titulo = cardAtivo.querySelector("h3").innerText;
            const imagem = cardAtivo.querySelector(".card-image img").getAttribute("src");
            let precoTexto = cardAtivo.querySelector(".price").innerText;
            
            let precoLimpo = parseFloat(precoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());

            const produtoParaCarrinho = {
                id: Math.random().toString(36).substr(2, 9), 
                nome: titulo,
                precoCard: precoLimpo, 
                precoPix: precoLimpo * 0.865,
                imagem: imagem,
                quantidade: 1
            };

            localStorage.setItem("itemCarrinho", JSON.stringify(produtoParaCarrinho));
            window.location.href = "../html/carrinho.html";
        });
    }

    function closeModal() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
        
    });
});v
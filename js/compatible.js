document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
        
        // Verifica se existe a marcação de login no localStorage
        const estaLogado = localStorage.getItem("usuarioLogado");

        if (estaLogado === "true") {
            // Esconde os botões alterando o display para 'none'
            authButtons.style.display = "none";
            
            // (Opcional) Se quiser mostrar um botão de "Sair" (Logout), você pode injetar aqui:
            // const navbar = document.querySelector('.navbar'); // ou onde desejar
            // navbar.insertAdjacentHTML('beforeend', '<button onclick="logout()">Sair</button>');
        }
    
    // Função caso você queira permitir o usuário deslogar depois
    function logout() {
        localStorage.removeItem("usuarioLogado");
        window.location.reload(); // Recarrega a página para atualizar os botões
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

    // Monitora especificamente os BOTÕES de comprar, evitando conflito no card
    const botoesComprar = document.querySelectorAll(".btn-buy");
    
    botoesComprar.forEach(botao => {
        botao.addEventListener("click", (event) => {
            // Para o comportamento padrão do botão imediatamente
            event.preventDefault();
            event.stopPropagation();

            // Sobe até o card pai para coletar os dados
            cardAtivo = botao.closest(".card");
            if (!cardAtivo) return;

            const titulo = cardAtivo.querySelector("h3").innerText;
            const imagem = cardAtivo.querySelector(".card-image img").getAttribute("src");
            const precoTexto = cardAtivo.querySelector(".price").innerText;
            
            const productDesc = cardAtivo.getAttribute("data-desc") || "Descrição detalhada em breve.";
            const productSpecs = cardAtivo.getAttribute("data-specs") || "Especificações técnicas não informadas.";

            // Alimenta a janela modal
            modalImg.src = imagem;
            modalImg.alt = titulo;
            modalName.innerText = titulo;
            modalPrice.innerText = precoTexto;
            modalDesc.innerText = productDesc;
            modalSpecs.innerText = productSpecs;

            // Ativa o display flex e depois joga a classe de transição do CSS
            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
        });
    });

    // Botão definitivo dentro da modal para mandar ao carrinho
    if (modalRedirectBtn) {
        modalRedirectBtn.addEventListener("click", (event) => {
            event.preventDefault();
            if (!cardAtivo) return;

            const titulo = cardAtivo.querySelector("h3").innerText;
            const imagem = cardAtivo.querySelector(".card-image img").getAttribute("src");
            let precoTexto = cardAtivo.querySelector(".price").innerText;
            
            // Limpa formatação de moeda para salvar valor real puro
            let precoLimpo = parseFloat(precoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());

            const produtoParaCarrinho = {
                id: Math.random().toString(36).substr(2, 9), 
                nome: titulo,
                precoCard: precoLimpo, 
                precoPix: precoLimpo * 0.865, // Desconto PIX
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
});
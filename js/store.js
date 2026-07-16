document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
        
        // Verifica se existe a marcação de login no localStorage
        const estaLogado = localStorage.getItem("usuarioLogado");

        if (estaLogado === "true") {
            // Esconde os botões alterando o display para 'none'
            authButtons.style.display = "none";
        }
    
    // Função caso você queira permitir o usuário deslogar depois
    function logout() {
        localStorage.removeItem("usuarioLogado");
        window.location.reload(); // Recarrega a página para atualizar os botões
    }


    // Elementos da Janela Modal
    const modal = document.getElementById("productModal");
    const closeModalBtn = document.querySelector(".close-modal");
    
    const modalImg = document.getElementById("modalProductImg");
    const modalName = document.getElementById("modalProductName");
    const modalPrice = document.getElementById("modalProductPrice");
    const modalDesc = document.getElementById("modalProductDesc");
    const modalSpecs = document.getElementById("modalProductSpecs");
    const modalRedirectBtn = document.getElementById("modalRedirectBtn");

    // Variável para guardar o card que está ativo no momento
    let cardAtivo = null;

    //Captura todos os cards de produtos para abrir a modal
    const productCards = document.querySelectorAll(".card");

    productCards.forEach(card => {
        card.addEventListener("click", (event) => {
            // Se o clique for em um link (caso tenha algum solto), não faz nada
            if (event.target.tagName === 'A') return;

            // Guarda a referência do card clicado para usar depois no botão do carrinho
            cardAtivo = card;

            
            const titulo = card.querySelector("h3").innerText;
            const imagem = card.querySelector(".card-image img").getAttribute("src");
            const precoTexto = card.querySelector(".price").innerText;
            
          
            const productDesc = card.getAttribute("data-desc") || "Descrição detalhada em breve.";
            const productSpecs = card.getAttribute("data-specs") || "Especificações técnicas não informadas.";

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

        modalRedirectBtn.addEventListener("click", function (e) {
    
            e.preventDefault();
    
            if (!cardAtivo) return;
    
            const nome = cardAtivo.querySelector("h3").innerText;
            const imagem = cardAtivo.querySelector("img").src;
    
            const precoTexto = cardAtivo.querySelector(".price").innerText;
    
            const preco = Number(
                precoTexto
                    .replace("R$", "")
                    .replace(/\./g, "")
                    .replace(",", ".")
                    .trim()
            );
    
            let tipo = "";
    
            if (cardAtivo.classList.contains("cpu"))
                tipo = "processador";
    
            else if (cardAtivo.classList.contains("motherboard"))
                tipo = "placaMae";
    
            else if (cardAtivo.classList.contains("ram"))
                tipo = "memoria";
    
            else if (cardAtivo.classList.contains("ssd"))
                tipo = "armazenamento";
    
            else if (cardAtivo.classList.contains("gpu"))
                tipo = "gpu";
    
            else if (cardAtivo.classList.contains("cabinet"))
                tipo = "gabinete";
    
            else if (cardAtivo.classList.contains("cooling"))
                tipo = "cooler";
    
            const montagem =
                JSON.parse(localStorage.getItem("montagem")) || {};
    
            montagem[tipo] = {
    
                nome: nome,
                imagem: imagem,
                preco: preco
    
            };
    
            localStorage.setItem(
                "montagem",
                JSON.stringify(montagem)
            );
    
            window.location.href = "../html/montagem.html";
    
        });
    
    }

    // 4. Funções para fechar a modal de forma limpa
    function closeModal() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300); // 300ms é o tempo da transição do seu CSS
    }

    // Fecha no botão (X)
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    // Fecha se clicar fora da caixinha preta (no fundo desfocado)
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    let carrinho = JSON.parse(localStorage.getItem("itensNoCarrinho")) || [];
// Verifique se o item já existe para apenas aumentar a quantidade, se não existia faça carrinho.push(novoProduto)
localStorage.setItem("itensNoCarrinho", JSON.stringify(carrinho));
});
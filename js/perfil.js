document.addEventListener("DOMContentLoaded", () => {
    // Seleciona o container dos botões de Login e Cadastro
    const authButtons = document.querySelector(".auth-buttons");
    
    // Verifica se existe a marcação de login no localStorage
    const estaLogado = localStorage.getItem("usuarioLogado");

    if (estaLogado === "true") {
        // Esconde os botões alterando o display para 'none'
        authButtons.style.display = "none";
        
    }
});

// Função caso você queira permitir o usuário deslogar depois
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.reload(); // Recarrega a página para atualizar os botões
}

function switchTab(tabId) {
    // 1. Remove classe active de todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // 2. Remove classe active de todos os botões do menu
    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Ativa a aba clicada (verifica se existe antes para não dar erro)
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // 4. Ativa o botão correspondente (busca pelo parâmetro passado na função)
    const buttons = document.querySelectorAll('.menu-item');
    buttons.forEach(btn => {
        // Verifica se o onclick do botão contém o nome da aba
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
}

    // Função 2: Conectar o fluxo do Carrinho para Minhas Compras
    function checkoutProduct(productName, elementId) {

    let itensDoCarrinhoNoPerfil = JSON.parse(localStorage.getItem("itensNoCarrinho")) || [];

        // 1. Remove o item visualmente do carrinho
        const productElement = document.getElementById(elementId);
        if (productElement) {
            productElement.remove();
        }
        const produto = JSON.parse(localStorage.getItem("itemCarrinho"));
        // Atualiza o contador de itens do carrinho para 0
        document.getElementById('cart-counter-sidebar').innerText = "0 itens";
        
        // Se o carrinho esvaziar por completo, mostra mensagem de vazio
        const container = document.getElementById('cart-items-container');
        if(container.children.length === 0) {
            container.innerHTML = '<p class="empty-message">Seu carrinho está vazio.</p>';
        }

        // 2. Cria um número de pedido aleatório
        const orderId = Math.floor(100000 + Math.random() * 900000);

        // 3. Injeta o item diretamente na aba "Minhas Compras"
        const activeOrdersContainer = document.getElementById('active-orders-container');
        
        // Remove a mensagem de "Nenhum pedido" se ela existir
        const emptyMsg = activeOrdersContainer.querySelector('.empty-message');
        if (emptyMsg) emptyMsg.remove();

        // Novo bloco de pedido em andamento
        const newOrderHTML = `
            <div class="order-history-row" id="order-${orderId}">
                <div>
                    <h4>Pedido #${orderId} - ${productName}</h4>
                    <p class="order-date">Status: Aguardando Coleta da Transportadora</p>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <span class="status-badge warning">A Caminho</span>
                    <button class="btn-confirm-delivery" onclick="confirmDelivery('${productName}', '${orderId}')">Confirmar Entrega</button>
                </div>
            </div>
        `;
        activeOrdersContainer.insertAdjacentHTML('afterbegin', newOrderHTML);

        // 4. Atualiza também o card de visualização rápida na página inicial (Painel Geral)
        const dashPreview = document.getElementById('dashboard-shipping-preview');
        dashPreview.innerHTML = `
            <div class="product-img-placeholder"><i class="fa-solid fa-microchip"></i></div>
            <h4>${productName}</h4>
            <p class="serial-number">Número do Pedido: #${orderId}</p>
            <span class="status-badge warning" style="display:inline-block; margin-top:5px;">A Caminho</span>
        `;

        // Abre a aba "Minhas Compras" automaticamente para dar o feedback ao usuário
        alert(`Sucesso! Compra do ${productName} finalizada com sucesso! Verifique o status em 'Minhas Compras'.`);
        switchTab('compras');
    }   


    let historicoDeCompras = JSON.parse(localStorage.getItem("minhasCompras")) || [];
// Mapeie esses itens exibindo o código do rastreamento (item.codigoPedido) e a data (item.dataCompra)
    // Função Bônus: Mover de "Minhas Compras" para "Compras Finalizadas" ao receber o produto
    function confirmDelivery(productName, orderId) {
        // Remove das compras em andamento
        document.getElementById(`order-${orderId}`).remove();
        
        const activeOrdersContainer = document.getElementById('active-orders-container');
        if(activeOrdersContainer.children.length === 0) {
            activeOrdersContainer.innerHTML = '<p class="empty-message">Nenhum pedido em processamento ou transporte.</p>';
        }

        // Insere nas Compras Finalizadas
        const finishedContainer = document.getElementById('finished-orders-container');
        const date = new Date().toLocaleDateString('pt-BR');
        
        const finishedHTML = `
            <div class="order-history-row">
                <div>
                    <h4>Pedido #${orderId} - ${productName}</h4>
                    <p class="order-date">Entregue em: ${date}</p>
                </div>
                <span class="status-badge success">Concluído</span>
            </div>
        `;
        finishedContainer.insertAdjacentHTML('afterbegin', finishedHTML);

        // Limpa o preview do painel inicial
        document.getElementById('dashboard-shipping-preview').innerHTML = '<p style="color: #777;">Nenhum produto a caminho no momento.</p>';

        alert("Obrigado por confirmar o recebimento! Seu produto foi movido para Compras Finalizadas.");
        switchTab('finalizadas');
    }

    function carregarCarrinhoPerfil() {

        const container = document.getElementById("cart-items-container");
    
        if (!container) return;
    
        // Exibe tanto os itens ainda no carrinho quanto os já comprados
        const carrinho =
            JSON.parse(localStorage.getItem("minhasCompras")) || [];
    
        if (carrinho.length === 0) {
    
            container.innerHTML =
                "<p class='empty-message'>Nenhum produto encontrado.</p>";
    
            document.getElementById("cart-counter-sidebar").innerText =
                "0 itens";
    
            return;
        }
    
        document.getElementById("cart-counter-sidebar").innerText =
            `${carrinho.length} item(ns)`;
    
        container.innerHTML = "";
    
        carrinho.forEach(produto => {
    
            container.innerHTML += `
                <div class="cart-item">
    
                    <img src="${produto.imagem}" width="90">
    
                    <div class="cart-info">
    
                        <h3>${produto.nome}</h3>
    
                        <p><strong>Quantidade:</strong>
                            ${produto.quantidade}
                        </p>
    
                        <p><strong>Preço:</strong>
                            R$ ${produto.precoPix.toFixed(2)}
                        </p>
    
                        <p><strong>Pedido:</strong>
                            ${produto.codigoPedido}
                        </p>
    
                        <p><strong>Data:</strong>
                            ${produto.dataCompra}
                        </p>
    
                    </div>
    
                </div>
            `;
        });
    
    }

    document.addEventListener("DOMContentLoaded", () => {

        carregarCarrinhoPerfil();
    
    });
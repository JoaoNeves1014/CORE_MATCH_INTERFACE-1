document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
    
    // Verifica se existe a marcação de login no localStorage
    const estaLogado = localStorage.getItem("usuarioLogado");

    if (estaLogado === "true" && authButtons) {
        authButtons.style.display = "none";
    }

    const container = document.getElementById("container-produtos-carrinho");
    
    // Elementos do resumo lateral
    const txtSubtotal = document.getElementById("resumo-subtotal");
    const txtTotal = document.getElementById("resumo-total");
    const txtPix = document.getElementById("resumo-pix");
    const txtEconomia = document.getElementById("resumo-economia");
    const btnFinalizar = document.querySelector(".btn-finish");

    // Lendo como LISTA unificada para o site inteiro e para a tela de Perfil
    let listaProdutos = JSON.parse(localStorage.getItem("itensNoCarrinho")) || [];

    // Se houver algum resquício do modelo antigo de item único, converte para array de forma segura
    const itemAntigo = localStorage.getItem("itemCarrinho");
    if (itemAntigo) {
        try {
            const parsedAntigo = JSON.parse(itemAntigo);
            if (parsedAntigo && !Array.isArray(parsedAntigo)) {
                listaProdutos.push(parsedAntigo);
                localStorage.setItem("itensNoCarrinho", JSON.stringify(listaProdutos));
            }
        } catch(e) {}
        localStorage.removeItem("itemCarrinho"); // Deleta a chave antiga para limpar o escopo
    }

    // Se não houver produtos salvos na lista, avisa que o carrinho está vazio
    if (listaProdutos.length === 0) {
        exibirCarrinhoVazio();
        return;
    }

    function exibirCarrinhoVazio() {
        if (container) {
            container.innerHTML = "<p style='color: white; padding: 20px;'>Seu carrinho está vazio.</p>";
        }
        zerarResumo();
    }

    // Função para formatar números em formato de moeda real (R$)
    function formatarMoeda(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // Zera o painel lateral caso não existam itens
    function zerarResumo() {
        if(txtSubtotal) txtSubtotal.innerText = formatarMoeda(0);
        if(txtTotal) txtTotal.innerText = formatarMoeda(0);
        if(txtPix) txtPix.innerText = formatarMoeda(0);
        if(txtEconomia) txtEconomia.innerText = formatarMoeda(0);
    }

    // Executa as contas matemáticas baseadas em todos os itens da lista
    function atualizarResumoFinanceiro() {
        let totalCartao = 0;
        let totalPix = 0;

        listaProdutos.forEach(item => {
            totalCartao += (item.precoCard || 0) * (item.quantidade || 1);
            totalPix += (item.precoPix || 0) * (item.quantidade || 1);
        });

        const economia = totalCartao - totalPix;

        if (txtSubtotal) txtSubtotal.innerText = formatarMoeda(totalCartao);
        if (txtTotal) txtTotal.innerText = formatarMoeda(totalCartao);
        if (txtPix) txtPix.innerText = formatarMoeda(totalPix);
        if (txtEconomia) txtEconomia.innerText = formatarMoeda(economia);
    }

    // Adiciona escuta de cliques usando seletores de classe e data-index para múltiplos itens
    function adicionarEventosBotoes() {
        document.querySelectorAll(".qtd-mais").forEach(botao => {
            botao.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                listaProdutos[index].quantidade++;
                salvarERecarregar();
            });
        });

        document.querySelectorAll(".qtd-menos").forEach(botao => {
            botao.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                if (listaProdutos[index].quantidade > 1) {
                    listaProdutos[index].quantidade--;
                    salvarERecarregar();
                }
            });
        });

        document.querySelectorAll(".btn-remover-item").forEach(botao => {
            botao.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                listaProdutos.splice(index, 1); // Remove do array pelo índice
                salvarERecarregar();
            });
        });
    }

    function salvarERecarregar() {
        localStorage.setItem("itensNoCarrinho", JSON.stringify(listaProdutos));
        if (listaProdutos.length === 0) {
            exibirCarrinhoVazio();
        } else {
            renderizarCarrinho();
        }
    }

    // Renderiza dinamicamente a pilha de itens na tela
    function renderizarCarrinho() {
        if (!container) return;
        container.innerHTML = "";

        listaProdutos.forEach((item, index) => {
            container.innerHTML += `
                <div class="carrinho-item" style="display: flex; align-items: center; background: #111; padding: 15px; margin-bottom: 15px; border-radius: 8px; justify-content: space-between; border: 1px solid #222;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${item.imagem}" alt="${item.nome}" style="width: 80px; height: 80px; object-fit: contain;">
                        <div>
                            <h3 style="color: white; margin: 0; font-size: 16px;">${item.nome}</h3>
                            <p style="color: #666; margin: 5px 0; font-size: 13px;">CÓD: ${item.id ? item.id.toUpperCase() : 'HW'}</p>
                            <button class="btn-remover-item" data-index="${index}" style="color: #ff4d4d; background: none; border: none; cursor: pointer; padding: 0; font-weight: bold; font-size: 12px;">REMOVER</button>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div class="qtd-control" style="background: #222; border-radius: 4px; display: flex; align-items: center; border: 1px solid #333;">
                            <button class="qtd-menos" data-index="${index}" style="background: none; border: none; color: #00A19B; padding: 8px 12px; cursor: pointer; font-weight: bold;">-</button>
                            <span style="color: white; padding: 0 5px; font-family: monospace;">${item.quantidade}</span>
                            <button class="qtd-mais" data-index="${index}" style="background: none; border: none; color: #00A19B; padding: 8px 12px; cursor: pointer; font-weight: bold;">+</button>
                        </div>
                        
                        <div style="text-align: right; min-width: 150px;">
                            <span style="color: #888; display: block; font-size: 11px;">À vista no PIX</span>
                            <strong style="color: #00A19B; font-size: 18px; display: block;">${formatarMoeda((item.precoPix || 0) * item.quantidade)}</strong>
                            <span style="color: #666; display: block; font-size: 11px;">ou ${formatarMoeda((item.precoCard || 0) * item.quantidade)} no cartão</span>
                        </div>
                    </div>
                </div>
            `;
        });

        atualizarResumoFinanceiro();
        adicionarEventosBotoes();
    }

    // --- INTERFACE DE FINALIZAÇÃO E PAGAMENTO EM SEGUNDO PLANO ---
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (listaProdutos.length === 0) return;

            // Calcula o total dinâmico do Pix para exibir na janela modal de pagamento
            let valorTotalPix = 0;
            listaProdutos.forEach(item => valorTotalPix += (item.precoPix || 0) * item.quantidade);

            // Injeta a estrutura de checkout em segundo plano de forma dinâmica (Modal Overlap)
            const painelPagamento = document.createElement("div");
            painelPagamento.id = "checkout-background-modal";
            painelPagamento.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px);";
            
            painelPagamento.innerHTML = `
                <div style="background: #111; border: 2px solid #00A19B; padding: 30px; border-radius: 12px; width: 90%; max-width: 445px; text-align: center; color: white; box-shadow: 0px 0px 25px rgba(0, 161, 155, 0.25);">
                    <h2 style="color: #00A19B; margin-top: 0; font-size: 22px;">Finalizar Compra</h2>
                    <p style="color: #888; font-size: 14px; margin-bottom: 20px;">Escolha o método de pagamento para concluir seu pedido em segundo plano:</p>
                    
                    <div style="background: #161616; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #252525;">
                        <span style="color: #666; font-size: 13px; display: block;">Total Geral:</span>
                        <strong style="font-size: 24px; color: #fff;">${formatarMoeda(valorTotalPix)}</strong>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button id="checkout-confirmar-pix" style="background: #00A19B; color: black; border: none; padding: 12px; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 15px;">Pagar no PIX (Desconto Aplicado)</button>
                        <button id="checkout-confirmar-cartao" style="background: #222; color: white; border: 1px solid #444; padding: 12px; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 15px;">Pagar no Cartão de Crédito</button>
                        <button id="checkout-fechar" style="background: none; color: #ff4d4d; border: none; margin-top: 10px; cursor: pointer; font-size: 13px; font-weight: bold;">Cancelar e voltar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(painelPagamento);

            // Ação de fechar/cancelar o checkout
            document.getElementById("checkout-fechar").addEventListener("click", () => {
                painelPagamento.remove();
            });

            // Função que executa a transferência entre banco de dados locais
            const dispararPagamentoBemSucedido = () => {

                // Adiciona número do pedido e data aos produtos
                listaProdutos.forEach(item => {
                    item.codigoPedido = "CM-" + Math.floor(100000 + Math.random() * 900000);
                    item.dataCompra = new Date().toLocaleDateString("pt-BR");
                });
            
                // Salva SOMENTE a compra atual
                localStorage.setItem(
                    "minhasCompras",
                    JSON.stringify(listaProdutos)
                );
            
                // Limpa o carrinho
                localStorage.removeItem("itensNoCarrinho");
            
                painelPagamento.innerHTML = `
                    <div style="background: #111; border: 2px solid #00A19B; padding: 35px; border-radius: 12px; width: 90%; max-width: 420px; text-align: center; color: white;">
                        <span style="font-size:45px;">✔</span>
                        <h2 style="color:#00A19B;">Pagamento Aprovado!</h2>
                        <p>O pedido foi processado.</p>
            
                        <button id="checkout-ir-perfil"
                            style="background:#00A19B;color:black;border:none;padding:12px 24px;border-radius:4px;cursor:pointer;">
                            Acessar Meu Perfil
                        </button>
                    </div>
                `;
            
                document.getElementById("checkout-ir-perfil").addEventListener("click", () => {
                    window.location.href = "../html/perfil.html";
                });
            
            };

            document.getElementById("checkout-confirmar-pix").addEventListener("click", dispararPagamentoBemSucedido);
            document.getElementById("checkout-confirmar-cartao").addEventListener("click", dispararPagamentoBemSucedido);
        });
    }

    // Inicializa a página carregando os produtos corretos
    renderizarCarrinho();
});
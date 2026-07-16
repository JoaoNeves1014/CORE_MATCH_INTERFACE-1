document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
    const estaLogado = localStorage.getItem("usuarioLogado");

    if (estaLogado === "true" && authButtons) {
        authButtons.style.display = "none";
    }

    const container = document.getElementById("container-produtos-carrinho");
    const txtSubtotal = document.getElementById("resumo-subtotal");
    const txtTotal = document.getElementById("resumo-total");
    const txtPix = document.getElementById("resumo-pix");
    const txtEconomia = document.getElementById("resumo-economia");
    const btnFinalizar = document.querySelector(".btn-finish");

    // Lendo a lista de produtos unificada do site
    let listaProdutos = JSON.parse(localStorage.getItem("itensNoCarrinho")) || [];

    // Compatibilidade com o formato antigo de item único (itemCarrinho)
    const itemAntigo = localStorage.getItem("itemCarrinho");
    if (itemAntigo) {
        try {
            const parsedAntigo = JSON.parse(itemAntigo);
            if (parsedAntigo && !Array.isArray(parsedAntigo)) {
                listaProdutos.push(parsedAntigo);
                localStorage.setItem("itensNoCarrinho", JSON.stringify(listaProdutos));
            }
        } catch(e) {}
        localStorage.removeItem("itemCarrinho");
    }

    if (listaProdutos.length === 0) {
        exibirCarrinhoVazio();
        return;
    }

    function exibirCarrinhoVazio() {
        if (container) {
            container.innerHTML = "<p style='color: white; padding: 20px; text-align: center;'>Seu carrinho está vazio.</p>";
        }
        zerarResumo();
    }

    function formatarMoeda(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function zerarResumo() {
        if(txtSubtotal) txtSubtotal.innerText = formatarMoeda(0);
        if(txtTotal) txtTotal.innerText = formatarMoeda(0);
        if(txtPix) txtPix.innerText = formatarMoeda(0);
        if(txtEconomia) txtEconomia.innerText = formatarMoeda(0);
    }

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
                listaProdutos.splice(index, 1);
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

    // Configurando o botão de Finalizar Compra para redirecionar
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (listaProdutos.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }
            // Redireciona diretamente para a tela de pagamentos
            window.location.href = "pagamento.html";
        });
    }

    renderizarCarrinho();
});
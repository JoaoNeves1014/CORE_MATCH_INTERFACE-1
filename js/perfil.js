document.addEventListener("DOMContentLoaded", () => {
 
    renderizarMinhasCompras();
    renderizarPedidosFinalizados();
    atualizarPreviewDashboard();
});
document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
    
    const estaLogado = localStorage.getItem("usuarioLogado");

    if (estaLogado === "true") {
        authButtons.style.display = "none";
        
    }
});


function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.reload();
}
function fazerLogout() {
    const confirmar = confirm("Tem certeza que deseja sair da sua conta?");
    if (!confirmar) return;

    const camposDados = ["info-nome", "info-email", "info-telefone", "info-endereco"];
    camposDados.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = "—";
        }
    });

    const previewDash = document.getElementById("dashboard-shipping-preview");
    if (previewDash) previewDash.innerHTML = `<p style="color: #777; margin: 0;">Nenhum produto a caminho no momento.</p>`;
    
    const cartCounter = document.getElementById("cart-counter-sidebar");
    if (cartCounter) cartCounter.textContent = "0 itens";

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("minhasCompras");
    localStorage.removeItem("comprasFinalizadas");
    localStorage.removeItem("carrinho");
    localStorage.removeItem("itensCarrinho");

    alert("Você saiu da conta! Seus dados locais foram limpos com segurança.");

    window.location.href = "../html/index.html"; 
}
function switchTab(tabId) {

    window.location.href = "../html/carrinho.html";
}


function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


function renderizarMinhasCompras() {
    const containerAtivos = document.getElementById("container-minhas-compras");
    if (!containerAtivos) return;

    let minhasCompras = JSON.parse(localStorage.getItem("minhasCompras")) || [];

    if (minhasCompras.length === 0) {
        containerAtivos.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fa-solid fa-box-open" style="font-size: 40px; margin-bottom: 15px; color: #444;"></i>
                <p>Você não possui nenhum pedido em andamento no momento.</p>
            </div>
        `;
        return;
    }

    containerAtivos.innerHTML = "";

    minhasCompras.forEach((pedido, index) => {
        const etapas = ["Pedido Recebido", "Em Preparação", "A caminho", "Entregue"];
        const statusAtual = pedido.statusEntrega || "Pedido Recebido";
        const indiceEtapaAtual = etapas.indexOf(statusAtual) !== -1 ? etapas.indexOf(statusAtual) : 0;

        let timelineHTML = `<div style="display: flex; justify-content: space-between; margin: 20px 0; position: relative; padding: 0 10px;">`;
        timelineHTML += `<div style="position: absolute; top: 15px; left: 5%; right: 5%; height: 2px; background: #222; z-index: 1;"></div>`;
        const progressoLargura = (indiceEtapaAtual / (etapas.length - 1)) * 90;
        timelineHTML += `<div style="position: absolute; top: 15px; left: 5%; width: ${progressoLargura}%; height: 2px; background: #00A19B; z-index: 2; transition: 0.5s;"></div>`;

        etapas.forEach((etapa, idx) => {
            const ativa = idx <= indiceEtapaAtual;
            const corBolinha = ativa ? "#00A19B" : "#222";
            const corTexto = ativa ? "#fff" : "#666";
            const pesoTexto = ativa ? "bold" : "normal";

            timelineHTML += `
                <div style="text-align: center; z-index: 3; width: 22%;">
                    <div style="width: 30px; height: 30px; border-radius: 50%; background: ${corBolinha}; color: ${ativa ? '#000' : '#444'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto; font-weight: bold; font-size: 12px; border: 2px solid #090909;">
                        ${idx + 1}
                    </div>
                    <span style="font-size: 11px; color: ${corTexto}; font-weight: ${pesoTexto}; display: block;">${etapa}</span>
                </div>
            `;
        });
        timelineHTML += `</div>`;

        containerAtivos.innerHTML += `
            <div class="card-pedido" style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <span style="color: #666; font-size: 12px; display: block;">CÓDIGO DO PEDIDO</span>
                        <strong style="color: #00A19B; font-size: 15px;">${pedido.codigoPedido || '#CO' + Math.floor(1000 + Math.random() * 9000)}</strong>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #666; font-size: 12px; display: block;">DATA DA COMPRA</span>
                        <strong style="color: #fff; font-size: 14px;">${pedido.dataCompra || new Date().toLocaleDateString('pt-BR')}</strong>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <img src="${pedido.imagem || '../img/placeholder.png'}" alt="${pedido.nome}" style="width: 70px; height: 70px; object-fit: contain; background: #161616; padding: 5px; border-radius: 6px; border: 1px solid #222;">
                    <div style="flex: 1;">
                        <h4 style="color: white; margin: 0; font-size: 15px;">${pedido.nome}</h4>
                        <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Quantidade: ${pedido.quantidade || 1} | Valor: ${formatarMoeda(pedido.precoPago || pedido.preco || 0)}</p>
                    </div>
                </div>

                <!-- Linha do Tempo de Rastreamento -->
                <div style="background: #161616; border-radius: 6px; padding: 15px 5px; margin-bottom: 15px; border: 1px solid #222;">
                    ${timelineHTML}
                </div>

                <!-- Botão de Finalizar -->
                <div style="text-align: right;">
                    <button onclick="finalizarPedidoParaHistorico(${index})" style="background: #00A19B; color: black; border: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; cursor: pointer; transition: 0.3s; font-size: 13px;">
                        <i class="fa-solid fa-circle-check"></i> Finalizar Pedido
                    </button>
                </div>
            </div>
        `;
    });
}

function finalizarPedidoParaHistorico(index) {
    let minhasCompras = JSON.parse(localStorage.getItem("minhasCompras")) || [];
    let comprasFinalizadas = JSON.parse(localStorage.getItem("comprasFinalizadas")) || [];

    const [pedidoFinalizado] = minhasCompras.splice(index, 1);

    pedidoFinalizado.statusEntrega = "Entregue";
    pedidoFinalizado.dataFinalizacao = new Date().toLocaleDateString("pt-BR");

    comprasFinalizadas.unshift(pedidoFinalizado);

    localStorage.setItem("minhasCompras", JSON.stringify(minhasCompras));
    localStorage.setItem("comprasFinalizadas", JSON.stringify(comprasFinalizadas));

    alert("Pedido finalizado com sucesso!");

    renderizarMinhasCompras();
    renderizarPedidosFinalizados();
    atualizarPreviewDashboard();
}

function renderizarPedidosFinalizados() {
    const containerFinalizados = document.getElementById("container-pedidos-finalizados");
    if (!containerFinalizados) return;

    let comprasFinalizadas = JSON.parse(localStorage.getItem("comprasFinalizadas")) || [];

    if (comprasFinalizadas.length === 0) {
        containerFinalizados.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fa-solid fa-clipboard-check" style="font-size: 40px; margin-bottom: 15px; color: #333;"></i>
                <p>Nenhum pedido finalizado ainda.</p>
            </div>
        `;
        return;
    }

    containerFinalizados.innerHTML = "";

    comprasFinalizadas.forEach((pedido) => {
        containerFinalizados.innerHTML += `
            <div class="card-pedido-finalizado" style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left; border-left: 4px solid #00A19B;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px;">
                    <div>
                        <strong style="color: #aaa;">PEDIDO: ${pedido.codigoPedido || '#CO0000'}</strong>
                    </div>
                    <div style="color: #666;">
                        Finalizado em: ${pedido.dataFinalizacao || new Date().toLocaleDateString('pt-BR')}
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${pedido.imagem || '../img/placeholder.png'}" alt="${pedido.nome}" style="width: 50px; height: 50px; object-fit: contain; background: #161616; padding: 3px; border-radius: 4px; border: 1px solid #222;">
                    <div style="flex: 1;">
                        <h4 style="color: #ccc; margin: 0; font-size: 14px;">${pedido.nome}</h4>
                        <p style="color: #555; margin: 3px 0 0 0; font-size: 12px;">Qtd: ${pedido.quantidade || 1} | Pago: ${formatarMoeda(pedido.precoPago || pedido.preco || 0)}</p>
                    </div>
                    <div>
                        <span style="background: rgba(0, 161, 155, 0.1); color: #00A19B; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            <i class="fa-solid fa-check-double"></i> Concluído
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
}

function atualizarPreviewDashboard() {
    const previewDashboard = document.getElementById("dashboard-shipping-preview");
    if (!previewDashboard) return;

    let minhasCompras = JSON.parse(localStorage.getItem("minhasCompras")) || [];

    if (minhasCompras.length > 0) {
        const ultimoPedido = minhasCompras[0];
        previewDashboard.innerHTML = `
            <div style="text-align: left;">
                <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 14px;">${ultimoPedido.nome}</h4>
                <p style="color: #00A19B; margin: 0; font-size: 12px; font-weight: bold;">
                    <i class="fa-solid fa-truck-ramp-box"></i> Status: ${ultimoPedido.statusEntrega || "Pedido Recebido"}
                </p>
            </div>
        `;
    } else {
        previewDashboard.innerHTML = `<p style="color: #777; margin: 0;">Nenhum produto a caminho no momento.</p>`;
    }
}

function carregarDadosUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioAtivo"));

    const elNome = document.getElementById("info-nome");
    const elEmail = document.getElementById("info-email");
    const elTelefone = document.getElementById("info-telefone");
    const elEndereco = document.getElementById("info-endereco");
    
    const boasVindasNome = document.querySelector(".user-welcome-info h2");
    const boasVindasEmail = document.querySelector(".user-welcome-info p");

    if (usuarioLogado) {
        if (elNome) elNome.textContent = usuarioLogado.nome || usuarioLogado.name || "Não informado";
        if (elEmail) elEmail.textContent = usuarioLogado.email || "Não informado";
        if (elTelefone) elTelefone.textContent = usuarioLogado.telefone || usuarioLogado.phone || "Não informado";
        if (elEndereco) elEndereco.textContent = usuarioLogado.endereco || usuarioLogado.address || "Não informado";

        const nomeCompleto = usuarioLogado.nome || usuarioLogado.name || "Usuário";
        if (boasVindasNome) boasVindasNome.textContent = `Olá, ${nomeCompleto.split(' ')[0]}`;
        if (boasVindasEmail) boasVindasEmail.textContent = usuarioLogado.email || "";
    } else {

        const feedbackVazio = "—";
        
        if (elNome) elNome.textContent = feedbackVazio;
        if (elEmail) elEmail.textContent = feedbackVazio;
        if (elTelefone) elTelefone.textContent = feedbackVazio;
        if (elEndereco) elEndereco.textContent = feedbackVazio;

        if (boasVindasNome) boasVindasNome.textContent = "Olá, Visitante";
        if (boasVindasEmail) boasVindasEmail.textContent = "Faça login para ver seus dados";
    }
}


function fazerLogout() {
    const confirmar = confirm("Tem certeza que deseja sair da sua conta?");
    if (!confirmar) return;

    
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioAtivo");
    localStorage.removeItem("minhasCompras"); 
    localStorage.removeItem("comprasFinalizadas"); 
    localStorage.removeItem("carrinho");      

    alert("Você saiu da conta com sucesso!");

    
    window.location.href = "../html/index.html"; 
}
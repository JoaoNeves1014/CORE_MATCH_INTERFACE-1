document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUsuario();
    renderizarMinhasCompras();
    renderizarPedidosFinalizados();
    atualizarPreviewDashboard();
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
});


function switchTab(tabName) {
    // Esconde todos os conteúdos
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    // Mostra apenas a aba alvo
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.style.display = 'block';
    }
}

function carregarDadosUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioAtivo"));
    const elNome = document.getElementById("info-nome");
    const elEmail = document.getElementById("info-email");

    if (usuarioLogado && elNome) {
        elNome.textContent = usuarioLogado.nome || "João Pedro";
        elEmail.textContent = usuarioLogado.email || "joao@example.com";
    }
}

function fazerLogout() {
    if (confirm("Tem certeza que deseja sair da conta?")) {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("usuarioAtivo");
        window.location.href = "../html/index.html";
    }
}

function renderizarMinhasCompras() {
    const container = document.getElementById("container-minhas-compras");
    if (!container) return;
    let compras = JSON.parse(localStorage.getItem("minhasCompras")) || [];
    if (compras.length === 0) container.innerHTML = "<p>Nenhum pedido em andamento.</p>";
}

function renderizarPedidosFinalizados() {
    const container = document.getElementById("container-pedidos-finalizados");
    if (!container) return;
    let finalizadas = JSON.parse(localStorage.getItem("comprasFinalizadas")) || [];
    if (finalizadas.length === 0) container.innerHTML = "<p>Nenhum pedido finalizado.</p>";
}

function atualizarPreviewDashboard() {
    const preview = document.getElementById("dashboard-shipping-preview");
    if (!preview) return;
    // Lógica para exibir o último status aqui
}
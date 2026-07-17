let listaProdutos = JSON.parse(localStorage.getItem("itensNoCarrinho")) || [];
let valorSubtotal = 0;
let valorFrete = 0;
let metodoSelecionado = "pix";

document.addEventListener("DOMContentLoaded", () => {
    if (listaProdutos.length === 0) {
        alert("Carrinho vazio! Redirecionando...");
        window.location.href = "carrinho.html";
        return;
    }
    inicializarResumo();
    gerarQrCodePix();
});

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function inicializarResumo() {
    const listCont = document.getElementById("lista-resumo-produtos");
    listCont.innerHTML = "";
    valorSubtotal = 0;

    listaProdutos.forEach(item => {
        const preco = item.precoPix || item.precoCard || 0;
        const totalItem = preco * item.quantidade;
        valorSubtotal += totalItem;

        listCont.innerHTML += `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
                <span style="color: #ccc; max-width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.quantidade}x ${item.nome}</span>
                <span>${formatarMoeda(totalItem)}</span>
            </div>
        `;
    });

    document.getElementById("resumo-subtotal").innerText = formatarMoeda(valorSubtotal);
    atualizarTotal();
}

function atualizarTotal() {
    const totalGeral = valorSubtotal + valorFrete;
    document.getElementById("resumo-total").innerText = formatarMoeda(totalGeral);
}

function mudarMetodo(metodo) {
    metodoSelecionado = metodo;
    document.querySelectorAll(".method-btn").forEach(btn => btn.classList.remove("selected"));
    document.querySelectorAll(".payment-content").forEach(cont => cont.classList.remove("active"));

    const index = metodo === "pix" ? 0 : metodo === "cartao" ? 1 : 2;
    document.querySelectorAll(".method-btn")[index].classList.add("selected");
    

    document.getElementById(`pay-${metodo}`).classList.add("active");
}


function gerarQrCodePix() {
    const qrContainer = document.getElementById("qr-code-container");
    const pixTexto = "00020126580014BR.GOV.BCB.PIX0136suachavedeexemplo123456789105204000053039865405" + valorSubtotal.toFixed(2) + "5802BR5925SuaLojaTecnologia6009SAOPAULO62070503***6304D1A2";
    
    document.getElementById("pix-string").innerText = pixTexto;

    qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixTexto)}" alt="QR Code Pix" style="display: block;">`;
}

function copiarPix() {
    const texto = document.getElementById("pix-string").innerText;
    navigator.clipboard.writeText(texto).then(() => {
        alert("Código Pix 'Copia e Cola' copiado para a área de transferência!");
    });
}

function selecionarCartaoSalvo() {
    const select = document.getElementById("cartao-salvo");
    const formNovo = document.getElementById("formulario-novo-cartao");
    
    if (select.value !== "") {
        formNovo.style.opacity = "0.4";
        formNovo.querySelectorAll("input").forEach(i => i.disabled = true);
    } else {
        formNovo.style.opacity = "1";
        formNovo.querySelectorAll("input").forEach(i => i.disabled = false);
    }
}

function confirmarPagamentoSimulado() {
    alert("Pagamento pré-autorizado com sucesso! Agora, insira seus dados de entrega.");

    document.getElementById("step-pay-indicator").classList.remove("active");
    document.getElementById("step-ship-indicator").classList.add("active");


    document.getElementById("painel-pagamento").style.display = "none";
    document.getElementById("painel-envio").style.display = "block";
}


function calcularFreteSimulado() {
    const cep = document.getElementById("envio-cep").value;
    if (cep.length < 8) {
        alert("Por favor, digite um CEP válido.");
        return;
    }


    document.getElementById("opcoes-frete-container").style.display = "block";
    
    document.getElementById("envio-rua").value = "Paineiras";
    document.getElementById("envio-bairro").value = "Eldorado";
    document.getElementById("envio-cidade").value = "Contagem";

    atualizarFreteCheckout(15);
}

function atualizarFreteCheckout(valor) {
    valorFrete = valor;
    document.getElementById("resumo-frete").innerText = formatarMoeda(valorFrete);
    atualizarTotal();
}

function concluirTudoEPorNoHistorico() {
    const rua = document.getElementById("envio-rua").value;
    const numero = document.getElementById("envio-numero").value;
    const cidade = document.getElementById("envio-cidade").value;

    if (!rua || !numero || !cidade) {
        alert("Por favor, preencha o endereço completo de entrega.");
        return;
    }

    // A chave CORRETA que seu perfil.js deve ler é "MinhasCompras"
    let MinhasCompras = JSON.parse(localStorage.getItem("MinhasCompras")) || [];
    const enderecoFormatado = `${rua}, Nº ${numero} - ${cidade}`;

    listaProdutos.forEach(item => {
        const precoUtilizado = item.precoPix || item.precoCard || 0;
        
        MinhasCompras.push({
            id: item.id,
            nome: item.nome,
            imagem: item.imagem,
            quantidade: item.quantidade,
            precoPago: precoUtilizado,
            codigoPedido: "CM-" + Math.floor(100000 + Math.random() * 900000),
            dataCompra: new Date().toLocaleDateString("pt-BR"),
            enderecoEntrega: enderecoFormatado,
            statusEntrega: "Pedido em Preparação"
        });
    });

    localStorage.setItem("MinhasCompras", JSON.stringify(MinhasCompras));
    
    // IMPORTANTE: Limpe a chave que você definiu lá no topo do seu JS (itensNoCarrinho)
    localStorage.removeItem("itensNoCarrinho");

    alert("Pedido Concluído com Sucesso!");
    window.location.href = "../html/perfil.html";
}
function finalizarCompra() {
    // 1. Pega o carrinho
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // 2. Pega as compras atuais (ou cria uma nova lista)
    let MinhasCompras = JSON.parse(localStorage.getItem("MinhasCompras")) || [];

    // 3. Move os itens do carrinho para "Minhas Compras"
    carrinho.forEach(item => {
        const novoPedido = {
            ...item,
            codigoPedido: '#CO' + Math.floor(Math.random() * 9000 + 1000),
            dataCompra: new Date().toLocaleDateString('pt-BR'),
            statusEntrega: "Pedido Recebido"
        };
        MinhasCompras.push(novoPedido);
    });

    // 4. Salva no localStorage e limpa o carrinho
    localStorage.setItem("MinhasCompras", JSON.stringify(MinhasCompras));
    localStorage.removeItem("carrinho");

    alert("Compra finalizada com sucesso! Verifique em 'Minhas Compras'.");

    // 5. Atualiza a tela
    window.location.href = "../html/perfil.html"; 
}
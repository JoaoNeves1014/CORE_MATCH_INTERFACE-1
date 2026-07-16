// ------------------------------
// IA (mantido como já existia)
// ------------------------------
const dados = JSON.parse(localStorage.getItem("resultadoIA"));

if (dados) {

    const compatibilidade = document.getElementById("compatibilidade");
    const motivo = document.getElementById("motivo");
    const fonte = document.getElementById("fonte");
    const sugestao = document.getElementById("sugestao");

    if (compatibilidade)
        compatibilidade.innerHTML = dados.compativel ? "✅ Compatível" : "❌ Não Compatível";

    if (motivo)
        motivo.innerHTML = dados.motivo;

    if (fonte)
        fonte.innerHTML = "Fonte recomendada: " + dados.fonteRecomendada;

    if (sugestao)
        sugestao.innerHTML = dados.sugestao;
}



// ------------------------------
// PRODUTOS SELECIONADOS NA STORE
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const montagem =
        JSON.parse(localStorage.getItem("montagem")) || {};



    function preencher(id, componente) {

        const campo = document.getElementById(id);

        if (!campo) return;

        if (componente) {

            campo.innerHTML =
                componente.nome +
                "<br><small>R$ " +
                componente.preco.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                }) +
                "</small>";

        }

    }



    preencher("processadorNome", montagem.processador);
    preencher("placaMaeNome", montagem.placaMae);
    preencher("memoriaNome", montagem.memoria);
    preencher("armazenamentoNome", montagem.armazenamento);
    preencher("gpuNome", montagem.gpu);
    preencher("gabineteNome", montagem.gabinete);
    preencher("coolerNome", montagem.cooler);



    // Total

    let total = 0;

    Object.values(montagem).forEach(item => {

        if (item && item.preco)
            total += Number(item.preco);

    });

    const precoTotal = document.getElementById("precoTotal");

    if (precoTotal) {

        precoTotal.innerHTML =
            "Preço Total: R$ " +
            total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
            });

    }

});
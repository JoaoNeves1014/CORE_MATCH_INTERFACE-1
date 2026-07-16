console.log("Login JS carregado");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // pega dados
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            // envia para API
            const resposta = await fetch(
                "http://localhost:3000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            // erro login
            if (!resposta.ok) {
                alert("Usuário não cadastrado");
                return;
            }

            alert("Login realizado");

            // --- ALTERAÇÕES AQUI ---
            // 1. Marca que o usuário está logado para sumir os botões do header
            localStorage.setItem("usuarioLogado", "true");

            // 2. SALVA OS DADOS REAIS DO USUÁRIO VINDOS DA API
            // Se sua API retornar o usuário diretamente em 'dados', usamos 'dados'. 
            // Se ela retornar dentro de um objeto 'dados.user' ou 'dados.usuario', ajuste aqui!
            const dadosUsuario = dados.usuario || dados.user || dados;
            localStorage.setItem("usuarioAtivo", JSON.stringify(dadosUsuario));
            // ------------------------

            console.log(dados);

            // redireciona (ajuste para a sua página inicial, ex: "home.html" ou "index.html")
            window.location.href = "index.html";

        } catch (erro) {
            console.log(erro);
            alert("Erro ao conectar na API");
        }
    });
});
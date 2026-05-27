console.log("JS carregado");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM carregado");

    const form = document.getElementById("formCadastro");

    form.addEventListener("submit", async (event) => {

        console.log("Submit acionado");

        event.preventDefault();

        const nome = document.getElementById("nome").value;

        const email = document.getElementById("email").value;
        
        const senha = document.getElementById("senha").value;

        const senhaRep = document.getElementById("senha-rep").value;

        console.log(nome);
        console.log(email);
        console.log(senha);

        // valida senha
        if (senha !== senhaRep) {

            alert("As senhas não coincidem");

            return;
        }

        try {

            console.log("Enviando para API...");

            const resposta = await fetch(
                "http://localhost:3000/TabelaCadastro",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nome,
                        email,
                        senha
                    })
                }
            );

            console.log("Resposta recebida");

            const dados = await resposta.json();

            console.log(dados);

            if (!resposta.ok) {

                alert(dados.erro);

                return;
            }

            alert("Cadastro realizado");

        } catch (erro) {

            console.log("ERRO:");

            console.log(erro);

            alert("Erro ao conectar com API");
        }
    });
});
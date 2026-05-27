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

            console.log(dados);

            // redireciona
            window.location.href = "home.html";

        } catch (erro) {

            console.log(erro);

            alert("Erro ao conectar na API");
        }
    });
});
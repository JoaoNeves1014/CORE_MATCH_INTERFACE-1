document.addEventListener("DOMContentLoaded", () => {
        // Seleciona o container dos botões de Login e Cadastro
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
    });

    // Função caso você queira permitir o usuário deslogar depois
    function logout() {
        localStorage.removeItem("usuarioLogado");
        window.location.reload(); // Recarrega a página para atualizar os botões
    }
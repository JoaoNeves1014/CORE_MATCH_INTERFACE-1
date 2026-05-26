function fazercadastro(event) {
    
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const senhaRep = document.getElementById("senha-rep").value;

    if (nome === "" || email === "" || senha === "" || senhaRep === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    if (senha !== senhaRep) {
        alert("As senhas não coincidem!");
        return;
    }

    if (email === "admin@gmail.com") {
        alert("Este e-mail já está cadastrado!");
    } else {
        alert("Cadastro realizado com sucesso, " + nome + "!");
        window.location.href = "home.html";
    }
} 
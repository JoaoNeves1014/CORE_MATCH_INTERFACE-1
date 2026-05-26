

function fazerlogin(event) {

event.preventDefault();

const email = document.getElementById("email").valu
const senha = document.getElementById("senha").valu

if(email === "" || senha === "") {
    alert("Preencha todos os campos!");
    return;
}

if (email === "admin@gmail.com" && senha === "123456") {

    alert("Login realizado com sucesso!");

    window.location.href = "home.html";
} else {

    alert("Email ou senha inválidos!");
}

}

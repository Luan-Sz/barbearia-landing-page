document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("form_agendamento");

    if (!form) {
        console.error("Form não encontrado");
        return;
    }

    const inputData = document.getElementById("data");

    //LIMITAR DATA 
    if (inputData) {
        const hoje = new Date().toISOString().split("T")[0];
        inputData.setAttribute("min", hoje);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        //CAMPOS BÁSICOS
        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();

       //SERVIÇO
const servicoSelect = document.getElementById("servico");

let servico = "Não informado";

if (servicoSelect && servicoSelect.value) {
    servico = servicoSelect.selectedOptions[0].text;
}

//PROFISSIONAL
const profissionalSelect = document.getElementById("profissional");

let profissional = "Qualquer profissional";

if (profissionalSelect && profissionalSelect.value) {
    profissional = profissionalSelect.selectedOptions[0].text;
}
        //DATA E HORA
        const data = document.getElementById("data").value;
        const hora = document.getElementById("hora").value;

        //VALIDAÇÃO EXTRA
        if (!nome || !telefone || !data || !hora) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        //FORMATAR DATA
        let dataFormatada = data;
        if (data.includes("-")) {
            const partes = data.split("-");
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        //MENSAGEM MARCACAO
        const mensagem = 
        `Olá, gostaria de agendar um horário:

        Nome: ${nome}
        Telefone: ${telefone}
        Serviço: ${servico}
        Profissional: ${profissional}
        Data: ${dataFormatada}
        Hora: ${hora}`;

        const mensagemFormatada = encodeURIComponent(mensagem);

        const numero = "5588999978808";

        const link = `https://wa.me/${numero}?text=${mensagemFormatada}`;

        //REDIRECIONAMENTO SEGURO
        window.location.href = link;
    });

});

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("form_agendamento");

    if (!form) {
        console.error("Form não encontrado");
        return;
    }

    //FORMATAR TELEFONE
    const telefoneInput = document.getElementById("telefone");

    if (telefoneInput) {
        telefoneInput.addEventListener("input", function () {
        let valor = this.value.replace(/\D/g, "");

    if (valor.length > 11) {
            valor = valor.slice(0, 11);
        }

        //(11) 98765-4321
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        this.value = valor;
    });
}
    
    //LIMITAR DATA 
    const inputData = document.getElementById("data");

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

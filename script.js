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

        //BOTAO
        const botao = form.querySelector("button");

        if (botao) {
            botao.innerText = "Enviando...";
            botao.disabled = true;
        }

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

        let profissional = profissionalSelect?.value
            ? profissionalSelect.selectedOptions[0].text
            : "Qualquer profissional";

        //DATA E HORA
        const dataInput = document.getElementById("data");
        const horaInput = document.getElementById("hora");

        const data = dataInput ? dataInput.value : "";
        const hora = horaInput ? horaInput.value : "";

        //VALIDAÇÃO EXTRA
        if (nome.length < 2) {
            alert("Nome muito curto");
            return;
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");
        if (telefoneLimpo.length < 10) {
            alert("Telefone inválido");
            return;
        }

        if (!data || !hora) {
            alert("Data e hora obrigatórias");
            resetButton(botao);
            return;
        }

        //FORMATAR DATA
        let dataFormatada = data;
        if (data.includes("-")) {
            const partes = data.split("-");
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        //MENSAGEM MARCACAO
        const mensagem = `Olá, gostaria de agendar um horário:

        Nome: ${nome}
        Telefone: ${telefoneLimpo}
        Serviço: ${servico}
        Profissional: ${profissional}
        Data: ${dataFormatada}
        Hora: ${hora}`;

        const mensagemFormatada = encodeURIComponent(mensagem);

        const numero = "5588999978808";

        const link = `https://wa.me/${numero}?text=${mensagemFormatada}`;

        //REDIRECIONAMENTO SEGURO
        const confirmar = confirm("Confirmar agendamento e abrir WhatsApp?");
        
        if (confirmar) {
            resetButton(botao);
            window.location.href = link;
            return;
        }

        resetButton(botao);
    });

});

function resetButton(botao) {
    if (botao) {
        botao.innerText = "Agendar pelo WhatsApp";
        botao.disabled = false;
    }
}

//SCROLL REVEAL
const elements = document.querySelectorAll(
  ".servico_card, .info_card, .item, .hero_frases"
);

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    elements.forEach((el) => {
        const top = el.getBoundingClientRect().top;

        if (top < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

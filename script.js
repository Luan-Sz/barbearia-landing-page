document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("form_agendamento");

    if (!form) {
        console.error("Ops! O formulário de agendamento não foi encontrado no HTML.");
        return;
    }

    //FORMATAR TELEFONE - Deixando o campo bonitinho enquanto o usuário digita
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

    //LIMITAR DATA - Evita que o cliente tente agendar no passado
    const inputData = document.getElementById("data");

    if (inputData) {
        const hoje = new Date().toISOString().split("T")[0];
        inputData.setAttribute("min", hoje);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        //BOTAO - Aqui a gente dá aquele feedback visual pro cliente não clicar duas vezes
        const botao = form.querySelector("button");
        const originalText = "Agendar pelo WhatsApp";

        if (botao) {
            botao.style.width = `${botao.offsetWidth}px`; // Mantém o tamanho pra não balançar o layout
            botao.innerHTML = '<span>Processando...</span>'; 
            botao.disabled = true;
            botao.style.opacity = "0.7";
        }

        //CAMPOS BÁSICOS
        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();

        //SERVIÇO - Pegando o texto bonitinho que está no select
        const servicoSelect = document.getElementById("servico");
        let servico = "Não informado";

        if (servicoSelect && servicoSelect.value) {
            servico = servicoSelect.selectedOptions[0].text;
        }

        //PROFISSIONAL - Verificando se o cliente escolheu alguém ou se está de boa com qualquer um
        const profissionalSelect = document.getElementById("profissional");
        let profissional = profissionalSelect?.value
            ? profissionalSelect.selectedOptions[0].text
            : "Qualquer profissional";

        //DATA E HORA
        const dataInput = document.getElementById("data");
        const horaInput = document.getElementById("hora");

        const data = dataInput ? dataInput.value : "";
        const hora = horaInput ? horaInput.value : "";

        //VALIDAÇÃO EXTRA - Aquela checada rápida pra ver se os dados fazem sentido
        if (nome.length < 2) {
            destacarErro("nome");
            alert("Por favor, digite seu nome completo.");
            resetButton(botao);
            return;
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");
        if (telefoneLimpo.length < 10) {
            destacarErro("telefone");
            alert("O número de telefone parece estar incompleto.");
            resetButton(botao);
            return;
        }

        if (!data || !hora) {
            alert("Precisamos saber o dia e a hora do seu agendamento.");
            if (!data) destacarErro("data");
            if (!hora) destacarErro("hora");
            resetButton(botao);
            return;
        }

        //FORMATAR DATA - Transformando o padrão do sistema (ano-mes-dia) para o nosso (dia/mes/ano)
        let dataFormatada = data;
        if (data.includes("-")) {
            const partes = data.split("-");
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        //MENSAGEM MARCACAO - Preparando o texto que vai chegar no Zap do barbeiro
        const mensagem = `Olá, gostaria de agendar um horário:

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
        const confirmar = confirm("Tudo pronto! Podemos abrir o seu WhatsApp para finalizar o agendamento?");
        
        if (confirmar) {
            window.location.href = link;
            // Damos um tempinho para o navegador abrir o link antes de resetar o botão
            setTimeout(() => resetButton(botao), 2000);
            return;
        }

        resetButton(botao);
    });

});

// Função amiga para resetar o botão caso algo dê errado ou o usuário cancele
function resetButton(botao) {
    if (botao) {
        botao.innerText = "Agendar pelo WhatsApp";
        botao.disabled = false;
        botao.style.opacity = "1";
    }
}

//SCROLL REVEAL - Aquele efeito suave das seções aparecendo ao rolar a página
const elements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    elements.forEach((el) => {
        const top = el.getBoundingClientRect().top;

        if (top < windowHeight - 100) {
            el.classList.add("active");
        } else {
            el.classList.remove("active"); //RESET SCROLL REVEAL
        }
    });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

//CLIQUE SECAO PROFISSIONAL CARDS - Preenche o nome do barbeiro automaticamente
const cards = document.querySelectorAll(".prof_card");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const profissional = card.getAttribute("data-profissional");

        //scroll suave até o formulário
        const section = document.getElementById("marcacao");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }

        //selecionar profissional no form e focar no próximo passo (data)
        setTimeout(() => {
            const select = document.getElementById("profissional");
            if (select) {
                select.value = profissional;
                document.getElementById("data").focus(); 
            }
        }, 500);
    });
});

//CLIQUE SECAO SERVICOS CARDS - Preenche o serviço automaticamente
const servicos = document.querySelectorAll(".servico_card");

servicos.forEach(card => {
    card.addEventListener("click", () => {
        const servico = card.getAttribute("data-servico");

        //scroll suave até o formulário
        const section = document.getElementById("marcacao");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }

        //selecionar serviço no form e focar no próximo passo (profissional)
        setTimeout(() => {
            const select = document.getElementById("servico");
            if (select) {
                select.value = servico;
                document.getElementById("profissional").focus();
            }
        }, 500);
    });
});

//NOTIFICAR ERRO USUARIO - Faz o campo brilhar em vermelho pra chamar atenção
function destacarErro(idCampo) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;

    campo.style.borderColor = "#ff4b4b";
    campo.style.transition = "all 0.3s";
    
    setTimeout(() => {
        campo.style.borderColor = ""; // Volta para o padrão do CSS
    }, 2000);
    
    campo.focus();
}

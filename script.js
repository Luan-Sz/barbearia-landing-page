const CONFIG = {
    whatsappNumero: "5588999978808", //NUMERO DO AGENDAMENTO
};

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formAgendamento");

    if (!form) return;

    //MASCARA TELEFONE
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) {
        telefoneInput.addEventListener("input", function () {
            let valor = this.value.replace(/\D/g, "");
            if (valor.length > 11) valor = valor.slice(0, 11);
            valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2 ");
            valor = valor.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
            this.value = valor;
        });
    }

    //BLOQUEAR FORM DATA PASSADO
    const inputData = document.getElementById("data");
    if (inputData) {
        const hoje = new Date().toISOString().split("T")[0];
        inputData.setAttribute("min", hoje);
    }

    //ENVIAR FORM
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const botao = form.querySelector("button");
        if (botao) {
            botao.style.width = `${botao.offsetWidth}px`;
            botao.innerHTML = '<span>Processando...</span>'; 
            botao.disabled = true;
            botao.style.opacity = "0.7";
        }

        //CAPTURA DADOS
        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const servicoSelect = document.getElementById("servico");
        const profissionalSelect = document.getElementById("profissional");
        const data = document.getElementById("data").value;
        const hora = document.getElementById("hora").value;

        //VALIDACOES
        if (nome.length < 2 || telefone.replace(/\D/g, "").length < 10 || !data || !hora) {
            alert("Por favor, preencha todos os campos corretamente.");
            resetButton(botao);
            return;
        }
        
        //PREPARAÇÃO PARA O FUTURO BACKEND (JAVA)
        const agendamentoPayload = {
            clienteNome: nome,
            clienteTelefone: telefone.replace(/\D/g, ""), 
            servicoId: servicoSelect.value, 
            profissionalId: profissionalSelect.value || "qualquer",
            dataHoraAgendamento: `${data}T${hora}:00` 
        };

       //DISPARO PARA O JAVA
       fetch("http://localhost:8080/agendamentos", {
           method: "POST", 
           headers: {
               "Content-Type": "application/json" 
           },
           body: JSON.stringify(agendamentoPayload) 
       })
       .then(resposta => {
           if (resposta.ok) {
               console.log("Wakethefuckup, SAMURAI. We have a city to burn! deu certo");
           } else {
               console.error("Erro HTTP:", resposta.status);
           }
       })
       .catch(erro => {
           console.error("Erro de conexão. Servidor não está rodando?", erro);
       });

        //INTEGRAÇÃO WHATSAPP
        const servicoTexto = servicoSelect.selectedOptions[0].text;
        const profissionalTexto = profissionalSelect.value ? profissionalSelect.selectedOptions[0].text : "Sem preferência";
        const dataFormatada = data.split("-").reverse().join("/");

        const mensagem = `Olá! Gostaria de agendar um horário:\n*Nome:* *${nome}*\n*Telefone:* *${telefone}*\n*Serviço:* ${servicoTexto}\n*Profissional:* ${profissionalTexto}\n*Data:* ${dataFormatada}\n*Hora:* ${hora}`;

        const link = `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;

        const confirmar = confirm("Tudo pronto! Vamos abrir o seu WhatsApp para finalizar o agendamento?");
        
        if (confirmar) {
            //NOVA ABA REDIRECIONAMENTO
            window.open(link, '_blank'); 
            setTimeout(() => resetButton(botao), 2000);
            form.reset(); //limpa form apos envio
        } else {
            resetButton(botao);
        }
    });

    // Ocultar indicador de scroll ao rolar a página verticalmente
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            // Se rolou mais de 100px para baixo, esconde o indicador
            if (window.scrollY > 100) {
                scrollIndicator.classList.add('is-scrolled');
            } else {
                scrollIndicator.classList.remove('is-scrolled');
            }
        });
    }
});

//RESET BTN
function resetButton(botao) {
    if (botao) {
        botao.innerText = "Confirmar Agendamento";
        botao.disabled = false;
        botao.style.opacity = "1";
        botao.style.width = "100%"; // Retorna ao padrão mobile
    }
}

//INTEGRACAO UI E UX

//SCROLL REVEAL (Intersection Observer)
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            //efeito unico (melhor pra performance)
            // observer.unobserve(entry.target);
        } else {
            // Saiu da tela: esconde o elemento de novo
            entry.target.classList.remove("active");
        }
    });
}, {
    root: null,
    threshold: 0.15, // Dispara quando 15% do card aparecer
});

revealElements.forEach(el => revealObserver.observe(el));

//CLIQUE DE MARCACAO FORM CARDS
function setupCardClick(seletorCard, idSelectForm, dataAttribute, focusTargetId) {
    const cards = document.querySelectorAll(seletorCard);
    
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const valor = card.getAttribute(dataAttribute);
            const sectionForm = document.getElementById("marcacao");
            const selectTarget = document.getElementById(idSelectForm);
            
            if (sectionForm && selectTarget) {
                sectionForm.scrollIntoView({ behavior: "smooth" });
                
                setTimeout(() => {
                    selectTarget.value = valor;
                    // Pisca a borda pra mostrar pro cliente que preencheu sozinho
                    selectTarget.style.borderColor = "var(--dourado)";
                    setTimeout(() => selectTarget.style.borderColor = "", 1500);

                    document.getElementById(focusTargetId).focus();
                }, 600); //TEMPO SCROLL SUAVE
            }
        });
    });
}

setupCardClick(".prof_card", "profissional", "data-profissional", "data");
setupCardClick(".servico_card", "servico", "data-servico", "profissional");

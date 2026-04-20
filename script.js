const CONFIG = {
    whatsappNumero: "5588999978808", 
};

function mostrarAvisoPremium(mensagem) {
    const toast = document.createElement("div");
    toast.innerText = mensagem;
    toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #111; color: #c6a96b; padding: 15px 25px; border-radius: 8px; z-index: 9999; border: 1px solid #c6a96b; font-family: 'Poppins', sans-serif; font-size: 14px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8); opacity: 0; transition: opacity 0.3s ease;";
    
    document.body.appendChild(toast);
    
    //animacao entrada
    setTimeout(() => toast.style.opacity = "1", 10);
    
    //some e quebra depois de 4sec
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// MENU HAMBURGUER
const btnMobile = document.getElementById('btn-mobile');
const menu = document.getElementById('menu');

if (btnMobile && menu) {
    btnMobile.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');
        btnMobile.classList.toggle('active');
        btnMobile.setAttribute('aria-expanded', isActive);
    });

    const links = document.querySelectorAll('.nav_menu a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btnMobile.classList.remove('active');
            btnMobile.setAttribute('aria-expanded', false);
        });
    });
}

//FAROL EFFECT (INTERSECTION OBSERVER)
//ajuste para disparar assim que o card estiver centralizado
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', 
    threshold: 0
};

const observerCenter = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-center');
        } else {
            entry.target.classList.remove('is-center');
        }
    });
}, observerOptions);

//tempo de 100ms pra ligar a tela e depois o radar
setTimeout(() => {
    const cards = document.querySelectorAll('.servico_card, .prof_card');
    cards.forEach(card => observerCenter.observe(card));
}, 100);

//FORM, MASCARA E WHATSAPP
const form = document.getElementById("formAgendamento");

if (form) {
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

    //BLOQUEAR DATA PASSADO FORM (TRAVA DUPLA) 
    const inputData = document.getElementById("data");
    if (inputData) {
        //pega a data exata no fuso BR
        const dataAtual = new Date();
        dataAtual.setMinutes(dataAtual.getMinutes() - dataAtual.getTimezoneOffset());
        const hoje = dataAtual.toISOString().split("T")[0];

        //1 TRAVA - VISUAL
        inputData.setAttribute("min", hoje);

        //2 TRAVA - MOBILE
        inputData.addEventListener("change", function () {
            if (this.value < hoje) {
                mostrarAvisoPremium("Data inválida. Selecione uma data a partir de hoje.");
                this.value = hoje; 
            }
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const botao = form.querySelector("button");
        if (botao) {
            botao.style.width = `${botao.offsetWidth}px`;
            botao.innerHTML = '<span>Processando...</span>'; 
            botao.disabled = true;
            botao.style.opacity = "0.7";
        }

        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const servicoSelect = document.getElementById("servico");
        const profissionalSelect = document.getElementById("profissional");
        const data = document.getElementById("data").value;
        const hora = document.getElementById("hora").value;

        //VALIDACAO ERRO POR ERRO
        if (nome.length < 2) {
            mostrarAvisoPremium("Por favor, informe seu nome.");
            document.getElementById("nome").focus(); //poe o cursor pro erro
            resetButton(botao);
            return;
        }

        if (telefone.replace(/\D/g, "").length < 10) {
            mostrarAvisoPremium("Informe um WhatsApp válido com DDD.");
            document.getElementById("telefone").focus();
            resetButton(botao);
            return;
        }

        if (!data) {
            mostrarAvisoPremium("Escolha a data do agendamento.");
            document.getElementById("data").focus();
            resetButton(botao);
            return;
        }

        if (!hora) {
            mostrarAvisoPremium("Escolha o horário do agendamento.");
            document.getElementById("hora").focus();
            resetButton(botao);
            return;
        }
        
        const agendamentoPayload = {
            clienteNome: nome,
            clienteTelefone: telefone.replace(/\D/g, ""), 
            servicoId: servicoSelect.value, 
            profissionalId: profissionalSelect.value || "qualquer",
            dataHoraAgendamento: `${data}T${hora}:00` 
        };

       fetch("http://localhost:8080/agendamentos", {
           method: "POST", 
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(agendamentoPayload) 
       })
       .then(resposta => {
           if (resposta.ok) console.log("Wakethefuckup, SAMURAI. We have a city to burn! deu certo");
       })
       .catch(erro => console.error("Erro de conexão", erro));

        const servicoTexto = servicoSelect.selectedOptions[0].text;
        const profissionalTexto = profissionalSelect.value ? profissionalSelect.selectedOptions[0].text : "Sem preferência";
        const dataFormatada = data.split("-").reverse().join("/");

        const mensagem = `Olá! Gostaria de agendar um horário:\n*Nome:* *${nome}*\n*Telefone:* *${telefone}*\n*Serviço:* ${servicoTexto}\n*Profissional:* ${profissionalTexto}\n*Data:* ${dataFormatada}\n*Hora:* ${hora}`;
        const link = `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;

        if (confirm("Tudo pronto! Vamos abrir o seu WhatsApp para finalizar o agendamento?")) {
            window.open(link, '_blank'); 
            setTimeout(() => resetButton(botao), 2000);
            form.reset(); 
        } else {
            resetButton(botao);
        }
    });
}

function resetButton(botao) {
    if (botao) {
        botao.innerText = "Confirmar Agendamento";
        botao.disabled = false;
        botao.style.opacity = "1";
        botao.style.width = "100%"; 
    }
}


//SCROLL REVEAL E CLIQUES NOS CARDS
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        } else {
            entry.target.classList.remove("active");
        }
    });
}, { root: null, threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

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
                    selectTarget.style.borderColor = "var(--dourado)";
                    setTimeout(() => selectTarget.style.borderColor = "", 1500);
                    document.getElementById(focusTargetId).focus();
                }, 600); 
            }
        });
    });
}

setupCardClick(".prof_card", "profissional", "data-profissional", "data");
setupCardClick(".servico_card", "servico", "data-servico", "profissional");

// ========================================
// ESTADO DA CAIXA
// ========================================

const estadoCaixa = {
    slots: [
        null,
        null,
        null,
        null,
        null,
        null
    ]
};


// ========================================
// CONFIGURAÇÃO DOS FUSÍVEIS
// ========================================

const fusiveis = {

    vermelho: {
        nome: "Vermelho",
        classe: "vermelho"
    },

    verde: {
        nome: "Verde",
        classe: "verde"
    },

    amarelo1: {
        nome: "Amarelo 1",
        classe: "amarelo"
    },

    amarelo2: {
        nome: "Amarelo 2",
        classe: "amarelo"
    },

    rosa: {
        nome: "Rosa",
        classe: "rosa"
    },

    roxo: {
        nome: "Roxo",
        classe: "roxo"
    }

};

// ========================================
// POSIÇÃO CORRETA DOS FUSÍVEIS
// ========================================

const fusivelPorSlot = [
    "vermelho",
    "verde",
    "amarelo1",
    "rosa",
    "amarelo2",
    "roxo"
];


// ========================================
// COMBINAÇÕES DA CAIXA
// ========================================

const combinacoes = [

    // Vermelho + Verde
    {
        fusiveis: ["vermelho", "verde"],
        slots: [0, 1],
        mensagem: "TODAS AS PORTAS ABERTAS",
        cor: "verde"
    },

    // Vermelho + Verde + Amarelo 1
    {
        fusiveis: ["vermelho", "verde", "amarelo1"],
        slots: [0, 1, 2],
        mensagem: "PORTA DA CABINE ABERTA",
        cor: "verde"
    },

    // Vermelho + Amarelo 1
    {
        fusiveis: ["vermelho", "amarelo1"],
        slots: [0, 2],
        mensagem: "PORTAS DA TRIPULAÇÃO E DEPÓSITO ABERTAS",
        cor: "amarelo"
    },

    // Vermelho + Amarelo 2
    {
        fusiveis: ["vermelho", "amarelo2"],
        slots: [0, 4],
        mensagem: "PORTAS DOS PASSAGEIROS ABERTAS",
        cor: "verde"
    },

    // Rosa + Roxo
    {
        fusiveis: ["rosa", "roxo"],
        slots: [3, 5],
        mensagem: "ELÉTRICA DO TREM FUNCIONANDO",
        cor: "roxo"
    }

];



function verificarCombinacao() {

    const instalados =
        estadoCaixa.slots.filter(
            fusivel => fusivel !== null
        );


    const combinacoesAtivas =
        combinacoes.filter(
            function (combinacao) {

                return combinacao.fusiveis.every(
                    function (fusivel) {

                        return instalados.includes(
                            fusivel
                        );

                    }
                );

            }
        );


    return combinacoesAtivas;
}

// ========================================
// ATUALIZAR DESTAQUE DAS COMBINAÇÕES
// ========================================

function atualizarDestaqueCombinacao() {

    // Remove qualquer destaque anterior

    slots.forEach(function (slot) {

        slot.classList.remove(
            "combinacao-ativa"
        );

    });


    const combinacoesAtivas =
        verificarCombinacao();


    // ========================================
    // NENHUMA COMBINAÇÃO
    // ========================================

    if (combinacoesAtivas.length === 0) {

        statusMensagens.innerHTML = `
            <span>SISTEMA EM ESPERA</span>
        `;

        luzStatus.className =
            "luz-status";

        combinacoesAtivasAnteriormente = [];

        return;

    }


    // ========================================
    // MENSAGENS ATIVAS
    // ========================================

    statusMensagens.innerHTML =
        combinacoesAtivas.map(
            function (combinacao) {

                return `
                    <span class="status-mensagem">
                        <span class="status-indicador status-${combinacao.cor}"></span>
                        ${combinacao.mensagem}
                    </span>
                `;

            }
        ).join("");


    // ========================================
    // DESTACAR TODOS OS SLOTS ENVOLVIDOS
    // ========================================

    const slotsAtivos = new Set();


    combinacoesAtivas.forEach(
        function (combinacao) {

            combinacao.slots.forEach(
                function (indice) {

                    slotsAtivos.add(indice);

                }
            );

        }
    );


    slotsAtivos.forEach(
        function (indice) {

            slots[indice].classList.add(
                "combinacao-ativa"
            );

        }
    );


    // ========================================
    // DETECTAR NOVAS COMBINAÇÕES
    // ========================================

    const novasCombinacoes =
        combinacoesAtivas.filter(
            function (combinacao) {

                return !combinacoesAtivasAnteriormente.includes(
                    combinacao.mensagem
                );

            }
        );


    if (novasCombinacoes.length > 0) {

        tocarSomCombinacao();

    }


    combinacoesAtivasAnteriormente =
        combinacoesAtivas.map(
            function (combinacao) {

                return combinacao.mensagem;

            }
        );


    // ========================================
    // INDICADOR PRINCIPAL
    // ========================================

    luzStatus.className =
        "luz-status status-ativo";

}

// ========================================
// ELEMENTOS
// ========================================

const checkboxes =
    document.querySelectorAll(
        "[data-fusivel]"
    );

const fusiveisDisponiveis =
    document.querySelectorAll(
        ".fusivel-disponivel"
    );

const slots =
    document.querySelectorAll(".slot");

const botaoReset =
    document.getElementById("btn-reset");

const nenhumDisponivel =
    document.getElementById("nenhum-disponivel");

const luzStatus =
    document.querySelector(".luz-status");

const statusMensagens =
    document.querySelector(".status-mensagens");

// ========================================
// SOM DAS COMBINAÇÕES
// ========================================

let audioContext = null;
let combinacoesAtivasAnteriormente = [];

function tocarSomCombinacao() {

    if (!audioContext) {
        audioContext =
            new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }


    const agora =
        audioContext.currentTime;


    // Primeiro bip

    const oscilador1 =
        audioContext.createOscillator();

    const ganho1 =
        audioContext.createGain();


    oscilador1.type = "square";

    oscilador1.frequency.setValueAtTime(
        520,
        agora
    );

    ganho1.gain.setValueAtTime(
        0.0001,
        agora
    );

    ganho1.gain.exponentialRampToValueAtTime(
        0.12,
        agora + 0.01
    );

    ganho1.gain.exponentialRampToValueAtTime(
        0.0001,
        agora + 0.12
    );


    oscilador1.connect(ganho1);
    ganho1.connect(audioContext.destination);


    oscilador1.start(agora);
    oscilador1.stop(agora + 0.12);


    // Segundo bip

    const oscilador2 =
        audioContext.createOscillator();

    const ganho2 =
        audioContext.createGain();


    oscilador2.type = "square";

    oscilador2.frequency.setValueAtTime(
        760,
        agora + 0.14
    );

    ganho2.gain.setValueAtTime(
        0.0001,
        agora + 0.14
    );

    ganho2.gain.exponentialRampToValueAtTime(
        0.12,
        agora + 0.15
    );

    ganho2.gain.exponentialRampToValueAtTime(
        0.0001,
        agora + 0.28
    );


    oscilador2.connect(ganho2);
    ganho2.connect(audioContext.destination);


    oscilador2.start(agora + 0.14);
    oscilador2.stop(agora + 0.28);
}

// ========================================
// SOM DE INSTALAÇÃO DO FUSÍVEL
// ========================================

function tocarSomInstalacao() {

    if (!audioContext) {
        audioContext =
            new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();

    oscilador.type = "square";

    oscilador.frequency.setValueAtTime(
        420,
        agora
    );

    ganho.gain.setValueAtTime(
        0.0001,
        agora
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.08,
        agora + 0.01
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.0001,
        agora + 0.10
    );

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);

    oscilador.start(agora);
    oscilador.stop(agora + 0.10);
}

// ========================================
// ATUALIZAR PAINEL DE DISPONÍVEIS
// ========================================

function atualizarPainelDisponiveis() {

    let existeDisponivel = false;


    fusiveisDisponiveis.forEach(
        function (fusivel) {

            if (
                fusivel.style.display !== "none"
            ) {

                existeDisponivel = true;

            }

        }
    );


    if (existeDisponivel) {

        nenhumDisponivel.style.display =
            "none";

    } else {

        nenhumDisponivel.style.display =
            "flex";

    }

}

// ========================================
// MOSTRAR / ESCONDER FUSÍVEIS
// ========================================

checkboxes.forEach(function (checkbox) {

    checkbox.addEventListener("change", function () {

        const tipo =
            checkbox.dataset.fusivel;

        const fusivel =
            document.querySelector(
                `.fusivel-disponivel[data-tipo="${tipo}"]`
            );


        if (checkbox.checked) {

            // Mostra o fusível

            fusivel.style.display = "block";

            // Volta para a posição original

            resetarPosicaoFusivel(fusivel);

        } else {

            // Remove da caixa

            removerFusivelDaCaixa(tipo);

            // Esconde o fusível

            fusivel.style.display = "none";

            // Limpa qualquer posição anterior

            resetarPosicaoFusivel(fusivel);

        }

        atualizarPainelDisponiveis();

    });

});


// ========================================
// CONFIGURAR ARRASTE DOS FUSÍVEIS
// ========================================

fusiveisDisponiveis.forEach(function (fusivel) {

    fusivel.addEventListener(
        "pointerdown",
        iniciarArraste
    );

    fusivel.addEventListener(
        "pointermove",
        moverFusivel
    );

    fusivel.addEventListener(
        "pointerup",
        finalizarArraste
    );

});



// ========================================
// VARIÁVEIS DO ARRASTE
// ========================================

let fusivelArrastado = null;

let fusivelSelecionado = null;
let ultimoToque = 0;

let offsetX = 0;
let offsetY = 0;

// ========================================
// COMEÇAR A ARRASTAR
// ========================================

function iniciarArraste(evento) {

    // No celular: detecta toque duplo
    if (evento.pointerType === "touch") {

        const fusivel =
            evento.currentTarget;

        const agora =
            Date.now();

        if (
            fusivelSelecionado === fusivel &&
            agora - ultimoToque < 400
        ) {

            const tipo =
                fusivel.dataset.tipo;

            const indice =
                fusivelPorSlot.indexOf(tipo);

            if (indice !== -1) {

                const slot =
                    slots[indice];

                fusivelSelecionado = null;
                ultimoToque = 0;

                fusivel.classList.remove(
                    "selecionado"
                );

                instalarFusivel(
                    slot,
                    tipo
                );

            }

            return;
        }

        fusivelSelecionado =
            fusivel;

        ultimoToque =
            agora;

        fusivelSelecionado.classList.add(
            "selecionado"
        );

        return;
    }

    // No PC: mantém o arraste normal
    evento.preventDefault();

    fusivelArrastado =
        evento.currentTarget;


    const rect =
        fusivelArrastado.getBoundingClientRect();


    offsetX =
        evento.clientX - rect.left;

    offsetY =
        evento.clientY - rect.top;


    fusivelArrastado.setPointerCapture(
        evento.pointerId
    );


    fusivelArrastado.classList.add(
        "arrastando"
    );


    console.log(
        "Começou a arrastar:",
        fusivelArrastado.dataset.tipo
    );

}


// ========================================
// MOVER FUSÍVEL
// ========================================

function moverFusivel(evento) {

    if (
        fusivelArrastado !==
        evento.currentTarget
    ) {
        return;
    }


    fusivelArrastado.style.position =
        "fixed";


    fusivelArrastado.style.left =
        `${evento.clientX - offsetX}px`;


    fusivelArrastado.style.top =
        `${evento.clientY - offsetY}px`;

}


// ========================================
// SOLTAR FUSÍVEL
// ========================================

function finalizarArraste(evento) {

    if (
        fusivelArrastado !==
        evento.currentTarget
    ) {
        return;
    }


    const fusivel =
        fusivelArrastado;


    const tipo =
        fusivel.dataset.tipo;


    console.log(
        "Soltou:",
        tipo
    );


    fusivel.releasePointerCapture(
        evento.pointerId
    );


    fusivel.classList.remove(
        "arrastando"
    );


    verificarOndeSoltou(
        evento.clientX,
        evento.clientY,
        tipo
    );


    fusivelArrastado = null;

}


// ========================================
// VERIFICAR ONDE SOLTOU
// ========================================

function verificarOndeSoltou(
    x,
    y,
    tipoFusivel
) {

    let encontrouSlot = false;


    slots.forEach(function (slot) {

        const rect =
            slot.getBoundingClientRect();


        const dentroDoSlot =
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom;


        if (dentroDoSlot) {

            const indice =
                Number(slot.dataset.slot) - 1;

            const fusivelEsperado =
                fusivelPorSlot[indice];

            const fusivelValido =
                tipoFusivel === fusivelEsperado 


            console.log(
                "Fusível",
                tipoFusivel,
                "solto no slot:",
                slot.dataset.slot
            );


            if (fusivelValido) {

                encontrouSlot = true;

                console.log(
                    "Encaixe correto!"
                );

                instalarFusivel(
                    slot,
                    tipoFusivel
                );

            } else {

                console.log(
                    "Encaixe incorreto!"
                );

            }

        }

    });


    // Se soltou fora da caixa,
    // volta para o lugar original

    if (!encontrouSlot) {

        const fusivel =
            document.querySelector(
                `.fusivel-disponivel[data-tipo="${tipoFusivel}"]`
            );


        resetarPosicaoFusivel(
            fusivel
        );

    }

}


// ========================================
// INSTALAR FUSÍVEL
// ========================================

function instalarFusivel(
    slot,
    tipoFusivel
) {

    const indice =
        Number(slot.dataset.slot) - 1;


    estadoCaixa.slots[indice] =
        tipoFusivel;
    
    tocarSomInstalacao();


    console.log(
        "Estado atual:",
        estadoCaixa.slots
    );


    // Esconde o fusível disponível

    const fusivel =
        document.querySelector(
            `.fusivel-disponivel[data-tipo="${tipoFusivel}"]`
        );


    fusivel.style.display =
        "none";


    resetarPosicaoFusivel(
        fusivel
    );


    renderizarCaixa();
    atualizarDestaqueCombinacao();

}


// ========================================
// REMOVER FUSÍVEL DA CAIXA
// ========================================

function removerFusivelDaCaixa(
    tipoFusivel
) {

    estadoCaixa.slots.forEach(
        function (fusivel, indice) {

            if (
                fusivel ===
                tipoFusivel
            ) {

                estadoCaixa.slots[indice] =
                    null;

            }

        }
    );


    renderizarCaixa();
    atualizarDestaqueCombinacao();

}


// ========================================
// DESENHAR CAIXA
// ========================================

function renderizarCaixa() {

    slots.forEach(function (
        slot,
        indice
    ) {

        const fusivel =
            estadoCaixa.slots[indice];


        // ==================================
        // SLOT VAZIO
        // ==================================

        if (fusivel === null) {

            const fusivelEsperado =
                fusivelPorSlot[indice];

            const dadosEsperados =
                fusiveis[fusivelEsperado];

            slot.innerHTML = `
                <span class="numero">
                    ${indice + 1}
                </span>

                <div class="terminal terminal-esquerdo"></div>

                <div class="corpo-fusivel vazio ${dadosEsperados.classe}">
                    <span class="nome-fusivel">
                        ${dadosEsperados.nome}
                    </span>
                </div>

                <div class="terminal terminal-direito"></div>
            `;

            return;
        }


        // ==================================
        // DADOS DO FUSÍVEL
        // ==================================

        const dados =
            fusiveis[fusivel];


        // ==================================
        // SLOT COM FUSÍVEL
        // ==================================

        slot.innerHTML = `

            <span class="numero">
                ${indice + 1}
            </span>

            <div class="terminal terminal-esquerdo"></div>

            <div class="corpo-fusivel">

                <div class="fusivel-interno ${dados.classe}">

                    <div class="fio"></div>

                </div>

            </div>

            <div class="terminal terminal-direito"></div>

        `;

    });

}


// ========================================
// RESETAR POSIÇÃO
// ========================================

function resetarPosicaoFusivel(
    fusivel
) {

    fusivel.style.position = "";
    fusivel.style.left = "";
    fusivel.style.top = "";
    fusivel.style.transform = "";
    fusivel.style.zIndex = "";
    fusivel.style.opacity = "";
    fusivel.style.pointerEvents = "";

    fusivel.classList.remove(
        "arrastando"
    );

}


// ========================================
// RESETAR CAIXA
// ========================================

botaoReset.addEventListener(
    "click",
    function () {

        console.log(
            "Resetando caixa..."
        );


        // Limpa os slots

        estadoCaixa.slots = [
            null,
            null,
            null,
            null,
            null,
            null
        ];


        // Devolve todos os fusíveis descobertos

        fusiveisDisponiveis.forEach(
            function (fusivel) {

                const tipo =
                    fusivel.dataset.tipo;


                const checkbox =
                    document.querySelector(
                        `[data-fusivel="${tipo}"]`
                    );


                if (checkbox.checked) {

                    fusivel.style.display =
                        "block";

                    resetarPosicaoFusivel(
                        fusivel
                    );

                }

            }
        );


        renderizarCaixa();
        atualizarDestaqueCombinacao();

    }
);

// ========================================
// INICIALIZAR CAIXA
// ========================================

renderizarCaixa();
atualizarPainelDisponiveis();
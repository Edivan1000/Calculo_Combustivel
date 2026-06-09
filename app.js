let CONSUMO =
Number(localStorage.getItem("consumo")) || 12.5;

let PRECO_COMBUSTIVEL =
Number(localStorage.getItem("precoCombustivel")) || 7;

let DISTANCIA_DIA =
Number(localStorage.getItem("distanciaDia")) || 60;

let PARTICIPACAO_CUNHADA =
Number(localStorage.getItem("participacao")) || 50;

let abastecimentos =
JSON.parse(localStorage.getItem("abastecimentos")) || [];

let diasCunhada =
Number(localStorage.getItem("diasCunhada")) || 0;
let valorPagoCunhada =
Number(localStorage.getItem("valorPagoCunhada")) || 0;
let kmPercorridos =
Number(localStorage.getItem("kmPercorridos")) || 0;

let ultimoDesconto =
Number(localStorage.getItem("ultimoDesconto")) || 0;

function mostrarAba(aba){

    document.getElementById("abaCombustivel").style.display = "none";
    document.getElementById("abaCunhada").style.display = "none";
    document.getElementById("abaConfiguracoes")
    .style.display = "none";
    document.getElementById("abaViagens")
    .style.display = "none";

    if(aba === "combustivel"){
        document.getElementById("abaCombustivel").style.display = "block";
    }

    if(aba === "cunhada"){
        document.getElementById("abaCunhada").style.display = "block";
    }
    if(aba === "configuracoes"){
    document.getElementById("abaConfiguracoes")
        .style.display = "block";
}
    if(aba === "viagens"){
    document.getElementById("abaViagens")
    .style.display = "block";
}
}

function salvarAbastecimento(){

    const data =
    document.getElementById("dataAbastecimento").value;

    const valor =
    Number(document.getElementById("valorAbastecimento").value);

    if(!valor){
        alert("Informe o valor abastecido.");
        return;
    }

    abastecimentos.push({
        data,
        valor
    });

    localStorage.setItem(
        "abastecimentos",
        JSON.stringify(abastecimentos)
    );

    document.getElementById("valorAbastecimento").value = "";

    atualizarTela();
}

function salvarDiasCunhada(){

    diasCunhada =
    Number(document.getElementById("diasCunhada").value);

    valorPagoCunhada =
    Number(document.getElementById("valorPagoCunhada").value) || 0;

    localStorage.setItem(
        "diasCunhada",
        diasCunhada
    );

    localStorage.setItem(
        "valorPagoCunhada",
        valorPagoCunhada
    );

    atualizarTela();
}

function atualizarTela(){

    let totalAbastecido = 0;

    const tabela =
    document.getElementById("tabelaAbastecimentos");

    tabela.innerHTML = "";

    abastecimentos.forEach((item, index) => {


        totalAbastecido += item.valor;

        tabela.innerHTML += `
    <tr>
        <td>${item.data || "-"}</td>
        <td>R$ ${item.valor.toFixed(2)}</td>

        <td>
            <button
                class="btn btn-danger btn-sm"
                onclick="excluirAbastecimento(${index})">

                <i class="bi bi-trash"></i>

            </button>
        </td>
    </tr>
`;
    });

    const litrosTotais =
    totalAbastecido / PRECO_COMBUSTIVEL;

    const autonomia =
    litrosTotais * CONSUMO;

    let ultimoAbastecimentoKm = 0;

if(abastecimentos.length > 0){

    const ultimo =
    abastecimentos[abastecimentos.length - 1];

    ultimoAbastecimentoKm =
    (ultimo.valor / PRECO_COMBUSTIVEL) * CONSUMO;
}

const autonomiaRestante =
autonomia - kmPercorridos;

    const kmCunhada =
    diasCunhada * DISTANCIA_DIA;

    const litrosCunhada =
    kmCunhada / CONSUMO;

    const custoCunhada =
    litrosCunhada * PRECO_COMBUSTIVEL;

    const valorReceber =
    custoCunhada * (PARTICIPACAO_CUNHADA / 100);

    const saldoCunhada =
    valorReceber - valorPagoCunhada;

    document.getElementById("totalAbastecido")
        .innerText =
        "R$ " + totalAbastecido.toFixed(2);

    document.getElementById("autonomia")
        .innerText =
        autonomia.toFixed(0) + " km";

    document.getElementById("diasCunhadaCard")
        .innerText =
        diasCunhada;

    document.getElementById("valorReceber")
        .innerText =
        "R$ " + valorReceber.toFixed(2);

    document.getElementById("saldoCunhada")
    .innerText =
    "R$ " + saldoCunhada.toFixed(2);

document.getElementById("statusCunhada")
    .innerText =
    saldoCunhada <= 0
        ? "✅ Contas quitadas"
        : "⚠️ Em aberto";

    document.getElementById("ultimoAbastecimento")
.innerText =
ultimoAbastecimentoKm.toFixed(0) + " km";

document.getElementById("autonomiaRestante")
.innerText =   
Math.max(0, autonomiaRestante).toFixed(0) + " km";      

document.getElementById("kmPercorridosCard")
    .innerText =
    kmPercorridos.toFixed(0) + " km";

console.log("Autonomia:", autonomia);
console.log("KM Percorridos:", kmPercorridos);
console.log("Restante:", autonomiaRestante);

}

function excluirAbastecimento(index){

    const confirmar =
    confirm("Deseja excluir este abastecimento?");

    if(!confirmar){
        return;
    }

    abastecimentos.splice(index, 1);

    localStorage.setItem(
        "abastecimentos",
        JSON.stringify(abastecimentos)
    );

    atualizarTela();
}

function salvarConfiguracoes(){

    CONSUMO =
    Number(document.getElementById("consumo").value);

    PRECO_COMBUSTIVEL =
    Number(document.getElementById("precoCombustivel").value);

    DISTANCIA_DIA =
    Number(document.getElementById("distanciaDia").value);

    PARTICIPACAO_CUNHADA =
    Number(document.getElementById("participacao").value);

    localStorage.setItem(
        "consumo",
        CONSUMO
    );

    localStorage.setItem(
        "precoCombustivel",
        PRECO_COMBUSTIVEL
    );

    localStorage.setItem(
        "distanciaDia",
        DISTANCIA_DIA
    );

    localStorage.setItem(
        "participacao",
        PARTICIPACAO_CUNHADA
    );

    alert("Configurações salvas!");

    atualizarTela();
}

document.getElementById("consumo").value =
CONSUMO;

document.getElementById("precoCombustivel").value =
PRECO_COMBUSTIVEL;

document.getElementById("distanciaDia").value =
DISTANCIA_DIA;

document.getElementById("participacao").value =
PARTICIPACAO_CUNHADA;

document.getElementById("valorPagoCunhada").value =
valorPagoCunhada;

function registrarViagem(){

    const km =
    Number(document.getElementById("kmViagem").value);

    if(!km){
        return;
    }

    kmPercorridos += km;

    localStorage.setItem(
        "kmPercorridos",
        kmPercorridos
    );

    document.getElementById("kmViagem").value = "";

    atualizarTela();
}

function trabalheiHoje(){

    const confirmar = confirm(
        "Tem certeza que trabalhou hoje?\n\nSerá descontado "
        + DISTANCIA_DIA +
        " km da autonomia."
    );

    if(!confirmar){
        return;
    }

    kmPercorridos += DISTANCIA_DIA;

    ultimoDesconto = DISTANCIA_DIA;

    localStorage.setItem(
        "kmPercorridos",
        kmPercorridos
    );

    localStorage.setItem(
        "ultimoDesconto",
        ultimoDesconto
    );

    atualizarTela();
}
    function desfazerUltimoDia(){

    if(ultimoDesconto <= 0){
        alert("Nenhum lançamento para desfazer.");
        return;
    }

    const confirmar =
    confirm("Deseja desfazer o último registro?");

    if(!confirmar){
        return;
    }

    kmPercorridos -= ultimoDesconto;

    if(kmPercorridos < 0){
        kmPercorridos = 0;
    }

    ultimoDesconto = 0;

    localStorage.setItem(
        "kmPercorridos",
        kmPercorridos
    );

    localStorage.setItem(
        "ultimoDesconto",
        ultimoDesconto
    );

    atualizarTela();
}
atualizarTela();

    function zerarKmPercorridos(){

    const confirmar = confirm(
        "Deseja realmente zerar os KM percorridos?"
    );

    if(!confirmar){
        return;
    }

    kmPercorridos = 0;

    localStorage.setItem(
        "kmPercorridos",
        kmPercorridos
    );

    atualizarTela();

    alert("KM percorridos zerados com sucesso!");
}

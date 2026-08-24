    let abastecimentos =
        JSON.parse(localStorage.getItem("abastecimentos")) || [];

    function mostrarAba(aba){

        document.getElementById("abaCombustivel").style.display = "none";
        document.getElementById("abaChecklist").style.display = "none";

        if(aba === "combustivel"){

            document.getElementById("abaCombustivel").style.display = "block";

        }

        if(aba === "checklist"){

            document.getElementById("abaChecklist").style.display = "block";

        }

    }

    function salvarAbastecimento(){

        const data =
            document.getElementById("dataAbastecimento").value;

        const valor =
            Number(
                document.getElementById("valorAbastecimento").value
            );

        const km =
            Number(
                document.getElementById("kmAbastecimento").value
            );

        const preco =
            Number(
                document.getElementById("precoAbastecimento").value
            );

        if(!data || !valor || !km || !preco){

            alert("Preencha todos os campos do abastecimento.");

            return;
        }

        abastecimentos.push({
            data: data,
            valor: valor,
            km: km,
            preco: preco
        });

        localStorage.setItem(
            "abastecimentos",
            JSON.stringify(abastecimentos)
        );

        document.getElementById("dataAbastecimento").value = "";
        document.getElementById("valorAbastecimento").value = "";
        document.getElementById("kmAbastecimento").value = "";
        document.getElementById("precoAbastecimento").value = "";

        atualizarHistorico();
        atualizarCards();
    }


    function atualizarHistorico(){

        const tabela =
            document.getElementById("tabelaAbastecimentos");

        tabela.innerHTML = "";

        abastecimentos.forEach((item, index) => {

            tabela.innerHTML += `
                <tr>

                    <td>
                        ${formatarData(item.data)}
                    </td>

                    <td>
                        ${formatarMoeda(item.valor)}
                    </td>

                    <td>
                        ${item.km} km
                    </td>

                    <td>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="excluirAbastecimento(${index})">

                            🗑️

                        </button>

                    </td>

                </tr>
            `;

        });

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

        atualizarHistorico();
        atualizarCards();
    }


    function formatarMoeda(valor){

        return valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    function formatarData(data){

        if(!data){
            return "-";
        }

        const partes = data.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    atualizarHistorico();
    atualizarCards();

    function calcularConsumoReal(){

        if(abastecimentos.length < 2){
            return null;
        }

        const atual =
            abastecimentos[abastecimentos.length - 1];

        const anterior =
            abastecimentos[abastecimentos.length - 2];

        const kmRodados =
            atual.km - anterior.km;

        const litrosAbastecidos =
            atual.valor / atual.preco;

        if(kmRodados <= 0 || litrosAbastecidos <= 0){
            return null;
        }

        return kmRodados / litrosAbastecidos;
    }

    function atualizarCards(){

    const cardTotal =
        document.getElementById("totalAbastecido");

    const cardKm =
        document.getElementById("kmAtualVeiculoCard");

    const cardAutonomia =
        document.getElementById("autonomia");

    const cardConsumo =
        document.getElementById("consumoMedio");

    const cardUltimo =
        document.getElementById("ultimoAbastecimento");


    // =========================
    // NENHUM ABASTECIMENTO
    // =========================

    if(abastecimentos.length === 0){

        cardTotal.innerText = "R$ 0,00";
        cardKm.innerText = "0";
        cardAutonomia.innerText = "0 km";
        cardConsumo.innerText = "Aguardando abastecimentos";
        cardUltimo.innerText = "R$ 0,00";

        return;
    }


    // =========================
    // TOTAL ABASTECIDO
    // =========================

    let totalAbastecido = 0;

    abastecimentos.forEach(function(item){

        totalAbastecido += item.valor;

    });

    cardTotal.innerText =
        formatarMoeda(totalAbastecido);


    // =========================
    // ÚLTIMO ABASTECIMENTO
    // =========================

    const ultimo =
    abastecimentos[abastecimentos.length - 1];

if(abastecimentos.length >= 2){

    const anterior =
        abastecimentos[abastecimentos.length - 2];

    document.getElementById("kmAtualVeiculoCard")
        .innerText =
        anterior.km;

} else {

    document.getElementById("kmAtualVeiculoCard")
        .innerText =
        "0";
}

    document.getElementById("kmAbastecimentoAtual")
    .innerText =
    ultimo.km;

    // KM de abastecimento do veículo
    const kmDesdeAbastecimento =
    abastecimentos.length >= 2
        ? ultimo.km -
          abastecimentos[abastecimentos.length - 2].km
        : 0;

    document.getElementById("kmDesdeAbastecimento")
    .innerText =
    kmDesdeAbastecimento + " km";


    // Valor do último abastecimento
    cardUltimo.innerText =
        formatarMoeda(ultimo.valor);


    // =========================
    // CONSUMO REAL
    // =========================

    const consumo =
        calcularConsumoReal();


    if(consumo === null){

        cardConsumo.innerText =
            "Aguardando próximo";

        cardAutonomia.innerText =
            "Aguardando próximo";

        return;
    }


    // =========================
    // CONSUMO MÉDIO
    // =========================

    cardConsumo.innerText =
        consumo.toFixed(2) + " km/L";


    // =========================
    // AUTONOMIA
    // =========================

    const litros =
        ultimo.valor / ultimo.preco;

    const autonomia =
        litros * consumo;

    cardAutonomia.innerText =
        autonomia.toFixed(0) + " km";

}


    function salvarChecklist(){

        const checklist = {

            data: new Date().toISOString(),

            calibragem:
                document.getElementById("checkCalibragem").checked,

            radiador:
                document.getElementById("checkRadiador").checked,

            oleo:
                document.getElementById("checkOleo").checked,

            sinalizacao:
                document.getElementById("checkSinalizacao").checked,

            combustivel:
                document.getElementById("checkCombustivel").checked,

            aguaParabrisa:
                document.getElementById("checkAguaParabrisa").checked

        };

        let historicoChecklist =
            JSON.parse(
                localStorage.getItem("historicoChecklist")
            ) || [];

        historicoChecklist.push(checklist);

        localStorage.setItem(
            "historicoChecklist",
            JSON.stringify(historicoChecklist)
        );

        alert("Checklist salvo com sucesso!");

    }
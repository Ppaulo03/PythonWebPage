let DadoBarras = document.getElementById("DadoBarras");
let DadoLinhas = document.getElementById("DadosLinhas");
let Vbase = document.getElementById("Vbase");

let NumBarra_element = document.getElementById("num_barras");
let n_barras = NumBarra_element.value;

let NumLinhas_element = document.getElementById("num_linhas");
let n_linhas = NumLinhas_element.value;

let name_tipos = ["slack", "PQ", "PV"]


let dado_barra_labels = ["N_barra", "Tipo", "Potencia Ativa de Carga (p.u)", "Potencia Reativa de Carga (p.u)", "Potencia ativa gerada(p.u)", 
                        "Potencia reativa gerada (p.u)", "Modulo da tensao (p.u)", "Angulo da tensao (graus)"];
let dado_linhas_labels = ["Barra Envio", "Barra_recibo", "Resistencia Serie (p.u)", "Reatancia Serie (p.u)", "Suceptancia shunt Y/2 (p.u)"];


function dado_barras_linha(num_barra)
{
    let line =  document.createElement('tr');

    let cel =  document.createElement('th');
    let label = document.createElement('label');
    label.innerHTML = num_barra;
    cel.appendChild(label);
    line.append(cel);

    let cel_tipo = document.createElement('th');
    let tipo = document.createElement('select');
    tipo.name = "tipo" + num_barra;
    name_tipos.forEach(e =>
    {
        let t =  document.createElement('option');
        t.style = "text-align: center";
        t.value = e;
        t.innerHTML = e;
        tipo.appendChild(t);
    });
    cel_tipo.appendChild(tipo);
    line.append(cel_tipo);
    
    for(let i = 0; i <6; i++)
    {
        let cel_content = document.createElement('th');
        let c = document.createElement('input');
        c.name = dado_barra_labels[i+2] + num_barra;
        c.type = "number";
        c.style = "text-align: center"
        cel_content.appendChild(c);
        line.append(cel_content);
    }
    DadoBarras.appendChild(line);
}

function create_table_dado_barras()
{
    DadoBarras.innerHTML = "";
    n_barras = NumBarra_element.value;

    if(n_barras < 3)
    {
        n_barras = 3;
        NumBarra_element.value = "3";
    }
    else if(n_barras > 10)  
    {
        n_barras = 10;
        NumBarra_element.value = "10";
    }
    let line =  document.createElement('tr');
    dado_barra_labels.forEach(e =>
        {
            let cel =  document.createElement('th');
            let t =  document.createElement('label');
            t.innerHTML = e;
            cel.appendChild(t);
            line.append(cel);
        });
    
    DadoBarras.appendChild(line);
    
    for(let i = 0; i < n_barras; i++)
    {
        dado_barras_linha(i+1);
    }
    create_table_Vbase();
}


function create_table_Vbase(){
    Vbase.innerHTML = "";
    let title = document.createElement('caption');
    title.innerHTML = "Vbase (kV)";
    Vbase.appendChild(title);
    let line =  document.createElement('tr');
    for(let i = 0; i < n_barras; i++)
    {
        let cel =  document.createElement('th');
        let t =  document.createElement('label');
        t.innerHTML = i+1;
        t.step="0.01";
        t.min = 0;
        cel.appendChild(t);
        line.append(cel);
    }
    Vbase.appendChild(line);
    let line2 =  document.createElement('tr');
    for(let i = 0; i < n_barras; i++)
    {
        let cel_content = document.createElement('th');
        let c = document.createElement('input');
        c.name = "Vbase" + i;
        c.type = "number";
        c.step="0.01"
        c.style = "text-align: center"
        cel_content.appendChild(c);
        line2.append(cel_content);
    }
    Vbase.appendChild(line2);
}

function dado_linha_linha(linha)
{
    let line =  document.createElement('tr');
    
    for(let i = 0; i <5; i++)
    {
        let cel_content = document.createElement('th');
        let c = document.createElement('input');
        c.name = dado_linhas_labels[i] + linha;
        c.type = "number";
        c.style = "text-align: center"
        cel_content.appendChild(c);
        line.append(cel_content);
    }
    DadoLinhas.appendChild(line);
}

function create_table_dado_linhas()
{
    DadoLinhas.innerHTML = "";
    n_linhas = NumLinhas_element.value;

    if(n_linhas < n_barras-1)
    {
        n_linhas = n_barras-1;
        NumBarra_element.value = n_barras-1;
    }

    let line =  document.createElement('tr');
    dado_linhas_labels.forEach(e =>
        {
            let cel =  document.createElement('th');
            let t =  document.createElement('label');
            t.innerHTML = e;
            cel.appendChild(t);
            line.append(cel);
        });

    DadoLinhas.appendChild(line);

    for(let i = 0; i < n_linhas; i++)
    {
        dado_linha_linha(i);
    }

}


create_table_dado_barras();
create_table_dado_linhas();

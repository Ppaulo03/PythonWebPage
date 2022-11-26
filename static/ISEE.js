let DadoBarras = document.getElementById("DadoBarras");
let NumBarra_element = document.getElementById("num_barras");
let n_barras = NumBarra_element.value;
let name_tipos = ["slack", "PQ", "PV"]


function dado_barras_linha(num_barra)
{
    let label = document.createElement('label');
    label.innerHTML = num_barra;
    DadoBarras.appendChild(label)
    let tipo = document.createElement('select');
    
    name_tipos.forEach(e =>
        {
            let t =  document.createElement('option');
            t.value = e;
            t.innerHTML = e;
            tipo.appendChild(t);
        });
    
    DadoBarras.appendChild(tipo);
    
    for(let i = 0; i <6; i++)
    {
        let c = document.createElement('input');
        c.type = "number";
        DadoBarras.appendChild(c);
    }
    DadoBarras.appendChild( document.createElement('br'));
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
    
    for(let i = 0; i < n_barras; i++)
    {
        dado_barras_linha(i+1);
    }
}
create_table_dado_barras();

var fireworks = document.getElementById("fireworks");
fireworks.style.display = "none";

class Celula
{
    constructor(linha, coluna)
    {
        this.linha = linha;
        this.coluna = coluna;
        this.bomba = false;
        this.proximidade = 0;
        this.reveal = false;
        this.marked = false;
    }
}

function limits(n, min, max)
{
    let n_min = n - 1;
    let n_max = n + 2;
    if(n_min < min) n_min = n;
    if (n_max > max) n_max = n + 1;
    return [n_min, n_max];
}

class Tabuleiro 
{
    constructor(linha=0, coluna=0, num_bombs=1) 
    {
        this.linha = linha;
        this.coluna = coluna;
        this.blank = linha*coluna;
        this.num_bombs = num_bombs;
        this.situacao = 0;

        this.objetive = num_bombs;
        this.num_marks = 0;
        this.right_marks = 0;
        this.table_element = document.getElementById("table")
        this.table_element.addEventListener("contextmenu", e => e.preventDefault());
        this._create_tabuleiro();
    }


    _create_tabuleiro()
    {
        this.tabuleiro = [];
        for(let lin = 0; lin < this.linha; lin++)
        {
            let tab = [];
            for(let n = 0; n<this.coluna; n++)
            {
                let btn = document.createElement("button");
                btn.className = "minabot";
                
                btn.type="submit";
                btn.name='info';
                btn.addEventListener('mouseup', (e) =>  {
                    switch (e.button) {
                        case 0:
                            this.reveal(lin, n);
                            break;
                        case 2:
                            this.mark(lin, n);
                            break;
                        default: break;
                      }
                    
                });

                let img = document.createElement('img');
                let situation = ((lin + n) % 2 == 0).toString();
                situation = situation.charAt(0).toUpperCase() + situation.slice(1);
                img.id = "tile("+ lin + "," + n+")";
                img.src = "./static/assets/images/minefild/tile" + situation  + ".png";
                img.style="width: 150%; height: 150%;"
                img.alt="tile";
                btn.appendChild(img);

                this.table_element.appendChild(btn);
                
                tab.push(new Celula(lin, n, img));
            }
            this.tabuleiro.push(tab);
            this.table_element.appendChild(document.createElement("br"));
        }
    }


    _count_mines()
    { 
        for(let j = 0; j < this.linha; j++)
        {
            for(let k = 0; k < this.coluna; k++)
            {
                if (!this.tabuleiro[j][k].bomba)
                {  
                    let j_min_max = limits(j, 0, this.linha);
                    let k_min_max = limits(k, 0, this.coluna);
                    for(let line = j_min_max[0]; line < j_min_max[1]; line++)
                    {
                        for(let col = k_min_max[0]; col < k_min_max[1]; col++)
                        {
                            if(this.tabuleiro[line][col].bomba)
                            {
                                this.tabuleiro[j][k].proximidade ++;
                            }
                        }
                    }
                }
            }
        }
    }

    first_bomb(lin, col)
    {
        while(true)
        {
            for(var jay = 0; jay < this.linha; jay++)
            {
                for(var k = 0; k < this.coluna; k++)
                {
                    let rand =  Math.floor(Math.random() * (this.linha*this.coluna) ) + 1;
                    if (rand == (this.linha * this.coluna))
                    {
                        let j_min_max = limits(lin, 0, this.linha);
                        let k_min_max = limits(col, 0, this.coluna);

                        if(!(j_min_max[0] <= jay && jay < j_min_max[1]) || !(k_min_max[0] <= k && k < k_min_max[1]))
                        {
                            if (!this.tabuleiro[jay][k].bomba)
                            {
                                this.tabuleiro[jay][k].bomba = true;
                                this.num_bombs -= 1;

                                if(this.num_bombs == 0)
                                {
                                    this._count_mines();
                                    this.reveal(lin, col);
                                    return;
                                }
                            }
                        }      
                    }
                }
            }
        }
    }

    reveal(line, col)
    {
        if(this.num_bombs > 0)
        {
            this.first_bomb(line, col);
            return;
        }
        
        let celula = this.tabuleiro[line][col];
        if(celula.bomba)
        {
            this.end();
            this.tabuleiro[line][col].reveal = true;
            let img = document.getElementById("tile("+ line + "," + col +")");
            let situation = ((line + col) % 2 == 0).toString();
            situation = situation.charAt(0).toUpperCase() + situation.slice(1);
            img.src = "./static/assets/images/minefild/bomb" + situation  + ".png";
            
            for(let j = 0; j < this.linha; j ++)
                for(let k = 0; k < this.coluna; k ++)
                    if (this.tabuleiro[j][k].bomba)
                    {
                        this.tabuleiro[j][k].reveal = true;
                        let img = document.getElementById("tile("+ j + "," + k +")");
                        let situation = ((j + k) % 2 == 0).toString();
                        situation = situation.charAt(0).toUpperCase() + situation.slice(1);
                        img.src = "./static/assets/images/minefild/bomb" + situation  + ".png";
                    }
                        
            
            return;
        }

        else if(!celula.reveal)
        {
            if(celula.marked) this.mark(line, col);
            this.tabuleiro[line][col].reveal = true;
            this.blank -= 1;

            let img = document.getElementById("tile("+ line + "," + col +")");
            let situation = ((line + col) % 2 == 0).toString();
            situation = situation.charAt(0).toUpperCase() + situation.slice(1);
            img.src = "./static/assets/images/minefild/num" + celula.proximidade + situation  + ".png";
            
            if(celula.proximidade == 0)
            {
                let j_min_max = limits(line, 0, this.linha);
                let k_min_max = limits(col, 0, this.coluna);
                for(let j = j_min_max[0]; j < j_min_max[1]; j++)
                {
                    for(let k = k_min_max[0]; k < k_min_max[1]; k++)
                    {
                        if(celula != this.tabuleiro[j][k])
                        {
                            if(!this.tabuleiro[j][k].reveal) this.reveal(j, k);
                        }
                    }
                }
            }
            
        }
        if (this.blank == this.objetive) 
        {
            fireworks.style.display = "block";
            this.end();
        }
       
    }

    mark(line, col)
    {
        let celula = this.tabuleiro[line][col];
        if(!celula.reveal)
        {
            let img = document.getElementById("tile("+ line + "," + col +")");
            let situation = ((line + col) % 2 == 0).toString();
            situation = situation.charAt(0).toUpperCase() + situation.slice(1);

            if(celula.marked)
            {
                this.tabuleiro[line][col].marked = false
                img.src = "./static/assets/images/minefild/tile" + situation  + ".png";
                this.num_marks --;
                if(celula.bomba) this.right_marks --;
            }
            else
            {
                this.tabuleiro[line][col].marked = true
                img.src = "./static/assets/images/minefild/flag" + situation  + ".png";
                this.num_marks ++;
                if(celula.bomba) this.right_marks++;
            }
            if ((this.right_marks == this.objetive) && (this.right_marks == this.num_marks)) 
            {
                fireworks.style.display = "block";
                this.end();
            }
        } 
    }

    end()
    {
        for (let tiles of this.table_element.children) 
            tiles.setAttribute("disabled", "");
    }
}
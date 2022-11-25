class Celula
{
    constructor(linha, coluna)
    {
        this.linha = linha
        this.coluna = coluna
        this.bomba = false
        this.proximidade = 0
        this.reveal = false
        this.marked = false
    }
}

function limits(n, min, max)
{
    var n_min = n - 1
    var n_max = n + 2
    if(n_min < min) n_min = n
    if (n_max > max) n_max = n + 1
    return n_min, n_max
}

class Tabuleiro 
{
    constructor(linha=0, coluna=0, num_bombs=0) 
    {
        this.linha = linha;
        this.coluna = coluna;
        this.blank = linha*coluna;
        this.num_bombs = num_bombs;

        this.objetive = num_bombs;
        this.num_marks = 0;
        this.right_marks = 0;
        this._create_tabuleiro();
    }


    _create_tabuleiro()
    {
        this.tabuleiro = [];
        for(var lin = 0; lin < this.linha; lin++)
        {
            for(var n; n<this.coluna; n++)
            {
                tab = tab.push(Celula(lin, n))
                this.tabuleiro.push(tab)
            }
        }
    }

    _count_mines()
    {
        for(var j = 0; j < this.linha; j++)
        {
            for(var k = 0; k < this.coluna; k++)
            {
                if (!this.tabuleiro[j][k].bomba)
                {
                    j_min, j_max = limits(j, 0, this.linha)
                    k_min, k_max = limits(k, 0, this.coluna)
                    for(var line = j_min; lin < j_max; line++)
                    {
                        for(var col = k_min; col < k_max; col++)
                        {
                            if(this.tabuleiro[line][col].bomba) 
                                this.tabuleiro[j][k].proximidade += 1
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
                    rand = randint(1, (self.linha*self.coluna))
                    if (rand == (this.linha * this.coluna))
                    {
                        j_min, j_max = limits(lin, 0, self.linha)
                        k_min, k_max = limits(col, 0, self.coluna)
                        if(!(j_min <= jay && jay < j_max) || !(k_min <= k && k < k_max))
                        {
                            if (!this.tabuleiro[jay][k].bomba)
                            {
                                this.tabuleiro[jay][k].bomba = true
                                this.num_bombs -= 1
                                if(this.num_bombs == 0)
                                {
                                    this._count_mines()
                                    this.reveal(lin, col)
                                    return
                                }
                            }
                        }      
                    }
                }
            }
        }
    }



}
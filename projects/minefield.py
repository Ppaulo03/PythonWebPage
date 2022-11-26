from random import randint
import pdb


def limits(n, min, max):
    n_min = n - 1
    n_max = n + 2
    if n_min < min:
        n_min = n
    if n_max > max:
        n_max = n + 1
    return n_min, n_max


def show(table):
    print()
    for line in table:
        for item in line:
            print(item.proximidade, item.bomba, item.reveal, end=" ")
        print()
    print()


class Tabuleiro():

    class Celula():

        def __init__(self, linha, coluna):
            self.linha = linha
            self.coluna = coluna
            self.bomba = False
            self.proximidade = 0
            self.reveal = False
            self.marked = False

    def __init__(self, linha=0, coluna=0, num_bombs=5, txt=None):
        if txt is None:
            self.linha = linha
            self.coluna = coluna
            self.blank = linha*coluna
            self.num_bombs = num_bombs
            self.num_marks = 0
            self.right_marks = 0
            self.objetive = num_bombs
            self._create_tabuleiro()
        else:
            try:
                with open(txt, mode="r") as teste:
                    pass
            except Exception:
                txt = '/home/peter03/PythonWebPage/' + txt
            with open(txt, mode='r') as jogo:
                file = jogo.read().splitlines()
                self.linha = int(file.pop(0))
                self.coluna = int(file.pop(0))
                self.blank = int(file.pop(0))
                self.num_bombs = int(file.pop(0))
                self.num_marks = int(file.pop(0))
                self.right_marks = int(file.pop(0))
                self.objetive = int(file.pop(0))
                self.tabuleiro = []
                file.remove("")
                for idx_linha, linha in enumerate(file):
                    content = linha.split(";")
                    content.remove("")
                    lin = []
                    for idx_coluna, celula in enumerate(content):
                        cel = self.Celula(idx_linha, idx_coluna)
                        item = celula.split(',')
                        cel.bomba = True if item[0] == 'True' else False
                        cel.proximidade = int(item[1])
                        cel.reveal = True if item[2] == 'True' else False
                        cel.marked = True if item[3] == 'True' else False
                        lin.append(cel)
                    self.tabuleiro.append(lin)

    def _create_tabuleiro(self):
        self.tabuleiro = []
        for lin in range(self.linha):
            tab = [self.Celula(lin, n) for n in range(self.coluna)]
            self.tabuleiro.append(tab)

    def _count_mines(self):
        for j in range(self.linha):
            for k in range(self.coluna):
                if not self.tabuleiro[j][k].bomba:
                    j_min, j_max = limits(j, 0, self.linha)
                    k_min, k_max = limits(k, 0, self.coluna)
                    for line in range(j_min, j_max):
                        for col in range(k_min, k_max):
                            if self.tabuleiro[line][col].bomba:
                                self.tabuleiro[j][k].proximidade += 1

    def reveal(self, line, col):
        if self.num_bombs > 0:
            self.first_bomb(line, col)
            return False, False

        celula = self.tabuleiro[line][col]

        if celula.bomba:
            self.tabuleiro[line][col].reveal = True
            for idx_l, l in enumerate(self.tabuleiro):
                for idx_j,  j in enumerate(l):
                    if j.bomba:
                        self.tabuleiro[idx_l][idx_j].reveal = True
            return False, True

        elif not celula.reveal:
            if celula.marked:
                self.mark(line, col)
            self.tabuleiro[line][col].reveal = True
            if celula.proximidade == 0:
                j_min, j_max = limits(line, 0, self.linha)
                k_min, k_max = limits(col, 0, self.coluna)
                for j in range(j_min, j_max):
                    for k in range(k_min, k_max):
                        if celula is not self.tabuleiro[j][k]:
                            if not self.tabuleiro[j][k].reveal:
                                self.reveal(j, k)

        self.blank -= 1
        if self.blank == self.objetive:
            return True, False
        else:
            return False, False

    def mark(self, line, col):
        celula = self.tabuleiro[line][col]
        if celula.marked:
            self.tabuleiro[line][col].marked = False
            self.num_marks -= 1
            if celula.bomba:
                self.right_marks -= 1
        else:
            self.tabuleiro[line][col].marked = True
            self.num_marks += 1
            if celula.bomba:
                self.right_marks += 1

        if self.right_marks == self.objetive == self.num_marks:
            return True, False
        else:
            return False, False

    def first_bomb(self, lin, col):
        while True:
            for jay in range(self.linha):
                for k in range(self.coluna):
                    rand = randint(1, (self.linha*self.coluna))
                    if rand == (self.linha*self.coluna):
                        j_min, j_max = limits(lin, 0, self.linha)
                        k_min, k_max = limits(col, 0, self.coluna)
                        if not j_min <= jay < j_max or not k_min <= k < k_max:
                            if not self.tabuleiro[jay][k].bomba:
                                self.tabuleiro[jay][k].bomba = True
                                self.num_bombs -= 1
                                if self.num_bombs == 0:
                                    self._count_mines()
                                    self.reveal(lin, col)
                                    return

    def register_game(self, txt):
        try:
            with open(txt, mode="w") as teste:
                pass
        except Exception:
            txt = '/home/peter03/PythonWebPage/' + txt
        with open(txt, mode="w") as jogo:
            jogo.write(f'{self.linha}\n')
            jogo.write(f'{self.coluna}\n')
            jogo.write(f'{self.blank}\n')
            jogo.write(f'{self.num_bombs}\n')
            jogo.write(f'{self.num_marks}\n')
            jogo.write(f'{self.right_marks}\n')
            jogo.write(f'{self.objetive}\n')

            for l in self.tabuleiro:
                jogo.write('\n')
                for num in l:
                    jogo.write(
                        f'{num.bomba},{num.proximidade},{num.reveal}\
,{num.marked};')


if __name__ == "__main__":
    # jogo = Tabuleiro(txt='database.txt')
    jogo = Tabuleiro(6, 6, 4)
    jogo.first_bomb(2, 2)
    jogo.mark(3, 4)
    # show(jogo.tabuleiro)
    jogo.register_game('database.txt')

    # while True:
    #     x = int(input('x: '))
    #     y = int(input('y: '))
    #     win = jogo.reveal(x, y)
    #     show(jogo.table)
    #     if not win:
    #         print("You lost")
    #         break

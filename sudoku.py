from copy import deepcopy
import pdb


def show_matriz(matriz):

    print()
    cont_row = 2
    for line in matriz:
        cont_line = 2
        for num in line:
            print(num, end=" ")
            if not cont_line:
                cont_line = 2
                print(end="   ")
            else:
                cont_line -= 1
        print("")
        if not cont_row:
            cont_row = 2
            print()
        else:
            cont_row -= 1


def transformar_em_listas(matriz):  # transform 0 em [0]

    new_matriz = [
        [[col] if type(col) is not list else col for col in lin]
        for lin in matriz]

    return new_matriz


def fill_gaps(matriz):  # transform [] em [0] e ['1'] em [1]
    for idx_lin, lin in enumerate(matriz):
        for idx_col, iten in enumerate(lin):
            if iten == [] or iten == ['']:
                matriz[idx_lin][idx_col] = [0]
            else:
                matriz[idx_lin][idx_col] = [int(iten[0])]
    return matriz


def transformar_em_numero(matriz):  # transform [0] em 0

    new_matriz = [
        [int(str(col)[1:-1]) if type(col) is list else col for col in lin]
        for lin in matriz]

    return new_matriz


def transposta(matriz):
    try:

        transposta = [
            [linha[col] for linha in matriz]
            for col in range(len(matriz[0]))
        ]
        return transposta

    except IndexError:
        raise IndexError("Lista fornecida não caracteriza uma matriz")


def separar_quadrantes(matriz):

    separado = list()
    size = int(len(matriz)/3)
    for line_quad in range(size):
        for row_quad in range(size):

            quadrante = [
                [
                    matriz[line+(line_quad*3)][row+(row_quad*3)]
                    for row in range(size)
                ]for line in range(size)]

            separado.append(quadrante)
    return separado


def juntar_quadrantes(matriz):
    fusao = list()
    new_lin = list()
    for lin_quad in range(0, 9, 3):
        for linha in range(3):
            for col_quad in range(3):
                new_lin.extend(matriz[col_quad+lin_quad][linha])
            fusao.append(new_lin)
            new_lin = []
    return fusao


def conferir_conflitos(matriz):
    flag = True
    erros = set()

    for idx_lin, linha in enumerate(matriz):
        for idx_col, item in enumerate(linha):
            if 0 not in item and len(item) == 1:

                linhas = matriz
                colunas = transposta(matriz)
                quadrantes = separar_quadrantes(matriz)
                quad_col = int(idx_col/3)
                quad_lin = (int(idx_lin/3)*3)
                pos_quad = quad_lin + quad_col

                if linhas[idx_lin].count(item) > 1:
                    id_col = None
                    for colx, num in enumerate(linhas[idx_lin]):
                        if num == item:
                            erros.add((idx_lin, colx))
                            flag = False

                if colunas[idx_col].count(item) > 1:
                    for linx, num in enumerate(colunas[idx_col]):
                        if num == item:
                            erros.add((linx, idx_col))
                            flag = False

                cont = 0
                for lins in quadrantes[pos_quad]:
                    cont += lins.count(item)
                if cont > 1:

                    for linx, lins in enumerate(quadrantes[pos_quad]):
                        for colx, num in enumerate(lins):

                            if num == item:
                                id_lin = linx + quad_lin
                                id_col = colx + (quad_col*3)
                                erros.add((id_lin, id_col))
                                flag = False

    if not flag:
        return False, erros
    else:
        return True, erros


def determinar_possibilidades(sudoku, pos_lin, pos_col):

    if 0 in sudoku[pos_lin][pos_col]:
        possibilidades = {1, 2, 3, 4, 5, 6, 7, 8, 9}
    elif len(sudoku[pos_lin][pos_col]) == 1:
        return sudoku[pos_lin][pos_col]
    else:
        possibilidades = set(sudoku[pos_lin][pos_col])

    linhas = sudoku
    colunas = transposta(sudoku)
    quadrantes = separar_quadrantes(sudoku)
    pos_quad = int(pos_col/3) + (int(pos_lin/3)*3)

    pos_ocpd = {item[0] for item in linhas[pos_lin] if len(item) == 1}
    possibilidades = possibilidades.difference(pos_ocpd)

    pos_ocpd = {item[0] for item in colunas[pos_col] if len(item) == 1}
    possibilidades = possibilidades.difference(pos_ocpd)

    for lin in quadrantes[pos_quad]:
        for item in lin:
            if len(item) == 1:
                pos_ocpd.add(item[0])
    possibilidades = possibilidades.difference(pos_ocpd)

    return list(possibilidades)


def marcar_possibilidades(sudoku):

    finished = False
    old_matriz = sudoku

    while not finished:
        finished = True
        new_matriz = list()
        new_line = list()
        for idx_lin, linha in enumerate(old_matriz):
            for idx_col, item in enumerate(linha):

                if finished:
                    solucoes = determinar_possibilidades(
                        old_matriz, idx_lin, idx_col)

                    if solucoes != item:
                        finished = False

                    new_line.append(solucoes)
                else:
                    new_line.append(item)

            new_matriz.append(new_line)
            new_line = []
        old_matriz = new_matriz[:]

    return new_matriz


def pegar_duplicata(matriz, lin, dupla):
    linha = matriz[lin]
    for item in linha:
        if item is not dupla and item == dupla:
            for x in range(len(linha)):
                if linha[x] is not dupla and linha[x] is not item:
                    for num in dupla:
                        if num in linha[x]:
                            matriz[lin][x].remove(num)
            break
    return matriz


def eliminar_duplicata(sudoku, pos_lin, pos_col):

    if len(sudoku[pos_lin][pos_col]) != 2:
        return sudoku

    quad = separar_quadrantes(sudoku)
    quad_lin = (int(pos_lin/3)*3)
    quad_col = int(pos_col/3)
    pos_quad = quad_lin + quad_col

    sudoku = pegar_duplicata(sudoku, pos_lin, sudoku[pos_lin][pos_col])

    sudoku = transposta(sudoku)
    sudoku = pegar_duplicata(sudoku, pos_col, sudoku[pos_col][pos_lin])
    sudoku = transposta(sudoku)

    target = sudoku[pos_lin][pos_col]
    pos = quad[pos_quad]
    for quad_l in pos:
        for quad_it in quad_l:
            if quad_it is not target and quad_it == target:

                for id_line, line in enumerate(pos):
                    for row, item in enumerate(line):
                        if item is not target and item is not quad_it:
                            for num in target:
                                if num in item:
                                    quad[pos_quad][id_line][row].remove(num)

                break

    sudoku = juntar_quadrantes(quad)
    return sudoku


def checar_duplicatas(sudoku):
    new_matriz = sudoku

    for idx_lin, linha in enumerate(new_matriz):
        for idx_col in range(len(linha)):
            new_matriz = eliminar_duplicata(new_matriz, idx_lin, idx_col)
    return new_matriz


def check_routine(sudoku):

    if sudoku == []:
        return sudoku

    new_matriz = sudoku
    old_matriz = []

    while old_matriz != new_matriz:

        old_matriz = new_matriz
        new_matriz = marcar_possibilidades(new_matriz)
        new_matriz = checar_duplicatas(new_matriz)
        new_matriz = marcar_possibilidades(new_matriz)

    for linhas in new_matriz:
        for item in linhas:
            if item == []:
                return []

    return new_matriz


def doble_check(sudoku):
    if sudoku == []:
        return False
    for idx_lin in range(len(sudoku)):
        for idx_col in range(len(sudoku[idx_lin])):
            if len(sudoku[idx_lin][idx_col]) > 2:
                return True
    return False


def tentativa_erro(sudoku):
    mutiplos = False
    sudoku = check_routine(sudoku)
    if sudoku == []:
        return [], mutiplos

    new_matriz = list()
    solucao = list()

    for idx_lin in range(len(sudoku)):
        for idx_col in range(len(sudoku[idx_lin])):

            if len(sudoku[idx_lin][idx_col]) == 2:

                new_matriz = deepcopy(sudoku)
                sudoku[idx_lin][idx_col].remove(sudoku[idx_lin][idx_col][0])
                sudoku, mutiplos = tentativa_erro(sudoku)

                if mutiplos:
                    return sudoku, mutiplos

                elif sudoku != []:
                    solucao = deepcopy(sudoku)

                sudoku = deepcopy(new_matriz)
                sudoku[idx_lin][idx_col].remove(sudoku[idx_lin][idx_col][1])
                sudoku, mutiplos = tentativa_erro(sudoku)

                if mutiplos:
                    return sudoku, mutiplos

                if sudoku != []:
                    if solucao == []:
                        solucao = deepcopy(sudoku)
                    else:
                        mutiplos = True

                return solucao, mutiplos

    return sudoku, mutiplos


def solve_sudoku(sudoku):
    '''
    Solve sudoku games and return a list with a value and a solution.
    The whitespaces of the sudoku shold be zeros or empty lists
     example = [
     [0, 0, 0,  0, 0, 0,  0, 0, 0],
     [0, 0, 0,  0, 0, 0,  0, 0, 0],
     [0, 0, 0,  0, 0, 0,  0, 0, 0],

     [0, 0, 0,  0, 0, 0,  0, 0, 0],
     [0, 0, 0,  0, 0, 0,  0, 0, 0],
     [0, 0, 0,  0, 0, 0,  0, 0, 0],

     [0, 0, 0,  0, 0, 0,  0, 0, 0],
     [0, 0, 0,  0, 0, 0,  0, 0, 0],
     [0, 0, 0,  0, 0, 0,  0, 0, 0]
 ]

    If there is only 1 solution: returns 0 and the solution;

    If there is more than one solution: returns 1 and a solution;

    If the sudoku is not resolvable: returns 2 and an empty list;

    If there is little information: returns 3 and an empty list;

    If is there a conflict of values: returns 4 and a lis of coordinates of
    the problem
    '''

    sudoku_lista = transformar_em_listas(sudoku)
    sudoku_lista = fill_gaps(sudoku_lista)
    no_conflito, loc = conferir_conflitos(sudoku_lista)
    if no_conflito:
        solucao, mutiplos = tentativa_erro(sudoku_lista)

        if mutiplos:
            solucao = transformar_em_numero(solucao)
            return 1, solucao
        elif doble_check(solucao):
            return 3, []

        elif solucao == []:
            return 2, []

        else:
            solucao = transformar_em_numero(solucao)
            return 0, solucao
    else:
        return 4, loc


example = [
    [6, 0, 2,  5, 0, 4,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  4, 4, 9,  0, 0, 0],

    [0, 1, 0,  0, 4, 0,  0, 0, 0],
    [3, 0, 0,  0, 8, 5,  4, 0, 0],
    [9, 0, 0,  0, 0, 0,  5, 6, 0],

    [0, 0, 0,  2, 0, 0,  0, 0, 0],
    [2, 0, 2,  7, 4, 3,  0, 9, 4],
    [0, 5, 0,  0, 0, 0,  8, 3, 0]
]

if __name__ == '__main__':
    num, sol = solve_sudoku(example)
    print(len(sol))
    print(sol)

def configure_text_matriz(M):
    max = [0 for i in range(len(M[0]))]
    for l in M: 
        for idx, n in enumerate(l):
            if len(n) > max[idx]: max[idx] = len(n)

    for idx_l, l in enumerate(M): 
        for idx_n, n in enumerate(l):
            while len(n) < max[idx_n]: n = " " + n
            M[idx_l][idx_n] = n
    
    return M

def print_matriz(m):
    for l in m: print(l)

def print_array(a):
    for l in a: print(l)

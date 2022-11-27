from numpy import rad2deg, concatenate
from sympy import  Symbol, cos, sin
from time import time
from projects.ISEE.NewtonRapson import newton_rapson, newton_rapson_desacoplado
from projects.ISEE.txt_functions import print_matriz, configure_text_matriz


def get_ohmk(D, k): #Obtem todas as barras que estão diretamente ligadas a uma barra k, com exceção dela mesma
    linhas = []
    for dado in D:
        if dado[0] == k: linhas.append(dado[1])
        elif dado[1] == k: linhas.append(dado[0])
    return linhas
def get_gkm(rkm, xkm): return rkm / (rkm**2 + xkm**2)
def get_bkm(rkm, xkm): return -xkm / (rkm**2 + xkm**2)

def get_GB(DLT): #Calcula [G] e [B]
    n = len(DLT)
    
    G = [[0.0 for j in range(n)] for k in range(n)]
    B = [[0.0 for j in range(n)] for k in range(n)]
    
    for j in range(n):
        for k in range(n):
            gkm = 0.0; bkm = 0.0
            if j == k: #Verifica se está na diagonal principal
                for linha in DLT:
                    if linha[0] == j+1 or linha[1] == j+1:
                        gkm += get_gkm(linha[2], linha[3])
                        bkm += get_bkm(linha[2], linha[3]) + linha[4]
            else:
                for linha in DLT:
                    if linha[0] == j+1 and linha[1] == k+1 or linha[1] == j+1 and linha[0] == k+1:
                        gkm -= get_gkm(linha[2], linha[3])
                        bkm -= get_bkm(linha[2], linha[3])

            G[j][k] = gkm
            B[j][k] = bkm
    return (G, B)

def get_V_Theta(DB):
    v0_ = []; theta0_=[]; vs_ = []; thetas_ = []
    for i, barra in enumerate(DB):
        if barra[1] == 'PV': #V é fornecido e theta é incógnita
            theta0_.append(barra[7])

            thetas_.append(Symbol("theta" + str((i+1))))
            vs_.append(barra[6])

        elif barra[1] == 'PQ': #V e theta são incógnita
            theta0_.append(barra[7])
            v0_.append(barra[6])

            thetas_.append(Symbol("theta" + str((i+1))))
            vs_.append(Symbol("v" + str((i+1))))
        else: #V e theta são fornecidos
            vs_.append(barra[6])
            thetas_.append(barra[7])

    return (v0_, theta0_, vs_, thetas_)

def get_xs(theta_, vs_): #Cria uma lista com apenas as incógnitas theta e V
    xs_ = []
    for theta in theta_: 
        if type(theta) == type(Symbol('')):
            xs_.append(theta)
    for v in vs_: 
        if type(v) == type(Symbol('')):
            xs_.append(v)
    return xs_

def get_x0(theta_, v_): #Cria uma lista com os valores de teste iniciais para as incógnitas theta e V
    return concatenate((theta_, v_))

def get_Pesp_Qesp(DB): #Calcula o Pesperado e o Qesperado a partir dos valores fornecidos
    Pesp_ = []; Qesp_ = []
    for barra in DB:
        if barra[1] == 'PV':
            Pesp_.append(barra[4] - barra[2])
            Qesp_.append(None)
        elif barra[1] == 'PQ': 
            Pesp_.append(barra[4] - barra[2])
            Qesp_.append(barra[5] - barra[3])
        else: #Slack
            Pesp_.append(None)
            Qesp_.append(None)
    return (Pesp_, Qesp_)

def get_Pcal_Qcal(DLT, DB, vs_, thetas_, G, B):#Gera a equação para o Pcalculado e o Qcalculado das barras
    Pcal_ = []; Qcal_ = []
    
    for k, barra in enumerate(DB):
        if barra[1] == 'PV': #Em barras PV usa-se so a função do Pcalculado, pois sua carga é uma incógnita
            ohmk = get_ohmk(DLT, k+1)
            somatoria = 0
            for m in ohmk:
                m -= 1
                somatoria += vs_[m]*(G[k][m]*cos(thetas_[k] - thetas_[m]) + B[k][m]*sin(thetas_[k] - thetas_[m]))
            Pcal_.append(vs_[k]**2*G[k][k] + vs_[k]*somatoria) 
            Qcal_.append(None)
        
        elif barra[1] == 'PQ':
            ohmk = get_ohmk(DLT, k+1)
            somatoriaP = 0; somatoriaQ = 0
            for m in ohmk:
                m -= 1
                somatoriaP += vs_[m]*(G[k][m]*cos(thetas_[k] - thetas_[m]) + B[k][m]*sin(thetas_[k] - thetas_[m]))
                somatoriaQ += vs_[m]*(G[k][m]*sin(thetas_[k] - thetas_[m]) - B[k][m]*cos(thetas_[k] - thetas_[m])) 
            Pcal_.append(vs_[k]**2*G[k][k] + vs_[k]*somatoriaP) 
            Qcal_.append(-(vs_[k]**2)*B[k][k] + vs_[k]*somatoriaQ)
        
        else: #Slack
            Pcal_.append(None)
            Qcal_.append(None)

    return (Pcal_, Qcal_)

def get_fs(Pcalc_, Pesp_, Qcalc_, Qesp_):# Gera o array com as funções {Pesp - Pcalc} e {Qesp - Qcalc}
    fs_ = []
    
    for idx, P in enumerate(Pcalc_):
        if P is not None:   fs_.append(Pesp_[idx] - P)
    
    for idx, Q in enumerate(Qcalc_):
        if Q is not None:   fs_.append(Qesp_[idx] - Q)

    return fs_

def get_fs_desacoplado(Pcalc_, Pesp_, Qcalc_, Qesp_): # Gera o array com as funções {Pesp - Pcalc} e {Qesp - Qcalc} separados
    Ps_ = []; Qs_ = []
    
    for idx, P in enumerate(Pcalc_):
        if P is not None:   Ps_.append(Pesp_[idx] - P)
    
    for idx, Q in enumerate(Qcalc_):
        if Q is not None:   Qs_.append(Qesp_[idx] - Q)

    return (Ps_, Qs_)


def set_results(results, thetas_, vs_): #Separa o vetor de resultados em 2 vetores, 1 para as tensões e outro para os thetas
    k = 0; v_results = []; theta_results = []
    for theta in thetas_:
        if type(theta) != type(Symbol('')): theta_results.append(theta)
        else:
            theta_results.append(results[k])
            k += 1

    for v in vs_:
        if type(v) != type(Symbol('')): v_results.append(v)
        else:
            v_results.append(results[k])
            k += 1
    
    return (theta_results, v_results)

def calcula_P(Pesp_, G, B, v, theta, DLT): #Calcula as potencias ativas que faltam, a partir dos resultados encontrados
    for k, P in enumerate(Pesp_):
        if P is None:
            ohmk = get_ohmk(DLT, k+1)
            somatoria = 0
            for m in ohmk:
                m -= 1
                somatoria += v[m]*(G[k][m]*cos(theta[k] - theta[m]) + B[k][m]*sin(theta[k] - theta[m]))
            Pesp_[k] = v[k]**2*G[k][k] + v[k]*somatoria
    return Pesp_

def calcula_Q(Qesp_, G, B, v, theta, DLT):#Calcula as potencias reativas que faltam, a partir dos resultados encontrados
    for k, Q in enumerate(Qesp_):
        if Q is None: 
            ohmk = get_ohmk(DLT, k+1)
            somatoria = 0
            for m in ohmk:
                m -= 1
                somatoria += v[m]*(G[k][m]*sin(theta[k] - theta[m]) - B[k][m]*cos(theta[k] - theta[m])) 
            Qesp_[k] = -(v[k]**2)*B[k][k] + v[k]*somatoria
    return Qesp_


def get_tensões(v, theta, DB): #Organiza as tensões e seus angulos em uma matriz
    return [[i+1, v[i], theta[i]] for i in range(len(DB))]

def get_Pkm_Pmk(k, m, v, theta, gkm, bkm): #Calcula o fluxo de potencia ativa entre 2 barras
    k-=1; m-=1
    Pkm = (v[k]**2)*gkm - v[k]*v[m]*gkm*cos(theta[k] - theta[m]) - v[k]*v[m]*bkm*sin(theta[k] - theta[m])
    Pmk = (v[m]**2)*gkm - v[k]*v[m]*gkm*cos(theta[k] - theta[m]) + v[k]*v[m]*bkm*sin(theta[k] - theta[m])
    return  (Pkm, Pmk)

def get_Qkm_Qmk(k, m, v, theta, gkm, bkm, bkmsht): #Calcula o fluxo de potencia reativa entre 2 barras
    k-=1; m-=1
    Qkm = -(v[k]**2)*(bkmsht + bkm) - v[k]*v[m]*gkm*sin(theta[k] - theta[m]) + v[k]*v[m]*bkm*cos(theta[k] - theta[m])
    Qmk = -(v[m]**2)*(bkmsht + bkm) + v[k]*v[m]*gkm*sin(theta[k] - theta[m]) + v[k]*v[m]*bkm*cos(theta[k] - theta[m])
    return (Qkm, Qmk)

def get_fluxos(v, theta, DLT): #Organiza os fluxos de potencia em em uma matriz
    fluxos = []
    for linha in DLT:
        
        k = linha[0]; m = linha[1] 
        gkm = get_gkm(linha[2], linha[3])
        bkm = get_bkm(linha[2], linha[3])
        bkmsht = linha[4]

        Pkm, Pmk = get_Pkm_Pmk(linha[0], linha[1], v, theta, gkm, bkm)
        Qkm, Qmk = get_Qkm_Qmk(linha[0], linha[1], v, theta, gkm, bkm, bkmsht)
        
        fluxos.append([k, m, Pkm, Qkm])
        fluxos.append([m, k, Pmk, Qmk])


    return fluxos

'''Inicializa o vetor de variáveis com o flat-start, monta as matrizes condutância [G] , susceptância 
[B] e o vetor de potências especificadas'''
def set_variables(DLT, DB):
    G, B = get_GB(DLT)

    v0_, theta0_, vs_, thetas_ = get_V_Theta(DB)
    xs_ = get_xs(thetas_, vs_); 
    Pesp_, Qesp_ = get_Pesp_Qesp(DB)

    Pcalc_, Qcalc_ = get_Pcal_Qcal(DLT,DB, vs_, thetas_, G, B)
    return (G, B, theta0_, v0_, thetas_, vs_, xs_, Pesp_, Qesp_, Pcalc_, Qcalc_)

def calcule_subsistema2(results,Pesp_, Qesp_, thetas_, vs_, G, B, DLT, DB):
    theta_results, v_results = set_results(results, thetas_, vs_) 
    Pesp_ = calcula_P(Pesp_, G, B, v_results, theta_results, DLT)
    Qesp_ = calcula_Q(Qesp_, G, B, v_results, theta_results, DLT)
        
    tensões = get_tensões(v_results, theta_results, DB)
    fluxos = get_fluxos(v_results, theta_results, DLT)
    return (tensões, fluxos)

def soluciona_PFC_NR(DLT, DB, epsilon): #Solução usanto Newton Rapson normal
    start = time()
    G, B, theta0_, v0_, thetas_, vs_, xs_, Pesp_, Qesp_, Pcalc_, Qcalc_ = set_variables(DLT, DB)
    
    fs_ = get_fs(Pcalc_, Pesp_, Qcalc_, Qesp_)
    x0_ = get_x0(theta0_, v0_)

    
    results, iterações = newton_rapson(fs_, xs_, x0_, epsilon)

    if results is not None: 
        tensões, fluxos = calcule_subsistema2(results,Pesp_, Qesp_, thetas_, vs_, G, B, DLT, DB)
        return (tensões, fluxos, iterações, time() - start)
    else: return (None, None, iterações, time() - start)

def soluciona_PFC_desacoplado(DLT, DB, epsilon): #Solução usanto Newton Rapson desacoplado
    start = time()
    G, B, theta0_, v0_, thetas_, vs_, xs_, Pesp_, Qesp_, Pcalc_, Qcalc_ = set_variables(DLT, DB)


    ths = []
    for th in thetas_:
        if type(th) == type(Symbol('')): ths.append(th)

    vns = []
    for v in vs_:
        if type(v) == type(Symbol('')): vns.append(v)

    Ps_, Qs_ = get_fs_desacoplado(Pcalc_, Pesp_, Qcalc_, Qesp_) 
    
    results, iterações = newton_rapson_desacoplado(Ps_, theta0_, Qs_, v0_, xs_,ths, vns, epsilon)

    if results is not None: 
        tensões, fluxos = calcule_subsistema2(results,Pesp_, Qesp_, thetas_, vs_, G, B, DLT, DB)
        return (tensões, fluxos, iterações, time() - start)
    else: return (None, None, iterações, time() - start)

def print_results(tensões, fluxos, iterações, Vbase, Sbase, tempo):
    tensões_txt = [['Barra', 'V[pu]', 'Fase[rad]', 'V[kv]', 'Fase[graus]']]
    for barra in tensões: 
        n_barra = str(barra[0]); v_pu = f'{barra[1]:.4f}'; theta_rad = f'{barra[2]:.4f}'
        v_kv = f'{barra[1]*Vbase[barra[0]-1]:.4f}'; theta_deg = f'{rad2deg(barra[2]):.4f}'
        tensões_txt.append([n_barra, v_pu, theta_rad, v_kv, theta_deg])
    
    fluxos_txt = [['From', 'To', 'P[MW]', 'Q[MVAr]']]
    perdas_P_total = 0; perdas_Q_total = 0
    for linha in fluxos:
        fr= str(linha[0]); to = str(linha[1]); 
        P = f'{linha[2]*Sbase:.4f}'; Q = f'{linha[3]*Sbase:.4f}'
        fluxos_txt.append([fr, to, P, Q])

        perdas_P_total += linha[2]; perdas_Q_total += linha[3]

    perdas_P_total *= Sbase; perdas_Q_total*= Sbase
    
    print_matriz(configure_text_matriz(tensões_txt)); print()
    print_matriz(configure_text_matriz(fluxos_txt)); print()
    print(f'Perdas de potência ativa totais [MW]: {perdas_P_total:.6f}')
    print(f'Perdas de potência reativa totais [MVAr]: {perdas_Q_total:.6f}')
    print(f'Número de iterações realizadas: {iterações}');
    print(f'Elapsed time: {tempo} seconds'); print()


if __name__ == '__main__':

    DadosLinhaTransformadores = [
        [1, 4, 0.0000, 0.0576, 0.0000],
        [2, 7, 0.0000, 0.0625, 0.0000],
        [3, 9, 0.0000, 0.0586, 0.0000],
        [4, 5, 0.0100, 0.0850, 0.0176],
        [4, 6, 0.0170, 0.0920, 0.1580],
        [5, 7, 0.0320, 0.1610, 0.3060],
        [6, 9, 0.0390, 0.1700, 0.3580],
        [7, 8, 0.0085, 0.0720, 0.1490],
        [8, 9, 0.0119, 0.1010, 0.2090] 
    ]

    DadoBarras = [
        [1, 'Slack', 0.00, 0.00, None, None, 1.040, 0.00],
        [2, 'PV'   , 0.00, 0.00, 1.63, None, 1.025, 0.00],
        [3, 'PV'   , 0.00, 0.00, 0.85, None, 1.025, 0.00],
        [4, 'PQ'   , 0.00, 0.00, 0.00, 0.00, 1.000, 0.00],
        [5, 'PQ'   , 1.25, 0.50, 0.00, 0.00, 1.000, 0.00],
        [6, 'PQ'   , 0.90, 0.30, 0.00, 0.00, 1.000, 0.00],
        [7, 'PQ'   , 0.00, 0.00, 0.00, 0.00, 1.000, 0.00],
        [8, 'PQ'   , 1.00, 0.35, 0.00, 0.00, 1.000, 0.00],
        [9, 'PQ'   , 0.00, 0.00, 0.00, 0.00, 1.000, 0.00]
    ]

    Sbase = 100
    Vbase = [16.5, 18, 13.8, 230, 230, 230, 230, 230, 230]
    tolerancia = 1e-9

    #tensões, fluxos, iterações, tempo = soluciona_PFC_NR(DadosLinhaTransformadores, DadoBarras, tolerancia)
    tensões, fluxos, iterações, tempo = soluciona_PFC_desacoplado(DadosLinhaTransformadores, DadoBarras, tolerancia)

    if tensões is None: print("Máximo de iterações atingida sem convergir na tolerância estabelecida")
    else: print_results(tensões, fluxos, iterações, Vbase, Sbase, tempo)

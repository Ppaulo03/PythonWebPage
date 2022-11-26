import numpy as np
from sympy import  lambdify, symbols, diff
from txt_functions import print_array, print_matriz

def Jacobiana(f_, x_): return [[diff(f, x)for x in x_ ] for f in f_] #Cria a matriz jacobiana 

def lambdify_array(A, x_):  return [lambdify([x_], i) for i in A] #Transforma um array de simbolos em um array de funçoes

def lambdify_matriz(M, x_): return [[lambdify([x_], i) for i in l] for l in M] #Transforma uma matriz de simbolos em um array de funções

def iterar_newton_rapson(f_, jacobiana, x0_, epsilon, cmax, cont = 0):
    if cont >= cmax: return  None, cmax #Verifica se já iterou por um numero maximo predefinido de iterações, evitando criação de loops infinitos caso não haja convergência
    fr = np.array([f(x0_) for f in f_]) #Obtem os resultados numéricos de f(x) para um x0 especificado
    if np.abs(fr).max() <= epsilon: return (x0_, cont) #Verifica se já chegou em um resultado dentro da tolerância
    jacobiana_inv = np.array(np.linalg.inv([[dp(x0_) for dp in l] for l in jacobiana])) #Calcula a Jacobiana invertida 
    return iterar_newton_rapson(f_, jacobiana,(x0_ - np.dot(jacobiana_inv, fr)), epsilon, cmax, cont+1) #Nova iteração de Newton Rapson

def newton_rapson(fs_, xs_ ,x0_, eps, cmax = 990):
    f_ = lambdify_array(fs_, xs_)
    jacobiana = lambdify_matriz(Jacobiana(fs_, xs_), xs_)
    return iterar_newton_rapson(f_, jacobiana, x0_, eps, cmax)

#Variante de Newton Rapson 
def iterar_newton_rapson_desacoplado(P_, H, Th0_, Q_, L, V0_, eps, cmax = 990, p=0, q=0, kp = True, kq = True):
    
    if (p+q) >= cmax: return  None, cmax 
    
    x0_ = np.concatenate((Th0_, V0_))
    if kp: 
        Pr = np.array([P(x0_) for P in P_])

        if np.abs(Pr).max() <= eps: 
            kp = False
            if not kq: return (np.concatenate((Th0_, V0_)), (p+q))
        else:
            H_inv = np.array(np.linalg.inv([[dp(x0_) for dp in l] for l in H]))
            Th0_ -= np.dot(H_inv, Pr)
            p += 0.5
    if kq: 
        Qr = np.array([Q(x0_) for Q in Q_])
        if np.abs(Qr).max() <= eps: 
            kq = False
            if not kp: return (np.concatenate((Th0_, V0_)), (p+q))
        else:
            L_inv = np.array(np.linalg.inv([[dp(x0_) for dp in l] for l in L])) 
            V0_ -= np.dot(L_inv, Qr)
            q += 0.5

    return iterar_newton_rapson_desacoplado(P_, H, Th0_, Q_, L, V0_, eps, cmax, p, q, kp, kq)

def newton_rapson_desacoplado (Ps_, theta0_, Qs_, V0_, xs, ths, vs, eps, cmax = 990):
    P_ = lambdify_array(Ps_, xs)

    H = lambdify_matriz(Jacobiana(Ps_, ths), xs)

    Q_ = lambdify_array(Qs_, xs)

    L = lambdify_matriz(Jacobiana(Qs_, vs), xs)
    
    return iterar_newton_rapson_desacoplado(P_, H, theta0_, Q_, L, V0_, eps, cmax)


if __name__ == '__main__':
    x, y= symbols('x y')
    xs_ = [x, y]

    fs_ = [x**2 + y**2, x*y]
    x0_ = np.array([1, 5])

    f_ = lambdify_array(fs_, xs_)
    print_matriz(newton_rapson(fs_, xs_, x0_, 1e-10))
    
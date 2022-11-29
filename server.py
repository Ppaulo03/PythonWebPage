from flask import Flask, render_template, request, redirect
from projects.sudoku import solve_sudoku
from projects.checkmypass import check_pass
from projects.email_sender import send_email
from projects.ISEE.PFC import soluciona_PFC_NR, soluciona_PFC_desacoplado
from projects.ISEE.txt_functions import configure_text_matriz
from random import choice, shuffle
from numpy import rad2deg
import csv

app = Flask(__name__)


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/plataformer')
def plataformer():
    return render_template('/plataformer.html')


@app.route('/mineField')
def minefield_game():
    return redirect('/minefild_prep.html')


minefield_cont = 0
@app.route('/mineField-play', methods=['POST'])
def play_mine_fild():
    data = request.form.to_dict()
    tamanho = int(data['Dificuldade'])
    n_bomb = int((16*tamanho*18.75)/100)
    return render_template('minefild.html', n_bomb=n_bomb, tamanho=tamanho)


def write_to_file(data):
    with open('database.txt', mode='a') as database:
        email = data['email']
        subject = data['subject']
        message = data['message']
        file = database.write(f"\n{email}, {subject}, {message}")


def write_to_csv(data):
    with open('database.csv', mode='a') as database:
        email = data['email']
        subject = data['subject']
        message = data['message']
        csv_writer = csv.writer(database, delimiter=',',
                                quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csv_writer.writerow([email, subject, message])


@app.route('/submit_form', methods=['POST', 'GET'])
def subm():
    if request.method == 'POST':
        data = request.form.to_dict()
        write_to_csv(data)
        send_email(data['email'], data['subject'], data['message'])
        thankss = ["thanks for the email, I'll get in contact soon",
                   "Hope that's not span... Just kidding, I'll get \
in contact soon", "You're the best, I promise that I'll get in contact soon"]
        msg = choice(thankss)
        return render_template('/contact.html', msg=msg)
    else:
        return 'Something gone wrong'


@app.route('/passoword-checker', methods=['POST', 'GET'])
def check_password():
    if request.method == 'POST':
        data = request.form.to_dict()
        count = check_pass(data['pass'])
        if count:
            text = f'This password was found {count} times... you should \
                problably change it'
        else:
            text = f'This password was NOT found. Carry on'

        return render_template('password-checker.html', text=text)
    else:
        return render_template('password-checker.html')


@app.route('/solve_sudoku', methods=['POST', 'GET'])
def sudoku_solver():
    if request.method == 'POST':
        data = request.form.to_dict()
        matz = [[None for x in range(9)] for y in range(9)]
        prench = list()
        for cord, num in data.items():
            cord = cord.replace(
                "(", "").replace(")", "").split(",")
            cord[0], cord[1] = int(cord[0]), int(cord[1])
            matz[cord[1]][cord[0]] = num

            if num != "":
                prench.append(cord)

        res, sol = solve_sudoku(matz)
        print(prench)
        return render_template('solving_sudo.html', res=res, sud=sol, org=matz,
                               pren=prench)
    else:
        return 'Something gone wrong'
    

@app.route('/ISEE', methods=['POST', 'GET'])
def ISEE_solver():
    if request.method == 'POST':
        data = request.form.to_dict()

        dado_barra_labels = ["Potencia Ativa de Carga (p.u)", "Potencia Reativa de Carga (p.u)", "Potencia ativa gerada(p.u)", 
                        "Potencia reativa gerada (p.u)", "Modulo da tensao (p.u)", "Angulo da tensao (graus)"]

        dado_linhas_labels = ["Barra Envio", "Barra_recibo", "Resistencia Serie (p.u)", "Reatancia Serie (p.u)", "Suceptancia shunt Y/2 (p.u)"]

        n_barras = int(data['num_barras'] if data['num_barras'] != '' else 0)
        Sbase = float(data['Sbase'] if data['Sbase'] != '' else 200) 
        tolerancia = 10 ** -(int(data['Tolerancia'] if data['Tolerancia'] != '' else 9))

        Vbase = []
        DadoBarras = []
        for i in range(n_barras): 
            Vbase.append(float(data["Vbase" + str(i)]) if data["Vbase" + str(i)] != '' else 0)
            barra = [i+1]
            barra.append(data["tipo" + str(i+1)])
            for label in dado_barra_labels:  
                barra.append(float(data[label + str(i+1)]) if data[label + str(i+1)] != '' else None)
            DadoBarras.append(barra)

        DadosLinhaTransformadores = []
        for i in range(int(data['num_linhas'] if data['num_linhas'] != '' else 0)):
            lt = []
            for idx, label in enumerate(dado_linhas_labels): 
                if idx == 0 or idx == 1: lt.append(int(data[label + str(i)]) if data[label + str(i)] != '' else None)
                else: lt.append(float(data[label + str(i)]) if data[label + str(i)] != '' else None)
            DadosLinhaTransformadores.append(lt)

        try:

            if(data['metodo'] == 'normal'):
                tensões, fluxos, iterações, tempo = soluciona_PFC_NR(DadosLinhaTransformadores, DadoBarras, tolerancia)
            else:
                tensões, fluxos, iterações, tempo = soluciona_PFC_desacoplado(DadosLinhaTransformadores, DadoBarras, tolerancia)
           
            if tensões is None: return render_template('ISEE.html', erro=False, iterações_max=True)
            else: 
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

                return render_template('ISEE_solved.html', tensões_txt=configure_text_matriz(tensões_txt), fluxos_txt=configure_text_matriz(fluxos_txt),
                                perdas_P_total=perdas_P_total, perdas_Q_total=perdas_Q_total, iterações=iterações, tempo=tempo)
        except Exception as e:
            print(e)
            return render_template('ISEE.html', erro=True, iterações_max = False)

    else:
        return render_template('ISEE.html', erro=False, iterações_max = False)


@app.route('/paciencia')
def spider(page_name=None):
    naipes = ['copas', 'espadas', 'ouros', 'paus']
    deck = [(x, num) for x in naipes for num in range(1, 14)]
    shuffle(deck)
    return render_template('paciencia.html', deck=deck)

@app.route('/pacman')
def pacman(page_name=None):
    return render_template('pacman.html')

@app.route('/Lobo')
def lobos(page_name=None):
    return redirect('https://pt.wikipedia.org/wiki/Lobo')


@app.route('/<string:page_name>')
def urls(page_name=None):
    if ".html" in page_name:
        page_name = page_name.replace(".html", "")
        return redirect(page_name)
    else:
        html_page_name = page_name + ".html"
        try:
            render = render_template(html_page_name)
        except:
            return redirect('https://pt.wikipedia.org/w/index.php?search=' + page_name)
        return render

if __name__ == '__main__':
    app.run(debug=False)
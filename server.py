from flask import Flask, render_template, request, redirect
from projects.minefield import Tabuleiro, show
from projects.sudoku import solve_sudoku
from projects.checkmypass import check_pass
from projects.email_sender import send_email
from random import choice, shuffle
import csv
import pdb
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


@app.route('/paciencia')
def spider(page_name=None):
    naipes = ['copas', 'espadas', 'ouros', 'paus']
    deck = [(x, num) for x in naipes for num in range(1, 14)]
    shuffle(deck)
    return render_template('paciencia.html', deck=deck)

@app.route('/pacman')
def pacman(page_name=None):
    return render_template('pacman.html')


@app.route('/<string:page_name>')
def urls(page_name=None):
    if ".html" in page_name:
        page_name = page_name.replace(".html", "")
        return redirect(page_name)
    else:
        page_name = page_name + ".html"
        return render_template(page_name)

if __name__ == '__main__':
    app.run(debug=True)
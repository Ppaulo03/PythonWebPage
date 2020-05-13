from flask import Flask, render_template, request, redirect
import csv
from minefield import Tabuleiro, show
import pdb
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/mineField')
def minefield_game():
    return redirect('/minefild_prep.html')


minefield_cont = 0
@app.route('/mineField-play', methods=['POST', 'GET'])
def play_mine_fild():
    if request.method == 'POST':
        data = request.form.to_dict()
        if data['primeiro'] == 'N':
            num = data['info'].replace("(", '').replace(")", "").split(",")
            num[2] = num[2].replace("'", "").replace(" ", '')
            jogo = Tabuleiro(txt=f'database/{num[2]}')
            if data['tipo'] == 'mark':
                vic, loss = jogo.mark(int(num[0]), int(num[1]))
                marking = True
            else:
                vic, loss = jogo.reveal(int(num[0]), int(num[1]))
                marking = False
            jogo.register_game(txt=f'database/{num[2]}')
            return render_template('minefild.html', url=num[2], table=jogo, lose=loss, win=vic, mark=marking)

        else:
            global minefield_cont
            game_url = f'minefild{minefield_cont}.txt'
            minefield_cont += 1
            jogo = Tabuleiro(30, 16, 99)
            jogo.register_game(f'database/{game_url}')
            return render_template('minefild.html', url=game_url, table=jogo, lose=False, win=False, mark=False)


@app.route('/<string:page_name>')
def urls(page_name=None):
    return render_template(page_name)


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
        return redirect('/thanks.html')
    else:
        return 'Something gone wrong'

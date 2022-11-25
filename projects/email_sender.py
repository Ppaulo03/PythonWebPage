import smtplib
from email.message import EmailMessage
from string import Template
from pathlib import Path

try:

    html = Template(Path(
        '/home/pedro/Área de Trabalho/Python mini projects/WebServer/projects/\
email.html').read_text())

except Exception:
    html = Template(Path(
        'projects\email.html').read_text())

'''
dummyb28
Dummy_123c
'''


def send_email(name, subject, message):
    try:

        email = EmailMessage()
        email['from'] = name
        email['to'] = 'dummyb28@gmail.com'
        email['subject'] = subject
        email.set_content(html.substitute(
            {'message': message, 'name': name}), 'html')

        with smtplib.SMTP(host='smtp.gmail.com', port=587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.login('dummyb28@gmail.com', 'Dummy_123')
            smtp.send_message(email)
            print('ALl good Boss!')

    except Exception:
        pass

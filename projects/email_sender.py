import smtplib
from email.message import EmailMessage
from string import Template
from pathlib import Path
from get_dir import get_dir


html = Template(Path(get_dir('projects\email.html')).read_text())

'''
dummyb28
Dummy_123c
'''


def send_email(name, subject, message):
    try:

        email = EmailMessage()
        email['from'] = name
        email['to'] = 'ppaulo030601@gmail.com'
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

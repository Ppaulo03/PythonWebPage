import requests
import hashlib
import sys


def request_api_data(query_char):
    url = 'https://api.pwnedpasswords.com/range/' + query_char
    res = requests.get(url)
    if res.status_code != 200:
        raise RuntimeError(
            f'Error fetching: {res.status_code}, check the API and try again')
    return res


def get_passowrd_leaks_count(hashes, hash_to_check):
    hashes = (line.split(':') for line in hashes.text.splitlines())
    for h, count in hashes:
        if h == hash_to_check:
            return count
    return 0


def pwned_api_check(password):
    sha1password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    first5_char, tail = sha1password[:5], sha1password[5:]
    response = request_api_data(first5_char)
    return get_passowrd_leaks_count(response, tail)


def check_pass(password):
    count = pwned_api_check(password)
    return count


if __name__ == "__main__":
    args = sys.argv[1:]
    for passoword in args:
        count = check_pass(passoword)
        if count:
            print(
                f'{passoword} was found {count} times... you should problably \
change your password')
        else:
            print(f'{passoword} was NOT found. Carry on')
    sys.exit()

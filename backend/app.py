import pwd_repository
import random_pass_generator
import time
from flask import Flask, jsonify, make_response, request

app = Flask(__name__)


@app.route('/pwd/<string:pwd_id>')
def get_user(pwd_id):
    result = pwd_repository.get_by_pwd_id(pwd_id)
    item = result.get('Item')

    if not item:
        return jsonify({'error': 'Could not find pass with provided "pwdId"'}), 404

    expiration_date = item.get('expirationDate').get('N')
    now = int(time.time())

    if now > int(expiration_date):
        pwd_repository.delete_by_pwd_id(pwd_id)
        return jsonify({'error': 'password expired'}), 412

    views_left = int(item.get('viewCount').get('N')) - 1

    if (views_left < 0):
        pwd_repository.delete_by_pwd_id(pwd_id)
        return jsonify({'error': 'no views left'}), 412

    if (views_left == 0):
        pwd_repository.delete_by_pwd_id(pwd_id)
    else:
        pwd_repository.decrease_count_view(pwd_id, views_left)

    return jsonify(
        {
            'pwd_id': item.get('pwdId').get('S'),
            'pwd': item.get('pwd').get('S'),
            'view_count': views_left,
            'expiration_date': expiration_date,
        }
    )


@app.route('/pwd', methods=['POST'])
def get_pwd():
    use_letters = request.json.get('use_letters')
    use_digits = request.json.get('use_digits')
    use_punctuation = request.json.get('use_punctuation')
    pass_length = request.json.get('pass_length')
    pass_view_limit = request.json.get('pass_view_limit')
    expiration_in_seconds = request.json.get('expiration_in_seconds')

    pwd = random_pass_generator.generate(
        use_letters, use_digits, use_punctuation, pass_length)

    if not use_letters or not use_digits or not use_punctuation or not expiration_in_seconds:
        return jsonify({'error': 'Please provide "use_letters", "use_digits", "use_punctuation" and "expiration_in_seconds"'}), 400

    pwd_id = pwd_repository.save_new_pwd(
        pwd, pass_view_limit, expiration_in_seconds)

    return jsonify({'pwd_id': pwd_id})


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)

import pwd_repository
import random_pass_generator
import time
from flask import Flask, jsonify, make_response, request
from jsonschema import validate
import pwd_schemas
import sended_password_validation
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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
    data = request.get_json()

    try:
        validate(data, pwd_schemas.save_pwd_schema)
    except Exception as e:
        return jsonify({'error': f'Erro de validação: {e.message}'}), 400

    use_letters = data.get('use_letters')
    use_digits = data.get('use_digits')
    use_punctuation = data.get('use_punctuation')
    pass_length = data.get('pass_length')
    pass_view_limit = data.get('pass_view_limit')
    expiration_in_seconds = data.get('expiration_in_seconds')
    sended_password = data.get('sended_password')

    if sended_password:
        is_valid_password = sended_password_validation.validate_password(
            use_letters, use_digits, use_punctuation, pass_length, sended_password)
        if not is_valid_password:
            return jsonify({'error': 'weak password'}), 400

        pwd = sended_password
    else:
        pwd = random_pass_generator.generate(
            use_letters, use_digits, use_punctuation, pass_length)

    pwd_id = pwd_repository.save_new_pwd(
        pwd, pass_view_limit, expiration_in_seconds)

    return jsonify({'pwd_id': pwd_id})


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)

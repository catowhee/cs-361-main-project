from flask import Flask, jsonify

app = Flask(__name__)

"""
https://openweathermap.org/forecast5
"""

@app.route('/weatherbro/locations', methods=['GET'])
def get_location():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid


app = Flask(__name__)
CORS(app)


@app.route('/save-data', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        title = data.get('title')
        data_folder = os.path.join('data', title)
        os.makedirs(data_folder, exist_ok=True)
        filename = os.path.join(data_folder, 'data.json')
        with open(filename, 'w') as json_file:
            json.dump(data, json_file, indent=2)

        return jsonify({"message": "Data saved successfully", "filename": filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

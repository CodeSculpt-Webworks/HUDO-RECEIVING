from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)


@app.route('/save-data', methods=['POST'])
def save_data():
    try:
        title = request.form.get('title')
        data_folder = os.path.join('data', title)
        os.makedirs(data_folder, exist_ok=True)

        json_filename = os.path.join(data_folder, 'data.json')
        with open(json_filename, 'w') as json_file:
            json_file.write(json.dumps(request.form.to_dict(), indent=2))

        for file in request.files.getlist('attachments'):
            file.save(os.path.join(data_folder, file.filename))

        return jsonify({"message": "Data saved successfully", "json_filename": json_filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

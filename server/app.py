from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import json
import shutil
from io import BytesIO
from zipfile import ZipFile
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)


@app.route('/save-data', methods=['POST'])
def save_data():
    try:
        title = request.form.get('title')
        data_folder = os.path.join('data', title)

        # If folder already exists, add a number to the folder name
        folder_number = 1
        while os.path.exists(data_folder):
            folder_number += 1
            data_folder = os.path.join('data', f'{title} {folder_number}')

        os.makedirs(data_folder, exist_ok=True)

        json_filename = os.path.join(data_folder, 'data.json')
        with open(json_filename, 'w') as json_file:
            json_file.write(json.dumps(request.form.to_dict(), indent=2))

        for idx, file in enumerate(request.files.getlist('attachments'), start=1):
            # Create a unique filename based on title and tracking number
            filename = f"{secure_filename(title)}_{idx}.{
                secure_filename(file.filename.rsplit('.', 1)[1])}"
            file.save(os.path.join(data_folder, filename))

        return jsonify({"message": "Data saved successfully", "json_filename": json_filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get-data')
def get_data():
    data = []
    data_folder = 'data'
    for folder_name in os.listdir(data_folder):
        folder_path = os.path.join(data_folder, folder_name)
        json_file_path = os.path.join(folder_path, 'data.json')
        if os.path.isfile(json_file_path):
            with open(json_file_path, 'r') as json_file:
                data.append(json.load(json_file))
    return jsonify(data)


@app.route('/download-data/<title>/<attachment_folder>/<filename>')
def download_attachment(title, attachment_folder, filename):
    data_folder = os.path.join('data', title, attachment_folder)
    filepath = os.path.join(data_folder, filename)

    content_type = "text/plain"

    return send_from_directory(data_folder, filename, as_attachment=True, mimetype=content_type)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

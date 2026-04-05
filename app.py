from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import time
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

conn = sqlite3.connect("recipes.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    steps TEXT NOT NULL,
    image TEXT
)
""")

try:
    cursor.execute("ALTER TABLE recipes ADD COLUMN image TEXT")
except:
    pass

conn.commit()
conn.close()


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/recipes", methods=["GET"])
def get_recipes():
    conn = sqlite3.connect("recipes.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes ORDER BY id DESC")
    recipes = cursor.fetchall()
    conn.close()

    result = []
    for recipe in recipes:
        result.append({
            "id": recipe["id"],
            "title": recipe["title"],
            "category": recipe["category"],
            "ingredients": recipe["ingredients"],
            "steps": recipe["steps"],
            "image": recipe["image"]
        })

    return jsonify(result)


@app.route("/recipes", methods=["POST"])
def add_recipe():
    try:
        title = request.form.get("title", "").strip()
        category = request.form.get("category", "").strip()
        ingredients = request.form.get("ingredients", "").strip()
        steps = request.form.get("steps", "").strip()

        if title == "" or category == "" or ingredients == "" or steps == "":
            return jsonify({"error": "Tüm alanlar zorunludur"}), 400

        image_name = ""

        if "image" in request.files:
            image = request.files["image"]

            if image and image.filename != "":
                filename = secure_filename(image.filename)
                image_name = str(int(time.time())) + "_" + filename
                image_path = os.path.join(app.config["UPLOAD_FOLDER"], image_name)
                image.save(image_path)

        conn = sqlite3.connect("recipes.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO recipes (title, category, ingredients, steps, image) VALUES (?, ?, ?, ?, ?)",
            (title, category, ingredients, steps, image_name)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Tarif eklendi"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/recipes/<int:id>", methods=["PUT"])
def update_recipe(id):
    try:
        title = request.form.get("title", "").strip()
        category = request.form.get("category", "").strip()
        ingredients = request.form.get("ingredients", "").strip()
        steps = request.form.get("steps", "").strip()

        if title == "" or category == "" or ingredients == "" or steps == "":
            return jsonify({"error": "Tüm alanlar zorunludur"}), 400

        conn = sqlite3.connect("recipes.db")
        cursor = conn.cursor()

        cursor.execute("SELECT image FROM recipes WHERE id = ?", (id,))
        old_recipe = cursor.fetchone()
        old_image = old_recipe[0] if old_recipe else ""

        image_name = old_image

        if "image" in request.files:
            image = request.files["image"]

            if image and image.filename != "":
                if old_image:
                    old_image_path = os.path.join(app.config["UPLOAD_FOLDER"], old_image)
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)

                filename = secure_filename(image.filename)
                image_name = str(int(time.time())) + "_" + filename
                image_path = os.path.join(app.config["UPLOAD_FOLDER"], image_name)
                image.save(image_path)

        cursor.execute("""
            UPDATE recipes
            SET title = ?, category = ?, ingredients = ?, steps = ?, image = ?
            WHERE id = ?
        """, (title, category, ingredients, steps, image_name, id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Tarif güncellendi"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/recipes/<int:id>", methods=["DELETE"])
def delete_recipe(id):
    conn = sqlite3.connect("recipes.db")
    cursor = conn.cursor()

    cursor.execute("SELECT image FROM recipes WHERE id = ?", (id,))
    recipe = cursor.fetchone()

    if recipe and recipe[0]:
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], recipe[0])
        if os.path.exists(image_path):
            os.remove(image_path)

    cursor.execute("DELETE FROM recipes WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Tarif silindi"})


app.run(debug=True)
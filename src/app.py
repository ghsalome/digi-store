from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


class Product:
    next_id = 1

    def __init__(self, name, price):
        self.id = Product.next_id
        Product.next_id += 1
        self.name = name
        self.price = price

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price
        }

    def update(self, name, price):
        self.name = name
        self.price = price

    @staticmethod
    def validatie_data(data):
        if "name" not in data or not data["name"]:
            return False, "Naam is verplicht"
        if "price" not in data or not isinstance(data["price"], (int, float)) or data["price"] < 0:
            return False, "Prijs moet een positief getal zijn"
        return True, None

products = []



@app.route("/", methods=["GET"])
def home():
    return "API werkt!"

@app.route("/products", methods=["POST"])
def add_product():

    if not request.is_json:
        return jsonify({"error": "Content-Type moet application/json zijn"}), 415

    data = request.json

    is_valid, error_message = Product.validatie_data(data)
    if not is_valid:
        return jsonify({"error": error_message}), 400

    new_product = Product(data["name"], data["price"])

    products.append(new_product)

    return jsonify(new_product.to_dict()), 201


@app.route("/products", methods=["GET"])
def get_all_product():
    products_list = [product.to_dict() for product in products]
    return jsonify(products_list), 200

@app.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    for product in products:
        if product.id == product_id:
            return jsonify(product.to_dict()), 200
    return jsonify({"error": "Product niet gevonden"}), 404

@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    for i, product in enumerate(products):
        if product.id == product_id:
            del products[i]
            return jsonify({"message": "Product verwijderd"}), 200

    return jsonify({"error": "Product niet gevonden"}), 404


@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    if not request.is_json:
        return jsonify({"error": "Content-type moet application/JSON zijn"}), 415

    data = request.json


    is_valid, error_message = Product.validatie_data(data)
    if not is_valid:
        return jsonify({"error": error_message}), 400


    for product in products:
        if product.id == product_id:
            product.update(data["name"], data["price"])
            return jsonify(product.to_dict()), 200


    return jsonify({"error": "Product niet gevonden"}), 404








if __name__ == "__main__":
    app.run(debug=True)

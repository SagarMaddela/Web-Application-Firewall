from flask import Flask, request, jsonify
from utils import clean_query, load_model

# Load ML Model
model, vectorizer = load_model()

# Initialize Flask App
app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to XSS & SQLi Detection API"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        query = data.get("query", "")

        if not query:
            return jsonify({"error": "Query cannot be empty"}), 400

        # Preprocess & Predict
        clean_q = clean_query(query)
        query_vec = vectorizer.transform([clean_q])
        prediction = model.predict(query_vec)

        # Return Response
        result = "❌ Malicious Query" if prediction[0] == 1 else "✅ Benign Query"
        return jsonify({"query": query, "classification": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

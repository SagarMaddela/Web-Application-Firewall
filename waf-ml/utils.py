import re
import joblib
import pickle

def clean_query(query):
    """Preprocess query by removing URLs, special characters, and extra spaces."""
    query = query.lower()
    query = re.sub(r'http\S+', '', query)
    query = re.sub(r'\W+', ' ', query)
    return query.strip()

def load_model():
    """Load trained ML model and vectorizer."""
    model = joblib.load('model.pkl')
    vectorizer = joblib.load('vectorizer.pkl')
    return model, vectorizer

from transformers import BertTokenizer, BertModel
import torch
import numpy as np
from sklearn.preprocessing import OneHotEncoder

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

category_encoder = OneHotEncoder(sparse_output=False)
category_encoder.fit([['study'], ['personal'], ['health']])

priority_encoder = OneHotEncoder(sparse_output=False)
priority_encoder.fit([['low'], ['medium'], ['high']])

complexity_encoder = OneHotEncoder(sparse_output=False)
complexity_encoder.fit([['low'], ['medium'], ['high']])

def estimate_time(description, category, priority, complexity):
    # Encode text
    inputs = tokenizer(description, return_tensors="pt", padding=True, truncation=True, max_length=512)
    outputs = model(**inputs)
    text_embedding = outputs.last_hidden_state.mean(dim=1).detach().numpy()

    # Encode categorical features
    category_encoded = category_encoder.transform([[category]])
    priority_encoded = priority_encoder.transform([[priority]])
    complexity_encoded = complexity_encoder.transform([[complexity]])

    # Combine features
    combined_features = np.concatenate([text_embedding, category_encoded, priority_encoded, complexity_encoded], axis=1)

    # This is a placeholder for the actual prediction
    # In a real scenario, you would train a model and use it here
    base_hours = (np.sum(combined_features) % 6 + 1) * (1 + priority_factor(priority) + complexity_factor(complexity))
    min_hours = max(1, int(base_hours - 1))
    max_hours = min(24, int(base_hours + 2))

    return f"{min_hours}-{max_hours}"

def priority_factor(priority):
    if priority == 'high':
        return 0.5
    elif priority == 'medium':
        return 0.3
    else:
        return 0.1

def complexity_factor(complexity):
    if complexity == 'high':
        return 0.5
    elif complexity == 'medium':
        return 0.3
    else:
        return 0.1

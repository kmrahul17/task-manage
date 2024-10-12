from flask import Flask, request, jsonify
from model import estimate_time
import os

app = Flask(__name__)

@app.route('/estimate', methods=['POST'])
def estimate():
    data = request.json
    description = data.get('description', '')
    category = data.get('category', 'personal')  # Default to 'personal' if not provided
    priority = data.get('priority', 'medium')    # Default to 'medium' if not provided
    complexity = data.get('complexity', 'medium')  # Default to 'medium' if not provided

    estimated_time = estimate_time(
        description,
        category,
        priority,
        complexity
    )
    return jsonify({'estimated_time': estimated_time})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'ml-service'
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        player1_prob = 0.55
        player2_prob = 0.45
        
        return jsonify({
            'player1_name': data.get('player1_name'),
            'player2_name': data.get('player2_name'),
            'player1_win_prob': player1_prob,
            'player2_win_prob': player2_prob,
            'predicted_winner': data.get('player1_name'),
            'confidence': max(player1_prob, player2_prob),
            'ensemble_prediction': {
                'player1_win_prob': player1_prob,
                'player2_win_prob': player2_prob,
                'favorite': 'player1',
                'confidence': max(player1_prob, player2_prob)
            }
        }), 200
    except Exception as e:
        logger.error(f'Prediction error: {e}')
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)

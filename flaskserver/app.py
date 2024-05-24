from flask import Flask, request, jsonify
import pickle
import numpy as np
from tensorflow.keras.models import load_model
import pandas as pd
from sklearn import preprocessing
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the RandomForest model
rfc_model_path = './rfc_model.pkl'
rfc_model = None
try:
    with open(rfc_model_path, 'rb') as file:
        rfc_model = pickle.load(file)
except FileNotFoundError:
    print(f"Error: Model file not found at {rfc_model_path}")
except EOFError:
    print(f"Error: Model file is corrupted at {rfc_model_path}")

# Load the Keras RNN model
rnn_model_path = './trained models/keras/RNN_fwd.keras'
rnn_model = load_model(rnn_model_path)

# Define column names for the Keras model
cols_names = ['id', 'cycle', 'setting1', 'setting2', 'setting3', 's1', 's2', 's3', 's4', 's5',
              's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19', 's20', 's21']

@app.route('/weatherPredict', methods=['POST'])
def predict():
    data = request.get_json()
    features = [
        data['main_temp'],
        data['visibility'],
        data['wind_speed'],
        data['pressure'],
        data['humidity'],
        966,  # grnd_level
        1014  # sea_level
    ]
    prediction = rfc_model.predict(np.array(features).reshape(1, -1))[0]
    return jsonify({'prediction': int(prediction)})

@app.route('/sensorPredict', methods=['POST'])
def sensor_predict():
    data = request.get_json()
    data_point_df = pd.DataFrame(data, columns=cols_names)
    
    data_point_df['cycle_norm'] = data_point_df['cycle']
    cols_normalize = ['s2']
    min_max_scaler = preprocessing.MinMaxScaler()
    min_max_scaler.fit(data_point_df[cols_normalize])
    norm_data_point_df = pd.DataFrame(min_max_scaler.transform(data_point_df[cols_normalize]), columns=cols_normalize, index=data_point_df.index)
    data_point_join_df = data_point_df[['id', 'cycle']].join(norm_data_point_df)
    data_point_df = data_point_join_df.reindex(columns=data_point_df.columns)

    sequence_length = 50
    seq_cols = ['s2']
    replicated_df = pd.concat([data_point_df] * sequence_length, ignore_index=True)

    def new_sequence_generator(feature_df, seq_length, seq_cols):
        feature_array = feature_df[seq_cols].values
        num_elements = feature_array.shape[0]
        for start, stop in zip(range(0, num_elements-seq_length+1), range(seq_length, num_elements+1)):
            yield feature_array[start:stop, :]
    
    new_seq_gen = list(new_sequence_generator(replicated_df, sequence_length, seq_cols))
    new_seq_set = np.array(new_seq_gen).astype(np.float32)
    
    new_predictions = rnn_model.predict(new_seq_set)
    threshold = 0.5
    predicted_labels = (new_predictions > threshold).astype(int)
    
    return jsonify({'prediction': predicted_labels.tolist()})

if __name__ == '__main__':
    app.run(port=5000, debug=True)

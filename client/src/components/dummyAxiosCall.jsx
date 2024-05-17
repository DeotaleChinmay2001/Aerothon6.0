import axios from 'axios';
import { authHeaderToken } from './authHeaderToken';

axios.get('/api/data', { headers: authHeaderToken() })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
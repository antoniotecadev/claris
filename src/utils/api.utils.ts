import axios from 'axios';
import ENV from './env.utils';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
	'Content-Type': 'application/json',
  },
});

export default apiClient
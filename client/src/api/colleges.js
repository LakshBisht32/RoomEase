import api from './client';

export const createCollege = (name, city) => api.post('/colleges', { name, city }).then((r) => r.data.college);

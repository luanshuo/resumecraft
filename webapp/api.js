const API_BASE = '';

const api = {
  _token: localStorage.getItem('token') || '',

  setToken(token) {
    this._token = token;
    localStorage.setItem('token', token);
  },

  clearToken() {
    this._token = '';
    localStorage.removeItem('token');
  },

  getToken() {
    return this._token;
  },

  _headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this._token) h['Authorization'] = 'Bearer ' + this._token;
    return h;
  },

  async get(url) {
    const r = await fetch(API_BASE + url, { headers: this._headers() });
    if (r.status === 401) { api.clearToken(); router.push('/login'); throw new Error('unauthorized'); }
    return r.json();
  },

  async post(url, data) {
    const r = await fetch(API_BASE + url, { method: 'POST', headers: this._headers(), body: JSON.stringify(data) });
    if (r.status === 401) { api.clearToken(); router.push('/login'); throw new Error('unauthorized'); }
    return r.json();
  },

  async put(url, data) {
    const r = await fetch(API_BASE + url, { method: 'PUT', headers: this._headers(), body: JSON.stringify(data) });
    if (r.status === 401) { api.clearToken(); router.push('/login'); throw new Error('unauthorized'); }
    return r.json();
  },

  async del(url) {
    const r = await fetch(API_BASE + url, { method: 'DELETE', headers: this._headers() });
    if (r.status === 401) { api.clearToken(); router.push('/login'); throw new Error('unauthorized'); }
    return r.json();
  },

  // Auth
  register(name, email, password) { return api.post('/api/v1/auth/register', { name, email, password }); },
  login(email, password) { return api.post('/api/v1/auth/login', { email, password }); },
  me() { return api.get('/api/v1/auth/me'); },

  // Resume
  listResumes() { return api.get('/api/v1/resumes'); },
  createResume(name, template) { return api.post('/api/v1/resumes', { name, template: template || 'minimal' }); },
  getResume(id) { return api.get('/api/v1/resumes/' + id); },
  updateResume(id, data) { return api.put('/api/v1/resumes/' + id, data); },
  deleteResume(id) { return api.del('/api/v1/resumes/' + id); },
  copyResume(id) { return api.post('/api/v1/resumes/' + id + '/copy'); },

  // Sections
  getSections(resumeId) { return api.get('/api/v1/resumes/' + resumeId + '/sections'); },
  updateSections(resumeId, sections) { return api.put('/api/v1/resumes/' + resumeId + '/sections', { sections }); },
  addSection(resumeId, type, data) { return api.post('/api/v1/resumes/' + resumeId + '/sections/' + type, data); },
};

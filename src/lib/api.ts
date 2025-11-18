// lib/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Generic fetch helper
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Calendar endpoints
  calendar: {
    getEvents: (filters?: any) => 
      api.request('/calendar' + (filters ? `?${new URLSearchParams(filters)}` : '')),
    createEvent: (eventData: any) => 
      api.request('/calendar', { method: 'POST', body: JSON.stringify(eventData) }),
    updateEvent: (id: string, eventData: any) => 
      api.request(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
    deleteEvent: (id: string) => 
      api.request(`/calendar/${id}`, { method: 'DELETE' }),
  },

  // Newsletter endpoints
  newsletters: {
    getNewsletters: (filters?: any) => 
      api.request('/newsletters' + (filters ? `?${new URLSearchParams(filters)}` : '')),
    createNewsletter: (newsletterData: any) => 
      api.request('/newsletters', { method: 'POST', body: JSON.stringify(newsletterData) }),
  },

  // Services endpoints
  services: {
    getServices: (filters?: any) => 
      api.request('/services' + (filters ? `?${new URLSearchParams(filters)}` : '')),
    createService: (serviceData: any) => 
      api.request('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
  },

  // Committee endpoints
  committee: {
    getMembers: () => api.request('/committee'),
    createMember: (memberData: any) => 
      api.request('/committee', { method: 'POST', body: JSON.stringify(memberData) }),
  },

  // Join endpoints
  join: {
    submitRequest: (formData: any) => 
      api.request('/join', { method: 'POST', body: JSON.stringify(formData) }),
  },

  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) => 
      api.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  },

  // Upload endpoints
  upload: {
    file: (file: File, type: 'image' | 'pdf') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      }).then(response => response.json());
    },
  },
};

export default api;
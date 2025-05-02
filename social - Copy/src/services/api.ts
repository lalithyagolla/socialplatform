import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class Api {
  private instance: AxiosInstance;
  private mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true
    }
  ];

  constructor() {
    this.instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public removeAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  // Mock authentication methods
  public async login(email: string, password: string) {
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = btoa(JSON.stringify(userWithoutPassword));

    return {
      data: {
        user: userWithoutPassword,
        token
      }
    };
  }

  public async register(name: string, email: string, password: string) {
    if (this.mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: String(this.mockUsers.length + 1),
      name,
      email,
      password,
      isAdmin: false
    };

    this.mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = btoa(JSON.stringify(userWithoutPassword));

    return {
      data: {
        user: userWithoutPassword,
        token
      }
    };
  }

  public async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const userData = JSON.parse(atob(token));
      return { data: { user: userData } };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig) {
    return await this.instance.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return await this.instance.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return await this.instance.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig) {
    return await this.instance.delete<T>(url, config);
  }
}

export const api = new Api();

// Feed services
export const feedService = {
  getFeeds: async (source: string = 'all', page: number = 1, limit: number = 10) => {
    return await api.get(`/feeds?source=${source}&page=${page}&limit=${limit}`);
  },
  
  saveContent: async (contentId: string) => {
    return await api.post('/feeds/save', { contentId });
  },
  
  shareContent: async (contentId: string) => {
    return await api.post('/feeds/share', { contentId });
  },
  
  reportContent: async (contentId: string, reason: string) => {
    return await api.post('/feeds/report', { contentId, reason });
  },
  
  getSavedContent: async (page: number = 1, limit: number = 10) => {
    return await api.get(`/feeds/saved?page=${page}&limit=${limit}`);
  }
};

// Admin services
export const adminService = {
  getReportedContent: async (page: number = 1, limit: number = 10) => {
    return await api.get(`/admin/reported?page=${page}&limit=${limit}`);
  },
  
  resolveReport: async (reportId: string, action: 'approve' | 'remove') => {
    return await api.post('/admin/reports/resolve', { reportId, action });
  },
  
  getUsers: async (page: number = 1, limit: number = 10) => {
    return await api.get(`/admin/users?page=${page}&limit=${limit}`);
  },
  
  updateUserRole: async (userId: string, isAdmin: boolean) => {
    return await api.put(`/admin/users/${userId}/role`, { isAdmin });
  },
  
  getStats: async () => {
    return await api.get('/admin/stats');
  }
};
import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';

// --- TYPES & INTERFACES ---

// Format standard de réponse API (à adapter selon ton backend)
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Format d'erreur standardisé pour l'application
export interface ApiError {
  message: string;
  code: string | number;
  details?: any;
}

// --- CONFIGURATION ---

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000, // 10 secondes max pour les analyses lourdes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// --- SERVICE API (SINGLETON) ---

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  // 1. Configuration des Intercepteurs (Middleware)
  private setupInterceptors() {
    
    // REQUEST INTERCEPTOR
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Nettoyage des données parasites (null/undefined)
        if (config.data) {
          config.data = this.cleanPayload(config.data);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // On retourne directement la data utile, pas l'objet axios complet
        return response.data;
      },
      (error: AxiosError) => {
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  // 2. Utilitaire : Nettoyage des payloads (supprime les clés undefined)
  private cleanPayload(data: any): any {
    if (typeof data !== 'object' || data === null) return data;
    
    return Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        acc[key] = typeof value === 'object' ? this.cleanPayload(value) : value;
      }
      return acc;
    }, {} as any);
  }

  // 3. Utilitaire : Normalisation des erreurs pour le Frontend
  private normalizeError(error: AxiosError<any>): ApiError {
    // Cas 1: Réponse erreur du serveur (4xx, 5xx)
    if (error.response) {
      return {
        message: error.response.data?.message || 'Erreur serveur inconnue',
        code: error.response.status,
        details: error.response.data?.errors || null
      };
    }
    
    // Cas 2: Pas de réponse (Timeout / Réseau coupé)
    if (error.request) {
      return {
        message: 'Impossible de joindre le serveur KMERLEX. Vérifiez votre connexion.',
        code: 'NETWORK_ERROR'
      };
    }

    // Cas 3: Erreur de configuration interne
    return {
      message: error.message || 'Une erreur inattendue est survenue',
      code: 'INTERNAL_ERROR'
    };
  }

  // --- MÉTHODES PUBLIQUES ---

  /**
   * GET Request
   * @param url Endpoint (ex: '/analyze')
   * @param config Config optionnelle (params, signal...)
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T, T>(url, config);
  }

  /**
   * POST Request
   * @param url Endpoint
   * @param data Body JSON
   * @param config Config optionnelle
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T, T>(url, data, config);
  }

  /**
   * PUT Request
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T, T>(url, data, config);
  }

  /**
   * DELETE Request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T, T>(url, config);
  }
}

// Export d'une instance unique (Singleton)
export const api = new ApiService();
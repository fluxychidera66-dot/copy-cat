import { API_BASE_URL } from './config';

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
  code?: string;
}

export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errorMsg =
        (data && typeof data === 'object' && (data.error || data.message || data.note)) ||
        `Backend returned status ${res.status}`;
      return {
        ok: false,
        status: res.status,
        data,
        error: String(errorMsg),
        code: data?.error
      };
    }

    return {
      ok: true,
      status: res.status,
      data
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: null as any,
      error: err?.message || 'Network error connecting to dropship-api'
    };
  }
}

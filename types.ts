
export interface WebApp {
  id: string;
  name: string;
  author: string;
  description: string;
  url: string;
  images: string[]; // URLs of images in Google Drive
  timestamp: string;
}

export type ActionType = 'FETCH_APPS' | 'REGISTER_APP' | 'UPDATE_APP' | 'DELETE_APP';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

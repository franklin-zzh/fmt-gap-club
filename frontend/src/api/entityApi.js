/**
 * Entity API helpers - maps frontend data operations to FastAPI backend endpoints.
 * 
 * Usage:  import { auth, products, articles, profiles, submissions, subscriptions, users, dashboard } from '@/api/entityApi';
 * 
 * Replaces: import { base44 } from '@/api/base44Client';
 *           base44.entities.Product.list()  →  products.list()
 *           base44.auth.me()                →  auth.me()
 */

import client from '@/api/client';

// ==================== Auth ====================
export const auth = {
  /** @param {string} email @param {string} password */
  login: (email, password) => {
    // FastAPI's OAuth2PasswordRequestForm expects form-data with username=email
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return client.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(r => r.data);
  },

  /** @param {string} email @param {string} password */
  register: (email, password) => {
    return client.post('/auth/register', { email, password }).then(r => r.data);
  },

  me: () => {
    return client.get('/auth/me').then(r => r.data);
  },
};

// ==================== Products ====================
export const products = {
  list: () => client.get('/products').then(r => r.data),
  /** @param {string|number} id */
  get: (id) => client.get(`/products/${id}`).then(r => r.data),
  /** @param {Record<string,any>} data */
  create: (data) => client.post('/products', data).then(r => r.data),
  /** @param {string|number} id @param {Record<string,any>} data */
  update: (id, data) => client.put(`/products/${id}`, data).then(r => r.data),
  /** @param {string|number} id */
  delete: (id) => client.delete(`/products/${id}`).then(r => r.data),
  /** @param {File} file - image file to upload */
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

// ==================== Articles ====================
export const articles = {
  /** @param {string} [category] */
  list: (category) => {
    const params = category ? { category } : {};
    return client.get('/articles', { params }).then(r => r.data);
  },
  /** @param {string|number} id */
  get: (id) => client.get(`/articles/${id}`).then(r => r.data),
  /** @param {Record<string,any>} data */
  create: (data) => client.post('/articles', data).then(r => r.data),
  /** @param {string|number} id @param {Record<string,any>} data */
  update: (id, data) => client.put(`/articles/${id}`, data).then(r => r.data),
  /** @param {string|number} id */
  delete: (id) => client.delete(`/articles/${id}`).then(r => r.data),
};

// ==================== Profiles ====================
export const profiles = {
  get: () => client.get('/profiles/me').then(r => r.data),
  /** @param {Record<string,any>} data */
  update: (data) => client.put('/profiles/me', data).then(r => r.data),
};

// ==================== Submissions ====================
export const submissions = {
  list: () => client.get('/submissions').then(r => r.data),
  /** @param {FormData} formData */
  create: (formData) => client.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
  /** @param {string|number} id */
  get: (id) => client.get(`/submissions/${id}`).then(r => r.data),
};

// ==================== Subscriptions ====================
export const subscriptions = {
  getMine: () => client.get('/subscriptions/me').then(r => r.data),
  /** @param {Record<string,any>} data */
  renew: (data) => client.post('/subscriptions/me/renew', data).then(r => r.data),
  listAll: () => client.get('/subscriptions').then(r => r.data),
};

// ==================== Users (admin) ====================
export const users = {
  /** @param {Record<string,any>} [params] */
  list: (params) => client.get('/users', { params }).then(r => r.data),
  /** @param {string|number} id */
  toggleStatus: (id) => client.patch(`/users/${id}/status`).then(r => r.data),
};

// ==================== Dashboard (admin) ====================
export const dashboard = {
  stats: () => client.get('/dashboard').then(r => r.data),
};

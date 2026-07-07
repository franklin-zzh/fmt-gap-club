import client from './client'

export function fetchDashboardStats() {
  return client.get('/dashboard')
}

export function fetchUsers(params = {}) {
  return client.get('/users', { params })
}

export function toggleUserStatus(userId) {
  return client.patch(`/users/${userId}/status`)
}

export function fetchProducts() {
  return client.get('/products')
}

export function createProduct(data) {
  return client.post('/products', data)
}

export function updateProduct(id, data) {
  return client.put(`/products/${id}`, data)
}

export function deleteProduct(id) {
  return client.delete(`/products/${id}`)
}

export function fetchArticles(params = {}) {
  return client.get('/articles', { params })
}

export function createArticle(data) {
  return client.post('/articles', data)
}

export function updateArticle(id, data) {
  return client.put(`/articles/${id}`, data)
}

export function deleteArticle(id) {
  return client.delete(`/articles/${id}`)
}

export function fetchSubscriptions() {
  return client.get('/subscriptions')
}

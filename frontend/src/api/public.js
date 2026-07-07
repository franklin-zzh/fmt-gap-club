import client from './client'

export function fetchProducts() {
  return client.get('/products')
}

export function fetchProduct(id) {
  return client.get(`/products/${id}`)
}

export function fetchArticles(params = {}) {
  return client.get('/articles', { params })
}

export function fetchArticle(id) {
  return client.get(`/articles/${id}`)
}

export function fetchComments(params = {}) {
  return client.get('/comments', { params })
}

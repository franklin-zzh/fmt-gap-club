import client from './client'

export function login(email, password) {
  const params = new URLSearchParams()
  params.append('username', email)
  params.append('password', password)
  return client.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export function register(email, password) {
  return client.post('/auth/register', { email, password })
}

export function fetchMe() {
  return client.get('/auth/me')
}

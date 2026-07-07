import client from './client'

export function fetchProfile() {
  return client.get('/profiles/me')
}

export function updateProfile(data) {
  return client.put('/profiles/me', data)
}

export function fetchSubmissions() {
  return client.get('/submissions')
}

export function createSubmission(data) {
  return client.post('/submissions', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function fetchSubscription() {
  return client.get('/subscriptions/me')
}

export function renewSubscription(planType) {
  return client.post('/subscriptions/me/renew', { plan_type: planType })
}

import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/member'

export const useMemberStore = defineStore('member', () => {
  const profile = ref(null)
  const submissions = ref([])
  const subscription = ref(null)

  async function loadProfile() {
    profile.value = await api.fetchProfile()
    return profile.value
  }

  async function saveProfile(data) {
    profile.value = await api.updateProfile(data)
  }

  async function loadSubmissions() {
    submissions.value = await api.fetchSubmissions()
  }

  async function submit(data) {
    const res = await api.createSubmission(data)
    submissions.value.unshift(res)
    return res
  }

  async function loadSubscription() {
    try {
      subscription.value = await api.fetchSubscription()
    } catch (e) {
      subscription.value = null
    }
  }

  async function renew(planType) {
    subscription.value = await api.renewSubscription(planType)
  }

  return {
    profile,
    submissions,
    subscription,
    loadProfile,
    saveProfile,
    loadSubmissions,
    submit,
    loadSubscription,
    renew,
  }
})

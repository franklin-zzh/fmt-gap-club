import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/member',
      component: () => import('@/views/member/MemberLayout.vue'),
      meta: { requiresAuth: true, role: 'member' },
      children: [
        { path: '', name: 'member-dashboard', component: () => import('@/views/member/MemberDashboard.vue') },
        { path: 'profile', name: 'member-profile', component: () => import('@/views/member/MemberProfile.vue') },
        { path: 'submission', name: 'member-submission', component: () => import('@/views/member/MemberSubmission.vue') },
        { path: 'reports', name: 'member-reports', component: () => import('@/views/member/MemberReports.vue') },
        { path: 'subscription', name: 'member-subscription', component: () => import('@/views/member/MemberSubscription.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
        { path: 'members', name: 'admin-members', component: () => import('@/views/admin/AdminMembers.vue') },
        { path: 'products', name: 'admin-products', component: () => import('@/views/admin/AdminProducts.vue') },
        { path: 'articles', name: 'admin-articles', component: () => import('@/views/admin/AdminArticles.vue') },
        { path: 'subscriptions', name: 'admin-subscriptions', component: () => import('@/views/admin/AdminSubscriptions.vue') },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAuth && to.meta.role && auth.user?.role !== to.meta.role && auth.user?.role !== 'admin') {
    return next({ name: 'landing' })
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next({ name: auth.user?.role === 'admin' ? 'admin-dashboard' : 'member-dashboard' })
  }
  next()
})

export default router

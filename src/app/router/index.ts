import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../../pages/HomePage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../../pages/dashboard/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../../pages/dashboard/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../../pages/profile/ProfilePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../../pages/users/UsersPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chats',
      name: 'chats',
      component: () => import('../../pages/chats/ChatsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contractors',
      name: 'contractors',
      component: () => import('../../pages/contractors/ContractorsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/broadcasts',
      name: 'broadcasts',
      component: () => import('../../pages/broadcasts/BroadcastsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('../../pages/templates/TemplatesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('../../pages/organizations/OrganizationsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../../pages/departments/DepartmentsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/imports/system',
      name: 'imports-system',
      component: () => import('../../pages/imports/SystemImportPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('../../pages/positions/PositionsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../../pages/employees/EmployeesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../../pages/roles/RolesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../../pages/companies/CompaniesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../../pages/clients/ClientsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: '/'
    }
  ],
})

// Настройка охраны маршрутов
setupRouterGuards(router)

export default router

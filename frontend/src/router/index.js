import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import api from '@/api';

import Login from '../views/LoginPage.vue';
import Home from '@/views/HomePage.vue';
import Perfil from '../views/Perfil.vue';
import MeusLivros from '../views/MeusLivros.vue';
import LivroPage from '../views/LivroPage.vue';
import PermissaoPage from '../views/PermissaoPage.vue';
import UsuarioPage from '../views/UsuarioPage.vue';
import TurmaPage from '../views/TurmaPage.vue';
import AlterarSenha from '../views/AlterarSenha.vue';

const routes = [
  { path: '/login', component: Login, meta: { requiresGuest: true } },
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/perfil', component: Perfil, meta: { requiresAuth: true } },
  { path: '/meuslivros', component: MeusLivros, meta: { requiresAuth: true } },
  { path: '/cadastrarlivro', component: LivroPage, meta: { requiresAuth: true } },
  { path: '/permissao', component: PermissaoPage, meta: { requiresAuth: true } },
  { path: '/usuarios', component: UsuarioPage, meta: { requiresAuth: true } },
  { path: '/turmas', component: TurmaPage, meta: { requiresAuth: true } },
  { path: '/alterarSenha', component: AlterarSenha, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated; 
  const currentUser = store.getters.currentUser;

  if (to.meta.requiresAuth && !currentUser) {
    try {
      const res = await api.get("/login/me");
      store.dispatch("setUser", res.data.user);
      next();
    } catch (err) {
      console.error("Não autenticado", err);
      next('/login');
    }
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;

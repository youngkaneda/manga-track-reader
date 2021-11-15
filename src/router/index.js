import Vue from 'vue';
import VueRouter from 'vue-router';
import View from '../views/View';
import Home from '../components/Home';
import Settings from '../components/Settings';
import Add from '../components/Add';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'view',
        component: View,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'add/', name: 'add', component: Add },
            { path: 'edit/', name: 'edit', component: Add },
            { path: 'settings/', name: 'settings', component: Settings },
        ],
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { db } from './firebase';
import { toast } from 'toast-notification-alert';
import {
    doc,
    collection,
    getDocs,
    addDoc,
    setDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        unsub: null,
        unsubUs: null,
        user: null,
        sources: [],
    },
    mutations: {
        sources(state, sources) {
            state.sources = sources;
        },
        addSource(state, source) {
            addDoc(collection(db, 'sources'), source);
        },
        updateSource(state, source) {
            let id = source.id;
            delete source.id;
            setDoc(doc(db, 'sources', id), source);
        },
        deleteSource(state, source) {
            deleteDoc(doc(db, 'sources', source.id));
        },
        register(state, user) {
            if (user.username == '' || user.password == '') {
                toast.show({
                    title: 'invalid username or password.',
                    position: 'topright',
                    type: 'error',
                });
                return;
            }
            getDocs(
                query(
                    collection(db, 'users'),
                    where('username', '==', user.username),
                ),
            ).then((snapshot) => {
                if (!snapshot.empty) {
                    toast.show({
                        title: 'user already exist.',
                        position: 'topright',
                        type: 'info',
                    });
                    return;
                }
                addDoc(collection(db, 'users'), {
                    ...user,
                    img: null,
                    createdAt: new Date(),
                });
                toast.show({
                    title: 'user created.',
                    position: 'topright',
                    type: 'info',
                });
            });
        },
        setUser(state, user) {
            state.user = user;
            if (user)
                localStorage.setItem('manxUser', JSON.stringify(state.user));
            else localStorage.removeItem('manxUser');
        },
        cacheUnsub(state, unsub) {
            state.unsub = unsub;
        },
        cacheUnsubUs(state, unsub) {
            state.unsubUs = unsub;
        },
    },
    actions: {
        login({ commit }, user) {
            const loginQuery = query(
                collection(db, 'users'),
                where('username', '==', user.username),
                where('password', '==', user.password),
            );
            getDocs(loginQuery).then((snapshot) => {
                if (snapshot.empty) {
                    toast.show({
                        title: 'user or password invalid.',
                        position: 'topright',
                        type: 'warn',
                    });
                    return;
                } else {
                    let userId;
                    snapshot.forEach((doc) => {
                        userId = doc.id;
                        commit('setUser', { id: doc.id, ...doc.data() });
                    });
                    const q = query(
                        collection(db, 'sources'),
                        where('user', '==', userId),
                    );
                    const unsub = onSnapshot(q, (snap) => {
                        let sources = [];
                        snap.forEach((doc) =>
                            sources.push({ id: doc.id, ...doc.data() }),
                        );
                        commit('sources', sources);
                        console.log('receiving updated snapshot source data.');
                    });
                    const unsubUs = onSnapshot(
                        doc(db, 'users', userId),
                        (doc) => {
                            commit('setUser', { id: doc.id, ...doc.data() });
                            console.log(
                                'receiving updated snapshot user data.',
                            );
                        },
                    );
                    commit('cacheUnsub', unsub);
                    commit('cacheUnsubUs', unsubUs);
                }
            });
        },
        updateUser({ commit }, user) {
            let id = user.id;
            delete user.id;
            setDoc(doc(db, 'users', id), user);
            commit('setUser', { id, ...user });
        },
    },
    modules: {},
});

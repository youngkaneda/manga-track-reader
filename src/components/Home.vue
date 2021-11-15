<template>
    <div class="container" style="margin-top: 2%">
        <div v-if="user != null">
            <div style="display: flex">
                <div style="max-height: 140px">
                    <img
                        :src="handleImgPrf(user)"
                        alt=""
                        width="140"
                        height="140"
                        style="border-radius: 50%"
                    />
                </div>
                <div style="padding-left: 12px; align-self: end">
                    <p><span>Username:</span> {{ user.username }}</p>
                    <p>
                        <span>Created at:</span>
                        {{
                            new Date(
                                user.createdAt.seconds * 1000,
                            ).toLocaleString()
                        }}
                    </p>
                </div>
            </div>
            <hr />
            <div>
                <div style="display: flex">
                    <span
                        style="margin-left: auto"
                        @click="
                            $router.push({
                                name: 'add',
                                params: { userId: user.id },
                            })
                        "
                        class="material-icons md-26 op"
                        >add</span
                    >
                    <span
                        @click="
                            $router.push({
                                name: 'settings',
                                params: { user: user },
                            })
                        "
                        class="material-icons md-26 op"
                        >settings</span
                    >
                    <span @click="logout()" class="material-icons md-26 op"
                        >logout</span
                    >
                </div>
                <div
                    v-for="source in sources"
                    :key="source.id"
                    style="margin-top: 12px"
                >
                    <h4 class="over"><span>Name:</span> {{ source.name }}</h4>
                    <div style="display: flex; max-height: 140px !important">
                        <div style="max-height: 140px">
                            <img
                                :src="handleImgSrc(source)"
                                alt=""
                                width="140"
                                height="140"
                            />
                        </div>
                        <div
                            style="
                                padding-left: 12px;
                                display: flex;
                                flex-direction: column;
                            "
                        >
                            <div
                                style="
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                "
                            >
                                <p class="over">
                                    <span>Description: </span
                                    >{{ source.description }}
                                </p>
                            </div>
                            <p>
                                <span>Current chapter: </span
                                >{{ source.currentChapter }}
                            </p>
                            <div
                                style="
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                "
                            >
                                <p class="notSoOver">
                                    <span>URL: </span
                                    ><a :href="source.url">{{ source.url }}</a>
                                </p>
                            </div>
                            <div style="margin-top: auto">
                                <span
                                    @click="
                                        $router.push({
                                            name: 'edit',
                                            params: { source: source },
                                        })
                                    "
                                    class="material-icons md-26 op"
                                    >edit</span
                                >
                                <span
                                    @click="remove(source)"
                                    class="material-icons md-26 op"
                                    >delete</span
                                >
                                <span
                                    @click="openModal(source)"
                                    class="material-icons md-26 op modal-btn"
                                    >library_books</span
                                >
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
            <div style="text-align: center">
                Made with
                <i class="icon ion-heart" style="color: #e25555"></i> by
                <a href="https://github.com/youngkaneda">Kaneda</a>.
            </div>
        </div>
        <div v-else style="display: flex; flex-direction: column">
            <p>
                <label for="username">Username</label>
                <input
                    autocorrect="off"
                    autocapitalize="none"
                    autocomplete="off"
                    id="username"
                    type="text"
                    placeholder="Type your username"
                    v-model="username"
                />
            </p>
            <p>
                <label for="password">Password</label>
                <input
                    @keypress="listenEnter($event)"
                    id="password"
                    type="password"
                    placeholder="Type your password"
                    v-model="password"
                />
            </p>
            <div style="margin-left: auto; margin-top: 15px">
                <button class="button primary" @click="register()">
                    Register
                </button>
                <button class="button primary" @click="login()">Login</button>
            </div>
        </div>
        <div class="modal">
            <div class="modal-content">
                <p style="margin: 13px 0 13px 0" v-if="sourceChapterToUpdate">
                    <label for="chapter">Current chapter</label>
                    <input
                        id="chapter"
                        type="number"
                        onkeypress="return /[0-9]/i.test(event.key)"
                        placeholder="Type the current chapter"
                        v-model="sourceChapterToUpdate"
                    />
                </p>
                <div style="margin-left: auto; display: flex">
                    <button
                        class="button secondary close-cancel-btn"
                        style="margin-left: auto"
                    >
                        Cancel
                    </button>
                    <button class="button primary close-save-btn">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { db } from '../store/firebase';
import {
    collection,
    getDocs,
    query,
    where,
    onSnapshot,
    doc,
} from 'firebase/firestore';
export default {
    data() {
        return {
            username: '',
            password: '',
            sourceChapterToUpdate: null,
        };
    },
    mounted() {
        if (this.user) {
            const q = query(
                collection(db, 'sources'),
                where('user', '==', this.user.id),
            );
            getDocs(q).then((snapshot) => {
                if (snapshot.empty) {
                    console.log('data not found for you.');
                    return;
                }
                let sources = [];
                snapshot.forEach((doc) =>
                    sources.push({ id: doc.id, ...doc.data() }),
                );
                this.$store.commit('sources', sources);
            });
            if (!this.$store.state.unsub) {
                const unsub = onSnapshot(q, (snap) => {
                    let sources = [];
                    snap.forEach((doc) =>
                        sources.push({ id: doc.id, ...doc.data() }),
                    );
                    this.$store.commit('sources', sources);
                    console.log('receiving updated snapshot source data.');
                });
                this.$store.commit('cacheUnsub', unsub);
            } else {
                console.log('data listener for sources still cached');
            }
            if (!this.$store.state.unsubUs) {
                const unsubUs = onSnapshot(
                    doc(db, 'users', this.user.id),
                    (doc) => {
                        this.$store.commit('setUser', {
                            id: doc.id,
                            ...doc.data(),
                        });
                        console.log('receiving updated snapshot user data.');
                    },
                );
                this.$store.commit('cacheUnsubUs', unsubUs);
            } else {
                console.log('data listener for user still cached');
            }
            return;
        }
        if (this.user == null && localStorage.getItem('manxUser')) {
            const user = JSON.parse(localStorage.getItem('manxUser'));
            this.username = user.username;
            this.password = user.password;
            this.login();
        }
    },
    computed: {
        user: function () {
            return this.$store.state.user;
        },
        sources: function () {
            return this.$store.state.sources;
        },
    },
    methods: {
        login() {
            this.$store.dispatch('login', {
                username: this.username,
                password: this.password,
            });
        },
        register() {
            this.$store.commit('register', {
                username: this.username,
                password: this.password,
            });
        },
        remove(source) {
            this.$store.commit('deleteSource', source);
        },
        openModal(source) {
            this.sourceChapterToUpdate = source.currentChapter;
            let modal = document.querySelector('.modal');
            let cancelBtn = document.querySelector('.close-cancel-btn');
            let saveBtn = document.querySelector('.close-save-btn');
            let clearModal = () => {
                modal.style.display = 'none';
                this.sourceChapterToUpdate = null;
            };
            cancelBtn.onclick = () => {
                clearModal();
            };
            saveBtn.onclick = () => {
                source.currentChapter = this.sourceChapterToUpdate;
                this.$store.commit('updateSource', source);
                clearModal();
            };
            window.onclick = (e) => {
                if (e.target == modal) {
                    clearModal();
                }
            };
            modal.style.display = 'block';
        },
        handleImgSrc(source) {
            return source.img != null
                ? source.img
                : require('../assets/cover_pc.png');
        },
        handleImgPrf(user) {
            return user.img != null
                ? user.img
                : require('../assets/profile_pc.jpg');
        },
        logout() {
            this.$store.commit('setUser', null);
            this.$store.commit('sources', []);
        },
        listenEnter(event) {
            if (event.key === 'Enter') {
                this.login();
            }
        },
    },
};
</script>
<style scoped>
@media (max-width: 398px) {
    .container {
        width: 398px !important;
    }
}
.over {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.notSoOver {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
}
p {
    margin: 0;
}
span {
    font-weight: bold;
    margin-top: auto;
}
span:hover {
    cursor: pointer;
}
.material-icons.md-26 {
    font-size: 26px;
}
.op {
    margin-left: 5px;
    padding: 3px;
}
.op:hover {
    background-color: #dcdcdc;
    border-radius: 2px;
}
img {
    object-fit: cover;
    width: 140px !important;
    border-radius: 2px;
    border: 1px solid #dcdcdc;
}
.modal {
    display: none;
    position: fixed;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
    position: relative;
    background-color: white;
    padding: 15px;
    margin: auto;
    width: 75%;
    min-width: 295px;
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: animatetop;
    animation-duration: 0.4s;
}
@-webkit-keyframes animatetop {
    from {
        top: -300px;
        opacity: 0;
    }
    to {
        top: 0;
        opacity: 1;
    }
}
@keyframes animatetop {
    from {
        top: -300px;
        opacity: 0;
    }
    to {
        top: 0;
        opacity: 1;
    }
}
</style>

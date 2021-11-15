<template>
    <div v-if="user" class="container" style="margin-top: 2%">
        <div style="display: flex; flex-direction: column">
            <label for="avatar">Avatar</label>
            <div style="display: flex">
                <div style="max-height: 140px">
                    <img
                        :src="newAvatar ? newAvatar : handleImgPrf(user)"
                        alt=""
                        width="140"
                        height="140"
                    />
                </div>
                <div
                    style="
                        display: flex;
                        align-self: end;
                        flex-grow: 1;
                        margin-left: 12px;
                    "
                >
                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        @change="parseToB64AndSet($event.target.files)"
                    />
                </div>
            </div>
            <p style="margin-top: 12px">
                <label for="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Type your username"
                    v-model="user.username"
                />
            </p>
            <div style="margin-left: auto">
                <button class="button secondary" @click="$router.push('/')">
                    Cancel
                </button>
                <button class="button primary" @click="updateUser()">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { toast } from 'toast-notification-alert';
export default {
    data() {
        return {
            user: null,
            newAvatar: null,
        };
    },
    mounted() {
        if (this.$route.params.user) {
            this.user = this.$route.params.user;
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        handleImgPrf(user) {
            return user.img != null
                ? user.img
                : require('../assets/profile_pc.jpg');
        },
        parseToB64AndSet(files) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                this.newAvatar = reader.result;
            };
            reader.onerror = (e) => console.log(e);
        },
        updateUser() {
            if (!this.user.username || this.user.username == '') {
                toast.show({
                    title: 'invalid username.',
                    position: 'topright',
                    type: 'error',
                });
                return;
            }
            if (this.newAvatar && this.newAvatar.length >= 1048487) {
                toast.show({
                    title: 'image size is too large.',
                    position: 'topright',
                    type: 'error',
                });
                return;
            }
            this.user.img = this.newAvatar ? this.newAvatar : this.user.img;
            this.$store.dispatch('updateUser', this.user);
            this.$router.push('/');
        },
    },
};
</script>
<style scoped>
img {
    object-fit: cover;
    border-radius: 2px;
    border: 1px solid #dcdcdc;
}
@media (max-width: 364px) {
    .container {
        width: 364px !important;
    }
}
</style>

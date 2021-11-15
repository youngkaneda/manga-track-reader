<template>
    <div class="container" style="margin-top: 2%">
        <div style="display: flex; flex-direction: column">
            <label for="cover">Cover page</label>
            <div style="display: flex">
                <div style="max-height: 140px">
                    <img :src="handleImgSrc(img)" alt="" width="140" height="140">
                </div>
                <div style="display: flex; align-self: end; flex-grow: 1; margin-left: 12px;">
                    <input
                        id="cover"
                        type="file"
                        accept="image/*"
                        @change="parseToB64AndSet($event.target.files)"
                    />
                </div>
            </div>
            <p style="margin-top: 10px">
                <label for="title">Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Type the title"
                    v-model="source.name"
                />
            </p>
            <p style="margin-top: 10px">
                <label for="desc">Description</label>
                <input
                    id="desc"
                    type="text"
                    placeholder="Type the description"
                    v-model="source.description"
                />
            </p>
            <p style="margin-top: 10px">
                <label for="url">URL</label>
                <input
                    id="url"
                    type="text"
                    placeholder="Type the URL"
                    v-model="source.url"
                />
            </p>
            <p style="margin-top: 10px">
                <label for="chapter">Current chapter</label>
                <input
                    id="chapter"
                    type="number"
                    onkeypress="return /[0-9]/i.test(event.key)"
                    placeholder="Type the current chapter"
                    v-model="source.currentChapter"
                />
            </p>
            <div style="margin-left: auto">
                <button class="button secondary" @click="$router.push('/')">Cancel</button>
                <button class="button primary" @click="save()">Save</button>
            </div>
        </div>
    </div>
</template>
<script>
import { toast } from 'toast-notification-alert';
export default {
    data() {
        return {
            source: {
                currentChapter: 0,
            },
            img: null,
        }
    },
    mounted() {
        if (this.$route.path.includes('/edit') && !this.$route.params.source) {
            this.$router.push('/');
            return ;
        } else if (this.$route.path.includes('/edit')) {
            this.source = this.$route.params.source;
            this.img = this.$route.params.source.img;
        }
    },
    methods: {
        handleImgSrc(img) {
            return img != null
                ? img
                : require("../assets/cover_pc.png");
        },
        parseToB64AndSet(files) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                this.img = reader.result;
            }
            reader.onerror = (e) => console.log(e);
        },
        save() {
            if (this.img.length >= 1048487) {
                toast.show({ title: 'image size is too large.', position: 'topright', type: 'error' });
                return ;
            }
            if (!this.source.name || !this.source.description || !this.source.url) {
                toast.show({ title: 'please fill all the fields.', position: 'topright', type: 'error' });
                return ;
            }
            this.source.img = this.img;
            if (this.$route.path.includes('/edit')) {
                this.$store.commit('updateSource', this.source);
            } else {
                this.$store.commit('addSource', this.source);
            }
            this.$router.push('/');
        }
    }
}
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
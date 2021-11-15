<template>
    <div id="app">
        <Front />
    </div>
</template>

<script>
import Front from './views/View';
export default {
    name: 'App',
    components: {
        Front,
    },
};
</script>

<style>
body {
    overflow: auto;
}
</style>

<template>
<div class="scaleOver" :class="scaleover"></div>
</template>

<script>
export default {
    props: {
        scaleover: String
    }
}
</script>

<style>
.scaleOver {
    /* background: #42b983; */
    background: var(--theme-1);
    border-radius: 50%;
    position: fixed;
    z-index: 15;
    top: -1px;
    right: -1px;
    width: 1px;
    height: 1px;
}
</style>

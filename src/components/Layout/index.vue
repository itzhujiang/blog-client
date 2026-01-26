<template>
  <div class="layout-container">
    <div class="menu">
        <slot name="menu"></slot>
    </div>
    <div class="main">
        <div class="top">
            <slot name="top"></slot>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.layout-container {
    width: 100%;
    height: 100%;
    display: flex;
    .menu {
        flex: 0 0 auto;
        overflow: hidden;
    }
    .main {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        .top {
            flex:  0 0 auto;
        }
        .content {
            overflow: auto;
            flex: 1 1 auto;
        }
    }
}
</style>
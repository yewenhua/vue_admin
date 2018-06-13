<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>

</script>
<style>
    body, html{
        width:100%;
        height:100%;
        background: #f4f4f4;
        overflow: hidden;
    }
    #app{
        width:100%;
        height:100%;
        font-size: 0.14rem;
    }
    .el-table td, .el-table th{
        padding: 8px 0px;
    }
    .updateWrapper{
        background-color: white;
        border: 1px solid #ebeef5;
        padding: 20px;
    }
    .updateWrapper .title{
        background-color: #f6f8f8;
        font-size: 16px;
        margin: -20px -20px 10px -20px;
        padding: 15px 20px;
        color: #333;
        font-weight: bold;
    }
    .updateWrapper .el-form--label-top .el-form-item__label{
        padding: 0px;
    }
</style>
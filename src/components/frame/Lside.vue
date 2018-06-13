<template>
    <div class="lsideWrapper">
        <el-menu
                :defaultActive="activeIndex"
                :uniqueOpened="true"
                :router="true"
                :collapse="collapse"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="handleSelect"
                @open="handleOpen"
                @close="handleClose">
            <el-submenu index="1" v-if="hasPagePermission('admin/user') || hasPagePermission('admin/role') || hasPagePermission('admin/privilege')">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span class="mtext">系统管理</span>
                </template>
                <el-menu-item index="/admin/user" class="mtext" v-if="hasPagePermission('admin/user')">用户管理</el-menu-item>
                <el-menu-item index="/admin/role" class="mtext" v-if="hasPagePermission('admin/role')">角色管理</el-menu-item>
                <el-menu-item index="/admin/privilege" class="mtext" v-if="hasPagePermission('admin/privilege')">权限管理</el-menu-item>
            </el-submenu>
            <el-submenu index="2" v-if="hasPagePermission('admin/agent') || hasPagePermission('admin/department') || hasPagePermission('admin/question')">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span class="mtext">会员管理</span>
                </template>
                <el-menu-item index="/admin/viplist" class="mtext" v-if="hasPagePermission('admin/viplist')">会员列表</el-menu-item>
                <el-menu-item index="/admin/agent" class="mtext" v-if="hasPagePermission('admin/agent')">代理商</el-menu-item>
                <el-menu-item index="/admin/department" class="mtext" v-if="hasPagePermission('admin/department')">部门管理</el-menu-item>
                <el-menu-item index="/admin/question" class="mtext" v-if="hasPagePermission('admin/question')">常见问题</el-menu-item>
            </el-submenu>
            <el-submenu index="3" v-if="hasPagePermission('admin/download') || hasPagePermission('admin/log') || hasPagePermission('admin/tiaoma')">
                <template slot="title">
                    <i class="el-icon-star-on"></i>
                    <span class="mtext">导航三</span>
                </template>
                <el-menu-item index="/admin/download" class="mtext" v-if="hasPagePermission('admin/download')">下载中心</el-menu-item>
                <el-menu-item index="/admin/log" class="mtext" v-if="hasPagePermission('admin/log')">日志管理</el-menu-item>
                <el-menu-item index="/admin/tiaoma" class="mtext" v-if="hasPagePermission('admin/tiaoma')">条码查询</el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-if="hasPagePermission('admin/manager') || hasPagePermission('admin/money') || hasPagePermission('admin/zhaopin')">
                <template slot="title">
                    <i class="el-icon-message"></i>
                    <span class="mtext">导航四</span>
                </template>
                <el-menu-item index="/admin/manager" class="mtext" v-if="hasPagePermission('admin/manager')">管理员管理</el-menu-item>
                <el-menu-item index="/admin/money" class="mtext" v-if="hasPagePermission('admin/money')">财务管理</el-menu-item>
                <el-menu-item index="/admin/zhaopin" class="mtext" v-if="hasPagePermission('admin/zhaopin')">招聘管理</el-menu-item>
            </el-submenu>
            <el-submenu index="5" v-if="hasPagePermission('admin/navigate') || hasPagePermission('admin/order')">
                <template slot="title">
                    <i class="el-icon-share"></i>
                    <span class="mtext">导航五</span>
                </template>
                <el-menu-item index="/admin/navigate" class="mtext" v-if="hasPagePermission('admin/navigate')">展厅导航</el-menu-item>
                <el-menu-item index="/admin/order" class="mtext" v-if="hasPagePermission('admin/order')">订单管理</el-menu-item>
            </el-submenu>
            <el-submenu index="6" v-if="hasPagePermission('admin/info') || hasPagePermission('admin/chgpwd')">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span class="mtext">我的</span>
                </template>
                <el-menu-item index="/admin/info" class="mtext" v-if="hasPagePermission('admin/info')">个人信息</el-menu-item>
                <el-menu-item index="/admin/chgpwd" class="mtext" v-if="hasPagePermission('admin/chgpwd')">修改密码</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Row,
        Col,
        Menu,
        Submenu,
        MenuItem,
        MenuItemGroup,
    } from 'element-ui'
    import { mapState } from 'vuex'

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);

    export default {
        computed: {
            ...mapState([
                'collapse',
                'activeIndex',
                'permissions'
            ])
        },
        data(){
            return {

            }
        },
        methods:{
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
            handleSelect(key, keyPath){
                this.$store.dispatch('activeIndex', {
                    activeIndex: key
                });
            },
            hasPagePermission(url){
                var flag = false;
                for(var i=0; i<this.permissions.length; i++){
                    if(this.permissions[i].desc == url){
                        flag = true;
                        break;
                    }
                }

                return flag;
            }
        }
    }
</script>
<style lang="scss">
    .lsideWrapper{
        height: 100%;
    }
    .aside-title{
        color: #fff;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: left;
        padding-left: 30px;
        font-size: 20px;
    }
    .el-menu{
        border-right: none;
        height: 100%;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>
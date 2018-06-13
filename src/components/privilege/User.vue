<template>
    <div>
        <PageTitle title="用户管理"></PageTitle>
        <div class="pageWrapper">
            <div class="lookWrapper" v-if="!edit && !editRole">
                <div class="searchWrapper">
                    <el-input placeholder="请输入内容" v-model="searchkey" size="medium">
                        <el-button slot="append" size="medium" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                    <el-button type="primary" size="medium" class="addBtn" icon="el-icon-plus" @click="addUser" v-if="hasPermission('admin/user', 'add')">添加</el-button>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            :index="indexMethod">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="用户名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="邮箱">
                    </el-table-column>
                    <el-table-column
                            prop="desc"
                            label="用户描述">
                    </el-table-column>
                    <el-table-column
                            prop="created_at"
                            label="创建日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="详情"
                            v-if="hasPermission('admin/user', 'add') && hasPermission('admin/user', 'delete') && hasPermission('admin/user', 'update') && hasPermission('admin/user', 'read')"
                            width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.$index, scope.row)" type="text" size="small">用户角色</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" v-if="hasPermission('admin/user', 'update') || hasPermission('admin/user', 'delete')">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    v-if="hasPermission('admin/user', 'update')"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    v-if="hasPermission('admin/user', 'delete')"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="perPage"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>

            <div class="updateWrapper" v-if="edit">
                <div class="title">请填写以下信息</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top" v-loading="loading">
                    <el-form-item label="用户名称" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户描述" prop="desc">
                        <el-input v-model="ruleForm.desc" placeholder="请输入用户描述"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="desc">
                        <el-input v-model="ruleForm.email" placeholder="请输入用户邮箱"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">创建</el-button>
                        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
                        <el-button type="warning" @click="cancelForm()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="updateWrapper" v-if="editRole">
                <div class="title">{{activeUserName}}--用户角色</div>
                <div v-loading="loading" class="userRoleWrapper">
                    <div class="roleItem" v-for="(item, key) in allRoles">
                        <div class="name"><el-checkbox v-model="item.selected">{{item.name}}</el-checkbox></div>
                    </div>
                    <div class="editPermission" v-if="allRoles.length > 0">
                        <el-button type="primary" @click="submitRole()">提交</el-button>
                        <el-button type="warning" @click="cancelRole()">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Table,
        TableColumn,
        Pagination,
        Input,
        Button,
        Form,
        FormItem,
        Checkbox,
        CheckboxGroup,
        Message,
        Loading,
        MessageBox
    } from 'element-ui'
    import PageTitle from '../frame/PageTitle.vue'
    import { checkToken }  from '../ajax';
    import { aesencode, aesdecode }  from '../utils';

    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.use(Loading);
    Vue.prototype.$confirm = MessageBox.confirm;

    export default {
        data(){
            return {
                msg: 'USER',
                currentPage: 1,
                perPage: 10,
                total: 1,
                searchkey: '',
                loading: false,
                edit: false,
                editRole: false,
                activeUserId: '',
                activeUserName: '',
                tableData: [],
                ruleForm: {
                    name: '',
                    desc: '',
                    email: ''
                },
                rules: {
                    name: [
                        { required: true, message: '角色名称', trigger: 'blur' },
                    ],
                    desc: [
                        { required: true, message: '角色描述', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, message: '邮箱描述', trigger: 'blur' },
                    ]
                },
                allRoles: [],
                myRoles: []
            }
        },
        methods:{
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.users();
            },
            addUser(){
                this.edit = true;
                this.activeUserId = '';
                this.activeUserName = '';
                this.ruleForm.name = '';
                this.ruleForm.desc = '';
            },
            submitForm(formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        checkToken(function () {
                            that.loading = true;
                            that.axios.post('/admins/store', {
                                id: that.activeUserId,
                                name: that.ruleForm.name,
                                desc: that.ruleForm.desc,
                                email: that.ruleForm.email,
                                privilege: that.activeUserId ? encodeURIComponent(aesencode('update')) : encodeURIComponent(aesencode('add'))
                            })
                            .then(function (response) {
                                that.loading = false;
                                Message.success({
                                    message: '恭喜你，插入成功'
                                });

                                that.ruleForm.name = '';
                                that.ruleForm.desc = '';
                                that.cancelForm();
                                that.users();
                            })
                            .catch(function (error) {
                                that.loading = false;
                                Message.warning({
                                    message: '警告哦，这是一条警告消息'
                                });
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancelForm(){
                this.edit = false;
            },
            handleClick(index, row) {
                this.editRole = true;
                this.activeUserId = row.id;
                this.activeUserName = row.name;
                this.getUserRoles();
            },
            users(){
                var that = this;
                checkToken(function () {
                    that.loading = true;
                    that.axios.get('/admins', {
                        params : {
                            page : that.currentPage,
                            num: that.perPage,
                            search: that.searchkey,
                            privilege: encodeURIComponent(aesencode('read'))   //js加密后的字符串里面的+被浏览器解析成了空格，php解密的时候会出错，encodeURIComponent解决
                        }
                    })
                    .then(function (response) {
                        if(response.data.code == 0){
                            that.tableData = response.data.data.data;
                            that.total = response.data.data.total;
                        }
                        that.loading = false;
                    })
                    .catch(function (error) {
                        Message.error({
                            message: '未知错误'
                        });
                        that.loading = false;
                    });
                });
            },
            getUserRoles(){
                var that = this;
                checkToken(function () {
                    that.allRoles = [];
                    that.myRoles = [];
                    var url = '/admins/' + that.activeUserId + '/role';
                    that.loading = true;
                    that.axios.get(url, {
                        params: {
                            privilege: encodeURIComponent(aesencode('read'))
                        }
                    })
                    .then(function (response) {
                        if (response.data.code == 0) {
                            for (var i = 0; i < response.data.data.roles.length; i++) {
                                response.data.data.roles[i].selected = false;
                            }
                            that.allRoles = response.data.data.roles;
                            that.myRoles = response.data.data.myRoles;

                            for (var i = 0; i < that.allRoles.length; i++) {
                                for (var j = 0; j < that.myRoles.length; j++) {
                                    if (that.myRoles[j].id == that.allRoles[i].id) {
                                        that.allRoles[i].selected = true;
                                    }
                                }
                            }
                        }
                        that.loading = false;
                    })
                    .catch(function (error) {
                        Message.error({
                            message: '未知错误'
                        });
                        that.loading = false;
                    });
                });
            },
            indexMethod(index){
                return index + 1;
            },
            submitRole(){
                var that = this;
                checkToken(function () {
                    that.loading = true;
                    var url = '/admins/' + that.activeUserId + '/role';

                    var newRoles = [];
                    for (var i = 0; i < that.allRoles.length; i++) {
                        if (that.allRoles[i].selected) {
                            newRoles.push(that.allRoles[i].id);
                        }
                    }

                    if(newRoles.length == 0){
                        Message.warning({
                            message: '请选择角色'
                        });
                        return false;
                    }

                    that.axios.post(url, {
                        roles: newRoles,
                        privilege: encodeURIComponent(aesencode('update'))
                    })
                    .then(function (response) {
                        that.loading = false;
                        Message.success({
                            message: '恭喜你，插入成功'
                        });

                        that.cancelRole();
                        that.getUserRoles();
                    })
                    .catch(function (error) {
                        that.loading = false;
                        Message.warning({
                            message: '未知错误'
                        });
                    });
                });
            },
            cancelRole(){
                this.editRole = false;
            },
            search(){
                this.currentPage = 1;
                this.total = 1;
                this.tableData = [];
                this.users()
            },
            handleEdit(index, row) {
                this.activeUserId = row.id;
                this.activeUserName = row.name;
                this.edit = true;
                this.ruleForm.name = row.name;
                this.ruleForm.desc = row.desc;
                this.ruleForm.email = row.email;
            },
            handleDelete(index, row) {
                var that = this;
                that.$confirm('此操作将删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    checkToken(function () {
                        that.loading = true;
                        that.axios.post('/admins/delete', {
                            id: row.id,
                            privilege: encodeURIComponent(aesencode('delete'))
                        })
                        .then(function (response) {
                            that.loading = false;
                            Message.success({
                                message: '恭喜你，删除成功'
                            });

                            that.currentPage = 1;
                            that.total = 1;
                            that.tableData = [];
                            that.users();
                        })
                        .catch(function (error) {
                            that.loading = false;
                            Message.warning({
                                message: '删除失败'
                            });
                        });
                    });
                }).catch((error) => {

                });
            }
        },
        components: {
            PageTitle
        },
        mounted() {
            this.users();
        }
    }
</script>
<style scoped>
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
    .userRoleWrapper{
        padding-top: 12px;
    }
    .roleItem{
        margin-right: 25px;
        margin-bottom: 15px;
        display: inline-block;
    }
    .privilegeItem .name{
        text-align: center;
        font-weight: 700;
    }
    .el-checkbox+.el-checkbox{
        margin-left: 20px;
    }
</style>
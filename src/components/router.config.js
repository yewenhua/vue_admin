import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/'

import Frame from './frame/Frame.vue'
import Privilege from './privilege/Privilege.vue'
import Role from './privilege/Role.vue'
import User from './privilege/User.vue'
import Login from './personal/Login.vue'
import Personal from './personal/Personal.vue'

import Agent from './page/Agent.vue'
import Department from './page/Department.vue'
import Download from './page/Download.vue'
import Log from './page/Log.vue'
import Manager from './page/Manager.vue'
import Money from './page/Money.vue'
import Navigate from './page/Navigate.vue'
import Order from './page/Order.vue'
import Question from './page/Question.vue'
import Tiaoma from './page/Tiaoma.vue'
import Zhaopin from './page/Zhaopin.vue'
import Userinfo from './page/Userinfo.vue'
import Chgpwd from './page/Chgpwd.vue'
import Viplist from './page/Viplist.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/admin',
        component: Frame,
        children: [
            {
                path: 'privilege',
                component: Privilege,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'role',
                component: Role,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'user',
                component: User,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'agent',
                component: Agent,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'department',
                component: Department,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'download',
                component: Download,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'log',
                component: Log,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'manager',
                component: Manager,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'money',
                component: Money,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'navigate',
                component: Navigate,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'order',
                component: Order,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'question',
                component: Question,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'tiaoma',
                component: Tiaoma,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'zhaopin',
                component: Zhaopin,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'info',
                component: Userinfo,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'chgpwd',
                component: Chgpwd,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
            {
                path: 'viplist',
                component: Viplist,
                meta: {
                    requireAuth: true,
                    agent: 'pc'
                }
            },
        ]
    },
    {
        path: '/personal',
        component: Personal,
        children: [
            {
                path: 'login',
                component: Login,
                meta: {
                    requireAuth: false,
                    agent: 'pc'
                }
            },
        ]
    },
    {
        path: '*',
        redirect: '/admin/user'
    }
];

/*
 * 新建一个方法  当new Router时，实例就包含goBack方法
 * 可用this.$router.goBack()调用
 */
VueRouter.prototype.goBack = function () {
    this.isBack = true;
    this.go(-1);
}

const router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    routes
});

router.beforeEach((to, from, next) => {
    store.dispatch('showLoading');
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: '/personal/login',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
});

router.afterEach(function (to) {
    store.dispatch('hideLoading')
});

export default router;



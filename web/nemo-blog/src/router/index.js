import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index.vue'
import login from '@/components/login.vue'
import register from '@/components/register.vue'
import publish from '@/components/publish.vue'
import list from '@/components/list.vue'
import detail from '@/components/detail.vue'
import my from '@/components/my.vue'
import about from '@/components/about';
import chat from '@/components/chat';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: list
    },{
    	path: '/login',
    	name: 'login',
    	component: login
    },{
    	path: '/register',
    	name: 'register',
    	component: register
    },{
      path:'/publish/:id',
      name: 'publish',
      component: publish,
    },{
      path:'/list',
      name: 'list',
      component: list
    },{
      path: '/detail/:id',
      name: 'detail',
      component: detail
    },{
      path: '/my',
      name: 'my',
      component: my
    },{
      path: '/about',
      name: 'about',
      component: about,
    },{
      path: '/chat',
      name: 'chat',
      component: chat
    }

  ]
})

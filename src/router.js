/**
 * Created by xhl on 2016/10/17.
 * Description : 路由列表
 */
export const routes = [
  {
    path: '/',
    name: 'circleScience',
    component: resolve => require(['./views/circle/science'], resolve)
  },
  {
    path: '/science',
    name: 'circleScience',
    component: resolve => require(['./views/circle/science'], resolve)
  }
]

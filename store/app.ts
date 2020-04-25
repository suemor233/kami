import {} from '@fortawesome/free-brands-svg-icons'
import {
  faBook,
  faFlask,
  faHome,
  faMusic,
  faPen,
  faStar,
  faTv,
  faComments,
} from '@fortawesome/free-solid-svg-icons'
import { action, observable, computed } from 'mobx'
import { MenuModel, PageModel, ViewportRecord } from './types'
import configs from 'configs'
import { Seo } from 'models/aggregate'

export default class AppStore {
  @observable menu: MenuModel[] = [
    {
      _id: '1',
      title: '主页',
      type: 'Home',
      path: '/',
      icon: faHome,
      subMenu: [],
    },
    {
      _id: '2',
      title: '博文',
      type: 'Post',
      path: '/posts',
      icon: faBook,
    },
    {
      _id: '3',
      title: '日记',
      type: 'Note',
      path: '/notes',
      icon: faPen,
    },
    {
      _id: '4',
      title: '说说',
      type: 'Custom',
      path: '/says',
      icon: faComments,
    },
    {
      _id: '5',
      title: '项目',
      icon: faFlask,
      path: '/project',
      type: 'Project',
    },
    {
      _id: '6',
      title: '兴趣',
      icon: faStar,
      path: '/music',
      type: 'Custom',
      subMenu: [
        {
          _id: '6-1',
          title: '音乐',
          icon: faMusic,
          path: '/music',
          type: 'Music',
        },
        {
          _id: '6-2',
          title: '追番',
          icon: faTv,
          path: 'bangumi',
          type: 'Bangumi',
        },
      ],
    },
  ]

  @observable viewport: Partial<ViewportRecord> = {}
  @observable loading = false
  @observable position = 0

  @observable config = { seo: {} as Seo } as any

  @action updatePosition() {
    this.position = document.documentElement.scrollTop
  }

  @computed get isOverflow() {
    if (typeof window === 'undefined') {
      return false
    }
    return this.position > window.innerHeight || this.position > screen.height
  }

  @action toggleLoading() {
    document.body.classList.toggle('loading')
    this.loading = !this.loading
  }

  @action setMenu(menu: MenuModel[]) {
    this.menu = menu
  }

  @action setPage(pages: PageModel[]) {
    const homeMenu = this.menu.find((menu) => menu.type === 'Home')
    const models: MenuModel[] = pages.map((page) => {
      const { title, _id, slug } = page
      return {
        title,
        _id,
        path: '/' + slug,
        type: 'Page',
      }
    })

    homeMenu?.subMenu!.push(...models)
  }
  @action UpdateViewport() {
    this.viewport = {
      w: document.documentElement.getBoundingClientRect().width,
      h: window.innerHeight,
      mobile: window.screen.width <= 568 || window.innerWidth <= 568,
      pad: window.innerWidth <= 768 && window.innerWidth > 568,
      hpad: window.innerWidth <= 1024 && window.innerWidth > 768,
      wider: window.innerWidth > 1024 && window.innerWidth < 1920,
      widest: window.innerWidth >= 1920,
    }
  }
  @action setConfig(config: any) {
    this.config = config
  }
  @computed get seo() {
    return this.config.seo || {}
  }
  @computed get title() {
    return this.seo?.title || configs.title || 'MX-space'
  }
  @computed get description() {
    return this.seo.description
  }
}

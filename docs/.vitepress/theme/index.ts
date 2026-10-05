import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import 'virtual:group-icons.css'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

import {
  InjectionKey,
  LayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  SpotlightStyle,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { h } from 'vue'

import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () =>
        h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  setup() {
    const route = useRoute()
    const initZoom = () =>
      mediumZoom('.vp-doc img:not(.no-zoom)', { background: 'var(--vp-c-bg)' })

    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
  enhanceApp({ app }) {
    app.provide(InjectionKey, {
      // Highlight the hovered line so readers can keep their place.
      spotlight: {
        defaultToggle: true,
        defaultStyle: SpotlightStyle.Aside,
      },
      layoutSwitch: {
        // Default to the full-width layout (sidebar and content expand).
        defaultMode: LayoutMode.FullWidth,
      },
    })
  },
}

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import 'virtual:group-icons.css'
import DefaultTheme from 'vitepress/theme'

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
  enhanceApp({ app }) {
    app.provide(InjectionKey, {
      // Highlight the hovered line so readers can keep their place.
      spotlight: {
        defaultToggle: true,
        defaultStyle: SpotlightStyle.Aside,
      },
      layoutSwitch: {
        // Keep both sliders visible by default.
        defaultMode: LayoutMode.BothWidthAdjustable,
      },
    })
  },
}

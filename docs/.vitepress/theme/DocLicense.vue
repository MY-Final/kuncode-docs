<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const isEnglish = computed(() => String(lang.value).startsWith('en'))

const startYear = 2023
const currentYear = new Date().getFullYear()
const yearRange =
  currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`

const disclaimerUrl = computed(() => (isEnglish.value ? '/en/disclaimer' : '/disclaimer'))
const disclaimerText = computed(() => (isEnglish.value ? 'Disclaimer' : '免责声明'))

const licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
const licenseName = computed(() => (isEnglish.value ? 'CC BY-SA 4.0' : 'CC-BY-SA-4.0'))
const prefix = computed(() => (isEnglish.value ? 'Released under the ' : '在 '))
const suffix = computed(() => (isEnglish.value ? ' license' : ' 许可下发布'))
</script>

<template>
  <div class="doc-license">
    <p class="license-line">
      {{ prefix }}<a
        :href="licenseUrl"
        target="_blank"
        rel="license noopener"
      >{{ licenseName }}</a>{{ suffix }}
    </p>
    <p class="license-line">Copyright © {{ yearRange }} final</p>
    <p class="license-line">
      <a :href="disclaimerUrl">{{ disclaimerText }}</a>
    </p>
  </div>
</template>

<style scoped>
.doc-license {
  margin-top: 32px;
  padding: 24px 24px 32px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.license-line {
  margin: 0;
}

.doc-license a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.doc-license a:hover {
  color: var(--vp-c-text-1);
}
</style>
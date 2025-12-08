<script lang="ts" setup>
import { computed } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { $t } from '#/locales';

const appName = computed(() => preferences.app.name);
const logoDark = computed(() => preferences.logo.sourceWithTitleDark);
const logoLight = computed(() => preferences.logo.sourceWithTitleLight);
const logoSize = computed(() => preferences.logo.size);
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo-dark="logoDark"
    :logo-light="logoLight"
    :logo-size="logoSize"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>

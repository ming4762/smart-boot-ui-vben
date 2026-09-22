<script lang="ts" setup>
import type { ReleaseNote } from '@smart/common/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { SmartMarkdown } from '@vben/plugins/smart-markdown';
import { formatDateTime } from '@vben/utils';

import {
  listReleaseNotesApi,
  markReleaseNotesReadApi,
} from '@smart/common/api';

const notes = ref<ReleaseNote[]>([]);
const currentId = ref<number>();

const currentNote = computed(
  () =>
    notes.value.find((item) => item.id === currentId.value) ?? notes.value[0],
);

const [Drawer] = useVbenDrawer({
  async onOpenChange(open) {
    if (!open) {
      return;
    }
    notes.value = await listReleaseNotesApi();
    currentId.value = notes.value[0]?.id;
    const publishSequence = notes.value[0]?.publishSequence;
    if (publishSequence) {
      await markReleaseNotesReadApi(publishSequence);
    }
  },
  class: 'w-[680px] max-w-full',
  footer: false,
});
</script>

<template>
  <Drawer title="更新日志">
    <div class="flex h-full min-h-0">
      <aside class="w-48 shrink-0 overflow-y-auto border-r pr-3">
        <button
          v-for="note in notes"
          :key="note.id"
          class="mb-2 w-full rounded px-3 py-2 text-left hover:bg-accent"
          :class="currentNote?.id === note.id ? 'bg-accent' : ''"
          type="button"
          @click="currentId = note.id"
        >
          <div class="font-medium">v{{ note.version }}</div>
          <div class="truncate text-xs text-muted-foreground">
            {{ note.title }}
          </div>
        </button>
      </aside>
      <main v-if="currentNote" class="min-w-0 flex-1 overflow-y-auto pl-6">
        <h2 class="text-xl font-semibold">
          v{{ currentNote.version }} · {{ currentNote.title }}
        </h2>
        <p class="mb-4 mt-1 text-sm text-muted-foreground">
          {{ formatDateTime(currentNote.publishedTime) }}
        </p>
        <SmartMarkdown :value="currentNote.content" mode="preview" />
      </main>
      <main
        v-else
        class="flex flex-1 items-center justify-center text-muted-foreground"
      >
        暂无已发布更新
      </main>
    </div>
  </Drawer>
</template>

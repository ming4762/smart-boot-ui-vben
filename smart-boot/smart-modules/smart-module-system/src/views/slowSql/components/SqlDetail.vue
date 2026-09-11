<script setup lang="ts">
import type { SlowSqlDetail } from '../SmartMonitorSlowSqlListView.api';

import { computed } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { formatDateTime } from '@vben/utils';

import { Tag } from 'antdv-next';

interface Props {
  detail?: SlowSqlDetail;
}

const props = defineProps<Props>();

const EMPTY_VALUE = '-';

const formatJson = (value?: string) => {
  if (!value) {
    return EMPTY_VALUE;
  }
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const parseStringArray = (value?: string) => {
  if (!value) {
    return [];
  }
  try {
    const result: unknown = JSON.parse(value);
    return Array.isArray(result) ? result.map(String) : [value];
  } catch {
    return [value];
  }
};

const formattedUseTime = computed(() => {
  const useTime = props.detail?.useTime;
  if (useTime === undefined) {
    return EMPTY_VALUE;
  }
  return useTime >= 1000 ? `${(useTime / 1000).toFixed(2)} s` : `${useTime} ms`;
});

const useTimeLevel = computed(() => {
  const useTime = props.detail?.useTime ?? 0;
  if (useTime >= 5000) {
    return 'critical';
  }
  if (useTime >= 1000) {
    return 'warning';
  }
  return 'normal';
});

const formattedParameter = computed(() => formatJson(props.detail?.parameter));
const columns = computed(() => parseStringArray(props.detail?.columnList));
</script>

<template>
  <div v-if="detail" class="sql-detail">
    <section class="summary-grid" aria-label="SQL执行摘要">
      <div class="summary-card duration-card" :data-level="useTimeLevel">
        <span class="summary-icon" aria-hidden="true">
          <IconifyIcon icon="lucide:gauge" />
        </span>
        <div>
          <div class="summary-label">执行耗时</div>
          <div class="duration-value">{{ formattedUseTime }}</div>
          <div class="summary-hint">原始值 {{ detail.useTime }} ms</div>
        </div>
      </div>

      <div class="summary-card">
        <span class="summary-icon" aria-hidden="true">
          <IconifyIcon icon="lucide:database" />
        </span>
        <div class="summary-content">
          <div class="summary-label">数据源</div>
          <div class="summary-value" :title="detail.datasourceName">
            {{ detail.datasourceName || EMPTY_VALUE }}
          </div>
          <Tag class="summary-tag" color="blue">{{ detail.dbType }}</Tag>
        </div>
      </div>

      <div class="summary-card">
        <span class="summary-icon" aria-hidden="true">
          <IconifyIcon icon="lucide:clock-3" />
        </span>
        <div class="summary-content">
          <div class="summary-label">执行时间</div>
          <div class="summary-value">
            {{ formatDateTime(detail.timestamp) || EMPTY_VALUE }}
          </div>
          <div class="summary-hint">SQL ID: {{ detail.sqlId }}</div>
        </div>
      </div>
    </section>

    <section class="detail-section">
      <header class="section-header">
        <IconifyIcon aria-hidden="true" icon="lucide:code-2" />
        <h3>SQL 语句</h3>
      </header>
      <pre
        class="code-block sql-code"
      ><code>{{ detail.sqlText || EMPTY_VALUE }}</code></pre>
    </section>

    <div class="content-grid">
      <section class="detail-section">
        <header class="section-header">
          <IconifyIcon aria-hidden="true" icon="lucide:braces" />
          <h3>执行参数</h3>
        </header>
        <pre class="code-block"><code>{{ formattedParameter }}</code></pre>
      </section>

      <section class="detail-section">
        <header class="section-header">
          <IconifyIcon aria-hidden="true" icon="lucide:columns-3" />
          <h3>涉及字段</h3>
          <span class="section-count">{{ columns.length }}</span>
        </header>
        <div class="column-list">
          <Tag v-for="column in columns" :key="column" class="column-tag">
            {{ column }}
          </Tag>
          <span v-if="columns.length === 0" class="empty-text">{{
            EMPTY_VALUE
          }}</span>
        </div>
      </section>
    </div>

    <section class="metadata-section" aria-label="记录信息">
      <div class="metadata-item">
        <span>记录 ID</span>
        <strong>{{ detail.id }}</strong>
      </div>
      <div class="metadata-item">
        <span>创建人</span>
        <strong>{{ detail.createBy || EMPTY_VALUE }}</strong>
      </div>
      <div class="metadata-item">
        <span>创建用户 ID</span>
        <strong>{{ detail.createUserId }}</strong>
      </div>
      <div class="metadata-item">
        <span>记录时间</span>
        <strong>{{ formatDateTime(detail.createTime) || EMPTY_VALUE }}</strong>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sql-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: hsl(var(--foreground));
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  display: flex;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
}

.summary-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: hsl(var(--primary));
  background: hsl(var(--primary) / 10%);
  border-radius: 9px;
}

.summary-content {
  min-width: 0;
}

.summary-label,
.summary-hint {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

.summary-label {
  margin-bottom: 4px;
}

.summary-value,
.duration-value {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: hsl(var(--foreground));
  white-space: nowrap;
}

.duration-value {
  font-size: 22px;
}

.summary-hint {
  margin-top: 4px;
}

.summary-tag {
  margin-top: 5px;
  text-transform: uppercase;
}

.duration-card[data-level='warning'] .summary-icon,
.duration-card[data-level='warning'] .duration-value {
  color: hsl(var(--warning));
}

.duration-card[data-level='warning'] .summary-icon {
  background: hsl(var(--warning) / 10%);
}

.duration-card[data-level='critical'] .summary-icon,
.duration-card[data-level='critical'] .duration-value {
  color: hsl(var(--destructive));
}

.duration-card[data-level='critical'] .summary-icon {
  background: hsl(var(--destructive) / 10%);
}

.detail-section {
  overflow: hidden;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
}

.section-header {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 42px;
  padding: 0 14px;
  color: hsl(var(--muted-foreground));
  border-bottom: 1px solid hsl(var(--border));
}

.section-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.section-count {
  min-width: 20px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  background: hsl(var(--muted));
  border-radius: 10px;
}

.code-block {
  min-height: 96px;
  max-height: 240px;
  padding: 14px 16px;
  margin: 0;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.7;
  color: hsl(var(--foreground));
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  background: hsl(var(--muted) / 55%);
}

.sql-code {
  min-height: auto;
  font-size: 14px;
  color: hsl(var(--primary));
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 12px;
}

.column-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
  min-height: 96px;
  padding: 14px;
}

.column-tag {
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.empty-text {
  color: hsl(var(--muted-foreground));
}

.metadata-section {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  background: hsl(var(--border));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 12px 14px;
  background: hsl(var(--card));
}

.metadata-item span {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

.metadata-item strong {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .summary-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .metadata-section {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

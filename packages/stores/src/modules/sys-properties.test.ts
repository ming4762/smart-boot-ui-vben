import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useSysPropertiesStore } from './sys-properties';

describe('useSysPropertiesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('defaults authMode to JWT', () => {
    const store = useSysPropertiesStore();

    expect(store.authMode).toBe('JWT');
    expect(store.isJwtAuthMode).toBe(true);
    expect(store.isSessionAuthMode).toBe(false);
  });

  it('uses SESSION auth mode from backend properties', () => {
    const store = useSysPropertiesStore();

    store.setProperties({ authMode: 'SESSION' });

    expect(store.authMode).toBe('SESSION');
    expect(store.isJwtAuthMode).toBe(false);
    expect(store.isSessionAuthMode).toBe(true);
  });
});

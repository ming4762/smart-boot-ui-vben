import type { Diagnostic } from '@codemirror/lint';

import { EditorView } from '@codemirror/view';

/**
 * 跳过空字符串的检验
 * @param originalLinter
 */
const nullParseLinter2 = (
  originalLinter: () => (view: EditorView) => Diagnostic[],
) => {
  return (view: EditorView) => {
    const text = view.state.doc.toString();
    if (!text || text.length === 0) {
      return [];
    }
    return originalLinter()(view);
  };
};

export default nullParseLinter2;

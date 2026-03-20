import { InputRule } from '@tiptap/core';
import { HorizontalRule as TipTapHorizontalRule } from '@tiptap/extension-horizontal-rule';

export const HorizontalRule = TipTapHorizontalRule.extend({
  addAttributes() {
    return {
      size: {
        default: 32,
        parseHTML: (element) => Number(element.getAttribute('data-size') || 32),
        renderHTML: (attributes) => ({
          'data-size': attributes.size,
        }),
      },
    };
  },
  addInputRules() {
    return [
      new InputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        handler: ({ state, range }) => {
          const attributes = {};

          const { tr } = state;
          const start = range.from;
          const end = range.to;

          tr.insert(start - 1, this.type.create(attributes)).delete(
            tr.mapping.map(start),
            tr.mapping.map(end)
          );
        },
      }),
    ];
  },
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mly:relative mly-divider-node',
      },
    };
  },
});

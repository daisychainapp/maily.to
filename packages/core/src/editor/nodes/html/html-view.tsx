import { cn } from '@/editor/utils/classname';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { HtmlCodeBlockAttributes } from './html';

export function HTMLCodeBlockView(props: NodeViewProps) {
  const { node } = props;

  const { language } = node.attrs as HtmlCodeBlockAttributes;

  const languageClass = language ? `language-${language}` : '';

  return (
    <NodeViewWrapper
      draggable={false}
      data-drag-handle={false}
      data-type="htmlCodeBlock"
    >
      <pre className="mly-html-code-pre">
        <NodeViewContent
          as="code"
          className={cn('is-editable', languageClass)}
        />
      </pre>
    </NodeViewWrapper>
  );
}

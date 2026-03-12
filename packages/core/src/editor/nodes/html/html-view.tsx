import { cn } from '@/editor/utils/classname';
import { useMailyContext } from '@/editor/provider';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { HtmlCodeBlockAttributes } from './html';

const escapeLiquidDoubleQuoted = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

export function HTMLCodeBlockView(props: NodeViewProps) {
  const { node, updateAttributes } = props;
  const { htmlPreviewRenderer } = useMailyContext();
  const previewHostRef = useRef<HTMLDivElement | null>(null);
  const previewRequestIdRef = useRef(0);

  let { language, activeTab = 'code' } = node.attrs as HtmlCodeBlockAttributes;
  activeTab ||= 'code';

  const languageClass = language ? `language-${language}` : '';

  const html = (() => {
    const text = node.content.content.reduce((acc, cur) => {
      if (cur.type.name === 'text') {
        return acc + cur.text;
      } else if (cur.type.name === 'variable') {
        const { id: variable, fallback } = cur?.attrs || {};
        const formattedVariable = fallback
          ? `{{${variable} | default: "${escapeLiquidDoubleQuoted(String(fallback))}"}}`
          : `{{${variable}}}`;
        return acc + formattedVariable;
      }

      return acc;
    }, '');

    const htmlParser = new DOMParser();
    const htmlDoc = htmlParser.parseFromString(text, 'text/html');
    const style = htmlDoc.querySelectorAll('style');
    const body = htmlDoc.body;
    const combinedStyle = Array.from(style)
      .map((s) => s.innerHTML)
      .join('\n');

    const bodyHtml = body.innerHTML;
    return combinedStyle.trim().length > 0
      ? `<style>${combinedStyle}</style>${bodyHtml}`
      : bodyHtml;
  })();

  const [renderedHtml, setRenderedHtml] = useState(html);

  useEffect(() => {
    let mounted = true;

    const renderPreview = async () => {
      if (activeTab !== 'preview') {
        return;
      }

      if (!htmlPreviewRenderer) {
        setRenderedHtml(html);
        return;
      }

      const requestId = previewRequestIdRef.current + 1;
      previewRequestIdRef.current = requestId;

      try {
        const backendHtml = await htmlPreviewRenderer(html);
        if (mounted && requestId === previewRequestIdRef.current) {
          setRenderedHtml(backendHtml || '');
        }
      } catch {
        if (mounted && requestId === previewRequestIdRef.current) {
          setRenderedHtml('');
        }
      }
    };

    renderPreview();
    return () => {
      mounted = false;
    };
  }, [activeTab, html, htmlPreviewRenderer]);

  useEffect(() => {
    if (activeTab !== 'preview') return;

    const host = previewHostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });

    if (shadow.adoptedStyleSheets.length === 0) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`
        * { font-family: 'Inter', sans-serif; }
        blockquote, h1, h2, h3, img, li, ol, p, ul {
          margin-top: 0;
          margin-bottom: 0;
        }
      `);
      shadow.adoptedStyleSheets = [sheet];
    }

    const container =
      (shadow.querySelector('[data-mly-html-preview-root]') as HTMLDivElement | null)
      || document.createElement('div');
    container.setAttribute('data-mly-html-preview-root', 'true');
    container.innerHTML = renderedHtml;
    if (!container.parentElement) {
      shadow.appendChild(container);
    }
  }, [activeTab, renderedHtml]);

  const isEmpty = renderedHtml === '';

  return (
    <NodeViewWrapper
      draggable={false}
      data-drag-handle={false}
      data-type="htmlCodeBlock"
    >
      {activeTab === 'code' && (
        <pre className="mly-html-code-pre">
          <NodeViewContent
            as="code"
            className={cn('is-editable', languageClass)}
          />
        </pre>
      )}

      {activeTab === 'preview' && (
        <div
          className={cn(
            'mly-html-preview',
            isEmpty && 'mly-html-preview-empty'
          )}
          ref={(node) => {
            previewHostRef.current = node;
          }}
          contentEditable={false}
          onClick={() => {
            if (!isEmpty) {
              return;
            }

            updateAttributes({
              activeTab: 'code',
            });
          }}
        />
      )}
    </NodeViewWrapper>
  );
}

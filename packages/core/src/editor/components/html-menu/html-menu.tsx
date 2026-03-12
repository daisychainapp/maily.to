import { cn } from '@/editor/utils/classname';
import { BubbleMenu } from '@tiptap/react';
import { CodeXmlIcon, ViewIcon } from 'lucide-react';
import { useCallback } from 'react';
import { sticky } from 'tippy.js';
import { getRenderContainer } from '../../utils/get-render-container';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useHtmlState } from './use-html-state';

export function HTMLBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const state = useHtmlState(editor);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'htmlCodeBlock');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      return editor.isActive('htmlCodeBlock');
    },
    tippyOptions: {
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      appendTo: () => appendTo?.current,
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: 'auto',
    },
    pluginKey: 'htmlCodeBlockBubbleMenu',
  };

  const { activeTab = 'code' } = state;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly:flex mly:items-stretch mly:rounded-lg mly:border mly:border-gray-200 mly:bg-white mly:p-0.5 mly:shadow-md"
    >
      <TooltipProvider>
        <div className="mly-html-tab-container mly:flex mly:items-center mly:h-7 mly:overflow-hidden mly:rounded-md mly:bg-soft-gray">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'mly-html-tab-button mly:flex mly:size-6 mly:shrink-0 mly:items-center mly:justify-center mly:rounded mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-gray-400 mly:focus-visible:ring-offset-2',
                  activeTab === 'code' && 'mly:bg-white'
                )}
                data-active={activeTab === 'code' ? 'true' : 'false'}
                disabled={activeTab === 'code'}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .updateHtmlCodeBlock({
                      activeTab: 'code',
                    })
                    .run();
                }}
              >
                <CodeXmlIcon className="mly:size-3 mly:shrink-0 mly:stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>HTML Code</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'mly-html-tab-button mly:flex mly:size-6 mly:shrink-0 mly:items-center mly:justify-center mly:rounded mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-gray-400 mly:focus-visible:ring-offset-2',
                  activeTab === 'preview' && 'mly:bg-white'
                )}
                data-active={activeTab === 'preview' ? 'true' : 'false'}
                disabled={activeTab === 'preview'}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .updateHtmlCodeBlock({
                      activeTab: 'preview',
                    })
                    .run();
                }}
              >
                <ViewIcon className="mly:size-3 mly:shrink-0 mly:stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Preview</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </BubbleMenu>
  );
}

import { BubbleMenu } from '@tiptap/react'
import { useMemo } from 'react'

import { spacing } from '@/editor/utils/spacing'
import { BubbleMenuButton } from '../bubble-menu-button'
import {
  BubbleMenuItem,
  EditorBubbleMenuProps,
} from '../text-menu/text-bubble-menu'
import { TooltipProvider } from '../ui/tooltip'

export function DividerBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props
  if (!editor) {
    return null
  }

  const items: BubbleMenuItem[] = useMemo(
    () =>
      spacing.map((space) => {
        const { value: size, short: name } = space
        return {
          name,
          isActive: () => editor.isActive('horizontalRule', { size }),
          command: () => {
            editor.chain().focus().updateAttributes('horizontalRule', { size }).run()
          },
        }
      }),
    [editor]
  )

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      if (!editor.isEditable) {
        return false
      }

      return editor.isActive('horizontalRule')
    },
    tippyOptions: {
      maxWidth: '100%',
      moveTransition: 'mly:transform 0.15s mly:ease-out',
    },
  }

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="menu-surface mly:flex mly:gap-0.5 mly:rounded-lg mly:border mly:border-gray-200 mly:bg-white mly:p-0.5 mly:shadow-md"
    >
      <TooltipProvider>
        {items.map((item, index) => (
          <BubbleMenuButton
            key={index}
            className="!mly:h-7 mly:w-7 mly:shrink-0 mly:p-0"
            iconClassName="mly:w-3 mly:h-3"
            nameClassName="mly:text-xs"
            {...item}
          />
        ))}
      </TooltipProvider>
    </BubbleMenu>
  )
}

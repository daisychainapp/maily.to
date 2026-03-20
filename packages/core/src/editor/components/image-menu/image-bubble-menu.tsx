import { AllowedLogoSize, allowedLogoSize } from '@/editor/nodes/logo/logo';
import { borderRadius } from '@/editor/utils/border-radius';
import { BubbleMenu } from '@tiptap/react';
import { LockIcon, LockOpenIcon } from 'lucide-react';
import { sticky } from 'tippy.js';
import { AlignmentSwitch } from '../alignment-switch';
import { BubbleMenuButton } from '../bubble-menu-button';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import { Select } from '../ui/select';
import { TooltipProvider } from '../ui/tooltip';
import { useImageState } from './use-image-state';

export function ImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;
  if (!editor) {
    return null;
  }

  const state = useImageState(editor);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }

      return editor.isActive('logo') || editor.isActive('image');
    },
    tippyOptions: {
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: '100%',
    },
  };

  const { lockAspectRatio } = state;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="menu-surface image-menu-surface mly:flex mly:rounded-lg mly:border mly:border-gray-200 mly:bg-white mly:p-0.5 mly:shadow-md"
    >
      <TooltipProvider>
        {state.isLogoActive && state.imageSrc && (
          <>
            <Select
              label="Size"
              tooltip="Size"
              value={state.logoSize}
              options={allowedLogoSize.map((size) => ({
                value: size,
                label: size,
              }))}
              onValueChange={(value) => {
                editor
                  ?.chain()
                  .focus()
                  .setLogoAttributes({ size: value as AllowedLogoSize })
                  .run();
              }}
            />

            <Divider />
          </>
        )}

        <div className="menu-inline-gap mly:flex mly:gap-x-0.5">
          <AlignmentSwitch
            alignment={state.alignment}
            onAlignmentChange={(alignment) => {
              const isCurrentNodeImage = state.isImageActive;
              if (!isCurrentNodeImage) {
                editor?.chain().focus().setLogoAttributes({ alignment }).run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .updateAttributes('image', { alignment })
                  .run();
              }
            }}
          />

        </div>

        {state.isImageActive && state.imageSrc && (
          <>
            <Divider />

            <Select
              label="Border Radius"
              value={state?.borderRadius}
              options={borderRadius.map((value) => ({
                value: String(value.value),
                label: value.name,
              }))}
              onValueChange={(value) => {
                editor
                  ?.chain()
                  .updateAttributes('image', {
                    borderRadius: Number(value),
                  })
                  .run();
              }}
              tooltip="Border Radius"
              className="mly:capitalize"
            />

            <div className="menu-inline-gap mly:flex mly:gap-x-0.5">
              <BubbleMenuButton
                isActive={() => lockAspectRatio}
                command={() => {
                  const width = Number(state.width) || 0;
                  const height = Number(state.height) || 0;
                  const aspectRatio = width / height;

                  editor
                    ?.chain()
                    .updateAttributes('image', {
                      lockAspectRatio: !lockAspectRatio,
                      aspectRatio,
                    })
                    .run();
                }}
                icon={lockAspectRatio ? LockIcon : LockOpenIcon}
                tooltip="Lock Aspect Ratio"
              />
            </div>
          </>
        )}
      </TooltipProvider>
    </BubbleMenu>
  );
}

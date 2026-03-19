import { BaseButton } from '@/editor/components/base-button';
import { cn } from '@/editor/utils/classname';
import { BubbleMenuItem } from './text-menu/text-bubble-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function BubbleMenuButton(item: BubbleMenuItem) {
  const { tooltip } = item;

  const content = (
    <BaseButton
      variant="ghost"
      size="sm"
      {...(item.command ? { onClick: item.command } : {})}
      data-state={item?.isActive?.()}
      className={cn(
        'mly:size-7! mly:px-2.5 mly:disabled:cursor-not-allowed',
        item?.className
      )}
      type="button"
      disabled={item.disbabled}
    >
      {item.icon ? (
        <item.icon
          className={cn(
            'mly:h-3 mly:w-3 mly:shrink-0 mly:stroke-[2.5]',
            item?.iconClassName
          )}
        />
      ) : (
        <span
          className={cn(
            'mly:text-sm mly:font-medium mly:text-slate-600',
            item?.nameClassName
          )}
        >
          {item.name}
        </span>
      )}
    </BaseButton>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          sideOffset={8}
          className="mly:border-gray-300 mly:bg-transparent mly:p-0 mly:text-gray-700 mly:shadow-sm"
        >
          <span className="mly:block mly:rounded-md mly:bg-soft-gray mly:!px-2 mly:!py-1.5">
            {tooltip}
          </span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

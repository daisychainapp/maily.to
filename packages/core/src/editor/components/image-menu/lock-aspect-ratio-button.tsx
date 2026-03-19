import { LockIcon, LockOpenIcon } from 'lucide-react';
import { BaseButton } from '../base-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type LockAspectRatioButtonProps = {
  onClick: () => void;
  isLocked: boolean;
};

export function LockAspectRatioButton(props: LockAspectRatioButtonProps) {
  const { onClick, isLocked } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BaseButton
          variant="ghost"
          size="sm"
          type="button"
          className="mly:size-7"
          data-state={isLocked}
          onClick={onClick}
        >
          {isLocked ? (
            <LockIcon className="mly:h-3 mly:w-3 mly:shrink-0 mly:stroke-[2.5] mly:text-midnight-gray" />
          ) : (
            <LockOpenIcon className="mly:h-3 mly:w-3 mly:shrink-0 mly:stroke-[2.5] mly:text-midnight-gray" />
          )}
        </BaseButton>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={8}
        className="mly:border-gray-300 mly:bg-transparent mly:p-0 mly:text-gray-700 mly:shadow-sm"
      >
        <span className="mly:block mly:rounded-md mly:bg-soft-gray mly:!px-2 mly:!py-1.5">
          {isLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}

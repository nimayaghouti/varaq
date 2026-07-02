'use client';

import { Pencil, X } from 'lucide-react';

import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

interface EditableSectionProps {
  title: string;
  description: string;
  summary: ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
  children: (close: () => void) => ReactNode;
}

export function EditableSection({
  title,
  description,
  summary,
  disabled = false,
  disabledMessage,
  children,
}: EditableSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="pt-1">{summary}</div>
        </div>

        {!disabled && (
          <Button
            type="button"
            variant={open ? 'destructive' : 'outline'}
            size="sm"
            className="rounded-lg shrink-0 cursor-pointer"
            onClick={() => setOpen(o => !o)}
          >
            {open ? (
              <>
                <X className="size-4 ml-1" /> انصراف
              </>
            ) : (
              <>
                <Pencil className="size-4 ml-1" /> ویرایش
              </>
            )}
          </Button>
        )}
      </div>

      {disabled && disabledMessage && (
        <p className="text-xs text-muted-foreground mt-3">{disabledMessage}</p>
      )}

      {!disabled && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent>
            <div className="pt-4 mt-4 border-t border-border/50">
              {children(() => setOpen(false))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

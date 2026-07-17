'use client';

import { Plus } from 'lucide-react';

import { useState } from 'react';

import { BookForm } from '@/components/admin/BookForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AddBookDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer font-bold rounded-xl">
          <Plus className="size-4" /> افزودن کتاب جدید
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-150 font-sans max-h-[90vh] overflow-y-auto px-0"
        dir="rtl"
        showCloseButton={false}
      >
        <ScrollArea dir="rtl" className="h-[80vh] p-4">
          <DialogHeader>
            <DialogTitle className="text-right text-xl px-2">
              مشخصات کتاب جدید
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <BookForm onSuccess={() => setOpen(false)} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

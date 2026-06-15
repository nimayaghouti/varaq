'use client';

import { AlertTriangle, Edit, Trash2 } from 'lucide-react';

import { Book } from '@prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';

import { BookForm } from '@/components/admin/BookForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { deleteBookAction } from '@/lib/actions/admin-books';

export function BookActions({ book }: { book: Book }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBookAction(book.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
        setOpenDelete(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 cursor-pointer"
          >
            <Edit className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-150 font-sans max-h-[90vh] overflow-y-auto"
          dir="rtl"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-right text-xl">
              ویرایش کتاب: {book.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <BookForm initialData={book} onSuccess={() => setOpenEdit(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-md font-sans"
          dir="rtl"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-right text-xl text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" />
              حذف کتاب
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-right">
            <p className="text-muted-foreground mb-2">
              آیا از حذف کتاب{' '}
              <span className="font-bold text-foreground">
                &quot;{book.title}&quot;
              </span>{' '}
              اطمینان دارید؟
            </p>
            <p className="text-sm text-destructive/80 font-medium">
              این عملیات غیرقابل بازگشت است.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer gap-2"
            >
              {isDeleting ? 'در حال حذف...' : 'بله، حذف شود'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

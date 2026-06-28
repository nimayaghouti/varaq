'use client';

import { AlertTriangle, XCircle } from 'lucide-react';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { cancelUserOrderAction } from '@/lib/actions/orders';

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const result = await cancelUserOrderAction(orderId);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.success);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 cursor-pointer mt-3 sm:mt-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
        >
          <XCircle className="size-4" />
          لغو سفارش
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
            لغو سفارش
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-right">
          <p className="text-muted-foreground mb-2">
            آیا از لغو این سفارش اطمینان دارید؟
          </p>
          <p className="text-sm font-medium">
            این عملیات{' '}
            <span className="font-bold text-destructive">غیرقابل بازگشت</span>{' '}
            است و در صورت تمایل به تکرار خرید باید سفارش جدیدی ثبت کنید.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="cursor-pointer"
          >
            بازگشت
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
            className="cursor-pointer gap-2"
          >
            {loading ? 'در حال لغو...' : 'بله، لغو شود'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

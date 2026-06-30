'use client';

import { AlertTriangle } from 'lucide-react';

import { OrderStatus } from '@prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { updateOrderStatusAction } from '@/lib/actions/orders';

import { STATUS_MAP } from '../../dashboard/page';

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const isFinalState =
    currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED';

  const onSelectChange = (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;

    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const executeStatusChange = async () => {
    if (!pendingStatus) return;

    setLoading(true);
    try {
      const result = await updateOrderStatusAction(orderId, pendingStatus);
      if (result?.error) toast.error(result.error);
      else toast.success(result.success);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Select
        value={currentStatus}
        onValueChange={onSelectChange}
        disabled={loading || isFinalState}
      >
        <SelectTrigger
          className={`w-32 bg-background cursor-pointer h-8 text-xs font-bold ${isFinalState ? 'opacity-50' : ''}`}
          dir="rtl"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {currentStatus === 'PENDING' && (
            <SelectItem
              value="PENDING"
              className="cursor-pointer text-yellow-600 font-medium"
            >
              در انتظار پرداخت
            </SelectItem>
          )}
          <SelectItem
            value="PAID"
            className="cursor-pointer text-blue-600 font-medium"
          >
            پرداخت شده
          </SelectItem>
          <SelectItem
            value="DELIVERED"
            className="cursor-pointer text-green-600 font-medium"
          >
            تحویل داده شده
          </SelectItem>
          {currentStatus !== 'PAID' && (
            <SelectItem
              value="CANCELLED"
              className="cursor-pointer text-red-600 font-medium"
            >
              لغو شده
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className="sm:max-w-md font-sans"
          dir="rtl"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-right text-xl flex items-center gap-2 text-orange-500">
              <AlertTriangle className="size-5" />
              تایید تغییر وضعیت
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-right">
            <p className="text-foreground">
              آیا از تغییر وضعیت این سفارش به{' '}
              <span className="font-bold text-primary" dir="ltr">
                {STATUS_MAP[pendingStatus ?? currentStatus]?.label}
              </span>{' '}
              اطمینان دارید؟
            </p>
            {(pendingStatus === 'DELIVERED' ||
              pendingStatus === 'CANCELLED') && (
              <p className="text-sm text-muted-foreground mt-2">
                توجه: این وضعیت نهایی است و پس از آن امکان ویرایش سفارش وجود
                نخواهد داشت.
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-row items-center justify-end gap-3 sm:justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
              className="cursor-pointer"
            >
              انصراف
            </Button>
            <Button
              onClick={executeStatusChange}
              disabled={loading}
              className="cursor-pointer gap-2"
            >
              {loading ? 'در حال ثبت...' : 'تایید و اعمال'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

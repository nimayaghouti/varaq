'use client';

import { Edit, Save } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateOrderShippingAction } from '@/lib/actions/orders';
import { CheckoutSchema } from '@/lib/validations/checkout';

const EditShippingSchema = CheckoutSchema.omit({ fullName: true });
type FormData = z.infer<typeof EditShippingSchema>;

interface EditShippingDialogProps {
  orderId: string;
  currentPhone: string;
  currentAddress: string;
  disabled?: boolean;
}

export function EditShippingDialog({
  orderId,
  currentPhone,
  currentAddress,
  disabled,
}: EditShippingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(EditShippingSchema),
    defaultValues: {
      phone: currentPhone || '',
      address: currentAddress || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await updateOrderShippingAction(orderId, data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
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
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-8 gap-2 cursor-pointer text-xs"
        >
          <Edit className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-150 font-sans max-h-[90vh] overflow-y-auto"
        dir="rtl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-right text-xl flex items-center gap-2">
            <Edit className="size-6 text-primary" />
            ویرایش اطلاعات ارسال
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input
                id="phone"
                {...register('phone')}
                dir="ltr"
                className="text-left bg-background"
                placeholder="09123456789"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">آدرس دقیق پستی</Label>
              <textarea
                id="address"
                {...register('address')}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 items-center gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="cursor-pointer"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? (
                  'در حال ذخیره...'
                ) : (
                  <>
                    <Save className="size-4 ml-2" /> ذخیره اطلاعات
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

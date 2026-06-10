'use client';

import { Send } from 'lucide-react';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xvznbowr', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('پیام شما با موفقیت ارسال شد', {
          description: 'در اسرع وقت به درخواست شما رسیدگی خواهد شد.',
        });
        form.reset();
      } else {
        throw new Error('Network error');
      }
    } catch (error) {
      console.error('Contact Form Error:', error);
      toast.error('خطا در ارسال پیام', {
        description:
          'متأسفانه ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="sr-only">
          نام و نام خانوادگی
        </label>
        <Input
          id="name"
          name="name"
          required
          placeholder="نام و نام خانوادگی"
          className="bg-background py-6"
        />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          ایمیل
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="ایمیل"
          className="bg-background py-6"
        />
      </div>

      <div>
        <label htmlFor="message" className="sr-only">
          پیام شما
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="متن پیام"
          className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full mt-2 gap-2 cursor-pointer rounded-xl font-bold"
        disabled={loading}
      >
        {loading ? (
          'در حال ارسال...'
        ) : (
          <>
            <Send className="size-4" />
            ارسال پیام
          </>
        )}
      </Button>
    </form>
  );
}

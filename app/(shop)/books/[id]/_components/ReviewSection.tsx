'use client';

import { BadgeCheck, Star, User } from 'lucide-react';

import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { addReviewAction } from '@/lib/actions/reviews';

type ReviewWithUser = {
  id: string;
  text: string;
  rating: number;
  createdAt: Date;
  userId: string;
  user: { name: string | null; image: string | null };
};

interface ReviewSectionProps {
  bookId: string;
  reviews: ReviewWithUser[];
  currentUserId?: string;
}

export function ReviewSection({
  bookId,
  reviews,
  currentUserId,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const userReview = reviews.find(r => r.userId === currentUserId);
  const otherReviews = reviews.filter(r => r.userId !== currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0)
      return toast.error('لطفاً یک امتیاز (ستاره) انتخاب کنید.');
    if (text.trim().length < 5)
      return toast.error('متن نظر باید حداقل ۵ کاراکتر باشد.');

    setLoading(true);
    try {
      const result = await addReviewAction({ bookId, rating, text });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
        setText('');
        setRating(0);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-8 mt-12 bg-muted/20 p-6 md:p-8 rounded-3xl border border-border/50">
      <h2 className="text-2xl font-bold tracking-tight">نظرات کاربران</h2>

      {!currentUserId ? (
        <div className="bg-card p-6 rounded-2xl border border-border/50 text-center text-muted-foreground text-sm shadow-sm">
          برای ثبت نظر لطفاً ابتدا وارد حساب کاربری خود شوید.
        </div>
      ) : !userReview ? (
        <form
          onSubmit={handleSubmit}
          className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-4"
        >
          <p className="font-medium text-sm">امتیاز شما به این کتاب:</p>
          <div className="flex gap-1" dir="ltr">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`size-6 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'fill-transparent text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="نظرتان را درباره این کتاب بنویسید..."
            rows={3}
            className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
          <Button
            type="submit"
            disabled={loading || rating === 0 || text.length < 5}
            className="w-fit mr-auto cursor-pointer rounded-xl px-8"
          >
            {loading ? 'در حال ثبت...' : 'ثبت نظر'}
          </Button>
        </form>
      ) : null}

      <div className="flex flex-col gap-4">
        {userReview && (
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-primary/20">
                <AvatarImage src={userReview.user.image || ''} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm text-primary flex items-center gap-1">
                  نظر شما
                  <BadgeCheck className="size-4 text-primary" />
                </p>
                <div className="flex text-yellow-500 text-xs mt-0.5" dir="ltr">
                  {'★'.repeat(userReview.rating)}
                  {'☆'.repeat(5 - userReview.rating)}
                </div>
              </div>
              <span className="mr-auto text-xs text-primary/60 font-medium">
                {new Intl.DateTimeFormat('fa-IR').format(userReview.createdAt)}
              </span>
            </div>
            <p className="text-foreground text-sm leading-relaxed text-justify">
              {userReview.text}
            </p>
          </div>
        )}

        {otherReviews.length > 0 ? (
          otherReviews.map(review => (
            <div
              key={review.id}
              className="bg-background p-5 rounded-2xl border border-border/50 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-border">
                  <AvatarImage src={review.user.image || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">
                    {review.user.name || 'کاربر ورق'}
                  </p>
                  <div
                    className="flex text-yellow-500 text-xs mt-0.5"
                    dir="ltr"
                  >
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <span className="mr-auto text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat('fa-IR').format(review.createdAt)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                {review.text}
              </p>
            </div>
          ))
        ) : !userReview ? (
          <div className="text-center py-10 text-muted-foreground">
            هنوز نظری برای این کتاب ثبت نشده است. اولین نفری باشید که نظر
            می‌دهید!
          </div>
        ) : null}
      </div>
    </section>
  );
}

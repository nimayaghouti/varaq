import { Mail, MapPin, Phone } from 'lucide-react';

import { Metadata } from 'next';

import { ContactForm } from './_components/ContactForm';

export const metadata: Metadata = {
  title: 'درباره ما',
  description:
    'آشنایی با کتابفروشی آنلاین ورق و راه‌های ارتباطی با پشتیبانی سایت.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 max-w-5xl mx-auto pb-8">
      <section className="space-y-6 text-center md:text-right pt-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          درباره <span className="text-primary">کتابفروشی ورق</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed text-justify md:text-right">
          کتابفروشی آنلاین ورق فعالیت خود را با هدف ترویج فرهنگ کتاب‌خوانی و
          دسترسی آسان و سریع علاقه‌مندان به بهترین آثار داخلی و خارجی آغاز کرد.
          ما باور داریم که هر کتاب، پنجره‌ای به دنیایی جدید است و تلاش می‌کنیم
          تا این پنجره‌ها را به روی شما باز کنیم.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed text-justify md:text-right">
          مجموعه ما با دقت و وسواس، گلچینی از پرفروش‌ترین رمان‌ها، کتاب‌های
          تاریخی، علمی و روانشناسی را برای شما گردآوری کرده است تا بتوانید با
          خیالی آسوده و در کوتاه‌ترین زمان، کتاب‌های مورد علاقه خود را پیدا و
          تهیه کنید.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-muted/30 p-6 md:p-10 rounded-3xl border border-border/50">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">ارتباط با پشتیبانی</h2>
            <p className="text-muted-foreground">
              سوالی دارید؟ پیشنهاد یا انتقادی هست؟ از طریق فرم زیر یا راه‌های
              ارتباطی با ما در تماس باشید.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
              <div className="bg-background p-3 rounded-xl shadow-sm border border-border/50">
                <MapPin className="size-5 text-primary" />
              </div>
              <span>ایران، تهران</span>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
              <div className="bg-background p-3 rounded-xl shadow-sm border border-border/50">
                <Phone className="size-5 text-primary" />
              </div>
              <span dir="ltr">۰۲۱ - ۱۲۳۴ ۵۶۷۸</span>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
              <div className="bg-background p-3 rounded-xl shadow-sm border border-border/50">
                <Mail className="size-5 text-primary" />
              </div>
              <span>info@email.com</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-6 md:p-8 rounded-2xl border border-border/50">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

import {
  GitHubLogoIcon as Github,
  InstagramLogoIcon as Instagram,
  TwitterLogoIcon as Twitter,
} from '@radix-ui/react-icons';

import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="varaq logo"
                className="size-32"
                width={128}
                height={128}
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              کتابفروشی آنلاین ورق؛ جایی برای کشف دنیاهای جدید میان صفحات کتاب.
              ما بهترین و محبوب‌ترین کتاب‌ها را برای شما گردآوری کرده‌ایم.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">دسترسی سریع</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/books"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  همه کتاب‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/genres"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  دسته‌بندی‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  جستجوی پیشرفته
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">همراه ما باشید</h3>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {currentYear} کتابفروشی ورق. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

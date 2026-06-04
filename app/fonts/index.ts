import localFont from 'next/font/local';

const iranSansX = localFont({
  src: [
    {
      path: './IRANSansX/woff2/IRANSansX-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './IRANSansX/woff2/IRANSansX-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-iran-sans',
  display: 'swap',
});

export { iranSansX };

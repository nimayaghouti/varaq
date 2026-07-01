'use client';

import 'altcha';
import 'altcha/i18n/fa';
import { useEffect, useRef } from 'react';

interface AltchaWrapperProps {
  onVerify?: (payload: string) => void;
}

export default function AltchaWrapper({ onVerify }: AltchaWrapperProps) {
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleStateChange = (ev: Event) => {
      const customEvent = ev as CustomEvent;
      if (customEvent.detail.state === 'verified' && onVerify) {
        onVerify(customEvent.detail.payload);
      }
    };

    const widget = widgetRef.current;
    if (widget) {
      widget.addEventListener('statechange', handleStateChange);
    }

    return () => {
      if (widget) widget.removeEventListener('statechange', handleStateChange);
    };
  }, [onVerify]);

  return (
    <altcha-widget
      ref={widgetRef}
      challenge="/api/altcha"
      // configuration={JSON.stringify({ hideFooter: true })}
      language="fa"
    ></altcha-widget>
  );
}

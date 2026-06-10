import { useEffect, useState } from 'react';

import { useCartStore } from '@/store/cart-store';

export function useCart() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return {
    ...cart,
    isMounted,
  };
}

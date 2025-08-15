import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força o scroll para o topo imediatamente quando a rota muda
    window.scrollTo(0, 0);
  }, [pathname]);
}; 
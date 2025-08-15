// Layout padrão para as páginas
import type { ReactNode } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';

type Props = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
  // Força scroll para o topo quando a rota muda
  useScrollToTop();

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <main className="w-full mt-16 md:mt-20 mx-auto p-6 lg:p-0">
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout; 
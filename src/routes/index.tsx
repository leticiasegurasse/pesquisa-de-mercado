// Definição das rotas principais
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import PesquisaMercado from '../pages/PesquisaMercado';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rota principal - redireciona para pesquisa */}
      <Route path={ROUTES.HOME} element={<PesquisaMercado />} />
      
      {/* Rota de login - redireciona se já estiver logado */}
      <Route path={ROUTES.LOGIN} element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      } />
      
      {/* Rota do dashboard admin - requer autenticação */}
      <Route path={ROUTES.DASHBOARD} element={
        <ProtectedRoute requireAuth={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Rota específica da pesquisa */}
      <Route path={ROUTES.PESQUISA_MERCADO} element={<PesquisaMercado />} />
      
      {/* Rota da pesquisa com responsável específico */}
      <Route path={ROUTES.PESQUISA_COM_RESPONSAVEL} element={<PesquisaMercado />} />
      
      {/* Rota 404 - Captura todas as rotas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes; 
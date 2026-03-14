import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import UsuariosList from '../pages/usuarios/UsuariosList'
import ClientesList from '../pages/clientes/ClientesList'
import ProveedoresList from '../pages/proveedores/ProveedoresList'
import ProductosList from '../pages/productos/ProductosList'
import CargarCSV from '../pages/productos/CargarCSV'
import RegistrarVenta from '../pages/ventas/RegistrarVenta'
import ReporteVentasCliente from '../pages/reportes/ReporteVentasCliente'

function PrivateRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { token, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!token) return <Navigate to="/login" replace />
  if (!isAdmin()) return <NoAccess />
  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <div className="flex items-center gap-3 text-ink-400">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm">Cargando…</span>
      </div>
    </div>
  )
}

function NoAccess() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 space-y-4 fade-in">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="font-display font-bold text-ink-800 text-xl mb-2">Acceso restringido</h2>
        <p className="text-sm text-ink-400 max-w-xs">
          Este módulo es exclusivo para administradores. Contacta a un ADMIN para obtener acceso.
        </p>
      </div>
      <a href="/dashboard" className="btn-secondary mt-2">
        Volver al Dashboard
      </a>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"            element={<Dashboard />} />
            <Route path="clientes"             element={<ClientesList />} />
            <Route path="proveedores"          element={<ProveedoresList />} />
            <Route path="productos"            element={<ProductosList />} />
            <Route path="productos/cargar-csv" element={<CargarCSV />} />
            <Route path="ventas"               element={<RegistrarVenta />} />

            {/* Solo ADMIN */}
            <Route path="usuarios" element={<AdminRoute><UsuariosList /></AdminRoute>} />
            <Route path="reportes" element={<AdminRoute><ReporteVentasCliente /></AdminRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
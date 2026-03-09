import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import UsuariosList from '../pages/usuarios/UsuariosList'
import CrearUsuario from '../pages/usuarios/CrearUsuario'
import ClientesList from '../pages/clientes/ClientesList'
import ProveedoresList from '../pages/proveedores/ProveedoresList'
import ProductosList from '../pages/productos/ProductosList'
import CargarCSV from '../pages/productos/CargarCSV'
import RegistrarVenta from '../pages/ventas/RegistrarVenta'
import ReporteVentasCliente from '../pages/reportes/ReporteVentasCliente'

function PrivateRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return (
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
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="usuarios" element={<UsuariosList />} />
            <Route path="usuarios/crear" element={<CrearUsuario />} />
            <Route path="clientes" element={<ClientesList />} />
            <Route path="proveedores" element={<ProveedoresList />} />
            <Route path="productos" element={<ProductosList />} />
            <Route path="productos/cargar-csv" element={<CargarCSV />} />
            <Route path="ventas" element={<RegistrarVenta />} />
            <Route path="reportes" element={<ReporteVentasCliente />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
import './global.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TemplatePage from './pages/TemplatePage'
import AppLayout from './pages/Layout/Layout'
import LabelEditor from './components/LabelEditor/LabelEditor'
import ProductsTablePage from './pages/ProductsTablePage'
import LabelsTablePage from './pages/LabelsTablePage'
import LoginPage from './pages/LoginPage/LoginPage'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate replace to="labels" />} />
          <Route path="products" element={<ProductsTablePage />} />
          <Route path="labels" element={<LabelsTablePage />} />
          <Route path="templates" element={<TemplatePage />}>
            <Route path="/templates/:templateTitle" element={<LabelEditor />} />
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />} />
        {/*
        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

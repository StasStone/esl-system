import './global.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TemplatePage from './pages/TemplatePage'
import AppLayout from './pages/Layout/Layout'
import LabelEditor from './components/LabelEditor/LabelEditor'
import ProductsTablePage from './pages/ProductsTablePage/ProductsTablePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="table" />} />
          <Route path="table" element={<ProductsTablePage />} />
          <Route path="templates" element={<TemplatePage />}>
            <Route path="/templates/:templateTitle" element={<LabelEditor />} />
          </Route>
        </Route>
        <Route index element={<Navigate replace to="table" />} />
        {/* <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

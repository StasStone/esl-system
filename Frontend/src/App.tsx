import './global.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TablePage from './pages/TablePage/TablePage'
import TemplatePage from './pages/TemplatePage'
import AppLayout from './pages/Layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="table" />} />
          <Route path="table" element={<TablePage />} />
          <Route path="template" element={<TemplatePage />} />
        </Route>
        <Route index element={<Navigate replace to="table" />} />
        {/* <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

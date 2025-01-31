import './global.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TablePage from './pages/TablePage'
import TemplatePage from './pages/TemplatePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="table" />} />
        <Route path="table" element={<TablePage />} />
        <Route path="template" element={<TemplatePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

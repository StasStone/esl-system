import './global.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TemplatePage from './pages/TemplatePage'
import AppLayout from './pages/Layout/Layout'
import LabelEditor from './components/LabelEditor/LabelEditor'
import ProductsTablePage from './pages/ProductsTablePage/ProductsTablePage'
import LabelsTablePage from './pages/LabelsTablePage/LabelsTablePage'
import LoginPage from './pages/LoginPage/LoginPage'
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute'
import { AuthProvider } from './pages/AuthProvider'
import SetupPage from './pages/SetupPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import { RxCross2 } from 'react-icons/rx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0 } }
})

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
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
              <Route path="setup" element={<SetupPage />} />
              <Route path="templates" element={<TemplatePage />}>
                <Route
                  path="/templates/:templateId"
                  element={<LabelEditor />}
                />
              </Route>
            </Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: '20px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-0)',
              color: 'var(--color-grey-700)'
            }
          }}
        >
          {t => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <button onClick={() => toast.dismiss(t.id)}>
                      <RxCross2 />
                    </button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

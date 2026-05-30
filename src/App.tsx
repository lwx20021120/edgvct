import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { DataProvider } from './context/DataContext'
import { WallProvider } from './context/WallContext'
import { ToastProvider } from './components/shared/Toast'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { seedVideos } from './config/videos'

export function App() {
  useEffect(() => {
    seedVideos()
  }, [])
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <DataProvider>
            <WallProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </WallProvider>
          </DataProvider>
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

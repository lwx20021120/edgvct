import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
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
    <HashRouter>
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
    </HashRouter>
  )
}

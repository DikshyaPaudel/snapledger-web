import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import UploadPage from './pages/UploadPage'
import ReviewPage from './pages/ReviewPage'
import DocumentsPage from './pages/DocumentsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/review/:jobId" element={<ReviewPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Route>
    </Routes>
  )
}

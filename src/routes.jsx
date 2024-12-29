import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import PhotoReportApp from './pages/PhotoReportApp'
import Contatos from './pages/Contatos'
import Page404 from './pages/Page404'
import Aplicativos from './pages/Aplicativos'
import PaginaBasica from './pages/PaginaBasica'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PaginaBasica />}>
                    <Route index element={<Home />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/aplicativos" element={<Aplicativos />} />
                    <Route path="/PhotoReportApp" element={<PhotoReportApp />} />
                    <Route path="/contatos" element={<Contatos />} />
                    <Route path="*" element={<Page404 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes

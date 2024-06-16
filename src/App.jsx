import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { HelloWorld, LoginPage, RegisterPage, CommunityPage, ProfilePage, NotFoundPage , HomePage ,AdminPage} from './pages';


export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/main' element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/communities" element={
            <ProtectedRoute>
                <CommunityPage/>
            </ProtectedRoute>
          }/>
          <Route path="/admin" element={
            <ProtectedRoute>
                <AdminPage/>
            </ProtectedRoute>
          }/>
          <Route path='*' element={<NotFoundPage/>} />
          <Route path='/helloworld' element={<HelloWorld/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

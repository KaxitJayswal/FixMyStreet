import './App.css'
import HomePage from '../page/HomePage.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { IssuesProvider } from './contexts/IssuesContext'

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <HomePage />
      </IssuesProvider>
    </AuthProvider>
  )
}

export default App

import { AuthProvider } from "./contexts/AuthContext.tsx"
import { AppRoutes } from "./Routes.tsx"

export function App() {

  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  )
}

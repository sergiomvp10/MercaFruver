import SaleContextWrap from "@/contexts/saleContext";
import { AuthProvider, AuthContext } from "@/contexts/authContext";
import "@/styles/globals.css";
import '@/utils/apiFetch';
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && router.pathname !== '/login') {
      router.replace('/login');
    }
  }, [user, loading, router.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyan-500 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user && router.pathname !== '/login') {
    return null;
  }

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SaleContextWrap>
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      </SaleContextWrap>
    </AuthProvider>
  );
}

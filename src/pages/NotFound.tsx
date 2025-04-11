
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Página não encontrada</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/dashboard">Ir para o Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

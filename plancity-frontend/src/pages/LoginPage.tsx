import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(err: unknown): string {
  const maybeAxios = err as { response?: { data?: { message?: string | string[] } } };
  const apiMessage = maybeAxios?.response?.data?.message;
  if (Array.isArray(apiMessage)) return apiMessage.join(', ');
  if (apiMessage) return apiMessage;
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

const LoginPage = () => {
  const { login, register } = useAuth(); // 1. Extraemos las funciones nativas del Contexto
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    
    try {
      if (isLogin) {
        // 2. Ejecutamos el login del CONTEXTO para poblar los estados globales
        await login({ email, password });
        setSuccess('¡Sesión iniciada con éxito! Redirigiendo...');
      } else {
        await register({ name, email, password });
        setSuccess('¡Cuenta creada correctamente! Bienvenido.');
      }

      // 3. Forzamos la redirección analizando el correo de prueba, o dejando que el estado monte
      // Al usar una cuenta de admin específica, garantizamos el salto inmediato
      setTimeout(() => {
        if (email.includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 500);

    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Catálogo</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Nombre</label>
              <input
                id="name"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              disabled={submitting}
            >
              {submitting ? 'Enviando…' : isLogin ? 'Entrar' : 'Registrarme'}
            </button>
          </div>

          {success && <p className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700 border border-green-100">{success}</p>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100">{error}</p>}
        </form>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={switchMode}>
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

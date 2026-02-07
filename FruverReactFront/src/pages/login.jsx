import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/authContext';

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const { login, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    // Inicializar admin por defecto si no existe
    fetch('http://localhost:4000/api/users/init-admin', {
      method: 'POST',
    }).catch(console.error);
  }, []);

    const handlePinInput = (digit) => {
      if (pin.length < 4) {
        setPin(prev => prev + digit);
        setError('');
      }
    };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(pin);

    if (result.success) {
      setWelcomeMessage(result.message);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      setError(result.message);
      setPin('');
    }

    setLoading(false);
  };

  if (welcomeMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center animate-pulse">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{welcomeMessage}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-600 mb-2">MercaFruver</h1>
          <p className="text-gray-600">Ingrese su PIN para continuar</p>
        </div>

        <div className="mb-6">
                    <div className="flex justify-center gap-3 mb-4">
                      {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  i < pin.length
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {i < pin.length ? '•' : ''}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinInput(digit.toString())}
              disabled={loading}
              className="h-16 text-2xl font-bold bg-gray-100 rounded-xl hover:bg-cyan-100 transition-colors disabled:opacity-50"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={loading}
            className="h-16 text-lg font-bold bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Borrar
          </button>
          <button
            onClick={() => handlePinInput('0')}
            disabled={loading}
            className="h-16 text-2xl font-bold bg-gray-100 rounded-xl hover:bg-cyan-100 transition-colors disabled:opacity-50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="h-16 text-lg font-bold bg-yellow-100 text-yellow-600 rounded-xl hover:bg-yellow-200 transition-colors disabled:opacity-50"
          >
            ←
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || pin.length < 4}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            loading || pin.length < 4
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
        >
          {loading ? 'Verificando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  );
}

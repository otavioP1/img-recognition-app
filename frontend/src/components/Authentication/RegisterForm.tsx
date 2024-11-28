import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isValidEmail } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ email: string; password: string, passwordConfirmation: string }>({email: '', password: '', passwordConfirmation: ''});

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return false;

    setLoading(true);
    const res = await register();
    if (!res.success) {
      setLoading(false);
      let newErrors = { email: '', password: '', passwordConfirmation: '' };
      newErrors.passwordConfirmation = res.error;
      setErrors(newErrors);
      return false;
    }
    await login(email, password);
    setLoading(false);
    navigate('/analysis-history');
  };

  const register = async (): Promise<{'success': boolean, 'error': string}> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);

    try {
      const API_PATH = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_PATH}/register`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {'success': false, 'error': errorData.error};
      }
      return {'success': true, 'error': ''};
    } catch (error) {
      return {'success': false, 'error': 'Ocorreu um erro ao se registrar'};
    }
  }

  const validate = () :boolean => {
    let valid = true;
    const newErrors = { email: '', password: '', passwordConfirmation: '' };

    if (!email) {
      newErrors.email = 'Informe o email';
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Informe a senha';
      valid = false;
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = 'Informe a confirmação de senha';
      valid = false;
    }

    if (password && passwordConfirmation && password != passwordConfirmation) {
      newErrors.passwordConfirmation = 'As senhas não conferem';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className="p-6 flex flex-col gap-4 min-w-80">
        <h1 className="text-2xl font-bold text-center mb-6">ReconheceAI</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors && errors.email &&
              <p className="mt-1 text-xs text-red-500">
                {errors.email}
              </p>
            }
          </div>
          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors && errors.password &&
              <p className="mt-1 text-xs text-red-500">
                {errors.password}
              </p>
            }
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirme a senha"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            {errors && errors.passwordConfirmation &&
              <p className="mt-1 text-xs text-red-500">
                {errors.passwordConfirmation}
              </p>
            }
          </div>
          <Button
            type="submit"
            disabled={loading}
            className={loading ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}
          >
            {loading ? 'Processando...' : 'Registre-se'}
          </Button>
          <p className="text-center text-sm">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
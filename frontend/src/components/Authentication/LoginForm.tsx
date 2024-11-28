import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isValidEmail } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email: string; password: string }>({email: '', password: ''});

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return false;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      let newErrors = { email: '', password: '' };
      newErrors.password = res.error;
      setErrors(newErrors);
      return false;
    }
    navigate('/analysis-history');
  };

  const validate = () :boolean => {
    let valid = true;
    const newErrors = { email: '', password: '' };

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
          <Button
            type="submit"
            disabled={loading}
            className={loading ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}
          >
            {loading ? 'Processando...' : 'Login'}
          </Button>
          <p className="text-center text-sm">
            Não possui uma conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
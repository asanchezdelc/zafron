import { useEffect, useState } from 'react'
import { Card, Title, Button, Divider, TextInput } from '@tremor/react';
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from '../../services/user';
import Alert from '../../components/alert';
import jwt_decode from "jwt-decode";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');

  let [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setError('Password reset token expired');
        }
      } catch (err) {
        console.error(err.message);
        setError('Invalid password reset token');
      }
    }
  }, [searchParams]);

  const onSubmitForm = async (e) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    try {
      const token = searchParams.get('token');
      setDisabled(true);
      await resetPassword(token, newPassword);
      setDisabled(false);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err.message);
      setDisabled(false);
    }
  }

  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold">
              <img className="w-12 h-12 mr-2" src="https://zafron.dev/img/zafron.png" alt="logo" />
              Zafron    
            </a>
          <Card className="max-w-xs">
            <Title>Login</Title>
            <Divider />
            { success && <>
              <Alert type="info" title="Password Reset" message={'Your password has been reset.'}></Alert>
              <Link className='text-blue-600 dark:text-blue-500 hover:underline' to={'/login'}>Login</Link>
              </> }
            { error !== '' && <Alert type="error" title="Password Reset" message={error}></Alert> }
            <form onSubmit={onSubmitForm} className={ success ? 'hidden': ''}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  New Password:
                </label>
                <TextInput 
                id="password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Confirm Password:
                </label>
                <TextInput 
                  id="password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="mb-4">
                <Button variant="primary" size='xs' disabled={disabled}>Reset</Button>
              </div>
            </form>
          </Card>
        </div>
        
    </main>
  );
}
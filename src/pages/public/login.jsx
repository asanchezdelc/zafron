import { useEffect, useState } from 'react'
import { Card, Title, Button, Divider, TextInput } from '@tremor/react';
import { Link, useNavigate } from "react-router-dom";
import Alert from '../../components/alert';
import { useAuth } from '../../services/AuthProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();


  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/devices');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch('/api/users/login', {  // Change this URL if your backend API is on a different domain or port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token); // Update the authenticated state
        navigate('/devices'); // Navigate the user to the dashboard or another protected route
      } else {
        setError(data.error || 'Failed to login'); // Display the error message returned from the API or a generic message
        setTimeout(() => {
          setError(null);
        }, 3000);
      }

    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
          <a href="/" className="flex items-center mb-6 text-2xl font-semibold">
            <img className="w-12 h-12 mr-2" src="https://zafron.dev/img/zafron.png" alt="logo" width={'50px'} />
            Zafron    
            </a>
          <Card className="max-w-xs">
            <Title>Login</Title>
            <Divider />
            { error && <Alert title="Login Error" message={'Email or password is invalid.'}>{error}</Alert> }
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  E-mail
                </label>
                <TextInput 
                  type="email" 
                  placeholder='E-mail address' 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}  // Update the username state when the input changes
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password:
                </label>
                <TextInput 
                  id="password" 
                  type="password" 
                  placeholder='' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}  // Update the password state when the input changes
                />
              </div>
              <div className="mb-4">
                <Button type="submit" variant="primary" size='xs'>Login</Button>
              </div>
            </form>
            <div className="mb-4">
              <Link className='text-blue-600 dark:text-blue-500 hover:underline' to={'/register'}>Register</Link>  
              {' or '}
              <Link className='text-blue-600 dark:text-blue-500 hover:underline' to="/forgot-password"> Forgot Password?</Link>
            </div>
          </Card>
        </div>
        
    </main>
  );
}
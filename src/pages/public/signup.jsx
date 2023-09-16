import { useState } from 'react'
import { Card, Title, Button, Flex, Divider, TextInput } from '@tremor/react';
import { Link, useNavigate } from "react-router-dom";
import Alert from '../../components/alert';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // React router's useHistory hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await fetch('/api/users', {  // Change this URL if your backend API is on a different domain or port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: username, password, name })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login'); // Navigate the user to the dashboard or another protected route
      } else {
        setError(data.error || 'Failed to register'); // Display the error message returned from the API or a generic message
        setTimeout(() => {
          setError(null);
        }, 3000);
      }

    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  }

  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex justifyContent='center'>
          <Card className="max-w-xs">
            <Title>Register</Title>
            <Divider />
            { error && <Alert title="Register Error" message={'Email or password is invalid.'}>{error}</Alert> }
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Name:
                </label>
                <TextInput type="text" placeholder='Azucar' value={name} 
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  E-mail Address:
                </label>
                <TextInput type="email" placeholder='E-mail adress' value={username} 
                  onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password:
                </label>
                <TextInput id="password" type="password" placeholder='' value={password} 
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Confirm Password:
                </label>
                <TextInput id="password" type="password" placeholder='' />
              </div>
              <div className="mb-4">
                <Button variant="primary" size='xs'>Register</Button>
              </div>
            </form>
            <div className="mb-4">
              <Link className='text-blue-600 dark:text-blue-500 hover:underline' to={'/login'}>Login</Link>
            </div>
          </Card>
        </Flex>
        
    </main>
  );
}
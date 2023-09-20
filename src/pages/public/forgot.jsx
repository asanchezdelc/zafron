import { Card, Title, Button, Flex, Divider, TextInput, Text } from '@tremor/react';
import { Link } from "react-router-dom";

export default function ForgotPage() {
  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
            <a href="/" className="flex items-center mb-6 text-2xl font-semibold">
              <img class="w-12 h-12 mr-2" src="https://zafron.dev/img/zafron.png" alt="logo" />
              Zafron    
            </a>
          <Card className="max-w-xs">
            <Title>Forgot password</Title>
            
            <Divider />
            <Text className='pb-5'>Enter your email address and we will send you a link to reset your password.</Text>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  E-mail Address:
                </label>
                <TextInput type="email" placeholder='E-mail adress' />
              </div>
              <div className="mb-4">
                <Button variant="primary" size='xs'>Request Reset Link</Button>
              </div>
              <div className="mb-4">
                <Link className='text-blue-600 dark:text-blue-500 hover:underline' to={'/login'}>{'<-'} Login</Link>  
              </div>
            </form>
          </Card>
        </div>
    </main>
  );
}
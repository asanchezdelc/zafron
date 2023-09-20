import { useState } from 'react'
import { Card, Title, Button, Flex, Divider, TextInput } from '@tremor/react';

export default function LoginPage() {

  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold">
              <img class="w-12 h-12 mr-2" src="https://zafron.dev/img/zafron.png" alt="logo" />
              Zafron    
            </a>
          <Card className="max-w-xs">
            <Title>Login</Title>
            <Divider />
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  New Password:
                </label>
                <TextInput id="password" type="password" placeholder='' />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Confirm Password:
                </label>
                <TextInput id="password" type="password" placeholder='' />
              </div>
              <div className="mb-4">
                <Button variant="primary" size='xs'>Reset</Button>
              </div>
            </form>
          </Card>
        </div>
        
    </main>
  );
}
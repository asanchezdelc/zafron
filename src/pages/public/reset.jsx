import { useState } from 'react'
import { Card, Title, Button, Flex, Divider, TextInput } from '@tremor/react';

export default function LoginPage() {

  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex justifyContent='center'>
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
        </Flex>
        
    </main>
  );
}
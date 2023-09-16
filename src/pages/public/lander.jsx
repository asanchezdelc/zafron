import { useState } from 'react'
import { Card, Title, Button, Flex, Divider, TextInput } from '@tremor/react';
import { Link, useNavigate } from "react-router-dom";

export default function LanderPage() {
  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Title>Zafron</Title>
        <Link to={'/login'}><Button variant="primary" size='xs'>Login</Button></Link>
    </main>
  );
}
"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const PitstopLandingPage = () => {
  const router=useRouter()
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1613234259978-98229fb76d9d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyJTIwY29sbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
        alt="Car collection"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-32 text-center">
        <Card className="bg-transparent text-white">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Welcome to Pitstop</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-8 text-lg">
              Pitstop is a virtual garage manager that helps you keep track of your car collection.
            </p>
            <Button onClick={()=>router.push("/auth/signin")} variant={'link'}  className="w-1/2 text-white">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PitstopLandingPage;
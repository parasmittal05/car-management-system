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
        src="https://img.freepik.com/free-photo/yellow-car-gas-station_23-2150697544.jpg?t=st=1731747675~exp=1731751275~hmac=241197722e3a2e6d9ffcf730c9daf1802b9e6e9bbac6147d73b863ddf76aef0a&w=740"
        alt="Car collection"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-32 text-center">
        <Card className="bg-transparent text-white">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Welcome to CarBase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-8 text-lg">
              CarBase is a virtual garage manager that helps you keep track of your car collection.
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
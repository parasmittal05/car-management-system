"use client"
import {  useEffect, useState } from 'react';
import axios from 'axios';
import { Car } from '@/Types/carTypes';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';


export default function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [car, setCar] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const id = React.use(params).id;

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/cars/${id}`)
        .then((response) => {
          setCar(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch car', error);
        });
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (car) {
      //@ts-ignore
      setCar((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (car) {
      setIsLoading(true);
      try {
        await axios.put(`/api/cars/${id}`, car); 
        setIsEditing(false);
        setIsLoading(false);
        alert('Car updated successfully!');
      } catch (error) {
        console.error('Failed to update car', error);
        alert('Failed to update car');
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (!car) return <div>Loading...</div>;

  return (
    <div className=' flex justify-center items-center'>
      <Card className="container mx-auto p-4 w-1/2">
      <CardHeader className=' flex flex-row justify-between items-center'>
        <CardTitle>{isEditing ? 'Edit Mode' : 'View Mode'}</CardTitle>
        <div className='flex gap-4'>
        {!isEditing && (
          <>
            <Button onClick={handleEdit} >
              Edit
            </Button>
           
          </>
        )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Input
              name="title"
              value={car.title}
              onChange={handleInputChange}
            />
            <Textarea
              name="description"
              value={car.description}
              onChange={handleInputChange}
              rows={4}
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant={isLoading ? 'secondary' : 'default'}
            >
              {isLoading ? 'Submitting...' : 'Submit Changes'}
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold">Car Information</h2>
            <p><strong>Title:</strong> {car.title}</p>
            <p><strong>Description:</strong> {car.description}</p>

            <div className="my-2 grid grid-cols-2 gap-2">
              {car.images.map((image:any, index:any) => (
                <img key={index} src={image} alt={`Car Image ${index + 1}`} className="w-full h-40 object-contain mr-2 col-span-1 m-4 rounded-lg border-2 border-white" />
              ))}
            </div>

            <div className="my-2">
              <p className="font-semibold text-white">Car Type: {car.carType}</p>
              <p className="font-semibold">Company: {car.company}</p>
              <p className="font-semibold">Dealer: {car.dealer}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
       
      </CardFooter>
    </Card>
    </div>
  );
}
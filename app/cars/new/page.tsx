"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Upload } from 'lucide-react';
import { CarFormData } from '@/Types/carTypes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CarFormPage = () => {
  const router =useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CarFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      alert('You can only upload up to 10 images');
      return;
    }
    setSelectedFiles(files);
  };

  const onSubmit = async (data: CarFormData) => {
    setIsLoading(true);

    try {
      function fileToBase64(file:any) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
      const imageLinks = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64String = await fileToBase64(file);
      
          const payload = {
            file: base64String,
            fileName: file.name, 
          };
      
          const response = await axios.post('/api/upload', payload, {
            headers: {
              'Content-Type': 'application/json', 
            },
          });
      
          return response.data.url;
        })
      );
      
     
      

      //@ts-ignore
      const response = await fetch(`/api/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          images: imageLinks
        })
      });

      if (response.ok) {
        alert('Car saved successfully');
        router.back();
      } else {
        alert('Error saving car');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
   <div className=' flex justify-center items-center py-4'>
     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-10 w-1/2  border-2  ">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="images">Images (Max 10)</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Click to upload images (max 10)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {selectedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedFiles.length} files selected
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="carType">Car Type</Label>
          <Input
            id="carType"
            {...register('carType', { required: 'Car type is required' })}
          />
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register('company', { required: 'Company is required' })}
          />
        </div>

        <div>
          <Label htmlFor="dealer">Dealer</Label>
          <Input
            id="dealer"
            {...register('dealer', { required: 'Dealer is required' })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Car'}
      </Button>
    </form>
   </div>
  );
};

export default CarFormPage
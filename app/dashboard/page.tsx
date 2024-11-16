'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { Car } from '@/Types/carTypes';
import CarCard from '@/components/CarCard';

export default function DashboardPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cars from the API when the component mounts
  useEffect(() => {
    fetchCars();
  }, []);

  // Function to fetch cars from the API
  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();

      // Ensure the fetched data is an array
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a car
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await fetch(`/api/cars/${id}`, {
          method: 'DELETE',
        });
        setCars(cars.filter(car => car.id !== id));
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  // Filter cars based on the search query
  const filteredCars = cars.filter(car => 
    car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (car.tags && Object.values(car.tags).some((tag: any) => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <div className="relative bg-black min-h-screen">
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Optional Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">My Garage</h1>
          <Button
            onClick={() => router.push('/cars/new')}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Car
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md mx-auto sm:mx-0"
          />
        </div>

        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <>
            {cars.length === 0 ? (
              <div className="text-center text-white">No cars found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onEdit={() => router.push(`/cars/modify/${car.id}`)}
                    onClick={() => router.push(`/cars/modify/${car.id}`)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

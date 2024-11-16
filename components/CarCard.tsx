import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { Car } from '@/Types/carTypes';

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onClick: (car: Car) => void;
  onDelete: (id: string) => void;
}

const CarCard = ({ car, onEdit, onDelete, onClick }: CarCardProps) => {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{car.title}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(car)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(car.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div onClick={() => onClick(car)} className="aspect-video relative mb-4">
          <img
            src={car.images?.[0] || "/api/placeholder/400/300"}
            alt={car.title}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 dark:text-white">
          {car.description || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-2">
          {/* Set custom styling for badges */}
          {car.carType && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">{car.carType}</Badge>
          )}
          {car.company && (
            <Badge variant="outline" className="bg-green-100 text-green-800">{car.company}</Badge>
          )}
          {car.dealer && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{car.dealer}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;

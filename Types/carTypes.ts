// types/index.ts

export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface Car {
    id: string;
    title: string;
    description: string;
    images: string[];
    tags: {
      carType: string;
      company: string;
      dealer: string;
    };
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CarFormData {
    title: string;
    description: string;
    images: File[];
    carType: string;
    company: string;
    dealer: string;
  }
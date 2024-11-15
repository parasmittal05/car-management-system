// app/api/cars/route.ts

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/authConfig'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, images, carType, company, dealer, tags } = await request.json()
    
    const car = await prisma.car.create({
      data: {
        title,
        description,
        images,
        carType,
        company,
        dealer,
        tags,
        userId: session.user.id
      }
    })

    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Server error '+error  }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const query: any = {
      where: { userId: session.user.id }
    }

    if (search) {
      query.where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    const cars = await prisma.car.findMany(query)
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Server error '+error }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authConfig'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const car = await prisma.car.findUnique({
      where: { id: (await params).id }
    })

    if (!car || car.userId !== session.user.id) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Server error '+error }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, images, carType, company, dealer, tags } =
      await request.json()

    const car = await prisma.car.findUnique({
      where: { id: (await params).id }
    })

    if (!car || car.userId !== session.user.id) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    const updatedCar = await prisma.car.update({
      where: { id: (await params).id },
      data: {
        title,
        description,
        images,
        carType,
        company,
        dealer,
        tags
      }
    })

    return NextResponse.json(updatedCar)
  } catch (error) {
    return NextResponse.json({ error: 'Server error'+error }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const car = await prisma.car.findUnique({
      where: { id: (await params).id }
    })

    if (!car || car.userId !== session.user.id) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    await prisma.car.delete({
      where: { id: (await params).id }
    })

    return NextResponse.json({ message: 'Car deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error'+error }, { status: 500 })
  }
}


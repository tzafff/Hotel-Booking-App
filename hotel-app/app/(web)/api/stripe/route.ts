import Stripe from 'stripe';


import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';


const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});

type RequestData = {
    totalPrice: number;
    room: any;
    firstname: string;
    lastname: string;
    email: string;
    checkIn: any;
    checkOut: any;
};

export async function POST(req: Request, res: Response) {
    const {
        totalPrice,
        room,
        firstname,
        lastname,
        email,
        checkIn,
        checkOut,
    }: RequestData = await req.json();
    debugger


    const roomId = room._id;

    const origin = req.headers.get('origin');

    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if (!getUser) {
        return new NextResponse('Authentication required', { status: 400 });
    }

    try {
        const imageUrl = `https://blush-fundamental-gerbil-302.mypinata.cloud/ipfs/QmSMyR7Vghinqei8agWQ9kgZtoyxZ9GChaGxzDzGU6Mr18`;


        // Create a stripe payment
        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: room.name,
                            images: [imageUrl],
                        },
                        unit_amount: parseInt((totalPrice * 100).toString()),
                    },
                },
            ],
            payment_method_types: ['card'],
            success_url: `${origin}/dashboard`,
            metadata: {
                totalPrice,
                roomId,
                firstname,
                lastname,
                email,
                checkIn,
                checkOut,
            }
        });

        return NextResponse.json(stripeSession, {
            status: 200,
            statusText: 'Payment session created',
        });
    } catch (error: any) {
        console.log('Payment falied', error);
        return new NextResponse(error, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createBooking } from "@/lib/apis";  // Ensure this path is correct

const checkout_session_completed = 'checkout.session.completed';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});

interface SessionMetadata {
    totalPrice: number;
    roomId: string;
    firstname: string;
    lastname: string;
    email: string;
    checkIn: string;
    checkOut: string;
}

export async function POST(req: Request, res: Response) {
    const reqBody = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }

    switch (event.type) {
        case checkout_session_completed:
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session.metadata as unknown as SessionMetadata;

            const {
                totalPrice,
                roomId,
                firstname,
                lastname,
                email,
                checkIn,
                checkOut,
            } = metadata;
            console.log(metadata)

            try {
                await createBooking({
                    checkinDate: checkIn,
                    checkoutDate: checkOut,
                    hotelRoom: roomId,
                    email,
                    totalPrice: totalPrice,
                    given_name: firstname,
                    family_name: lastname

                });

                return NextResponse.json('Booking successful', {
                    status: 200,
                    statusText: 'Booking Successful',
                });
            } catch (error) {
                return new NextResponse(`Error creating booking: ${error.message}`, { status: 500 });
            }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json('Event Received', {
        status: 200,
        statusText: 'Event Received',
    });
}

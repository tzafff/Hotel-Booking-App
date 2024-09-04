import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const checkout_session_completed = 'checkout.session.completed';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});

// Define a custom interface for the metadata if needed
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

    // Load our event
    switch (event.type) {
        case checkout_session_completed:
            // Explicitly cast session to Stripe.Checkout.Session
            const session = event.data.object as Stripe.Checkout.Session;

            // Cast metadata to our custom interface
            const metadata = session.metadata as unknown as SessionMetadata;

            // Access the properties safely
            const {
                totalPrice,
                roomId,
                firstname,
                lastname,
                email,
                checkIn,
                checkOut,
            } = metadata;

            const data = {
                data: {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    room: roomId
                },
            };

            console.log("DATA");
            console.log(data);

            await postData('http://127.0.0.1:1337/api/reservations', data);

            return NextResponse.json('Booking successful', {
                status: 200,
                statusText: 'Booking Successful',
            });

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json('Event Received', {
        status: 200,
        statusText: 'Event Received',
    });
}

const postData = async (url: string, data: object) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}
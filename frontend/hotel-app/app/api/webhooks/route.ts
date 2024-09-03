import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const checkout_session_completed = 'checkout.session.completed';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-08-16',
});

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

    // load our event
    switch (event.type) {
        case checkout_session_completed:
            const session = event.data.object;
            console.log("session")
            console.log(session)
            const {
                // @ts-ignore
                metadata: {
                    totalPrice,
                    roomId,
                    firstname,
                    lastname,
                    email,
                    checkIn,
                    checkOut,
                },
            } = session;

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


            postData('http://127.0.0.1:1337/api/reservations', data)

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

    try{
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error)

    }
}
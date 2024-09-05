import axios from 'axios';

import { CreateBookingDto, Room } from '@/models/room';
import sanityClient from '../sanity/lib/client';
import * as queries from './sanityQueries';
import Booking from "@/sanity/schemas/booking";
// import { Booking } from '@/models/booking';



export async function getRooms() {
    const result = await sanityClient.fetch<Room[]>(
        queries.getRoomsQuery,
        {},
        { cache: 'no-cache' }
    );
    return result;
}

export async function getRoom(slug: string) {
    const result = await sanityClient.fetch<Room>(
        queries.getRoom,
        { slug },
        { cache: 'no-cache' }
    );

    return result;
}

export async function getAllBookings(roomName: string) {
    const roomRef = await sanityClient.fetch(`*[_type == 'hotelRoom' && name == $roomName][0]._id`, { roomName });
    //console.log(roomRef)
    const result = await sanityClient.fetch<typeof Booking[]>(
        queries.getAllBookingsQuery,
        {
            roomRef,
        },
        { cache: 'no-cache' }
    );
    return result;
}

export async function getBookingsByEmail(email: string) {
    const result = await sanityClient.fetch<typeof Booking[]>(
        queries.getBookingsByEmailQuery,
        {
            email,
        },
        { cache: 'no-cache' }
    );
    return result;
}

export const createBooking = async ({
                                        checkinDate,
                                        checkoutDate,
                                        hotelRoom,
                                        email,
                                    }: CreateBookingDto) => {
    const mutation = {
        mutations: [
            {
                create: {
                    _type: 'booking',
                    hotelRoom: { _type: 'reference', _ref: hotelRoom },
                    checkinDate,
                    checkoutDate,
                    email,
                },
            },
        ],
    };



    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-06-20/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_STUDIO_TOKEN}` } }
    );

    return data;
};




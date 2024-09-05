import { groq } from 'next-sanity';



export const getRoomsQuery = groq`*[_type == "hotelRoom"] {
    _id, 
    coverImage,
    description,
    dimension,
    name,
    price,
    slug,
    type
}`;

export const getRoom = groq`*[_type == "hotelRoom" && slug.current == $slug][0] {
    _id,
    coverImage,
    description,
    dimension,
    images,
    name,
    price,
    slug,
    type
}`;



export const getAllBookingsQuery = groq`*[_type == 'booking' && references($roomRef)] {
    _id,
    checkinDate,
    checkoutDate,
    numberOfDays,
    email,
    hotelRoom -> {
        _id,
        name,
        slug,
        price
    },
}`;


export const getBookingsByEmailQuery = groq`*[_type == 'booking' && email == $email] {
    _id,
    checkinDate,
    checkoutDate,
    numberOfDays,
    email,
    hotelRoom -> {
        _id,
        name,
        slug,
        price
    },
}`;

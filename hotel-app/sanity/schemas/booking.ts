import { defineField } from 'sanity';

const booking = {
    name: 'booking',
    title: 'Booking',
    type: 'document',
    fields: [
        defineField({
            name: 'hotelRoom',
            title: 'Hotel Room',
            type: 'reference',
            to: [{ type: 'hotelRoom' }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'checkinDate',
            title: 'Check-in Date',
            type: 'date',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'checkoutDate',
            title: 'Check-out Date',
            type: 'date',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'email',
            type: 'string',
            title: 'Email',
        }),
    ],
};

export default booking;

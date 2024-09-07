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
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'string',
            validation: Rule => Rule.required().min(0),
        }),
        defineField({
            name: 'family_name',
            type: 'string',
            title: 'Family Name',
        }),
        defineField({
            name: 'given_name',
            type: 'string',
            title: 'Given Name',
        }),
    ],
};

export default booking;

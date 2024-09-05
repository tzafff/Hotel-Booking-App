import { defineField } from 'sanity';

const roomTypes = [
    { title: 'Basic', value: 'basic' },
    { title: 'Luxury', value: 'luxury' },
    { title: 'Suite', value: 'suite' },
];

const hotelRoom = {
    name: 'hotelRoom',
    title: 'Hotel Room',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule =>
                Rule.required().max(50).error('Maximum 50 Characters'),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'name',
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule =>
                Rule.required().min(100).error('Minimum 100 Characters'),
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: Rule =>
                Rule.required().min(70).error('Minimum 100 Characters'),
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'url', type: 'url', title: 'URL' },
                        { name: 'file', type: 'file', title: 'File' },
                    ],
                },
            ],
            validation: Rule =>
                Rule.required().min(3).error('Minimum of 3 images required'),
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'object',
            fields: [
                { name: 'url', type: 'url', title: 'URL' },
                { name: 'file', type: 'file', title: 'File' },
            ],
            validation: Rule => Rule.required().error('Cover Image is required'),
        }),
        defineField({
            name: 'type',
            title: 'Room Type',
            type: 'string',
            options: {
                list: roomTypes,
            },
            validation: Rule => Rule.required(),
            initialValue: 'basic',
        }),
        defineField({
            name: 'specialNote',
            title: 'Special Note',
            type: 'text',
            validation: Rule => Rule.required(),
            initialValue:
                'Check-in time is 12:00 PM, checkout time is 11:59 AM. If you leave behind any items, please contact the receptionist.',
        }),
        defineField({
            name: 'dimension',
            title: 'Dimension',
            type: 'string',
        }),
    ],
};

export default hotelRoom;

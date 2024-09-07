type CoverImage = {
    url: string;
};

export type Image = {
    _key: string;
    url: string;
};

type Amenity = {
    _key: string;
    amenity: string;
    icon: string;
};

type Slug = {
    _type: string;
    current: string;
};

export type Room = {
    _id: string;
    coverImage: CoverImage;
    description: string;
    dimension: string;
    images: Image[];
    name: string;
    price: number;
    slug: Slug;
    type: string;
    persons: string
};

export type CreateBookingDto = {
    hotelRoom: string;
    checkinDate: string;
    checkoutDate: string;
    email: string;
};

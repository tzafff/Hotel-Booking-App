"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { getBookingsByEmail } from '@/lib/apis';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from "@/components/LoadingSpinner";

const DashboardDetails = ({ userEmail }: { userEmail: string }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true); // Start loading
                const fetchedBookings = await getBookingsByEmail(userEmail);
                setBookings(fetchedBookings);
            } catch (error) {
                console.error('Error fetching checkin/checkout dates', error);
            } finally {
                setLoading(false); // Stop loading after fetching data
            }
        };

        fetchBookings();
    }, [userEmail]);

    if (loading) return <LoadingSpinner />; // Show spinner while loading
    return (
        <section className={'min-h-[80vh]'}>
            <div className={'container mx-auto py-8 h-full'}>
                <h3 className={'h3 font-bold mb-12 border-b pb-4 text-center lg:text-left'}>
                    My Bookings
                </h3>
                <div className={'flex flex-col gap-8 h-full'}>
                    {bookings.length < 1 ? (
                        <div className={'flex flex-col items-center justify-center h-[50vh]'}>
                            <p className={'text-xl text-center text-secondary/70 mb-4'}>
                                You do not have any reservations!
                            </p>
                            {/* Back to homepage */}
                            <Link href={'/'}>
                                <Button size={'md'}>Go to homepage</Button>
                            </Link>
                        </div>
                    ) : (
                        bookings.map((reservation) => {
                            return (
                                <div key={reservation._id} className={'bg-tertiary py-8 px-12'}>
                                    <div className={'flex flex-col lg:flex-row gap-4 items-center justify-between'}>
                                        <h3 className={'text-2xl font-medium w-[200px] text-center lg:text-left'}>
                                            {reservation.hotelRoom.name}
                                        </h3>
                                        {/* Check-in & Check-out dates */}
                                        <div className={'flex flex-col lg:flex-row gap-2 lg:w-[380px]'}>
                                            {/* Check-in */}
                                            <div className={'flex items-center gap-1 flex-1'}>
                        <span className={'text-accent font-bold uppercase tracking-[2px]'}>
                          From:
                        </span>
                                                <span className={'text-secondary font-semibold'}>
                          {format(new Date(reservation.checkinDate), 'PPP')}
                        </span>
                                            </div>
                                            {/* Check-out */}
                                            <div className={'flex items-center gap-1 flex-1'}>
                        <span className={'text-accent font-bold uppercase tracking-[2px]'}>
                          To:
                        </span>
                                                <span className={'text-secondary font-semibold'}>
                          {format(new Date(reservation.checkoutDate), 'PPP')}
                        </span>
                                            </div>
                                        </div>
                                        {/* <CancelReservation reservation={reservation} /> */}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default DashboardDetails;

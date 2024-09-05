"use client"

import React, { useState, useEffect } from "react";
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { format, isPast, isWithinInterval, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import AlertMessage from "@/components/AlertMessage";
import { useRouter } from 'next/navigation';
import getStripe from "@/lib/get-stripejs";
import axios from "axios";

const Reservation = ({
                         checkinCheckoutDates, // new prop with checkin/checkout dates
                         room,
                         isUserAuthenticated,
                         userData
                     }: {
    checkinCheckoutDates: { checkinDate: string; checkoutDate: string }[]; // updated prop type
    room: any;
    isUserAuthenticated: boolean;
    userData: any;
}) => {
    const [checkInDate, setCheckInDate] = useState<Date>();
    const [checkOutDate, setCheckOutDate] = useState<Date>();
    const [alertMessage, setAlertMessage] = useState<{
        message: string,
        type: 'error' | "success" | null;
    } | null>(null);

    const router = useRouter();

    const formatDateForSanity = (date: Date) => {
        return format(date, 'yyyy-MM-dd');
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            return setAlertMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [alertMessage]);

    // Helper function to check if a date is reserved using the new Sanity data
    const isDateReserved = (date: Date) => {
        return checkinCheckoutDates.some(({ checkinDate, checkoutDate }) => {
            const existingCheckIn = new Date(checkinDate).setHours(0, 0, 0, 0);
            const existingCheckOut = addDays(new Date(checkoutDate).setHours(0, 0, 0, 0), -1);
            return isWithinInterval(date, { start: existingCheckIn, end: existingCheckOut });
        });
    };

    const days = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;
    const totalPrice = Math.max(0, room.price * days); // Updated to work with room object from Sanity

    const handleBookNowClick = async () => {
        if (!checkInDate || !checkOutDate) {
            setAlertMessage({
                message: "Please select check-in and check-out dates",
                type: 'error',
            });
            return false;
        }

        if (checkInDate.getTime() === checkOutDate.getTime()) {
            setAlertMessage({
                message: 'Check-In and Check-out dates cannot be the same',
                type: 'error',
            });
            return false;
        }

        if (checkOutDate.getTime() < checkInDate.getTime()) {
            setAlertMessage({
                message: 'Check-Out date cannot be before Check-In date',
                type: 'error',
            });
            return false;
        }

        const isReserved = checkinCheckoutDates.some(({ checkinDate, checkoutDate }) => {
            const existingCheckIn = new Date(checkinDate).setHours(0, 0, 0, 0);
            const existingCheckOut = new Date(checkoutDate).setHours(0, 0, 0, 0);

            const checkInTime = checkInDate?.setHours(0, 0, 0, 0);
            const checkOutTime = checkOutDate?.setHours(0, 0, 0, 0);

            return (checkInTime >= existingCheckIn && checkInTime < existingCheckOut)
                || (checkOutTime > existingCheckIn && checkOutTime <= existingCheckOut)
                || (existingCheckIn > checkInTime && existingCheckIn < checkOutTime)
                || (existingCheckOut > checkInTime && existingCheckOut <= checkOutTime);
        });

        if (isReserved) {
            setAlertMessage({
                message: 'This room is already booked for the selected dates. Please choose different dates or another room',
                type: 'error',
            });
            return false;
        }

        // PROCEED TO CHECKOUT
        const stripe = await getStripe();

        try {
            const { data: stripeSession } = await axios.post("/api/stripe", {
                totalPrice,
                room,
                firstname: userData.family_name,
                lastname: userData.given_name,
                email: userData.email,
                checkIn: checkInDate ? formatDateForSanity(checkInDate) : null,
                checkOut: checkOutDate ? formatDateForSanity(checkOutDate) : null,
            });

            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: stripeSession.id,
                });

                if (result.error) {
                    console.log("error: " + result.error);
                    setAlertMessage({
                        message: 'Error occurred during checkout',
                        type: 'error',
                    });
                    return false;
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            router.push('/dashboard');
        }
    };

    return (
        <div>
            <div className={"bg-tertiary h-[320px] mb-4"}>
                {/* top */}
                <div className={"bg-accent py-4 text-center relative mb-2"}>
                    <h4 className={"text-xl text-white"}>Book your room</h4>
                    {/* triangle */}
                    <div className={"absolute -bottom-[8px] left-[calc(50%_-_10px)] w-0 h-0 border-l-[10px]" +
                        " border-l-transparent border-t-[8px] border-t-accent border-r-[10px] border-r-transparent"}></div>
                </div>
                <div className={"flex flex-col gap-4 w-full py-6 px-8"}>
                    {/* Check In */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"default"}
                                size={"md"}
                                className={cn(
                                    "w-full flex justify-start text-left font-semibold",
                                    !checkInDate && "text-secondary"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkInDate ? format(checkInDate, "PPP") : <span>Check In</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={checkInDate}
                                onSelect={setCheckInDate}
                                initialFocus
                                disabled={date => isPast(date) || isDateReserved(date)}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Check Out */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"default"}
                                size={"md"}
                                className={cn(
                                    "w-full flex justify-start text-left font-semibold",
                                    !checkOutDate && "text-secondary"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkOutDate ? format(checkOutDate, "PPP") : <span>Check Out</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={checkOutDate}
                                onSelect={setCheckOutDate}
                                initialFocus
                                disabled={date => isPast(date) || isDateReserved(date)}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* conditional rendering of the booking button based on a user authentication status
                        if user is authenticated, display a "Book now" button with an onClick event handler to save the booking
                        if the user is not authenticated display a "Book now" button wrapped inside a login link.
                    */}
                    {isUserAuthenticated ? (
                        <Button onClick={handleBookNowClick} size={"md"}>
                            Total Price {totalPrice} €
                        </Button>
                    ) : (
                        <LoginLink>
                            <Button className={"w-full"} size={"md"}>
                                Book now
                            </Button>
                        </LoginLink>
                    )}
                </div>
            </div>
            {alertMessage && <AlertMessage message={alertMessage.message} type={alertMessage.type} />}
        </div>
    );
};

export default Reservation;

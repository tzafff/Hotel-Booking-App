"use client"

import React, {useState, useEffect} from "react";
import {Button} from './ui/button'
import { Calendar } from './ui/calendar'
import { format, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import AlertMessage from "@/components/AlertMessage";
import {useRouter} from 'next/navigation'

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

const Reservation = ({
    reservations,
    room,
    isUserAuthenticated,
    userData
} : {
    reservations: any;
    room: any;
    isUserAuthenticated: boolean;
    userData: any;
}) => {
    //console.log(room)

    const [checkInDate, setCheckInDate] = React.useState<Date>()
    const [checkOutDate, setCheckOutDate] = React.useState<Date>()
    const [alertMessage, setAlertMessage] = useState<{
        message: string,
        type: 'error' | "success" | null;
    } | null>(null);

    const router = useRouter();

    const formatDateForStrapi = (date: Date) => {
        return format(date, 'yyyy-MM-dd')
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            return setAlertMessage(null)
        }, 5000)
        // clear timer
        return () => clearTimeout(timer);
    }, [alertMessage]);

    const saveReservation = () => {
        if(!checkInDate || !checkOutDate) {
            return setAlertMessage({
                message: "Please select check-in and check-out dates",
                type: 'error'
            })
        }

        if(checkInDate.getTime() === checkOutDate.getTime()) {
            return setAlertMessage({
                message: 'Check-In and Check-out dates cannot be the same',
                type: 'error'
            })
        }

        if (checkOutDate.getTime() < checkInDate.getTime()) {
            return setAlertMessage({
                message: 'Check-Out date cannot be before Check-In date',
                type: 'error',
            });
        }

        // filter reservations for the current room and check if any reservations overlaps with the selected dates
        const isReserved = reservations.data.filter(
            (item: any) => item.attributes.room.data.id === room.data.id
            // filter reservations for the current room
        ).some((item:any) => {
            // check if any reservations overlaps with the selected dates
            const existingCheckIn = new Date(item.attributes.checkIn).setHours(
                0,
                 0,
                 0,
                 0
            ); // convert existing check-in date to midnight
            const existingCheckOut = new Date(item.attributes.checkOut).setHours(
                0,
                0,
                0,
                0
            ); // convert existing check-out date to midnight

            // convert selected check-in date to midnight
            const checkInTime = checkInDate?.setHours(0,0,0,0);
            const checkOutTime = checkOutDate?.setHours(0,0,0,0);

            // check if the room is reserved between the check in and check out dates
            const isReservedBetweenDates =
            (checkInTime >= existingCheckIn && checkInTime < existingCheckOut)
            || (checkOutTime > existingCheckIn && checkOutTime <= existingCheckOut)
            || (existingCheckIn > checkInTime && existingCheckIn < checkOutTime)
            || (existingCheckOut > checkInTime && existingCheckOut <= checkOutTime);

            return isReservedBetweenDates; // return true if any reservation overlaps with the selected dates.
        });

        // if the room is reserved log a message; otherwise proceed with booking

        if(isReserved) {
            setAlertMessage({
                message: 'This room is already booked for the selected dates. Please choose different dates or another room',
                type: 'error'
            })
        } else {
            const data = {
                data: {
                    firstname: userData.family_name,
                    lastname: userData.given_name,
                    email: userData.email,
                    checkIn: checkInDate ? formatDateForStrapi(checkInDate) : null, // format selected check in date
                    checkOut: checkOutDate ? formatDateForStrapi(checkOutDate) : null, // format selected check in date
                    room: room.data.id
                },
            };

            // post booking data to the server
            postData('http://127.0.0.1:1337/api/reservations', data)
            setAlertMessage({
                message: 'Your booking has been successfully confirmed',
                type: 'success'
            })
            // refresh the page to reflect the updated reservation status
            router.refresh();
        }

    };

    return (
        <div>
            <div className={"bg-tertiary h-[320px] mb-4 "}>
                {/* top */}
                <div className={"bg-accent py-4 text-center relative mb-2"}>
                    <h4 className={"text-xl text-white"}>Book your room</h4>
                    {/*     triangle    */}
                    <div className={"absolute -bottom-[8px]  left-[calc(50%_-_10px)] w-0 h-0 border-l-[10px]" +
                        " border-l-transparent border-t-[8px] border-t-accent border-r-[10px] border-r-transparent"}></div>
                </div>
                <div className={"flex flex-col gap-4 w-full py-6 px-8"}>
                    {/*Check In*/}
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
                                disabled={isPast}
                            />
                        </PopoverContent>
                    </Popover>
                    {/*Check Out*/}
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
                                disabled={isPast}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* conditional rendering of the booking button based on a user authentication status
                        if user is authenticated, display a "Book now" button with an onClick event handler to save the booking
                        if the user is not authenticated display a "Book now" button wrapped inside a login link.
                    */}
                    {isUserAuthenticated ? (
                            <Button onClick={() => saveReservation()} size={"md"}>
                                Book now
                            </Button>
                        )
                        : (
                            <LoginLink>
                                <Button className={"w-full"} size={"md"}>
                                    Book now
                                </Button>
                            </LoginLink>
                           )
                    }
                </div>
            </div>
            {alertMessage && <AlertMessage  message={alertMessage.message} type={alertMessage.type}/>}
        </div>
    )
}
export default Reservation

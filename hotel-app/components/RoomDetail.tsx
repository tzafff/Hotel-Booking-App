"use client"
import React, {useEffect, useState} from 'react'
import useSWR from 'swr';
import {getAllBookings, getRoom} from "@/lib/apis";
import {TbArrowsMaximize, TbUsers} from "react-icons/tb";
import Gallery from "@/components/Gallery";
import Reservation from "@/components/Reservation";
import Image from 'next/image'
import LoadingSpinner from "@/components/LoadingSpinner";
const RoomDetail = ({roomId, isUserAuthenticated, userData}: {roomId: any; isUserAuthenticated: any; userData:any}) => {

    const [checkinCheckoutDates, setCheckinCheckoutDates] = useState<
        { checkinDate: string; checkoutDate: string }[]
    >([]);

    const fetchRoom = async () => getRoom(roomId);
    const { data: room, error, isLoading } = useSWR("/api/room", fetchRoom);

    useEffect(() => {
        if (!room) return; // You can handle this case here or move it outside the useEffect

        const fetchCheckinCheckoutDates = async () => {
            try {
                //console.log(room.name)
                const { name } = room;
                const bookings = await getAllBookings(name);
                // console.log(bookings)
                const dates = bookings.map((booking: any) => ({
                    checkinDate: booking?.checkinDate,  // Adjust to actual structure
                    checkoutDate: booking?.checkoutDate, // Adjust to actual structure
                }));
                setCheckinCheckoutDates(dates)

            } catch (error) {
                console.error("Error fetching checkin/checkout dates", error);
            }
        };

        fetchCheckinCheckoutDates();
    }, [room]);

    const imgURLs = room?.images?.map((image: { url: string }) => image.url) || [];

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p>Error loading room details.</p>;
    if (!room) return <p>No room data available.</p>;
    const { name, price, dimension, description } = room;



    return (
        <section className={"min-h-[88vh]"}>
            <div className={"container mx-auto py-8"}>
                <div className={"flex flex-col lg:flex-row lg:gap-12 h-full"}>
                    {/*    img & text   */}
                    <div className={"flex-1"}>
                        {/*    image    */}
                        <div className={"relative h-[360px] lg:h-[420px] mb-8"}>
                            <Gallery imgURLs={imgURLs}/>
                        </div>
                        <div className={"flex flex-1 flex-col mb-8"}>
                            {/*    title & price    */}
                            <div className={"flex justify-between items-center mb-4"}>
                                <h3 className={"h3"}>{name}</h3>
                                <p className={"h3 font-secondary font-medium text-accent"}>
                                    €{price}
                                    <span className={"text-base text-secondary"}>/ night</span>
                                </p>
                            </div>
                            {/*    info     */}
                            <div className={"flex items-center gap-8 mb-4"}>
                                <div className={"flex items-center gap-2 "}>
                                    <div className={"text-2xl text-accent"}>
                                        <TbArrowsMaximize />
                                    </div>
                                    <p>
                                        {dimension} m <sup>2</sup>
                                    </p>
                                </div>
                                <div className={"flex items-center gap-2 "}>
                                    <div className={"text-2xl text-accent"}>
                                        <TbUsers />
                                    </div>
                                    <p>
                                        {room.persons} Guests
                                    </p>
                                </div>
                            </div>

                            <p>{description}</p>
                        </div>
                    </div>
                    {/*    reservation   */}
                    <div className={"w-full lg:max-w-[360px] h-max"}>
                        <Reservation
                            checkinCheckoutDates={checkinCheckoutDates}
                            room={room}
                            isUserAuthenticated={isUserAuthenticated}
                            userData={userData}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
export default RoomDetail

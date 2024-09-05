'use client';
import RoomList from "@/components/RoomList";
import useSWR from 'swr';
import { getRooms } from '@/lib/apis';
import {Room} from "@/models/room";
import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";

const Rooms = () => {

    async function fetchData() {
        return getRooms();
    }

    const { data: rooms, error, isValidating } = useSWR<Room[]>('get/hotelRooms', fetchData);

    if (isValidating) return <LoadingSpinner />;
    if (error) return <p>Error loading room details.</p>;

    return (
        <section>
            <div className={"container mx-auto"}>
                <RoomList rooms={rooms}/>
            </div>
        </section>
    )
}
export default Rooms

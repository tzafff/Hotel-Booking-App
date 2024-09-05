"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {Room} from "@/models/room"; // Adjust this import based on your actual API

const RoomList = ({rooms} : { rooms: Room[] }) => {


    const [roomType, setRoomType] = useState('all');
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        if (rooms) {
            const filtered = rooms.filter((room) => {
                return roomType === 'all' ? true : room.type === roomType;
            });
            setFilteredRooms(filtered);
        }
    }, [roomType, rooms]);


    return (
        <section className={"py-16 min-h-[90vh]"}>
            {/* image & title */}
            <div className={"flex flex-col items-center"}>
                {/* image and logo */}
                <div className={"relative w-[82px] h-[20px]"}>
                    <Image
                        src={'/assets/heading-icon.svg'}
                        fill
                        alt={""}
                        className={"object-cover"}
                    />
                </div>
                <h3 className={"h2 mb-8"}>Our Rooms</h3>
            </div>

            {/* tabs */}
            <Tabs
                defaultValue={'all'}
                className={"w-[240px] lg:w-[540px] h-[200px] lg:auto mb-8 mx-auto"}
            >
                <TabsList className={'w-full h-full lg:h-[46px] flex flex-col lg:flex-row'}>
                    <TabsTrigger
                        className={"w-full h-full"}
                        value={'all'}
                        onClick={() => setRoomType('all')}
                    >
                        All
                    </TabsTrigger>
                    <TabsTrigger
                        className={"w-full h-full"}
                        value={'basic'}
                        onClick={() => setRoomType('basic')}
                    >
                        Basic
                    </TabsTrigger>
                    <TabsTrigger
                        className={"w-full h-full"}
                        value={'luxury'}
                        onClick={() => setRoomType('luxury')}
                    >
                        Luxury
                    </TabsTrigger>
                    <TabsTrigger
                        className={"w-full h-full"}
                        value={'suite'}
                        onClick={() => setRoomType('suite')}
                    >
                        Suite
                    </TabsTrigger>
                    {/*<TabsTrigger*/}
                    {/*    className={"w-full h-full"}*/}
                    {/*    value={'extended'}*/}
                    {/*    onClick={() => setRoomType('extended')}*/}
                    {/*>*/}
                    {/*    Extended*/}
                    {/*</TabsTrigger>*/}
                </TabsList>
            </Tabs>

            {/* rooms list */}
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
                {filteredRooms.map((room) => {
                    const imgUrl = room?.coverImage.url;

                    return (
                        <div key={room.id}>
                            <Link href={`/room/${room.slug.current}`}>
                                <div className={"relative w-full h-[300px] overflow-hidden mb-6"}>
                                    <Image
                                        src={imgUrl}
                                        fill
                                        priority
                                        alt={room.name}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <div className={"h-[134px]"}>
                                <div className={"flex items-center justify-between mb-6"}>
                                    <div>Capacity - {room.dimension} sqm</div>
                                    <div className={"flex gap-1 text-accent"}>
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStarHalf />
                                    </div>
                                </div>
                                <Link href={`/room/${room._id}`}>
                                    <h3 className={"h3"}>{room.name}</h3>
                                </Link>
                                <p className={"h3 font-secondary font-medium text-accent mb-4"}>
                                    €{room.price}
                                    <span className={"text-base text-secondary"}>/ night</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default RoomList;

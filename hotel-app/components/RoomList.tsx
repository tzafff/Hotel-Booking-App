"use client"
import {useEffect, useState} from "react";
import Link from "next/link"
import Image from "next/image"
import {FaStar, FaStarHalf} from "react-icons/fa";

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const RoomList = ({rooms}: { rooms: any }) => {

    const [roomType, setRoomType] = useState('all');
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        const filtered = rooms.data?.filter((room: any) => {
            return roomType === 'all' ? rooms: roomType === room.attributes.type;
        })
        setFilteredRooms(filtered)
    }, [roomType]);


    return (
        <section className={"py-16 min-h-[90vh]"}>
            {/* image & title*/}
            <div className={"flex flex-col items-center"}>
            {/*    image and logo */}
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
                        value={'single'}
                        onClick={() => setRoomType('single')}
                    >
                        Single
                    </TabsTrigger>
                    <TabsTrigger
                        className={"w-full h-full"}
                        value={'double'}
                        onClick={() => setRoomType('double')}
                    >
                        Double
                    </TabsTrigger>
                    <TabsTrigger
                        className={"w-full h-full"}
                        value={'extended'}
                        onClick={() => setRoomType('extended')}
                    >
                        Extended
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* rooms list */}
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
                {filteredRooms.map((room) => {
                    //const imgUrl = `http://127.0.0.1:1337${room.attributes.image.data?.attributes.url}`;
                    const firstImage = room.attributes.image.data?.[0];
                    const imgUrl = `http://127.0.0.1:1337${firstImage.attributes.url}`

                    return (
                        <div key={room.id}>
                            <Link href={`/room/${room.id}`}>
                                <div className={"relative w-full h-[300px] overflow-hidden mb-6"}>
                                    <Image
                                        src={imgUrl}
                                        fill
                                        priority
                                        alt={""}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <div className={"h-[134px]"}>
                                <div className={"flex items-center justify-between mb-6"}>
                                    <div>Capacity - {room.attributes.capacity} person</div>
                                    <div className={"flex gap-1 text-accent"}>
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStarHalf />
                                    </div>
                                </div>
                                <Link href={`/rooms/${room.id}`}>
                                    <h3 className={"h3"}>{room.attributes.title}</h3>
                                </Link>
                                <p className={"h3 font-secondary font-medium text-accent mb-4"}>
                                    €{room.attributes.price}
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
export default RoomList

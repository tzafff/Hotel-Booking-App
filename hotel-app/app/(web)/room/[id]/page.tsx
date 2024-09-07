import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import RoomDetail from "@/components/RoomDetail";


const RoomDetails = async ({params} : {params: any}) => {
    const {isAuthenticated, getUser} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    const userData = await getUser();
    console.log(userData)


    return(
            <RoomDetail roomId={params.id}  isUserAuthenticated={isUserAuthenticated} userData={userData}/>
        )


}
export default RoomDetails

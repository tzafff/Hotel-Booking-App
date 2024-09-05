
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import DashboardDetails from "@/components/DashboardDetails";

const Dashboard = async () => {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const userEmail = user?.email;
 

    return (
         <DashboardDetails userEmail={userEmail}/>
    )
}
export default Dashboard

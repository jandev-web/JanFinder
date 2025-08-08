'use client';

import { useEffect, useState } from 'react';

import MemberBuildingDataForm from '@/components/MemberBuildingDataForm';

interface OwnerBuildingDataProps {
  user: any; // Specify the exact type of `user` if available
}

const OwnerBuildingData: React.FC<OwnerBuildingDataProps> = ({ user }) => {
    const [buildingData, setBuildingData] = useState([]);
    //console.log(user)
    

    return (
        <div>
            <MemberBuildingDataForm buildingData={buildingData} user={user}/>
        </div>
    );
};

export default OwnerBuildingData;

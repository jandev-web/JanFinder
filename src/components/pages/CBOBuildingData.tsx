'use client';

import { useEffect, useState } from 'react';
import { getCBOBuildingTypes } from '@/utils/getCBOBuildingTypes';
import MemberBuildingDataForm from '@/components/MemberBuildingDataForm';

interface CBOBuildingDataProps {
  user: any; // Specify the exact type of `user` if available
}

const CBOBuildingData: React.FC<CBOBuildingDataProps> = ({ user }) => {
    const [buildingData, setBuildingData] = useState([]);
    //console.log(user)
    useEffect(() => {
        const fetchData = async () => {
            const data = await getCBOBuildingTypes();
            //console.log('Building Data: ', data);
            setBuildingData(data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <MemberBuildingDataForm buildingData={buildingData} user={user}/>
        </div>
    );
};

export default CBOBuildingData;

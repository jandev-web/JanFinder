import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Task {
  taskName: string;
  taskFrequency: string;
}

interface Room {
  roomName: string;
  tasks: Task[];
}

interface PackageOption {
  name: string;
  rooms: Room[];
  description: string;
}

interface PackageProps {
  pkg: any;

  rec: boolean;

}

const BronzeServiceList: React.FC<PackageProps> = ({ pkg, rec }) => {

  return (
    <div className={`min-w-[240px] relative overflow-hidden max-w-xs bg-white rounded-b-2xl shadow-lg px-6 pb-6 text-center hover:shadow-xl transition-shadow duration-300 ${rec ? 'border-b-4 border-l-4 border-r-4 border-yellow-400' : ''} flex flex-col justify-between`}>
      <div className="">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="text-[#001F54] font-bold">See All Services</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {pkg?.rooms.map((room: any, index: any) => (
              <div key={index} className="border-b border-[#001F54] pb-4">
                <div className="flex flex-col items-start"> {/* Align everything to the right */}
                  <h4 className="text-xl font-semibold text-[#001F54] mb-2 text-left">{room.roomName}</h4>
                  <ul className="space-y-2">
                    {room.tasks.map((task: any, idx: any) => (
                      <li key={idx} className="text-sm text-gray-700 flex justify-between items-center border-b border-gray-200 pt-4">
                        <span className="font-medium flex-grow mr-2 text-left">{task.taskName}</span>
                        <span className="italic text-gray-500 whitespace-nowrap text-right">{task.taskFrequency}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </AccordionDetails>




        </Accordion>
      </div>
    </div>
  );
};

export default BronzeServiceList;

import React ,{useState} from 'react';
import StaffPreference from './StaffPreference';

const StaffServiceCardSimple = ({ service, onEditClick }) => {
    const [showPreferenceView, setShowPreferenceView] = useState(false);

  const handlePreferenceViewClick = () => {
    setShowPreferenceView(true);
  };

  const closePreferenceView = () => {
    setShowPreferenceView(false);
  };
  return (
    <div className="ml-64">
      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden mb-4">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-2 px-4 border">Service Id</th>
            <th className="py-2 px-4 border">Service Name</th>
            <th className="py-2 px-4 border">SR Start Time</th>
            <th className="py-2 px-4 border">SR End Time</th>
            <th className="py-2 px-4 border">Staff Id</th>
            <th className="py-2 px-4 border">Dept</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Preference</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
        {service.map((data) => (
          <tr key={data.Service_Id} className="bg-gray-200 hover:bg-gray-100">
            <td className="py-2 px-4 border">{data.Service_Id}</td>
            <td className="py-2 px-4 border">{data.Service_Name}</td>
            <td className="py-2 px-4 border">{data.Service_Start_Time}</td>
            <td className="py-2 px-4 border">{data.Service_End_Time}</td>
            <td className="py-2 px-4 border">{data.Staff_Id}</td>
            <td className="py-2 px-4 border">{data.Service_Dept}</td>
            <td className="py-2 px-4 border">{data.Service_Status}</td>
            <td className="py-2 px-4 border">
            <button
            type="button"
            onClick={handlePreferenceViewClick}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
          >
            P
          </button>

            </td>
            <td className="py-2 px-4 border">
              <button
                type="button"
                onClick={() => onEditClick(data)}
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
              >
                D
              </button>
              {showPreferenceView && <StaffPreference data={data} onCloseClick={closePreferenceView} />}
            </td>
          </tr>
           ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffServiceCardSimple;

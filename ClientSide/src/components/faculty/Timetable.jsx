import React from 'react';

function Timetable() {
  const timetable = [
    { day: 'Monday', slots: ['9:00-10:00 CSE101', '11:00-12:00 MAT201'] },
    { day: 'Tuesday', slots: ['10:00-11:00 CSE101', '2:00-3:00 CSE202'] },
    { day: 'Wednesday', slots: ['9:00-10:00 CSE101', '1:00-2:00 CSE202'] },
    { day: 'Thursday', slots: ['11:00-12:00 MAT201', '3:00-4:00 CSE202'] },
    { day: 'Friday', slots: ['10:00-11:00 CSE101', '2:00-3:00 CSE202'] },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Timetable</h2>
      <table className="w-full text-left mb-4">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Day</th>
            <th className="px-4 py-2">Slots</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((row, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-4 py-2 font-semibold">{row.day}</td>
              <td className="px-4 py-2">
                <ul className="list-disc ml-4">
                  {row.slots.map((slot, i) => (
                    <li key={i}>{slot}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-gray-600">This is a placeholder. Connect to backend for real timetable data.</p>
    </div>
  );
}

export default Timetable; 
import React, { useState, useRef } from 'react';

const initialNotifications = [
  {
    id: 1,
    from: 'Dr. HOD Name',
    to: 'Faculty',
    title: 'Faculty Meeting',
    description: 'There will be a department meeting on Friday at 2pm in Seminar Hall.',
    file: null,
    fileName: '',
    date: '2025-07-11',
  },
  {
    id: 2,
    from: 'Dr. HOD Name',
    to: 'Students',
    title: 'Exam Schedule',
    description: 'Mid-semester exam schedule is uploaded. Check the attached PDF.',
    file: null,
    fileName: 'ExamSchedule.pdf',
    date: '2025-07-10',
  },
  {
    id: 3,
    from: 'Dr. HOD Name',
    to: 'Both',
    title: 'Holiday Notice',
    description: 'The college will remain closed on Monday due to a public holiday.',
    file: null,
    fileName: '',
    date: '2025-07-09',
  },
];

const audienceOptions = [
  { value: 'Faculty', label: 'Faculty' },
  { value: 'Students', label: 'Students' },
  { value: 'Both', label: 'Both Faculty & Students' },
];

const HODNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [form, setForm] = useState({
    title: '',
    description: '',
    to: 'Both',
    file: null,
    fileName: '',
  });
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size should be less than 10MB');
        return;
      }
      setUploadError('');
      setForm((prev) => ({ ...prev, file, fileName: file.name }));
    }
  };

  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const newNotif = {
      id: Date.now(),
      from: 'Dr. HOD Name',
      to: form.to,
      title: form.title,
      description: form.description,
      file: form.file ? URL.createObjectURL(form.file) : null,
      fileName: form.fileName,
      date: new Date().toISOString().slice(0, 10),
    };
    setNotifications([newNotif, ...notifications]);
    setForm({ title: '', description: '', to: 'Both', file: null, fileName: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Department Notifications</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Add Notification Form */}
        <div className="md:col-span-5">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add New Notice</h2>
            <form onSubmit={handleAddNotification}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Audience</label>
                <select
                  name="to"
                  value={form.to}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {audienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {form.fileName ? form.fileName : 'Attach File'}
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.txt"
                  />
                </label>
                {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!form.title.trim() || !form.description.trim()}
              >
                Add Notification
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        {/* Notifications List */}
        <div className="md:col-span-7">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Recent Notices</h2>
            <hr className="mb-4" />
            <div className="max-h-[600px] overflow-y-auto">
              {notifications.length === 0 && (
                <p className="text-gray-500">No notifications yet.</p>
              )}
              {notifications.map((notif) => (
                <div key={notif.id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      {notif.from[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{notif.title}</h3>
                      <p className="text-sm text-gray-600">
                        <b>From:</b> {notif.from} &nbsp;|&nbsp; <b>To:</b> {notif.to}
                      </p>
                      <p className="text-xs text-gray-500">{notif.date}</p>
                    </div>
                  </div>
                  <p className="mb-2">{notif.description}</p>
                  {notif.fileName && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-blue-300 text-blue-700 bg-blue-50 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {notif.file ? (
                        <a href={notif.file} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {notif.fileName}
                        </a>
                      ) : (
                        <span>{notif.fileName}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default HODNotifications;

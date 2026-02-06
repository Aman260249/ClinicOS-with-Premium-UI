import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const AddPatientModal = ({ isOpen, onClose, refreshData, editData }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Jab bhi editData badle, fields fill kar do
  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setPhone(editData.phone);
    } else {
      setName('');
      setPhone('');
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // URL Cleanup: Taki extra slash se error na aaye
    const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

    try {
      if (editData) {
        // UPDATE LOGIC (Backticks fixed)
        await axios.put(`${baseURL}/api/patients/update/${editData._id}`, 
          { name, phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Patient updated!");
      } else {
        // ADD LOGIC (Single quotes fixed to Backticks)
        await axios.post(`${baseURL}/api/patients/add`, 
          { name, phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Patient added!");
      }
      refreshData();
      onClose();
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      toast.error(editData ? "Update failed" : "Add failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-black text-slate-800 mb-6">
          {editData ? 'Edit Patient' : 'Add New Patient'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Patient Name</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter name" required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <input 
              type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="91XXXXXXXXXX" required 
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            {editData ? 'Save Changes' : 'Add to Queue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  Search, UserPlus, Play, CheckCircle,
  LogOut, Loader2, ClipboardList,
  Trash2, Phone, Download, Edit3, Users, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AddPatientModal from '../components/AddPatientModal';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState('live');

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

  // ================= FETCH DATA =================
  const getData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${baseURL}/api/patients/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data || []);
    } catch (err) {
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => { getData(); }, []);

  // ================= DERIVED LOGIC (FIXED) =================
  const displayPatients = patients.filter(p => {
    const match =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm);

    if (view === 'history') return match && p.status === 'Completed';
    return match && p.status !== 'Completed';
  });

  const completedCount = patients.filter(p => p.status === 'Completed').length;
  const waitingCount = patients.filter(p => p.status === 'Waiting').length;

  const efficiency =
    patients.length === 0 ? 0 : Math.round((completedCount / patients.length) * 100);

  // ================= ACTIONS =================
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${baseURL}/api/patients/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Updated");
      getData();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setPatientToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${baseURL}/api/patients/delete/${patientToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted");
      setShowDeleteModal(false);
      getData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const downloadHistoryReport = () => {
    const history = patients.filter(p => p.status === 'Completed');
    if (!history.length) return toast.error("No data");

    const sheet = XLSX.utils.json_to_sheet(history.map(p => ({
      Name: p.name,
      Phone: p.phone,
      Date: new Date(p.createdAt).toLocaleDateString()
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "History");
    XLSX.writeFile(wb, "ClinicOS_History.xlsx");
  };

  // ================= UI =================
return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 lg:p-8 font-sans">
      <Toaster position="top-right" />

      {/* 1. HEADER SECTION (With Stats Toggle) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">ClinicOS</h1>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Premium Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH BAR (Wapas aa gaya) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search patient..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase mb-1">Total Patients</p>
            <h2 className="text-4xl font-black text-slate-800">{patients.length}</h2>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Users size={32} /></div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Efficiency</p>
            <h2 className="text-4xl font-black">{efficiency}%</h2>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl text-indigo-400"><Clock size={32} /></div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase mb-1">Waiting</p>
            <h2 className="text-4xl font-black text-indigo-600">{waitingCount}</h2>
          </div>
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><UserPlus size={32} /></div>
        </div>
      </div>

      {/* 3. CONTROLS (Add Button & View Toggle) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setView('live')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'live' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Live Queue
          </button>
          <button 
            onClick={() => setView('history')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            History
          </button>
        </div>

        <div className="flex gap-3">
          {view === 'history' && (
            <button 
              onClick={downloadHistoryReport}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-100 transition-all"
            >
              <Download size={20} /> Export Excel
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
          >
            <UserPlus size={20} /> Add New Patient
          </button>
        </div>
      </div>

      {/* 4. PATIENTS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="font-bold text-gray-500">Connecting to Atlas...</p>
        </div>
      ) : displayPatients.length === 0 ? (
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] py-20 text-center border-2 border-dashed border-gray-200">
          <p className="text-xl font-bold text-gray-400">No {view} patients found matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayPatients.map(p => (
            <div key={p._id} className="group bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  p.status === 'In-Consultation' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {p.status || 'Waiting'}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                  <button onClick={() => confirmDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-1">{p.name}</h3>
              <p className="flex items-center gap-2 text-gray-500 font-medium mb-6"><Phone size={14} />{p.phone}</p>

              {(p.status || 'Waiting') !== 'Completed' && (
                <button
                  onClick={() => updateStatus(p._id, p.status === 'In-Consultation' ? 'Completed' : 'In-Consultation')}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                    p.status === 'In-Consultation' 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600' 
                    : 'bg-slate-100 text-slate-800 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {p.status === 'In-Consultation' ? <><CheckCircle size={20}/> Mark Done</> : <><Play size={20}/> Start Consultation</>}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal (Optional: Can be a separate component) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-8">This patient's record will be permanently removed from the system.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">Cancel</button>
              <button onClick={executeDelete} className="py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refreshData={getData}
        editData={selectedPatient}
      />
    </div>
  );
};

export default Dashboard;
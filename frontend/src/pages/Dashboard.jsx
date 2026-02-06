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
    <div className="min-h-screen bg-[#F0F4F8] p-4 lg:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-white p-4 rounded-3xl shadow">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white">
            <ClipboardList />
          </div>
          <h1 className="text-2xl font-black">ClinicOS</h1>
        </div>
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          className="flex items-center gap-2 text-red-500 font-bold"
        >
          <LogOut /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow">
          <p>Total Patients</p>
          <h2 className="text-4xl font-black">{patients.length}</h2>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow">
          <p>Efficiency</p>
          <h2 className="text-4xl font-black">{efficiency}%</h2>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <p>Waiting</p>
          <h2 className="text-4xl font-black">{waitingCount}</h2>
        </div>
      </div>

      {/* Patients */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : displayPatients.length === 0 ? (
        <p className="text-center text-gray-400">No Patients Found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayPatients.map(p => (
            <div key={p._id} className="bg-white p-6 rounded-3xl shadow">
              <h3 className="text-xl font-black">{p.name}</h3>
              <p className="flex items-center gap-2 text-gray-500"><Phone size={14} />{p.phone}</p>

              {(p.status || 'Waiting') !== 'Completed' && (
                <button
                  onClick={() => updateStatus(p._id,
                    p.status === 'In-Consultation' ? 'Completed' : 'In-Consultation')}
                  className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl"
                >
                  {p.status === 'In-Consultation' ? 'Mark Done' : 'Start'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl">
            <p className="mb-4 font-bold">Delete patient?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={executeDelete} className="text-red-500">Delete</button>
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

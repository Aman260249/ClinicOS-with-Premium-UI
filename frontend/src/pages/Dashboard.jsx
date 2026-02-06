import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { 
  Search, UserPlus, Play, CheckCircle, 
  LogOut, Loader2, ClipboardList,
  Trash2, Phone, Download, Edit3, Users, Clock, ArrowRight
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

  // Sabhi calls ke liye common Clean URL
  const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

  // --- LOGIC UPDATED WITH BASEURL ---
  const getData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // URL cleaned with baseURL
      const res = await axios.get(`${baseURL}/api/patients/all?t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    } catch (err) { 
      console.error(err);
      toast.error("Data load nahi hua!"); 
    }
    setLoading(false);
  };

  useEffect(() => { getData(); }, []);

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading(`Updating...`);
    try {
      // URL cleaned with baseURL
      await axios.put(`${baseURL}/api/patients/update-status/${id}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Updated!`, { id: loadingToast });
      await getData();
    } catch (err) { 
      toast.error("Failed!", { id: loadingToast });
    }
  };

  const executeDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      // URL cleaned with baseURL
      await axios.delete(`${baseURL}/api/patients/delete/${patientToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted!");
      setShowDeleteModal(false);
      await getData();
    } catch (err) { 
      toast.error("Error deleting patient!"); 
    }
  };
  // --- UI START ---
  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 lg:p-8 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <Toaster position="top-right" />
      
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-white/70 backdrop-blur-md p-4 rounded-[2.5rem] shadow-xl border border-white/40">
        <div className="flex items-center gap-4 pl-2">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-3 rounded-2xl text-white shadow-indigo-200 shadow-lg">
            <ClipboardList size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">ClinicOS</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management Suite</span>
          </div>
        </div>
        <button 
          onClick={() => {localStorage.removeItem('token'); navigate('/login')}} 
          className="group flex items-center gap-2 text-slate-500 hover:text-rose-500 font-bold px-6 py-3 rounded-2xl transition-all hover:bg-rose-50"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>

      {/* Hero Stats Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Total Patients */}
        <div className="relative overflow-hidden bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
          <div className="absolute -right-4 -top-4 bg-indigo-50 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase mb-2">Patient Traffic</p>
              <h3 className="text-4xl font-black text-slate-800">{patients.length}</h3>
            </div>
            <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg shadow-indigo-200"><Users size={30} /></div>
          </div>
        </div>

        {/* Efficiency Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
            <CheckCircle size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-slate-400 text-xs font-black uppercase mb-2">Efficiency Rate</p>
                <h3 className="text-4xl font-black">{efficiency}%</h3>
              </div>
              <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-bold backdrop-blur-md italic">{completedCount} Done</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div className="bg-gradient-to-r from-indigo-400 to-cyan-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(129,140,248,0.5)]" style={{ width: `${efficiency}%` }} />
            </div>
          </div>
        </div>

        {/* Waiting Card */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-amber-100 transition-all duration-500">
           <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase mb-2">Waiting Room</p>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-black text-slate-800">{waitingCount}</h3>
                <div className="flex space-x-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce delay-100" />
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce delay-200" />
                </div>
              </div>
            </div>
            <div className="bg-amber-500 p-4 rounded-3xl text-white shadow-lg shadow-amber-200"><Clock size={30} /></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center justify-between bg-slate-200/40 p-3 rounded-[2.5rem]">
          <div className="flex gap-2 p-1.5 bg-white rounded-[2rem] shadow-inner w-full lg:w-fit">
            <button onClick={() => setView('live')} className={`flex-1 lg:flex-none px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${view === 'live' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-500 hover:bg-slate-50'}`}>Live Queue</button>
            <button onClick={() => setView('history')} className={`flex-1 lg:flex-none px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-500 hover:bg-slate-50'}`}>History</button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto px-2">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Find patient..." 
                className="w-full md:w-80 pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-indigo-600 rounded-[1.8rem] outline-none shadow-sm focus:shadow-xl focus:shadow-indigo-50 transition-all font-bold text-slate-700"
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            {view === 'live' ? (
              <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 text-white px-8 py-4 rounded-[1.8rem] font-bold shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-2 tracking-tight">
                <UserPlus size={20} /> Add Patient
              </button>
            ) : (
              <button onClick={downloadHistoryReport} className="bg-emerald-600 text-white px-8 py-4 rounded-[1.8rem] font-bold shadow-xl hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 tracking-tight">
                <Download size={20} /> Export Excel
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
            </div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Data...</p>
          </div>
        ) : displayPatients.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
             <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-slate-200" size={48} />
             </div>
             <p className="text-slate-400 font-black text-xl tracking-tight">No Patients Found</p>
             <p className="text-slate-300 text-sm font-bold">Try adjusting your search or filters</p>
          </div>
        ) : view === 'live' ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {displayPatients.map((p) => (
              <div key={p._id} className="group bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 relative flex flex-col justify-between">
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter border-2 ${
                      (p.status || 'Waiting') === 'Waiting' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        (p.status || 'Waiting') === 'Waiting' ? 'bg-amber-400' : 'bg-indigo-500 animate-pulse'
                      }`} /> 
                      Q-{p.queueNumber} • {p.status || 'Waiting'}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                      <button onClick={() => handleEdit(p)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => confirmDelete(p._id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2 leading-tight tracking-tight">{p.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm italic"><Phone size={14} /> {p.phone}</div>
                </div>

                <div className="relative pt-4">
                  {(p.status || 'Waiting').toLowerCase().trim() !== 'in-consultation' ? (
                    <button onClick={() => updateStatus(p._id, 'In-Consultation')} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200">
                      <Play size={20} fill="currentColor" /> START SESSION
                    </button>
                  ) : (
                    <button onClick={() => updateStatus(p._id, 'Completed')} className="w-full bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-200">
                      <CheckCircle size={20} /> MARK AS DONE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* History Table UI Upgrade */
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-10 py-8">Patient Detail</th>
                  <th className="px-10 py-8">Contact</th>
                  <th className="px-10 py-8 text-center">Status</th>
                  <th className="px-10 py-8 text-right">Service Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayPatients.map(p => (
                  <tr key={p._id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-black text-lg text-slate-700 tracking-tight">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 font-bold text-slate-500 italic">{p.phone}</td>
                    <td className="px-10 py-7 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-[10px] font-black uppercase border-2 border-emerald-200">COMPLETED</span>
                    </td>
                    <td className="px-10 py-7 text-right">
                       <div className="flex flex-col items-end">
                         <span className="text-slate-700 font-black tracking-tight">{new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                         <span className="text-[10px] text-slate-300 font-bold">{new Date(p.createdAt).getFullYear()}</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation UI */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] p-10 max-w-sm w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
               <Trash2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 text-center tracking-tight">Are you sure?</h2>
            <p className="text-slate-400 text-center font-bold text-sm mb-8 leading-relaxed">This patient's record will be permanently removed from our database.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-5 bg-slate-100 rounded-[1.8rem] font-black text-slate-600 hover:bg-slate-200 transition-all">Go Back</button>
              <button onClick={executeDelete} className="flex-1 py-5 bg-rose-500 text-white rounded-[1.8rem] font-black shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Already stylized by you */}
      <AddPatientModal isOpen={isModalOpen} onClose={handleCloseModal} refreshData={getData} editData={selectedPatient} />
    </div>
  );
};

export default Dashboard;
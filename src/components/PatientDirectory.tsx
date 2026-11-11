import React, { useState } from 'react';
import { Patient } from '../types/clinical.ts';
import { Search, User, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PatientDirectoryProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.mrn && p.mrn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a6364]/10 pb-3">
        <div>
          <h2 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
            Patient Cohort & Outpatient Registry
          </h2>
          <p className="text-xs text-[#717978]">
            Search by patient name, UHID (Unique Health ID), MRN, or city
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#717978] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Ananya, UHID-KA..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredPatients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          const isCritical = patient.status === 'Critical Attention';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'border-[#214b4c] bg-[#214b4c]/5 ring-1 ring-[#214b4c]'
                  : 'border-[#3a6364]/15 bg-[#fdfbf7] hover:border-[#3a6364]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#717978]">
                    {patient.uhid}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#d1e7dd] text-[#284b4c]'
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
                  {patient.name}
                </h3>
                <p className="text-xs text-[#717978] mt-0.5">
                  {patient.age} Y · {patient.gender} · Blood: {patient.bloodGroup}
                </p>
                <p className="text-[11px] text-[#717978] mt-1 line-clamp-1">
                  {patient.chiefComplaint}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#3a6364]/10 flex items-center justify-between text-[11px] text-[#717978]">
                <span>BP: {patient.vitals.bloodPressure}</span>
                <span>Last: {patient.lastVisit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

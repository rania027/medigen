import React, { useState } from 'react';
import { Patient, MedicationItem, DrugInteraction } from '../types/clinical.ts';
import {
  Pill,
  AlertTriangle,
  Plus,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';

interface PrescriptionSafetyProps {
  patient: Patient;
  medications: MedicationItem[];
  drugInteractions: DrugInteraction[];
  onAddMedication: (med: MedicationItem) => void;
  onRemoveMedication: (id: string) => void;
}

export const PrescriptionSafety: React.FC<PrescriptionSafetyProps> = ({
  patient,
  medications,
  drugInteractions,
  onAddMedication,
  onRemoveMedication,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('Linagliptin 5 mg (Trajenta)');
  const [newActive, setNewActive] = useState('Linagliptin');
  const [newDosage, setNewDosage] = useState('5 mg');
  const [newFreq, setNewFreq] = useState<'OD' | 'BD' | 'TDS' | 'SOS'>('OD');
  const [newTiming, setNewTiming] = useState<'Before Food' | 'After Food' | 'With Food' | 'At Bedtime'>('With Food');
  const [newPrice, setNewPrice] = useState('240.00');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MedicationItem = {
      id: `med-${Date.now()}`,
      name: newMedName,
      activeIngredient: newActive,
      dosage: newDosage,
      frequency: newFreq,
      timing: newTiming,
      route: 'Oral',
      duration: 'Ongoing',
      prescribingDoctor: 'Dr. Rajesh K. Varma, MD, DM',
      prescribedDate: new Date().toLocaleDateString('en-GB'),
      inrPrice: parseFloat(newPrice) || 150,
      status: 'active',
    };
    onAddMedication(item);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif-clinical text-xl font-bold text-[#181a2e]">
              Prescription Safety, Drug Interactions & Regimen Management
            </h2>
            <span className="text-[10px] font-mono bg-[#ba1a1a]/10 text-[#ba1a1a] font-bold px-2 py-0.5 rounded-full">
              {drugInteractions.length} Active Alerts
            </span>
          </div>
          <p className="text-xs text-[#717978] mt-0.5">
            CDSCO-guided interaction engine with eGFR clearance contraindication monitoring
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinical Order</span>
        </button>
      </div>

      {/* Severe Drug Interaction Alerts */}
      <div className="space-y-3">
        {drugInteractions.map((alert) => (
          <div
            key={alert.id}
            className="bg-[#ffdad6]/40 border-2 border-[#ba1a1a]/40 rounded-2xl p-5 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
                <span className="font-bold text-sm text-[#ba1a1a]">
                  CRITICAL INTERACTION: {alert.drugA} ⟷ {alert.drugB}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold bg-[#ba1a1a] text-white px-2 py-0.5 rounded">
                {alert.severity} Risk
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[#181a2e]">
              <div className="bg-white/80 p-3 rounded-xl border border-[#ba1a1a]/20">
                <span className="font-semibold text-[#ba1a1a]">Pathophysiologic Mechanism:</span>
                <p className="mt-0.5 text-[#717978]">{alert.mechanism}</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-[#ba1a1a]/20">
                <span className="font-semibold text-[#214b4c]">Clinical Corrective Action:</span>
                <p className="mt-0.5 text-[#181a2e] font-medium">{alert.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Medications List */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#3a6364]/10 pb-3">
          <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
            Current Inpatient / Outpatient Medication Regimen ({medications.length} Prescriptions)
          </h3>
          <span className="text-xs font-mono text-[#717978]">Prices in INR (₹)</span>
        </div>

        <div className="space-y-3">
          {medications.map((med) => {
            const hasWarning = !!med.safetyWarning;

            return (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all ${
                  hasWarning
                    ? 'border-[#ba1a1a]/30 bg-[#ffdad6]/10'
                    : 'border-[#3a6364]/15 bg-[#fdfbf7]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#181a2e]">{med.name}</h4>
                      <span className="text-xs text-[#717978]">({med.activeIngredient})</span>
                      <span className="text-[10px] font-mono bg-[#214b4c]/10 text-[#214b4c] font-bold px-2 py-0.5 rounded">
                        {med.frequency}
                      </span>
                      <span className="text-[10px] font-mono bg-[#f4f0e8] text-[#181a2e] px-2 py-0.5 rounded">
                        {med.timing}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#717978]">
                      <span>Dose: {med.dosage}</span>
                      <span>·</span>
                      <span>Route: {med.route}</span>
                      <span>·</span>
                      <span>Prescribed: {med.prescribedDate}</span>
                      <span>·</span>
                      <span className="font-mono text-[#214b4c] font-bold">
                        MRP: ₹{med.inrPrice.toFixed(2)}
                      </span>
                    </div>

                    {med.safetyWarning && (
                      <div className="text-xs bg-[#ffdad6] text-[#ba1a1a] p-2.5 rounded-lg font-medium flex items-start gap-1.5 mt-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{med.safetyWarning}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveMedication(med.id)}
                    className="p-2 text-[#717978] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/20 rounded-lg transition-colors self-start sm:self-center"
                    title="Discontinue / De-prescribe Medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#3a6364]/20">
            <h3 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
              Add Prescribed Medication
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#181a2e] mb-1">
                  Brand Name & Strength
                </label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#181a2e] mb-1">
                  Active Pharmacological Molecule
                </label>
                <input
                  type="text"
                  required
                  value={newActive}
                  onChange={(e) => setNewActive(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#181a2e] mb-1">Frequency</label>
                  <select
                    value={newFreq}
                    onChange={(e: any) => setNewFreq(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl"
                  >
                    <option value="OD">OD (Once Daily)</option>
                    <option value="BD">BD (Twice Daily)</option>
                    <option value="TDS">TDS (Thrice Daily)</option>
                    <option value="SOS">SOS (As Needed)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#181a2e] mb-1">Timing</label>
                  <select
                    value={newTiming}
                    onChange={(e: any) => setNewTiming(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl"
                  >
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                    <option value="With Food">With Food</option>
                    <option value="At Bedtime">At Bedtime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#181a2e] mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#3a6364]/20 rounded-xl text-[#717978]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl font-semibold"
                >
                  Prescribe Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

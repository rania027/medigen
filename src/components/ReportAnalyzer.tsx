import React, { useState } from 'react';
import { Patient, LabReport } from '../types/clinical.ts';
import {
  FileText,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  Building2,
  CheckCircle,
  Filter,
} from 'lucide-react';

interface ReportAnalyzerProps {
  patient: Patient;
  currentReport: LabReport;
  priorReport?: LabReport;
  onUpdateReport: (report: LabReport) => void;
}

export const ReportAnalyzer: React.FC<ReportAnalyzerProps> = ({
  patient,
  currentReport,
  priorReport,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Renal', 'Metabolic', 'Lipid', 'Cardiovascular'];

  const filteredTests =
    filterCategory === 'all'
      ? currentReport.tests
      : currentReport.tests.filter((t) => t.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Report Facility & Metadata */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-[#3a6364]/10 text-[#214b4c] font-bold px-2 py-0.5 rounded">
                NABL ACCREDITED
              </span>
              <h2 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
                {currentReport.report_type}
              </h2>
            </div>
            <p className="text-xs text-[#717978] mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {currentReport.facility}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-[#717978]">
            <div className="flex items-center gap-1 sm:justify-end">
              <Clock className="w-3.5 h-3.5" />
              <span>Report Date: {currentReport.report_date}</span>
            </div>
            <p className="text-[11px] mt-0.5">Technician: {currentReport.technician_name}</p>
          </div>
        </div>

        {/* Impression */}
        <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#3a6364]/10 text-xs text-[#181a2e]">
          <span className="font-bold text-[#214b4c]">Clinical Impression:</span>{' '}
          {currentReport.clinical_impression}
        </div>
      </div>

      {/* Longitudinal Comparison Bar */}
      {priorReport && (
        <div className="bg-[#f4f0e8] rounded-2xl p-4 border border-[#3a6364]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#ba1a1a]" />
            <span className="font-semibold text-[#181a2e]">
              Longitudinal Renal Trajectory (6-Month Delta):
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <div>
              <span className="text-[#717978]">eGFR: </span>
              <span className="line-through text-[#717978]">47</span> →{' '}
              <span className="font-bold text-[#ba1a1a]">38 mL/min (-19%)</span>
            </div>
            <div>
              <span className="text-[#717978]">Creatinine: </span>
              <span className="line-through text-[#717978]">1.45</span> →{' '}
              <span className="font-bold text-[#ba1a1a]">1.82 mg/dL (+25%)</span>
            </div>
            <div>
              <span className="text-[#717978]">HbA1c: </span>
              <span className="line-through text-[#717978]">8.2%</span> →{' '}
              <span className="font-bold text-[#ba1a1a]">8.8%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tests Table with Filter */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a6364]/10 pb-3">
          <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
            Biochemical Analyte Panel ({filteredTests.length} Tests)
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-[#f4f0e8] p-1 rounded-xl">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  filterCategory === c
                    ? 'bg-white text-[#214b4c] shadow-xs'
                    : 'text-[#717978] hover:text-[#181a2e]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fdfbf7] text-[#717978] font-semibold border-b border-[#3a6364]/10">
              <tr>
                <th className="py-2.5 px-3">Analyte / Test Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Result Value</th>
                <th className="py-2.5 px-3">Reference Range</th>
                <th className="py-2.5 px-3">Clinical Risk Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a6364]/10">
              {filteredTests.map((test) => {
                const isCritical = test.status === 'critical';
                const isAbnormal = test.status === 'abnormal';

                return (
                  <tr
                    key={test.id}
                    className={`hover:bg-[#fdfbf7] ${
                      isCritical
                        ? 'bg-[#ffdad6]/10'
                        : isAbnormal
                        ? 'bg-[#fff3cd]/10'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-[#181a2e]">
                      {test.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f4f0e8] text-[#717978]">
                        {test.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={`text-sm ${
                          isCritical
                            ? 'text-[#ba1a1a]'
                            : isAbnormal
                            ? 'text-[#ba1a1a]'
                            : 'text-[#214b4c]'
                        }`}
                      >
                        {test.value}
                      </span>{' '}
                      <span className="text-[11px] font-normal text-[#717978]">
                        {test.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#717978] font-mono text-[11px]">
                      {test.referenceRange} {test.unit}
                    </td>
                    <td className="py-3 px-3 text-xs text-[#717978]">
                      {test.clinicalNote || 'Within expected biological tolerance'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

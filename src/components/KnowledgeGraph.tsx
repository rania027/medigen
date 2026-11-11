import React, { useState } from 'react';
import { Patient } from '../types/clinical.ts';
import {
  Network,
  Activity,
  AlertTriangle,
  Pill,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';

interface KnowledgeGraphProps {
  patient: Patient;
}

interface Node {
  id: string;
  label: string;
  category: 'condition' | 'biomarker' | 'drug' | 'warning' | 'guideline';
  desc: string;
  x: number;
  y: number;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ patient }) => {
  const [selectedNode, setSelectedNode] = useState<string>('node-warn-1');

  const nodes: Node[] = [
    {
      id: 'node-pt',
      label: patient.name,
      category: 'condition',
      desc: `Patient ${patient.uhid}, Age ${patient.age}, T2DM & CKD Stage 3b`,
      x: 320,
      y: 190,
    },
    {
      id: 'node-egfr',
      label: 'eGFR 38 mL/min',
      category: 'biomarker',
      desc: 'Critical renal decline; Stage 3b CKD confirmed.',
      x: 140,
      y: 90,
    },
    {
      id: 'node-glyc',
      label: 'Glycomet 2000mg/d',
      category: 'drug',
      desc: 'Metformin SR 1000mg BD. Exceeds safe threshold for eGFR < 45.',
      x: 130,
      y: 290,
    },
    {
      id: 'node-warn-1',
      label: 'Lactic Acidosis Risk',
      category: 'warning',
      desc: 'CRITICAL ALERT: Metformin accumulation risk under impaired tubular clearance.',
      x: 50,
      y: 190,
    },
    {
      id: 'node-bruf',
      label: 'Brufen 400mg (NSAID)',
      category: 'drug',
      desc: 'Causes renal afferent arteriolar vasoconstriction.',
      x: 500,
      y: 90,
    },
    {
      id: 'node-telma',
      label: 'Telma-H 40/12.5mg',
      category: 'drug',
      desc: 'Telmisartan ARB causes efferent arteriolar vasodilation.',
      x: 510,
      y: 290,
    },
    {
      id: 'node-warn-2',
      label: 'Triple Whammy AKI Risk',
      category: 'warning',
      desc: 'NSAID + ARB + Thiazide causes precipitous fall in intraglomerular pressure.',
      x: 630,
      y: 190,
    },
    {
      id: 'node-rssdi',
      label: 'RSSDI 2024 Guidelines',
      category: 'guideline',
      desc: 'Mandates max 1000mg Metformin in CKD 3b, recommend DPP-4i Linagliptin 5mg.',
      x: 320,
      y: 40,
    },
  ];

  const edges = [
    { from: 'node-pt', to: 'node-egfr' },
    { from: 'node-pt', to: 'node-glyc' },
    { from: 'node-pt', to: 'node-bruf' },
    { from: 'node-pt', to: 'node-telma' },
    { from: 'node-glyc', to: 'node-warn-1' },
    { from: 'node-egfr', to: 'node-warn-1' },
    { from: 'node-bruf', to: 'node-warn-2' },
    { from: 'node-telma', to: 'node-warn-2' },
    { from: 'node-egfr', to: 'node-rssdi' },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[0];

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'warning':
        return 'fill-[#ffdad6] stroke-[#ba1a1a] text-[#ba1a1a]';
      case 'drug':
        return 'fill-[#f4f0e8] stroke-[#3a6364] text-[#214b4c]';
      case 'biomarker':
        return 'fill-[#cfe2ff] stroke-[#084298] text-[#084298]';
      case 'guideline':
        return 'fill-[#d1e7dd] stroke-[#0f5132] text-[#0f5132]';
      default:
        return 'fill-[#214b4c] stroke-[#214b4c] text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif-clinical text-xl font-bold text-[#181a2e]">
              Multimodal Clinical Knowledge Graph & Organ Network
            </h2>
            <span className="text-[10px] font-mono bg-[#3a6364]/10 text-[#214b4c] font-bold px-2 py-0.5 rounded-full">
              Graph Topology
            </span>
          </div>
          <p className="text-xs text-[#717978] mt-0.5">
            Interconnected disease-drug-biomarker relationships and CDSCO safety edges
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Graph Viewport */}
        <div className="lg:col-span-2 bg-[#fdfbf7] rounded-2xl border border-[#3a6364]/15 p-4 shadow-xs relative overflow-hidden flex items-center justify-center min-h-[420px]">
          <svg viewBox="0 0 700 360" className="w-full h-auto select-none">
            {/* Edges */}
            {edges.map((edge, i) => {
              const src = nodes.find((n) => n.id === edge.from)!;
              const dst = nodes.find((n) => n.id === edge.to)!;
              return (
                <line
                  key={i}
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  stroke="#3a6364"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  strokeDasharray="4 2"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isCenter = node.id === 'node-pt';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isCenter ? 32 : 24}
                    className={`${categoryColor(node.category)} ${
                      isSelected ? 'stroke-4 filter drop-shadow' : 'stroke-2'
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 40}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-[#181a2e] font-sans pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Entity Node Detail */}
        <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#3a6364]/10 pb-3">
            <Layers className="w-4 h-4 text-[#214b4c]" />
            <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
              Entity Diagnostic Node
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#717978]">
                Category: {activeNodeData.category.toUpperCase()}
              </span>
              <h4 className="text-lg font-serif-clinical font-bold text-[#214b4c] mt-0.5">
                {activeNodeData.label}
              </h4>
            </div>

            <div className="p-3.5 bg-[#fdfbf7] rounded-xl border border-[#3a6364]/10 text-xs text-[#181a2e] leading-relaxed">
              {activeNodeData.desc}
            </div>

            <div className="text-[11px] text-[#717978] space-y-1 pt-2">
              <span className="font-semibold text-[#181a2e]">Graph Relationships:</span>
              <p>
                Connected to relevant clinical endpoints through validated pathophysiological pathways. Click on any node in the topology map to inspect mechanism.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

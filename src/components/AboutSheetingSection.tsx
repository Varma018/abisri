import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Sun, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Ruler, 
  Droplets, 
  Wrench,
  Check
} from 'lucide-react';

export const AboutSheetingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trapezoidal' | 'standing-seam' | 'insulation' | 'daylight'>('trapezoidal');

  const tabs = [
    {
      id: 'trapezoidal',
      label: 'Trapezoidal Sheeting',
      icon: <Layers className="w-4 h-4" />,
      tag: 'Standard & High-Tensile',
      title: 'Galvalume & PPGL Trapezoidal Profile Sheeting',
      shortDesc: 'High-tensile Galvalume (AZ150) and pre-painted PPGL profiled roof and wall cladding designed for durability and storm runoff.',
      features: [
        'Profile Depth: 28mm – 32mm crest height for accelerated storm water evacuation',
        'Effective Width: 1000mm – 1020mm cover width optimizing purlin spacing and steel weight',
        'Material Grade: 550 MPa high-tensile steel conforming to ASTM A792 & AS 1397',
        'Coating Protection: AZ150 (55% Aluminium, 43.5% Zinc, 1.5% Silicon alloy coating)',
        'Anti-Capillary Groove: Factory-formed siphon break prevents capillary water seepage at side laps',
        'Finish Options: Bare Galvalume or PPGL (RMP, SMP, PVDF) in a wide palette of industrial shades'
      ],
      idealFor: 'Industrial manufacturing sheds, factory warehouses, workshops, perimeter walls, and standard PEB structures.'
    },
    {
      id: 'standing-seam',
      label: 'Standing Seam System',
      icon: <ShieldCheck className="w-4 h-4" />,
      tag: '100% Puncture-Free',
      title: 'Motorized 360° Concealed-Clip Standing Seam Roofing',
      shortDesc: 'State-of-the-art standing seam metal roofing engineered with concealed expansion clips, eliminating through-fasteners on the roof plane.',
      features: [
        'Zero Penetrations: 100% puncture-free roof surface secured via concealed movable sliding clips',
        'Thermal Movement: Sliding clips accommodate longitudinal expansion/contraction during extreme weather',
        '360° Double-Lock Seam: Motorized electric seamer mechanically locks seams for extreme wind uplift resistance',
        'Continuous Lengths: On-site roll-forming delivers single unbroken sheets up to 60+ meters (no end laps)',
        'Low Slope Capability: Safely deployed on low-pitch roofs down to 1:50 (1.15° slope) with zero leakage risk',
        'Severe Weather Tested: Conforms to ASTM E1592 dynamic wind uplift & FM Global structural approvals'
      ],
      idealFor: 'Large-scale logistics distribution hubs, FMCG warehouses, aviation hangars, and high-value dry storage facilities.'
    },
    {
      id: 'insulation',
      label: 'Insulation & Thermal Comfort',
      icon: <ThermometerSnowflake className="w-4 h-4" />,
      tag: 'Energy Conservation',
      title: 'Underdeck Thermal & Acoustic Insulation Systems',
      shortDesc: 'Multi-layered glass wool and rockwool insulation barriers with reinforced reflective facing to lower indoor temperatures and reduce cooling costs.',
      features: [
        'Temperature Reduction: Lowers shed ambient temperatures by 6°C to 8°C beneath peak summer sun',
        'Reinforced Facing: Heavy-duty Aluminum Foil Facing (FSK) serves as a radiant vapor barrier',
        'Density & Thickness: 16 – 48 kg/m³ density glass wool in 50mm, 75mm, or 100mm thicknesses',
        'Acoustic Dampening: Drastically dampens heavy rain chatter noise (NRC up to 0.90)',
        'Fire Retardant: Class-1 fire rating and non-combustible classification (BS 476 / IS 8183)',
        'Condensation Control: Prevents internal dripping and structural corrosion on underside steel members'
      ],
      idealFor: 'Pharmaceutical units, textile mills, electronics manufacturing, food cold chain sheds, and occupant-heavy workspaces.'
    },
    {
      id: 'daylight',
      label: 'Skylights & Ventilation',
      icon: <Sun className="w-4 h-4" />,
      tag: 'Natural Lighting & Airflow',
      title: 'UV-Stabilized Polycarbonate Panels & Ridge Ventilators',
      shortDesc: 'Engineered daylighting strips and continuous aerodynamic ridge ventilators that maximize natural illumination and passive ventilation.',
      features: [
        'Matching Profiles: Polycarbonate sheets matched identically to steel profiles for seamless overlap',
        'UV Protective Co-Extrusion: Blocks 99.9% harmful UV rays while transmitting up to 85% diffused daylight',
        'Energy Savings: Eliminates the need for artificial daytime lighting across 5%–10% roof daylight area',
        'Impact Resistance: 250 times stronger than glass; withstands hailstones, windborne debris, and thermal cycles',
        'Continuous Ridge Vents: Aerodynamically engineered throat ventilators for non-powered, round-the-clock air change',
        'Industrial Louvers: Wall-mounted stormproof louvers for continuous cross-ventilation at work floor levels'
      ],
      idealFor: 'All green-building certified industrial warehouses, commercial sheds, and heavy engineering shops.'
    }
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="mt-20 pt-16 border-t border-gray-200">
      
      {/* 1. Section Header Banner */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
          <span className="w-5 h-[2px] bg-[#E31B23]" />
          <span>Specialized Roofing &amp; Cladding Technology</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 font-display tracking-tight mb-4">
          About Sheeting in Modern Construction
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          In industrial infrastructure and Pre-Engineered Buildings (PEB), roof and wall sheeting form the ultimate barrier against wind, monsoon rains, and thermal heat. At Yards Infra, we deliver precision roll-formed Galvalume, PPGL trapezoidal profiles, and 100% leak-proof standing seam roofing systems engineered to withstand harsh weather for 25+ years.
        </p>
      </div>

      {/* 2. Interactive Sheeting Solutions Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-xs mb-16">
        
        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#E31B23] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display - Full-Width Technical Specifications */}
        <div className="mt-8 space-y-6">
          
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-50 text-[#E31B23] border border-red-200 mb-2">
              {currentTab.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-950 font-display">
              {currentTab.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-4xl">
              {currentTab.shortDesc}
            </p>
          </div>

          {/* Key Deliverables / Features Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E31B23]" />
              <span>Technical Highlights &amp; Specifications</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentTab.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 bg-gray-50/80 p-3 rounded border border-gray-100">
                  <Check className="w-3.5 h-3.5 text-[#E31B23] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal Applications */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
            <strong className="text-gray-950 font-bold block mb-1">Recommended Application:</strong>
            <span>{currentTab.idealFor}</span>
          </div>

        </div>

      </div>

      {/* 3. Sheeting Comparison Matrix: Trapezoidal vs Standing Seam */}
      <div className="mb-16">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-2">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>Engineering Comparison Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-950 font-display">
            Choosing the Right Sheeting Solution for Your Facility
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Compare key parameters between conventional screw-down trapezoidal profiles and modern 360° concealed standing seam roofing.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs text-gray-700 min-w-[620px]">
            <thead className="bg-gray-100 text-gray-950 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Engineering Parameter</th>
                <th className="py-3.5 px-4 sm:px-6 bg-red-50/50 text-[#E31B23]">Trapezoidal Profile Sheeting</th>
                <th className="py-3.5 px-4 sm:px-6 bg-gray-50 text-gray-950">Standing Seam Roofing System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Roof Penetrations</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Through-fasteners with EPDM washers</td>
                <td className="py-3 px-4 sm:px-6 font-semibold text-emerald-700">Zero exposed penetrations (100% puncture-free)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Fastening Mechanism</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Class 3 / Class 4 self-drilling screws</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Concealed sliding thermal expansion clips</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Seam &amp; Lap Joint</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Overlapped with anti-capillary groove &amp; butyl tape</td>
                <td className="py-3 px-4 sm:px-6 font-semibold text-emerald-700">Motorized 360° double-lock mechanical seaming</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Maximum Continuous Length</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Up to 12 – 14 meters (transport limit)</td>
                <td className="py-3 px-4 sm:px-6 font-semibold text-emerald-700">Up to 60+ meters (on-site continuous roll-forming)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Minimum Recommended Slope</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">1:10 (approx. 5.7° slope)</td>
                <td className="py-3 px-4 sm:px-6 font-semibold text-emerald-700">1:50 (approx. 1.15° slope for ultra-low pitches)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Base Metal &amp; Tensile Strength</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">AZ150 Galvalume / PPGL (550 MPa yield)</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">AZ150 / AZ200 Galvalume (300 to 550 MPa)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">Primary Applications</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Industrial sheds, side wall cladding, canopy roofs</td>
                <td className="py-3 px-4 sm:px-6 text-gray-600">Large logistics hubs, e-commerce centers, high-bay plants</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Hallmark Engineering Protocols in Sheeting */}
      <div>
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-2">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>Execution Excellence</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-950 font-display">
            The Yards Infra Sheeting Quality Standard
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Every sheeting project executed by our teams follows strict quality benchmarks from material sourcing to final water-testing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white border border-gray-200 rounded hover:border-[#E31B23] transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
              <Ruler className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-display">On-Site Roll Forming</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mobile roll-forming machines mobilized directly to your site, producing single ridge-to-eave sheets with zero transport damage and no end-laps.
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded hover:border-[#E31B23] transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-display">Torque-Calibrated Fasteners</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Electric torque-limiting drivers ensure EPDM washers are compressed evenly without dimpling steel sheets or damaging protective coatings.
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded hover:border-[#E31B23] transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-display">Under-Purlin Safety Netting</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Complete fall-arrest safety nets rigged beneath purlins alongside perimeter static lifelines prior to roof sheet placement on all jobsites.
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded hover:border-[#E31B23] transition-colors shadow-2xs">
            <div className="w-10 h-10 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-950 mb-1.5 font-display">CNC Flashings &amp; Trims</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Custom-bent heavy-gauge ridge caps, barge boards, apron flashings, and downpipes engineered to prevent bird nesting and rain infiltration.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

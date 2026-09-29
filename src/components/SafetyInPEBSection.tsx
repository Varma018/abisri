import React from 'react';
import { 
  ShieldCheck, 
  HardHat, 
  Wind, 
  Anchor, 
  AlertTriangle, 
  FileCheck, 
  CheckCircle2
} from 'lucide-react';

interface SafetyInPEBSectionProps {
  onOpenConsultation?: () => void;
}

export const SafetyInPEBSection: React.FC<SafetyInPEBSectionProps> = () => {
  const safetyProtocols = [
    {
      icon: <Anchor className="w-5 h-5 text-[#E31B23]" />,
      code: 'HIGH-ALTITUDE RIGGING',
      title: 'Continuous Fall Arrest Lifelines',
      description: 'Dual-lanyard energy-absorbing harnesses (EN 361), heavy-duty wire-rope perimeter static lifelines, and under-purlin safety catch nets installed before roof sheeting starts.'
    },
    {
      icon: <Wind className="w-5 h-5 text-[#E31B23]" />,
      code: 'CRANE RIGGING CONTROLS',
      title: 'Tandem Lifts & Wind Anemometers',
      description: 'Pre-lift load rigging calculations with certified nylon webbing/wire slings. All high-altitude girder lifts are halted if site wind speeds exceed 25 km/h via on-site digital anemometers.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#E31B23]" />,
      code: 'STRUCTURAL STABILITY',
      title: 'Temporary Portal Frame Bracing',
      description: 'Immediate diagonal cross-cable stays and guy-wire tie-backs anchored as soon as the first two truss portals are erected, guarding against progressive wind-induced collapse.'
    },
    {
      icon: <HardHat className="w-5 h-5 text-[#E31B23]" />,
      code: 'EXCLUSION ZONE',
      title: 'Zero-Drop Tool Tethering & Drop Zones',
      description: 'All pneumatic drivers, torque wrenches, and drift pins are tethered with tool lanyards. Ground perimeter areas below active erection bays are barricaded with restricted entry.'
    },
    {
      icon: <FileCheck className="w-5 h-5 text-[#E31B23]" />,
      code: 'DAILY GOVERNANCE',
      title: 'Daily JSA & Mandatory Toolbox Talks',
      description: 'Daily Job Safety Analysis (JSA) conducted with certified riggers, crane operators, and welders before every morning shift to evaluate ground stability, weather, and electrical risks.'
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-[#E31B23]" />,
      code: 'SAFETY CULTURE',
      title: 'Empowered Stop-Work Authority',
      description: 'Every worker on a Yards Infra jobsite holds absolute authority to halt any operation immediately if unverified rigging, compromised footing, or hazardous weather arises.'
    }
  ];

  const safetyMetrics = [
    { value: '100%', label: 'Certified Riggers & Operators', sub: 'Trained heavy-machinery staff' },
    { value: '< 25 km/h', label: 'Wind-Speed Lift Cutoff', sub: 'Automated digital wind monitors' },
    { value: 'Zero-Harm', label: 'Safety First Objective', sub: 'Zero-compromise jobsite standard' },
    { value: 'IS 800 & OSHA', label: 'Erection Code Compliance', sub: 'Indian & international benchmarks' }
  ];

  return (
    <section 
      id="safety-peb" 
      className="relative py-20 sm:py-28 bg-white overflow-hidden border-t border-gray-200"
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#E31B23] text-xs font-bold tracking-widest uppercase mb-4 shadow-2xs">
            <HardHat className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Pre-Engineered Building Jobsite Protocols</span>
          </div>

          <h2
            id="safety-in-peb-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 leading-tight font-display"
          >
            Safety in <span className="text-[#E31B23]">PEB</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            From multi-ton rafter rigging to 14-meter roof sheeting, our industrial Pre-Engineered Building erection is guided by uncompromising structural safety protocols and zero-harm execution.
          </p>
        </div>

        {/* Safety Protocols 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {safetyProtocols.map((protocol, idx) => (
            <div
              key={protocol.title}
              id={`safety-protocol-card-${idx}`}
              className="bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-[#E31B23] p-6 rounded-lg transition-all duration-300 hover:shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-white border border-gray-200 flex items-center justify-center group-hover:bg-[#E31B23] group-hover:border-[#E31B23] group-hover:text-white transition-all shadow-2xs">
                    {React.cloneElement(protocol.icon, {
                      className: 'w-5 h-5 text-[#E31B23] group-hover:text-white transition-colors'
                    })}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#E31B23] transition-colors">
                    {protocol.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors font-display mb-2.5">
                  {protocol.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {protocol.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-200/60 flex items-center gap-2 text-xs font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Harm Quality Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety KPI Metric Strip */}
        <div className="bg-gray-950 text-white rounded-xl p-8 sm:p-10 border border-gray-800 shadow-xl relative overflow-hidden">
          {/* Subtle Industrial Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E31B23] via-amber-500 to-[#E31B23]" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-800/80">
            {safetyMetrics.map((metric, idx) => (
              <div 
                key={metric.label} 
                className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-6 lg:pt-0 lg:pl-6' : ''}`}
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E31B23] tracking-tight font-display mb-1">
                  {metric.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1">
                  {metric.label}
                </span>
                <span className="text-[11px] text-gray-400">
                  {metric.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

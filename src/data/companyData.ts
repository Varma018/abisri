import { ServiceItem, ProjectItem, TestimonialItem, ProcessStep, WhyChooseUsItem, StatItem, TeamMember } from '../types';

export const COMPANY_INFO = {
  name: 'Yards Infra and Builders LLP',
  shortName: 'Yards Infra',
  monogram: 'YIB',
  tagline: 'Building Tomorrow, Today.',
  subTagline: 'Your trusted partner for industrial sheds, godowns, PEB erection, structural steel and infrastructure projects.',
  motto: 'Stronger Structures. Brighter Tomorrows.',
  peopleMotto: 'People. Structures. Progress.',
  quote: 'Building structures that support progress, people and possibilities.',
  whyChooseQuote: 'Your Vision. Our Commitment. A Stronger Tomorrows.',
  aboutTitle: 'Built on Values. Driven by Purpose.',
  aboutDescription: 'Yards Infra and Builders LLP is a construction and infrastructure company focused on industrial sheds, godowns and infrastructure projects. We combine engineering expertise with a practical approach to deliver strong, durable and cost-effective solutions for businesses.',
  phone: '+91 86887 44795',
  phoneAlt: '+91 86887 44795',
  email: 'varma.prabbas@gmail.com',
  emailProjects: 'varma.prabbas@gmail.com',
  address: 'Level 4, Yards Infra Tower, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033, India',
  regionalOffice: 'Block B, Embassy TechVillage, Outer Ring Road, Bengaluru, Karnataka 560103, India',
  workingHours: 'Monday – Saturday: 9:00 AM – 6:00 PM',
  reraReg: 'TS RERA Reg: P02400004921 | ISO 9001:2015 Certified General Contractor',
  whatsappNumber: '918688744795',
  whatsappMessage: 'Hello Yards Infra and Builders LLP, I am interested in your industrial construction services. I would like to discuss my project.',
};

export const STATS_DATA: StatItem[] = [
  {
    value: '10+',
    label: 'Years of Experience',
    description: 'Over a decade of engineering mastery, steel erection, and industrial infrastructure across India.',
  },
  {
    value: '50+',
    label: 'Projects Completed',
    description: 'Delivered large-span industrial sheds, logistics godowns, PEB warehouses, and heavy structural frameworks.',
  },
  {
    value: '100%',
    label: 'Quality Commitment',
    description: 'Strict 140-point quality audit checklist, high-grade steel fabrication, and certified weld testing.',
  },
  {
    value: '24/7',
    label: 'Client Support',
    description: 'Dedicated site project managers, live milestone tracking, and rapid on-ground response.',
  },
];

export const CORE_FOUR_AREAS = [
  {
    id: 'sheds',
    title: 'Industrial Sheds',
    subtitle: 'Built for Growth',
    icon: 'Warehouse',
    description: 'Custom-built industrial sheds designed for durability, functionality and long-term performance.'
  },
  {
    id: 'godowns',
    title: 'Godowns & Warehouses',
    subtitle: 'Space for Progress',
    icon: 'Package',
    description: 'Spacious and efficient godown and warehouse solutions for logistics, storage and business growth.'
  },
  {
    id: 'peb',
    title: 'PEB Erection',
    subtitle: 'Engineered for Efficiency',
    icon: 'Cog',
    description: 'Professional erection of pre-engineered buildings with precision, speed and uncompromised safety.'
  },
  {
    id: 'infra',
    title: 'Infrastructure Projects',
    subtitle: 'Building Better Communities',
    icon: 'Building',
    description: 'Support infrastructure projects including civil works and allied structures for industrial and commercial needs.'
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'industrial-shed-construction',
    title: 'Industrial Shed Construction',
    shortDescription: 'Custom-built industrial sheds designed for durability, functionality and long-term performance.',
    fullDescription: 'Custom-built industrial sheds designed for durability, heavy-load tolerance, and long-term industrial performance. Engineered with precision truss systems, high-clearance bays, weather-resistant cladding, and specialized crane beams for manufacturing and processing facilities.',
    iconName: 'Building2',
    deliverables: [
      'Heavy-Duty Structural Steel Truss Framing',
      'High-Tensile Zinc-Aluminium Color-Coated Roof & Wall Sheeting',
      'Overhead EOT Crane Gantry Beam Design & Erection',
      'FM2 Grade Heavy-Load Industrial Floor Slabs',
      'Turbo Ventilators, Skylights & Natural Daylight Polycarbonate Panels'
    ],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    timeline: '3 – 6 Months'
  },
  {
    id: 'godown-warehouse-construction',
    title: 'Godown & Warehouse Construction',
    shortDescription: 'Spacious and efficient godown and warehouse solutions for logistics, storage and business growth.',
    fullDescription: 'Spacious, column-free and efficient godown and warehouse solutions tailored for logistics distribution hubs, FMCG storage, cold chains, and e-commerce fulfillment centers. Built with high dock heights, multi-tier racking capabilities, and modern loading bays.',
    iconName: 'Home',
    deliverables: [
      'High-Bay Clear Heights from 9m to 14m for Pallet Racking',
      'Dock Levelers, Industrial Rolling Shutters & Canopy Aprons',
      'Superflat Laser Screed Concrete Flooring (FM2 Spec)',
      'Heavy-Duty Fire Sprinkler Piping & Hydrant Infrastructure',
      'Perimeter Security, Drainage, and Heavy Articulated Truck Pavements'
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    timeline: '4 – 8 Months'
  },
  {
    id: 'peb-erection',
    title: 'PEB Erection',
    shortDescription: 'Professional erection of pre-engineered buildings with precision and safety.',
    fullDescription: 'Professional erection of Pre-Engineered Steel Buildings (PEB) engineered with high-strength structural members, tapered columns, and cold-formed secondary members. Our trained erectors follow strict safety protocols, using heavy mobile cranes and certified rigging.',
    iconName: 'Key',
    deliverables: [
      'Precision Anchor Bolt Positioning & Foundation Casting',
      'Tapered Built-Up Primary Frame Assembly with Torque-Controlled Bolts',
      'Z & C Purlin Installation with Anti-Sag Rods & Bracing Systems',
      'Thermal Glass Wool / Rockwool Underdeck Insulation',
      'Certified Rigging & Mobile Crane Erection Under Safety Supervision'
    ],
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop',
    timeline: '2 – 5 Months'
  },
  {
    id: 'structural-steel-works',
    title: 'Structural Steel Works',
    shortDescription: 'Design, fabrication and erection support for a wide range of structural steel applications.',
    fullDescription: 'Comprehensive design, shop fabrication, sandblasting, and on-site erection support for complex structural steel works. From multi-tier pipe racks and industrial mezzanines to heavy equipment platforms and architectural trusses, we guarantee maximum structural integrity.',
    iconName: 'Hammer',
    deliverables: [
      'Certified CNC Plasma Cutting, Drilling, and Submerged Arc Welding',
      'Non-Destructive Ultrasonic & Magnetic Particle Weld Testing',
      'Epoxy Primer, Polyurethane, and Fire-Retardant Intumescent Coatings',
      'Heavy-Duty Industrial Steel Mezzanine Floors & Catwalks',
      'Pipe Racks, Conveyor Galleries, and Storage Silo Structures'
    ],
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    timeline: 'Custom Milestone Based'
  },
  {
    id: 'infrastructure-development',
    title: 'Infrastructure Development',
    shortDescription: 'Support infrastructure projects including civil works and allied structures for industrial and commercial needs.',
    fullDescription: 'End-to-end support infrastructure projects including civil earthworks, reinforced concrete foundations, internal concrete roads, stormwater trunk drains, boundary walls, and dedicated substation civil structures for industrial corridors and logistics parks.',
    iconName: 'Truck',
    deliverables: [
      'Precision Cut-and-Fill Earthwork & Ground Compaction Testing',
      'Heavy Pavement Quality Concrete (PQC) & M40 Internal Roads',
      'Pre-Cast Stormwater Box Culverts & Rainwater Harvesting Pits',
      'Substation Transformer Plinths & Switchyard Foundations',
      'Precast RCC Security Boundary Walls & Automated Gantry Gates'
    ],
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop',
    timeline: '3 – 10 Months'
  },
  {
    id: 'industrial-facilities',
    title: 'Industrial Manufacturing Facilities',
    shortDescription: 'Turnkey industrial manufacturing units, processing plants, and production environments.',
    fullDescription: 'Turnkey construction of modern manufacturing units, clean industrial processing plants, and assembly facilities. We coordinate civil structural frameworks, heavy equipment vibration-isolated foundation plinths, and administrative office blocks under a single accountable contract.',
    iconName: 'ClipboardCheck',
    deliverables: [
      'Vibration-Isolated Heavy Machine Foundation Beds',
      'Integrated Administrative & Corporate Office Annexes',
      'Effluent Treatment Plant (ETP) Civil Infrastructure',
      'Heavy Industrial Power, Compressed Air & Process Line Routing',
      'Factory Inspectorate & Municipal Fire Safety Handover Approvals'
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    timeline: '6 – 14 Months'
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'industrial-shed-hyderabad',
    title: 'Heavy Industrial Fabrication Shed',
    category: 'Industrial Sheds',
    location: 'Patancheru Industrial Area',
    city: 'Hyderabad',
    shortDescription: 'Modern 65,000 sq.ft industrial shed equipped with dual 20-ton overhead EOT cranes and high-durability floor slabs.',
    fullDescription: 'Engineered for a precision equipment manufacturing enterprise in Patancheru. Built with high-tensile steel trusses, 11-meter clear hook height, FM2 laser-screed floor slabs, and insulated sandwich panel roofing to ensure optimal indoor temperatures during peak summer.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop'
    ],
    builtUpArea: '65,000 Sq. Ft.',
    year: '2025',
    clientScope: 'Civil Foundations, Structural Steel Fabrication, Erection & Industrial Flooring',
    structuralHighlights: ['Dual 20-Ton EOT Crane Gantries', '11m Clear Hook Height', 'FM2 Superflat Laser Screed Floor', 'Turbo Ventilation System']
  },
  {
    id: 'logistics-warehouse-telangana',
    title: 'High-Bay Logistics Warehouse & Godown',
    category: 'Warehouses',
    location: 'Outer Ring Road Logistics Hub',
    city: 'Telangana',
    shortDescription: '120,000 sq.ft modern logistics distribution godown with 14 dock levelers, heavy trailer aprons, and 12m clear height.',
    fullDescription: 'Custom-developed for national 3PL and supply-chain operations along the Hyderabad Outer Ring Road corridor. The facility features 12-meter clear stack height, fire sprinkler risers, heavy reinforced concrete truck aprons, and automated dock doors.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop'
    ],
    builtUpArea: '120,000 Sq. Ft.',
    year: '2024',
    clientScope: 'Complete Turnkey Warehouse Design, PEB Superstructure & Dock Infrastructure',
    structuralHighlights: ['14 Hydraulic Dock Levelers', '12m Clear Ceiling Height for 6-High Pallet Racks', 'Laser Screed Jointless Floor', 'NFPA Fire Sprinkler Network']
  },
  {
    id: 'peb-structure-ap',
    title: 'Pre-Engineered PEB Industrial Complex',
    category: 'PEB Structures',
    location: 'Sri City Industrial Zone',
    city: 'Andhra Pradesh',
    shortDescription: 'Large-span pre-engineered building (PEB) complex with 60-meter clear span without interior intermediate columns.',
    fullDescription: 'Showcasing engineering mastery in clear-span structural design. This 85,000 sq.ft facility utilizes high-grade ASTM A572 Grade 50 steel with custom tapered rafters, providing an uninterrupted clear span of 60 meters for flexible production layouts.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop'
    ],
    builtUpArea: '85,000 Sq. Ft.',
    year: '2025',
    clientScope: 'Design, Supply, Fabrication & Rigging of 60m Clear-Span PEB Structure',
    structuralHighlights: ['60-Meter Clear Span Column-Free Floor', 'Rockwool Thermal & Acoustic Roof Insulation', 'Tapered High-Tensile Rafters', 'Seismic Zone Compliant']
  },
  {
    id: 'industrial-facility-telangana',
    title: 'Manufacturing & Processing Facility',
    category: 'Industrial Facilities',
    location: 'Medchal Industrial Corridor',
    city: 'Telangana',
    shortDescription: 'Turnkey industrial manufacturing facility with machine vibration foundations, corporate annex, and electrical substation.',
    fullDescription: 'A turnkey industrial manufacturing project combining high-bay production bays, administrative offices, laboratory testing suites, and dedicated high-voltage substation foundations. Executed within 7 months with zero recorded safety incidents.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ],
    builtUpArea: '95,000 Sq. Ft.',
    year: '2024',
    clientScope: 'Full EPC Contracting: Civil, PEB Superstructure, MEP & Administrative Annex',
    structuralHighlights: ['Machine Vibration-Isolated Inertia Plinths', 'Two-Story Administrative Block', 'Internal Concrete Road Corridors', 'Dedicated 11kV Substation Plinth']
  },
  {
    id: 'steel-structure-telangana',
    title: 'Heavy Structural Steel Framing & Pipe Racks',
    category: 'Structural Steel',
    location: 'Jeedimetla Industrial Estate',
    city: 'Telangana',
    shortDescription: 'Engineered structural steel support frameworks, multi-tier industrial mezzanine floors, and heavy utility pipe racks.',
    fullDescription: 'Engineered with over 450 metric tonnes of fabricated structural steel. Features precision CNC welded heavy H-beams, high-load steel mezzanine platforms capable of supporting 1.5 MT/sq.m, and epoxy anti-corrosion marine coatings.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop'
    ],
    builtUpArea: '450 Metric Tonnes Steel',
    year: '2024',
    clientScope: 'Structural Shop Detailing, Heavy Fabrication, Sandblasting & High-Altitude Rigging',
    structuralHighlights: ['450 MT Heavy Structural Steel', 'High-Load 1.5 MT/m² Mezzanine Slabs', 'Epoxy Polyurethane Corrosion Shield', '100% NDT Radiographic Weld Tested']
  },
  {
    id: 'infrastructure-logistics-park',
    title: 'Allied Infrastructure & Industrial Roadway Corridor',
    category: 'Infrastructure',
    location: 'Shamshabad Industrial Zone',
    city: 'Telangana',
    shortDescription: 'Internal heavy-pavement concrete roadways, box culverts, stormwater retention basin, and gated security boundary.',
    fullDescription: 'Comprehensive site civil infrastructure supporting a 35-acre industrial logistics park. Included 3.5 kilometers of M40 grade pavement quality concrete roads built for 40-tonne axle loads, precast stormwater trunk drains, and automated security barriers.',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop'
    ],
    builtUpArea: '35 Acres Infrastructure Corridor',
    year: '2025',
    clientScope: 'Grading, Stormwater Culverts, Heavy PQC Roadways & Security Infrastructure',
    structuralHighlights: ['3.5 km M40 Grade Concrete Roadways', 'Heavy 40-Tonne Axle Load Certified', 'Integrated Precast Stormwater Trunk Drainage', 'Solar High-Mast Street Lighting']
  }
];

export const WHY_CHOOSE_US_DATA: WhyChooseUsItem[] = [
  {
    id: 'safety-first',
    title: 'Safety First',
    description: 'We follow strict safety standards at every stage of construction. Zero-harm workplace culture with certified rigging and protective protocols.',
    metric: 'Zero-Harm Site Record',
    iconName: 'ShieldCheck'
  },
  {
    id: 'quality-construction',
    title: 'Quality Construction',
    description: 'We focus on durability, functionality and attention to detail. Every structural weld, bolt torque, and concrete batch undergoes rigorous inspection.',
    metric: '140-Point Quality Check',
    iconName: 'Award'
  },
  {
    id: 'experienced-team',
    title: 'Experienced Team',
    description: 'Skilled professionals with hands-on industry experience. Certified structural engineers, steel fabricators, and on-site project supervisors.',
    metric: '25+ Technical Engineers',
    iconName: 'Users'
  },
  {
    id: 'timely-delivery',
    title: 'Timely Delivery',
    description: 'Efficient planning and execution to keep your project on track. We adhere to transparent milestone schedules and critical-path management.',
    metric: '98.5% On-Time Delivery',
    iconName: 'Clock'
  },
  {
    id: 'cost-effective-solutions',
    title: 'Cost-Effective Solutions',
    description: 'Practical and value-driven approach without compromising on quality. Transparent itemized estimates and optimal steel tonnage designs.',
    metric: 'Value-Optimized Engineering',
    iconName: 'HeartHandshake'
  },
  {
    id: 'client-centric-approach',
    title: 'Client-Centric Approach',
    description: 'We build long-term relationships based on trust and performance. Dedicated project liaisons and transparent milestone reporting.',
    metric: '100% Client Commitment',
    iconName: 'Eye'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Consultation & Site Evaluation',
    description: 'Understand client requirements, storage volumes, equipment layout, and plot parameters.',
    detailedScope: 'Initial discovery session to assess site contours, soil bearing capacity, regulatory industrial bylaws, crane load requirements, and realistic project budgets.',
    iconName: 'MessageSquareText',
    durationApprox: 'Week 1'
  },
  {
    stepNumber: '02',
    title: 'Structural Design & PEB Detailing',
    description: 'Develop optimized structural steel designs and 3D architectural plans.',
    detailedScope: 'Structural analysis using STAAD.Pro, high-precision shop drawings, bolt connection detailing, wind load calculations, and municipal sanction filings.',
    iconName: 'Compass',
    durationApprox: 'Weeks 2 – 3'
  },
  {
    stepNumber: '03',
    title: 'Transparent Estimation & BOQ',
    description: 'Provide an itemized, transparent project estimate and fixed-timeline schedule.',
    detailedScope: 'Clear, line-by-line itemized Bill of Quantities (BOQ) covering steel grades, sheeting specifications, concrete strengths, and milestone payment schedules.',
    iconName: 'Calculator',
    durationApprox: 'Week 4'
  },
  {
    stepNumber: '04',
    title: 'Precision Fabrication & Foundation',
    description: 'Parallel execution of plant fabrication and on-site civil foundations.',
    detailedScope: 'Excavation, casting anchor-bolt plinths, while steel members are cut, drilled, welded, sandblasted, and painted in controlled plant conditions.',
    iconName: 'HardHat',
    durationApprox: 'Months 2 – 3'
  },
  {
    stepNumber: '05',
    title: 'Safe Erection & Flooring',
    description: 'Heavy crane erection, secondary framing, roofing, and laser screed flooring.',
    detailedScope: 'Certified rigging crews erect primary steel frames, followed by roof sheeting, insulation, and casting superflat FM2 laser-screed industrial floor slabs.',
    iconName: 'CheckCircle2',
    durationApprox: 'Months 3 – 5'
  },
  {
    stepNumber: '06',
    title: 'Final Handover & Certification',
    description: 'Snag rectifications, test certifications, and operational handover.',
    detailedScope: 'Weld test records, structural stability certificates, drainage runoffs, warranty documentation, and official key handover ready for commercial operations.',
    iconName: 'KeyRound',
    durationApprox: 'Final Month'
  }
];

export const QUALITY_PILLARS = [
  {
    title: 'Certified Structural Steel',
    description: 'High-yield strength structural steel sections (ASTM A572 Grade 50 / IS 2062 E350) with verified metallurgical test certificates.'
  },
  {
    title: 'Advanced Shop Fabrication',
    description: 'CNC plasma cutting, automatic submerged arc welding, and precision jig assembly ensuring millimeter bolt-hole alignments on site.'
  },
  {
    title: 'Superflat Laser-Screed Slabs',
    description: 'FM2/FM3 tolerance industrial floor slabs with surface hardeners, anti-dusting sealers, and high abrasion resistance for heavy forklifts.'
  },
  {
    title: 'Weather-Proof Sheeting & Insulation',
    description: 'Alu-Zinc color coated profiling sheets with high solar reflectance index (SRI) and high-density glass wool thermal insulation.'
  },
  {
    title: 'Zero-Harm Safety Protocol',
    description: 'Mandatory PPE, certified riggers, crane load inspection checklists, and round-the-clock safety officers at every jobsite.'
  },
  {
    title: 'Long-Term Structural Durability',
    description: 'Corrosion-inhibiting epoxy primer systems and engineered wind/seismic design codes ensuring 50+ year operational lifespan.'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'testimonial-1',
    name: 'K. Venkatesh Rao',
    role: 'Managing Director, Apex Logistics & Warehousing',
    comment: 'Yards Infra and Builders LLP delivered our 120,000 sq.ft distribution warehouse 3 weeks ahead of schedule. The clear height, laser-screed flooring, and dock leveler installations were executed with exceptional engineering precision.',
    rating: 5,
    projectTitle: 'Outer Ring Road Logistics Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    location: 'Telangana'
  },
  {
    id: 'testimonial-2',
    name: 'Suresh Chandra',
    role: 'Operations Head, Deccan Engineering Industries',
    comment: 'Our industrial manufacturing shed required a 60-meter clear span without intermediate pillars to house heavy overhead cranes. Yards Infra engineered the exact PEB solution we envisioned. Extremely professional team.',
    rating: 5,
    projectTitle: 'Heavy Industrial Fabrication Shed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    location: 'Hyderabad'
  },
  {
    id: 'testimonial-3',
    name: 'Arun Varma',
    role: 'Director, Sri City Agro-Logistics',
    comment: 'From foundation pile casting to high-altitude PEB truss rigging, their safety practices and material quality were top notch. Transparent milestone billing made the whole process completely stress-free.',
    rating: 5,
    projectTitle: 'Pre-Engineered PEB Industrial Complex',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    location: 'Andhra Pradesh'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'D. Srinivas Varma',
    role: 'Managing Partner & Founder',
    experience: '16+ Years Experience',
    bio: 'Pioneered Yards Infra and Builders LLP with a vision to revolutionize industrial infrastructure in India. Specializes in large-span PEB developments, strategic capital planning, and high-efficiency project delivery.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
    specialties: ['Industrial Infrastructure', 'PEB Design & Erection', 'Contract Management', 'Strategic Execution']
  },
  {
    id: 'team-2',
    name: 'Er. R. K. Nambiar',
    role: 'Chief Structural Engineer (M.Tech Structures)',
    experience: '18+ Years Experience',
    bio: 'Oversees structural design, finite element analysis (FEA), and seismic compliance for all heavy industrial sheds, clear-span PEB frames, and gantry crane beams.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    specialties: ['Structural Steel Detailing', 'Seismic Analysis', 'Crane Gantry Design', 'Quality Control Audits']
  },
  {
    id: 'team-3',
    name: 'M. Anand Reddy',
    role: 'General Manager – Projects & Site Operations',
    experience: '14+ Years Experience',
    bio: 'Leads on-site execution teams, heavy equipment mobilization, crane rigging safety, and laser-screed concrete floor installations across Telangana and Andhra Pradesh.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    specialties: ['Heavy Rigging Safety', 'Fast-Track Site Scheduling', 'FM2 Industrial Flooring', 'Quality Assurance']
  },
  {
    id: 'team-4',
    name: 'Sunita Krishnan',
    role: 'Head of Client Relations & Estimation',
    experience: '10+ Years Experience',
    bio: 'Ensures transparent, itemized estimation, client liaison, regulatory compliance, and smooth project communications from initial consultation to final commissioning.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    specialties: ['Itemized BOQ Costing', 'Client Onboarding', 'Vendor Management', 'Handover Documentation']
  }
];

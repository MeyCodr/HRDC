import type { TrainingItem, MonthlyData } from '@/lib/index';

export const trainingData: TrainingItem[] = [
  { id: 1,  title: 'AI Workshop',               date: '20/05/2026', dueGrant: '06/05/2026', pic: 'Fiq', status: 'overdue',  needHrdc: true,  department: 'IT',        vendor: 'TechLearn Sdn Bhd',   pax: 20, cost: 4500  },
  { id: 2,  title: 'ISO Training',              date: '25/05/2026', dueGrant: '11/05/2026', pic: 'Ana', status: 'pending',  needHrdc: true,  department: 'QA',        vendor: 'ISO Consultants',      pax: 15, cost: 3200  },
  { id: 3,  title: 'Leadership Programme',      date: '28/05/2026', dueGrant: '14/05/2026', pic: 'Rafi', status: 'pending', needHrdc: true,  department: 'HR',        vendor: 'Leadership Hub',       pax: 12, cost: 6800  },
  { id: 4,  title: 'Safety & Health Awareness', date: '30/05/2026', dueGrant: '16/05/2026', pic: 'Zul', status: 'pending',  needHrdc: true,  department: 'Operations', vendor: 'Safety Pro',          pax: 40, cost: 2100  },
  { id: 5,  title: 'Excel Advanced',            date: '02/06/2026', dueGrant: '19/05/2026', pic: 'Nad', status: 'pending',  needHrdc: false, department: 'Finance',   vendor: 'Office Skills MY',     pax: 10, cost: 1200  },
  { id: 6,  title: 'Project Management',        date: '05/06/2026', dueGrant: '22/05/2026', pic: 'Haris', status: 'pending',needHrdc: true,  department: 'Engineering','vendor': 'PMI Malaysia',        pax: 8,  cost: 5400  },
  { id: 7,  title: 'Communication Skills',      date: '09/01/2026', dueGrant: '26/12/2025', pic: 'Lin', status: 'done',    needHrdc: true,  department: 'Sales',     vendor: 'Soft Skills Academy',  pax: 25, cost: 3000  },
  { id: 8,  title: 'Data Analysis',             date: '15/01/2026', dueGrant: '01/01/2026', pic: 'Fiq', status: 'done',    needHrdc: true,  department: 'IT',        vendor: 'DataPro Academy',      pax: 18, cost: 4200  },
  { id: 9,  title: 'Customer Service',          date: '22/01/2026', dueGrant: '08/01/2026', pic: 'Ana', status: 'done',    needHrdc: false, department: 'Sales',     vendor: 'Service Excellence',   pax: 30, cost: 1800  },
  { id: 10, title: 'Financial Management',      date: '29/01/2026', dueGrant: '15/01/2026', pic: 'Rafi', status: 'done',   needHrdc: true,  department: 'Finance',   vendor: 'FinanceLearn MY',      pax: 10, cost: 2500  },
  { id: 11, title: 'Lean Manufacturing',        date: '05/02/2026', dueGrant: '22/01/2026', pic: 'Zul', status: 'done',    needHrdc: true,  department: 'Operations','vendor': 'Lean Institute',       pax: 35, cost: 5000  },
  { id: 12, title: 'Cybersecurity Basics',      date: '12/02/2026', dueGrant: '29/01/2026', pic: 'Nad', status: 'done',    needHrdc: true,  department: 'IT',        vendor: 'CyberSafe Academy',    pax: 22, cost: 3800  },
  { id: 13, title: 'HR Policy Update',          date: '19/02/2026', dueGrant: '05/02/2026', pic: 'Haris', status: 'done',  needHrdc: false, department: 'HR',        vendor: 'HR Consultants MY',    pax: 15, cost: 900   },
  { id: 14, title: 'Negotiation Skills',        date: '26/02/2026', dueGrant: '12/02/2026', pic: 'Lin', status: 'done',    needHrdc: true,  department: 'Sales',     vendor: 'NegoPro Academy',      pax: 12, cost: 2800  },
  { id: 15, title: 'Quality Auditing',          date: '05/03/2026', dueGrant: '19/02/2026', pic: 'Ana', status: 'done',    needHrdc: true,  department: 'QA',        vendor: 'Quality Assurance MY', pax: 8,  cost: 4100  },
  { id: 16, title: 'Agile & Scrum',             date: '12/03/2026', dueGrant: '26/02/2026', pic: 'Fiq', status: 'done',    needHrdc: true,  department: 'IT',        vendor: 'Agile Experts',        pax: 14, cost: 3600  },
  { id: 17, title: 'Environmental Compliance',  date: '19/03/2026', dueGrant: '05/03/2026', pic: 'Zul', status: 'done',    needHrdc: false, department: 'Operations','vendor': 'EHS Malaysia',         pax: 20, cost: 1500  },
  { id: 18, title: 'Procurement Fundamentals',  date: '26/03/2026', dueGrant: '12/03/2026', pic: 'Rafi', status: 'done',   needHrdc: true,  department: 'Finance',   vendor: 'Procurement Pro',      pax: 11, cost: 2200  },
  { id: 19, title: 'Team Building Workshop',    date: '02/04/2026', dueGrant: '19/03/2026', pic: 'Nad', status: 'done',    needHrdc: false, department: 'HR',        vendor: 'Team Dynamics MY',     pax: 50, cost: 4500  },
  { id: 20, title: 'Sales Management',          date: '09/04/2026', dueGrant: '26/03/2026', pic: 'Lin', status: 'done',    needHrdc: true,  department: 'Sales',     vendor: 'Sales Academy MY',     pax: 16, cost: 3100  },
  { id: 21, title: 'Python Programming',        date: '16/04/2026', dueGrant: '02/04/2026', pic: 'Fiq', status: 'done',    needHrdc: true,  department: 'IT',        vendor: 'Code Institute MY',    pax: 10, cost: 5200  },
  { id: 22, title: 'Contract Management',       date: '23/04/2026', dueGrant: '09/04/2026', pic: 'Haris', status: 'done',  needHrdc: true,  department: 'Legal',     vendor: 'Legal Pros MY',        pax: 9,  cost: 3400  },
  { id: 23, title: 'Plant Maintenance',         date: '30/04/2026', dueGrant: '16/04/2026', pic: 'Zul', status: 'done',    needHrdc: false, department: 'Operations','vendor': 'PlantTech MY',         pax: 28, cost: 2700  },
  { id: 24, title: 'Business Writing',          date: '07/05/2026', dueGrant: '23/04/2026', pic: 'Ana', status: 'done',    needHrdc: true,  department: 'HR',        vendor: 'Writing Pros MY',      pax: 18, cost: 1900  },
  // Remaining 11 upcoming (not in next 30 days)
  { id: 25, title: 'Power BI Analytics',        date: '15/06/2026', dueGrant: '01/06/2026', pic: 'Fiq', status: 'pending', needHrdc: true,  department: 'IT',        vendor: 'BI Academy',           pax: 12, cost: 4000  },
  { id: 26, title: 'ESG Reporting',             date: '22/06/2026', dueGrant: '08/06/2026', pic: 'Rafi', status: 'pending',needHrdc: true,  department: 'Finance',   vendor: 'ESG Consultants',      pax: 10, cost: 3500  },
  { id: 27, title: 'Digital Marketing',         date: '29/06/2026', dueGrant: '15/06/2026', pic: 'Lin', status: 'pending', needHrdc: false, department: 'Sales',     vendor: 'Digital Pros MY',      pax: 15, cost: 2300  },
  { id: 28, title: 'Risk Management',           date: '06/07/2026', dueGrant: '22/06/2026', pic: 'Nad', status: 'pending', needHrdc: true,  department: 'Finance',   vendor: 'Risk Advisors',        pax: 11, cost: 4800  },
  { id: 29, title: 'Warehouse Management',      date: '13/07/2026', dueGrant: '29/06/2026', pic: 'Zul', status: 'pending', needHrdc: true,  department: 'Operations','vendor': 'LogiPro Academy',      pax: 25, cost: 2600  },
  { id: 30, title: 'Strategic Planning',        date: '20/07/2026', dueGrant: '06/07/2026', pic: 'Haris', status: 'pending',needHrdc: true,  department: 'HR',        vendor: 'Strategy Hub MY',      pax: 8,  cost: 7200  },
  { id: 31, title: 'SAP ERP Fundamentals',      date: '27/07/2026', dueGrant: '13/07/2026', pic: 'Fiq', status: 'pending', needHrdc: true,  department: 'IT',        vendor: 'SAP Malaysia',         pax: 6,  cost: 8500  },
  { id: 32, title: 'Effective Presentation',    date: '03/08/2026', dueGrant: '20/07/2026', pic: 'Ana', status: 'pending', needHrdc: false, department: 'HR',        vendor: 'Speak Easy MY',        pax: 20, cost: 1600  },
  { id: 33, title: 'Internal Audit',            date: '10/08/2026', dueGrant: '27/07/2026', pic: 'Rafi', status: 'pending',needHrdc: true,  department: 'QA',        vendor: 'Audit Experts MY',     pax: 7,  cost: 4300  },
  { id: 34, title: 'Lean Six Sigma',            date: '17/08/2026', dueGrant: '03/08/2026', pic: 'Zul', status: 'pending', needHrdc: true,  department: 'Operations','vendor': 'Lean Six Academy',     pax: 12, cost: 6100  },
  { id: 35, title: 'Mental Health @ Work',      date: '24/08/2026', dueGrant: '10/08/2026', pic: 'Lin', status: 'pending', needHrdc: false, department: 'HR',        vendor: 'Wellness Pro MY',      pax: 60, cost: 2000  },
];

export const hrdcStatus = {
  approved: 10,
  pending: 6,
  rejected: 1,
};

export const monthlyData: MonthlyData[] = [
  { month: 'Jan', count: 6 },
  { month: 'Feb', count: 5 },
  { month: 'Mar', count: 5 },
  { month: 'Apr', count: 5 },
  { month: 'May', count: 3 },
  { month: 'Jun', count: 4 },
  { month: 'Jul', count: 4 },
  { month: 'Aug', count: 3 },
];

// Upcoming in next 30 days (training date between today and +30d, here we filter by status)
export const upcomingTrainings = trainingData.filter(t =>
  ['20/05/2026', '25/05/2026', '28/05/2026', '30/05/2026', '02/06/2026', '05/06/2026'].includes(t.date)
);

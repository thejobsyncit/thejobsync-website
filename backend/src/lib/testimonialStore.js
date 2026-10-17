const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'testimonials.json');

const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'VP of Technology',
    company: 'FinTech Dynamics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Cloud Infrastructure',
    quote: 'The Jobsync accelerated our multi-cloud deployment across AWS and Azure by three months. Their engineering rigor and 24/7 reliability are unmatched in the enterprise IT space.',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Chief Information Officer',
    company: 'AeroGlobal Logistics',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Custom Software',
    quote: 'We partnered with The Jobsync for our core supply chain ERP overhaul. They delivered scalable microservices that increased our real-time throughput by 42%.',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Head of People & Operations',
    company: 'Quantum Systems EMEA',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'IT Consulting',
    quote: 'Finding elite cybersecurity and DevOps talent in Dubai was a bottleneck until we onboarded The Jobsync. They vetted and deployed specialized senior engineers within 5 business days.',
    created_at: new Date().toISOString(),
  },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_TESTIMONIALS, null, 2), 'utf-8');
  }
}

function getAllTestimonials() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TESTIMONIALS;
  } catch (err) {
    console.error('Error reading local testimonials:', err);
    return INITIAL_TESTIMONIALS;
  }
}

function saveTestimonial(testimonial) {
  try {
    ensureDataFile();
    const testimonials = getAllTestimonials();
    const newEntry = {
      id: testimonial.id || Date.now(),
      created_at: new Date().toISOString(),
      ...testimonial,
    };
    testimonials.unshift(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(testimonials, null, 2), 'utf-8');
    return newEntry;
  } catch (err) {
    console.error('Error saving local testimonial:', err);
    return testimonial;
  }
}

function deleteTestimonial(id) {
  try {
    ensureDataFile();
    let testimonials = getAllTestimonials();
    testimonials = testimonials.filter((t) => String(t.id) !== String(id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(testimonials, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return false;
  }
}

module.exports = {
  getAllTestimonials,
  saveTestimonial,
  deleteTestimonial,
};

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function getAllInquiries() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local inquiries:', err);
    return [];
  }
}

function saveInquiry(inquiry) {
  try {
    ensureDataFile();
    const inquiries = getAllInquiries();
    const newEntry = {
      id: inquiry.id || `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      ...inquiry,
    };
    inquiries.unshift(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
    return newEntry;
  } catch (err) {
    console.error('Error saving local inquiry:', err);
    return inquiry;
  }
}

function updateInquiryStatus(id, status) {
  try {
    ensureDataFile();
    const inquiries = getAllInquiries();
    const index = inquiries.findIndex((inq) => String(inq.id) === String(id));
    if (index !== -1) {
      inquiries[index].status = status;
      fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
      return inquiries[index];
    }
    return null;
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    return null;
  }
}

function deleteInquiry(id) {
  try {
    ensureDataFile();
    let inquiries = getAllInquiries();
    inquiries = inquiries.filter((inq) => String(inq.id) !== String(id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return false;
  }
}

module.exports = {
  getAllInquiries,
  saveInquiry,
  updateInquiryStatus,
  deleteInquiry,
};

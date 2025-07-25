import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
];

const WEBHOOK_URL = '/api/gsheet-proxy';

const styles = {
  container: {
    maxWidth: 400,
    margin: '60px auto',
    padding: '32px 24px',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  label: {
    fontWeight: 500,
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 10,
    outline: 'none',
    transition: 'border 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 10,
    outline: 'none',
    background: '#fafafa',
    transition: 'border 0.2s',
  },
  button: {
    padding: '12px 0',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 10,
    transition: 'background 0.2s',
  },
  error: {
    color: 'red',
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
  },
};

const WelcomeForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    matric: '',
    department: DEPARTMENTS[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Check if matric exists in Google Sheet
  const checkMatricExists = async (matric) => {
    try {
      const response = await fetch('/api/gsheet-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkMatric: true, matric }),
      });
      const data = await response.json();
      return data.exists;
    } catch (err) {
      return false; // fallback: allow if error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Check for duplicate matric
    const exists = await checkMatricExists(form.matric);
    if (exists) {
      toast.error('You have already taken the quiz.');
      setLoading(false);
      return;
    }
    onSubmit(form);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-center" />
      <h2 style={{ marginBottom: 24, color: '#222' }}>Welcome to the Quiz!</h2>
      <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
        <div>
          <label style={styles.label}>Name:</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label style={styles.label}>Matric Number:</label>
          <input
            style={styles.input}
            type="text"
            name="matric"
            value={form.matric}
            onChange={handleChange}
            required
            placeholder="Enter your matric number"
          />
        </div>
        <div>
          <label style={styles.label}>Department:</label>
          <select
            style={styles.select}
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Checking...' : 'Start Quiz'}
        </button>
        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default WelcomeForm; 
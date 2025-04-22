// GuestRequestPage.tsx
import axios from 'axios';
import { useState } from 'react';

const GuestRequestPage = () => {
  const [form, setForm] = useState({
    topic: '',
    description: '',
    preferredTimes: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/guest/requests', form, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });
      setSuccess('Request submitted successfully!');
      setForm({ topic: '', description: '', preferredTimes: '' });
    } catch (err) {
      setError('Failed to submit request.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '40px auto',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: 32,
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 28, color: '#2d3748' }}>Guest Request</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#4a5568' }}>Topic:</label>
          <input
            name="topic"
            value={form.topic}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              fontSize: 16,
              outline: 'none',
              marginBottom: 2,
              transition: 'border 0.2s',
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#4a5568' }}>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              fontSize: 16,
              outline: 'none',
              resize: 'vertical',
              marginBottom: 2,
              transition: 'border 0.2s',
            }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#4a5568' }}>Preferred Times:</label>
          <input
            name="preferredTimes"
            value={form.preferredTimes}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              fontSize: 16,
              outline: 'none',
              marginBottom: 2,
              transition: 'border 0.2s',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#3182ce',
            color: '#fff',
            padding: '12px 0',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 17,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(49,130,206,0.08)',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
          onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
        >
          Submit
        </button>
      </form>
      {success && <div style={{ color: '#38a169', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{success}</div>}
      {error && <div style={{ color: '#e53e3e', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
    </div>
  );
};

export default GuestRequestPage;

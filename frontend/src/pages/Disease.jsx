import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Disease = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/disease/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data.analysis);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Error processing image. Please try again.';
      const errorDetails = err.response?.data?.details ? ` (Details: ${err.response.data.details})` : '';
      setResult(`${errorMsg}${errorDetails}`);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ marginTop: '30px', maxWidth: '800px' }}>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
        AI Crop Disease & Pest Detection
      </h2>

      <div className="grid grid-2">
        <div className="glass-panel" style={{ padding: '30px' }}>
          <form onSubmit={uploadImage}>
            <div className="form-group">
              <label>Upload Crop Image</label>
              <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" required />
            </div>
            {preview && (
              <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' }} />
              </div>
            )}
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} disabled={!image || loading}>
              {loading ? 'Analyzing with AI...' : 'Analyze Image'}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '30px',  background: 'rgba(255,255,255,0.95)' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Diagnosis Report</h3>
          {loading && <p>AI is inspecting the image...</p>}
          {!loading && !result && <p>Upload an image to see the diagnosis here.</p>}
          {!loading && result && (
            <div className="fade-in" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disease;

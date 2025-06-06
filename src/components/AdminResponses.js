import React, { useEffect, useState } from 'react';

const AdminResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/responses');
      const data = await res.json();
      setResponses(data);
    } catch (err) {
      setError('Failed to fetch responses');
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!responses.length) return;
    const keys = Array.from(
      responses.reduce((acc, r) => {
        Object.keys(r.data).forEach(k => acc.add(k));
        return acc;
      }, new Set())
    );
    const header = ['id', 'timestamp', ...keys];
    const rows = responses.map(r => [
      r.id,
      r.timestamp,
      ...keys.map(k => JSON.stringify(r.data[k] ?? ''))
    ]);
    const csv = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey_responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-responses-container">
      <h1>Survey Responses</h1>
      <button onClick={downloadCSV} disabled={!responses.length} style={{marginBottom: 16}}>
        Download CSV
      </button>
      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {!loading && !error && responses.length === 0 && <div>No responses yet.</div>}
      {!loading && !error && responses.length > 0 && (
        <table border="1" cellPadding={6} style={{marginTop: 16, borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {responses.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.timestamp}</td>
                <td>
                  <pre style={{margin:0,whiteSpace:'pre-wrap'}}>{JSON.stringify(r.data, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminResponses;

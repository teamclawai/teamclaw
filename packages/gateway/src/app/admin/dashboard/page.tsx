'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>TeamClaw Admin</h1>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🤖 Agents</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              {config?.agentsCount || 0} agents configured
            </p>
            <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Manage Agents
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>💬 Channels</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Web Channel - Port {config?.port || 12345}
            </p>
            <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Configure Channels
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🔑 API Provider</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              OpenRouter - {config?.hasApiKey ? '✅ Configured' : '❌ Not configured'}
            </p>
            <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Update Settings
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🧠 Memory</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              LanceDB - Local storage
            </p>
            <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              View Memory
            </button>
          </div>

        </div>

        <div style={{ marginTop: '32px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🚀 Quick Start</h2>
          <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px' }}>
            <p style={{ marginBottom: '8px' }}># Send a message to @dev agent</p>
            <p style={{ marginBottom: '8px' }}>@dev help me write a function</p>
            <p style={{ marginBottom: '8px' }}>&nbsp;</p>
            <p style={{ marginBottom: '8px' }}># Or ask multiple agents</p>
            <p>@dev and @review fix this bug together</p>
          </div>
        </div>
      </main>
    </div>
  );
}

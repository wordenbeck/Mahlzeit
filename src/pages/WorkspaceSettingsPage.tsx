/**
 * /workspace — Haushalt-Einstellungen
 * PIN anzeigen, Familie einladen, Member sehen
 */

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, Users, Plus } from 'lucide-react';
import './WorkspaceSettingsPage.css';

interface Workspace {
  id: string;
  name: string;
  code: string;
}

interface Profile {
  id: string;
  display_name: string;
  color: string;
}

export function WorkspaceSettingsPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const loadWorkspaceData = async () => {
    try {
      // Get current user's workspace
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('workspace_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .single();

      if (profileError) throw profileError;

      const workspaceId = (profileData as any).workspace_id;

      // Get workspace details
      const { data: workspaceData, error: wsError } = await supabase
        .from('workspaces')
        .select('id, name, code')
        .eq('id', workspaceId)
        .single();

      if (wsError) throw wsError;
      setWorkspace(workspaceData as Workspace);

      // Get all members in this workspace
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('id, display_name, color')
        .eq('workspace_id', workspaceId);

      if (membersError) throw membersError;
      setMembers((membersData ?? []) as Profile[]);
    } catch (error) {
      console.error('Failed to load workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPIN = async () => {
    if (workspace?.code) {
      await navigator.clipboard.writeText(workspace.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Lade Haushalt-Daten...</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>❌ Haushalt nicht gefunden</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>🏠 Haushalt-Einstellungen</h1>

      {/* Workspace Info */}
      <div
        style={{
          background: '#f5f5f5',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      >
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '0.5rem' }}>
          Haushalt-Name
        </p>
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '24px' }}>
          {workspace.name}
        </h2>

        <p style={{ color: '#666', fontSize: '13px', marginBottom: '0.5rem' }}>
          Einladungs-PIN
        </p>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              color: '#006c49',
            }}
          >
            {workspace.code}
          </div>
          <button
            onClick={handleCopyPIN}
            style={{
              padding: '8px 12px',
              background: copied ? '#4caf50' : '#006c49',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'background 0.3s',
            }}
          >
            <Copy size={16} />
            {copied ? 'Kopiert!' : 'Kopieren'}
          </button>
        </div>

        <p
          style={{
            marginTop: '1rem',
            fontSize: '12px',
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          👥 Gib diese PIN deinen Familienmitgliedern, damit sie beitreten können.
        </p>
      </div>

      {/* Family Members */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} /> Haushalt-Mitglieder ({members.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #eee',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: member.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '12px',
                }}
              >
                {member.display_name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: '500' }}>{member.display_name}</span>
            </div>
          ))}
        </div>

        {members.length < 4 && (
          <p style={{ marginTop: '1rem', fontSize: '12px', color: '#888' }}>
            💡 Weitere Familienmitglieder können sich mit deiner PIN anmelden.
          </p>
        )}
      </div>

      {/* Info Box */}
      <div
        style={{
          background: '#e8f5e9',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #c8e6c9',
          fontSize: '13px',
          color: '#2e7d32',
        }}
      >
        <p style={{ margin: 0 }}>
          ✓ Alle Rezepte sind für euren Haushalt sichtbar. Jeder kann Notizen + Ratings
          hinzufügen.
        </p>
      </div>
    </div>
  );
}

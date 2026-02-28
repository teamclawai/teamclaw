'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Settings, Trash2, Copy, Check, Loader2, Bot } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  systemPrompt?: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAgent, setNewAgent] = useState({ id: '', name: '', description: '', systemPrompt: '' });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      const agentsList = Object.entries(data.agents || {}).map(([id, agent]: [string, any]) => ({
        id,
        name: agent.name || id,
        description: agent.description || '',
        enabled: agent.enabled !== false,
        systemPrompt: agent.systemPrompt || '',
      }));
      setAgents(agentsList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAgentId = (id: string) => {
    navigator.clipboard.writeText(`@${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleAgent = async (id: string) => {
    const updatedAgents = agents.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
    setAgents(updatedAgents);
    await saveAgents(updatedAgents);
  };

  const deleteAgent = async (id: string) => {
    const updatedAgents = agents.filter(a => a.id !== id);
    setAgents(updatedAgents);
    await saveAgents(updatedAgents);
  };

  const saveAgents = async (agentList: Agent[]) => {
    setSaving(true);
    try {
      const agentsObj: Record<string, any> = {};
      agentList.forEach(agent => {
        agentsObj[agent.id] = {
          name: agent.name,
          description: agent.description,
          enabled: agent.enabled,
          systemPrompt: agent.systemPrompt,
        };
      });
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agents: agentsObj }),
      });
    } catch (error) {
      console.error('Failed to save agents:', error);
    } finally {
      setSaving(false);
    }
  };

  const addAgent = async () => {
    if (!newAgent.id || !newAgent.name) return;
    
    const agent: Agent = {
      id: newAgent.id.toLowerCase().replace(/\s+/g, '-'),
      name: newAgent.name,
      description: newAgent.description,
      enabled: true,
      systemPrompt: newAgent.systemPrompt,
    };
    
    const updatedAgents = [...agents, agent];
    setAgents(updatedAgents);
    await saveAgents(updatedAgents);
    setNewAgent({ id: '', name: '', description: '', systemPrompt: '' });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agents</h1>
          <p className="text-slate-500 mt-1">Manage your AI agents</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Agent</CardTitle>
            <CardDescription>Configure a new AI agent with custom behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input 
                  id="agent-name" 
                  placeholder="e.g., QA Tester"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-id">Agent ID</Label>
                <Input 
                  id="agent-id" 
                  placeholder="e.g., qa"
                  value={newAgent.id}
                  onChange={(e) => setNewAgent({ ...newAgent, id: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="agent-description">Description</Label>
                <Input 
                  id="agent-description" 
                  placeholder="What this agent does"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="agent-prompt">System Prompt</Label>
                <Textarea 
                  id="agent-prompt"
                  placeholder="You are a QA tester agent that..."
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={addAgent} disabled={!newAgent.id || !newAgent.name}>
                <Plus className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className={`${!agent.enabled ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">@{agent.id}</Badge>
                      {agent.enabled ? (
                        <Badge variant="success" className="text-xs">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Disabled</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{agent.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyAgentId(agent.id)}
                  className="flex-1"
                >
                  {copiedId === agent.id ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => toggleAgent(agent.id)}
                  disabled={saving}
                >
                  {agent.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAgent(agent.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No agents configured</h3>
            <p className="text-slate-500 mb-4">Add your first AI agent to get started</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

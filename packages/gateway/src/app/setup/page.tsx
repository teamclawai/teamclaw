'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const OPENROUTER_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'OpenAI\'s flagship model' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & affordable' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Previous flagship' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Anthropic\'s best model' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast & affordable' },
  { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Google\'s latest' },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Google\'s pro model' },
  { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Google\'s fast model' },
  { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', description: 'Meta\'s largest' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Meta\'s balanced' },
  { id: 'mistralai/mistral-large', name: 'Mistral Large', description: 'Mistral\'s flagship' },
  { id: 'mistralai/mistral-small', name: 'Mistral Small', description: 'Mistral\'s fast model' },
  { id: 'qwen/qwen-2-72b-instruct', name: 'Qwen 2 72B', description: 'Alibaba\'s model' },
  { id: 'cohere/command-r-plus', name: 'Command R+', description: 'Cohere\'s flagship' },
];

export default function SetupPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [model, setModel] = useState('openai/gpt-4o-mini');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!apiKey || apiKey.length < 10) {
      setError('Please enter a valid API key');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, adminPassword: password, domain, model })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TeamClaw Setup</h1>
          <p className="text-slate-400 mt-2">Configure your multi-agent platform</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Initial Setup</CardTitle>
            <CardDescription>Enter your configuration details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenRouter API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-..."
                  required
                />
                <p className="text-xs text-slate-500">
                  Get a free API key at{' '}
                  <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    openrouter.ai
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="flex h-10 w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {OPENROUTER_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain (optional)</Label>
                <Input
                  id="domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://teamclaw.yourdomain.com"
                />
                <p className="text-xs text-slate-500">
                  Your VPS domain for external access
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

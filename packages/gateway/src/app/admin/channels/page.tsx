'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Slack, Globe, Webhook, Plus, Settings, Power, PowerOff } from 'lucide-react';
import { useState } from 'react';

const channels = [
  {
    id: 'web',
    name: 'Web Channel',
    icon: Globe,
    description: 'Browser-based chat interface',
    enabled: true,
    config: { port: 12345 },
  },
  {
    id: 'slack',
    name: 'Slack Channel',
    icon: Slack,
    description: 'Slack workspace integration',
    enabled: false,
    config: { workspace: '', botToken: '' },
  },
];

export default function ChannelsPage() {
  const [channelList, setChannelList] = useState(channels);

  const toggleChannel = (id: string) => {
    setChannelList(channelList.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Channels</h1>
        <p className="text-gray-500 mt-1">Configure communication channels</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {channelList.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    channel.enabled ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <channel.icon className={`h-6 w-6 ${channel.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <CardTitle>{channel.name}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </div>
                </div>
                <button
                  onClick={() => toggleChannel(channel.id)}
                  className={`p-2 rounded-full transition-colors ${
                    channel.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {channel.enabled ? <Power className="h-5 w-5" /> : <PowerOff className="h-5 w-5" />}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {channel.id === 'web' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input value={channel.config.port} readOnly />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="h-4 w-4" />
                    <span>http://localhost:{channel.config.port}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              )}

              {channel.id === 'slack' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Workspace</Label>
                    <Input placeholder="Your Slack workspace" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bot Token</Label>
                    <Input type="password" placeholder="xoxb-..." />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Slack
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Integration
          </CardTitle>
          <CardDescription>Receive messages from external services via webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://teamclaw.io/webhook/example"
                  className="font-mono text-sm"
                />
                <Button variant="outline">Copy</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Webhook Secret</Label>
              <Input
                type="password"
                value="whsec_example_secret"
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

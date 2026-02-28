'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Search, Trash2, Download, Upload, Database, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

const memoryStats = {
  totalVectors: 1247,
  storageUsed: '45.2 MB',
  lastSync: '2 minutes ago',
  agents: 3,
};

const recentMemories = [
  { id: 1, agent: 'dev', preview: 'Created user authentication module...', timestamp: '2 min ago', type: 'conversation' },
  { id: 2, agent: 'review', preview: 'Reviewed PR #42 - Code looks good...', timestamp: '15 min ago', type: 'review' },
  { id: 3, agent: 'dev', preview: 'Fixed bug in payment processing...', timestamp: '1 hour ago', type: 'conversation' },
  { id: 4, agent: 'ops', preview: 'Deployed v2.1.0 to production...', timestamp: '3 hours ago', type: 'action' },
];

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Memory</h1>
        <p className="text-gray-500 mt-1">View and manage agent memory</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vectors</CardTitle>
            <Brain className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryStats.totalVectors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryStats.storageUsed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryStats.lastSync}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Brain className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryStats.agents}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Memory</CardTitle>
          <CardDescription>Search through agent memories and conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Memories</CardTitle>
          <CardDescription>Latest memories stored by agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMemories.map((memory) => (
              <div
                key={memory.id}
                className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">@{memory.agent}</span>
                      <span className="text-xs text-gray-400">• {memory.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{memory.preview}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Memory Settings</CardTitle>
          <CardDescription>Configure memory retention and storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Retention Period (days)</Label>
              <Input type="number" defaultValue={30} />
            </div>
            <div className="space-y-2">
              <Label>Max Storage (MB)</Label>
              <Input type="number" defaultValue={500} />
            </div>
            <div className="space-y-2">
              <Label>Vector Dimension</Label>
              <Input value="1536 (OpenAI)" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Database Path</Label>
              <Input value="./data/memory" readOnly />
            </div>
          </div>
          <Button className="mt-4">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}

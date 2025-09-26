'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ChatbotConfig {
  id: string;
  personality: 'professional' | 'friendly' | 'technical' | 'creative';
  tone: 'formal' | 'casual' | 'enthusiastic' | 'calm';
  language: string;
  max_tokens: number;
  temperature: number;
  system_prompt: string;
  welcome_message: string;
  fallback_message: string;
  enabled_features: string[];
}

const ChatbotSettings: React.FC = () => {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig(data);
      } else {
        // Create default config
        const defaultConfig: Omit<ChatbotConfig, 'id'> = {
          personality: 'professional',
          tone: 'formal',
          language: 'en',
          max_tokens: 1000,
          temperature: 0.7,
          system_prompt: 'You are Auralis, an AI assistant for Limitless Infotech. You help users learn about our services, portfolio, and how we can help their business.',
          welcome_message: "Hello! I'm Auralis, your AI-powered assistant from Limitless Infotech. How can I help you today?",
          fallback_message: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
          enabled_features: ['voice_input', 'suggestions', 'analytics'],
        };

        const { data: newConfig, error: insertError } = await supabase
          .from('chatbot_config')
          .insert(defaultConfig)
          .select()
          .single();

        if (insertError) throw insertError;
        setConfig(newConfig);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch config');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('chatbot_config')
        .update({
          personality: config.personality,
          tone: config.tone,
          language: config.language,
          max_tokens: config.max_tokens,
          temperature: config.temperature,
          system_prompt: config.system_prompt,
          welcome_message: config.welcome_message,
          fallback_message: config.fallback_message,
          enabled_features: config.enabled_features,
        })
        .eq('id', config.id);

      if (error) throw error;
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: keyof ChatbotConfig, value: any) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  const toggleFeature = (feature: string) => {
    if (!config) return;
    const enabled = config.enabled_features.includes(feature);
    const newFeatures = enabled
      ? config.enabled_features.filter(f => f !== feature)
      : [...config.enabled_features, feature];
    updateConfig('enabled_features', newFeatures);
  };

  if (loading) return <LoadingSpinner />;
  if (!config) return <div>Failed to load configuration</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chatbot Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure the personality, behavior, and features of your AI chatbot.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Personality & Tone</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Personality</label>
              <select
                value={config.personality}
                onChange={(e) => updateConfig('personality', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                value={config.tone}
                onChange={(e) => updateConfig('tone', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="calm">Calm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={config.language}
                onChange={(e) => updateConfig('language', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </Card>

        {/* AI Parameters */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">AI Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Tokens: {config.max_tokens}
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={config.max_tokens}
                onChange={(e) => updateConfig('max_tokens', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature: {config.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower = more focused, Higher = more creative
              </p>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Messages</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Welcome Message</label>
              <textarea
                value={config.welcome_message}
                onChange={(e) => updateConfig('welcome_message', e.target.value)}
                rows={2}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Enter welcome message..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fallback Message</label>
              <textarea
                value={config.fallback_message}
                onChange={(e) => updateConfig('fallback_message', e.target.value)}
                rows={2}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Enter fallback message..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">System Prompt</label>
              <textarea
                value={config.system_prompt}
                onChange={(e) => updateConfig('system_prompt', e.target.value)}
                rows={4}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Enter system prompt..."
              />
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Enabled Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'voice_input', label: 'Voice Input' },
              { key: 'suggestions', label: 'Suggestions' },
              { key: 'analytics', label: 'Analytics' },
              { key: 'multilingual', label: 'Multilingual' },
              { key: 'memory', label: 'Conversation Memory' },
              { key: 'feedback', label: 'User Feedback' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.enabled_features.includes(key)}
                  onChange={() => toggleFeature(key)}
                  className="rounded"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotSettings;

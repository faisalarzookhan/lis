'use client';

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Search, TrendingUp, Globe, FileText, BarChart3 } from 'lucide-react';

interface SeoMetrics {
  pageUrl: string;
  title: string;
  metaDescription: string;
  h1Tags: number;
  h2Tags: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  pageLoadTime: number;
  mobileFriendly: boolean;
}

const SeoTools: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<SeoMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePage = async () => {
    if (!url) return;

    setAnalyzing(true);
    setError(null);

    try {
      // In a real implementation, this would call an SEO analysis API
      // For now, we'll simulate the analysis
      const mockMetrics: SeoMetrics = {
        pageUrl: url,
        title: 'Sample Page Title',
        metaDescription: 'This is a sample meta description for SEO analysis.',
        h1Tags: 1,
        h2Tags: 3,
        imagesWithoutAlt: 2,
        internalLinks: 15,
        externalLinks: 5,
        pageLoadTime: 2.3,
        mobileFriendly: true,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMetrics(mockMetrics);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScore = (metrics: SeoMetrics) => {
    let score = 100;
    if (metrics.title.length < 30 || metrics.title.length > 60) score -= 20;
    if (metrics.metaDescription.length < 120 || metrics.metaDescription.length > 160) score -= 15;
    if (metrics.h1Tags !== 1) score -= 10;
    if (metrics.imagesWithoutAlt > 0) score -= 10;
    if (metrics.pageLoadTime > 3) score -= 10;
    if (!metrics.mobileFriendly) score -= 20;
    return Math.max(0, score);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Search className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold">SEO Analysis Tools</h2>
      </div>

      {/* URL Input */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analyze Page</h3>
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter page URL (e.g., https://example.com/page)"
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={analyzePage}
            disabled={analyzing || !url}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Card>

      {/* Analysis Results */}
      {analyzing && (
        <Card className="p-6">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Analyzing page...</span>
          </div>
        </Card>
      )}

      {metrics && !analyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEO Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">SEO Score</h3>
              <BarChart3 className="w-6 h-6 text-gray-500" />
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(getScore(metrics))}`}>
                {getScore(metrics)}
              </div>
              <p className="text-sm text-gray-500 mt-1">out of 100</p>
            </div>
          </Card>

          {/* Page Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Page Information</h3>
              <FileText className="w-6 h-6 text-gray-500" />
            </div>
            <div className="space-y-2">
              <p><strong>Title:</strong> {metrics.title}</p>
              <p><strong>Meta Description:</strong> {metrics.metaDescription}</p>
              <p><strong>Load Time:</strong> {metrics.pageLoadTime}s</p>
              <p><strong>Mobile Friendly:</strong> {metrics.mobileFriendly ? 'Yes' : 'No'}</p>
            </div>
          </Card>

          {/* Content Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Content Analysis</h3>
              <Globe className="w-6 h-6 text-gray-500" />
            </div>
            <div className="space-y-2">
              <p><strong>H1 Tags:</strong> {metrics.h1Tags}</p>
              <p><strong>H2 Tags:</strong> {metrics.h2Tags}</p>
              <p><strong>Images without Alt:</strong> {metrics.imagesWithoutAlt}</p>
            </div>
          </Card>

          {/* Link Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Link Analysis</h3>
              <TrendingUp className="w-6 h-6 text-gray-500" />
            </div>
            <div className="space-y-2">
              <p><strong>Internal Links:</strong> {metrics.internalLinks}</p>
              <p><strong>External Links:</strong> {metrics.externalLinks}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Recommendations */}
      {metrics && !analyzing && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {metrics.title.length < 30 || metrics.title.length > 60 && (
              <li className="text-yellow-600 dark:text-yellow-400">
                • Title should be between 30-60 characters (currently {metrics.title.length})
              </li>
            )}
            {metrics.metaDescription.length < 120 || metrics.metaDescription.length > 160 && (
              <li className="text-yellow-600 dark:text-yellow-400">
                • Meta description should be between 120-160 characters (currently {metrics.metaDescription.length})
              </li>
            )}
            {metrics.h1Tags !== 1 && (
              <li className="text-red-600 dark:text-red-400">
                • Page should have exactly 1 H1 tag (currently {metrics.h1Tags})
              </li>
            )}
            {metrics.imagesWithoutAlt > 0 && (
              <li className="text-yellow-600 dark:text-yellow-400">
                • {metrics.imagesWithoutAlt} images are missing alt text
              </li>
            )}
            {metrics.pageLoadTime > 3 && (
              <li className="text-red-600 dark:text-red-400">
                • Page load time is too slow ({metrics.pageLoadTime}s). Aim for under 3 seconds.
              </li>
            )}
            {!metrics.mobileFriendly && (
              <li className="text-red-600 dark:text-red-400">
                • Page is not mobile-friendly
              </li>
            )}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default SeoTools;

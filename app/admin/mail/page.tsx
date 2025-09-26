'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, Inbox, Star, Archive, Trash2, Reply, Forward, Plus, Search, Filter } from 'lucide-react';
import Card from '../../../src/components/ui/Card';

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  body: string;
  isRead: boolean;
  isStarred: boolean;
  receivedAt: string;
  threadId: string;
}



const WebmailPage: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      // Mock email data for demonstration
      const mockEmails: Email[] = [
        {
          id: '1',
          subject: 'Project Proposal Review',
          from: 'client@techcorp.com',
          to: ['admin@limitless.com'],
          body: 'Dear team,\n\nI hope this email finds you well. I wanted to follow up on the project proposal we discussed last week. Could you please review the attached documents and let me know your thoughts?\n\nBest regards,\nJohn Smith\nTechCorp Inc.',
          isRead: false,
          isStarred: true,
          receivedAt: '2024-01-15T14:30:00Z',
          threadId: 'thread-1',
        },
        {
          id: '2',
          subject: 'Meeting Confirmation',
          from: 'sarah@logisticspro.com',
          to: ['admin@limitless.com'],
          body: 'Hi,\n\nThis is to confirm our meeting scheduled for tomorrow at 2 PM. We\'ll be discussing the mobile app requirements.\n\nLooking forward to it!\n\nSarah Johnson\nLogisticsPro',
          isRead: true,
          isStarred: false,
          receivedAt: '2024-01-14T09:15:00Z',
          threadId: 'thread-2',
        },
        {
          id: '3',
          subject: 'Invoice #INV-2024-001',
          from: 'billing@supportplus.com',
          to: ['admin@limitless.com'],
          body: 'Dear valued customer,\n\nPlease find attached invoice #INV-2024-001 for our recent AI chatbot implementation project.\n\nPayment terms: Net 30 days\n\nThank you for your business!\n\nBilling Department\nSupportPlus',
          isRead: false,
          isStarred: false,
          receivedAt: '2024-01-13T16:45:00Z',
          threadId: 'thread-3',
        },
      ];
      setEmails(mockEmails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read
    setEmails(emails.map(e =>
      e.id === email.id ? { ...e, isRead: true } : e
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Compose</span>
          </button>
        </div>

        <nav className="px-2 space-y-1">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            <Inbox className="w-5 h-5" />
            <span>Inbox</span>
            <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {emails.filter(e => !e.isRead).length}
            </span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Star className="w-5 h-5" />
            <span>Starred</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Send className="w-5 h-5" />
            <span>Sent</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Archive className="w-5 h-5" />
            <span>Archive</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Trash2 className="w-5 h-5" />
            <span>Trash</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Email List */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !email.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${selectedEmail?.id === email.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(email.id);
                        }}
                        className={`flex-shrink-0 ${email.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                      <span className="font-medium truncate">{email.from}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(email.receivedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className={`text-sm font-medium truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                      {email.subject}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                      {email.body.split('\n')[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Viewer */}
        <div className="flex-1">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><strong>From:</strong> {selectedEmail.from}</p>
                      <p><strong>To:</strong> {selectedEmail.to.join(', ')}</p>
                      <p><strong>Date:</strong> {new Date(selectedEmail.receivedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Reply className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Forward className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Archive className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none">
                  {selectedEmail.body.split('\n').map((line, index) => (
                    <p key={index} className={line === '' ? 'mb-4' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Select an email to read
                </h3>
                <p className="text-gray-500">
                  Choose an email from the list to view its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Compose Email</h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="recipient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your message here..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebmailPage;

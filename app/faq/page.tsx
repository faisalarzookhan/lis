'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import SearchFunctionality from '../../src/components/faq/SearchFunctionality';
import CategoryTabs from '../../src/components/faq/CategoryTabs';
import RelatedQuestions from '../../src/components/faq/RelatedQuestions';
import ContactForm from '../../src/components/faq/ContactForm';
import FAQVotingSystem from '../../src/components/faq/FAQVotingSystem';

// Define the type for a single FAQ item
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

// This is now a Client Component for search functionality
const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [popularFaqs, setPopularFaqs] = useState<FAQ[]>([]);

  React.useEffect(() => {
    const fetchFaqs = async () => {
      const { createClient } = await import('@/lib/supabaseClient');
      const supabase = createClient();

      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer, category')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to fetch FAQs:', error);
        setFaqs([]);
      } else {
        setFaqs(data || []);
      }
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  // Enhanced filtering logic
  const finalFilteredFaqs = useMemo(() => {
    let filtered = faqs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    return filtered;
  }, [faqs, searchTerm, selectedCategory]);

  // Group filtered FAQs by category
  const groupedFaqs = useMemo(() => {
    return finalFilteredFaqs.reduce((acc, faq) => {
      const category = faq.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);
  }, [finalFilteredFaqs]);

  // Get popular FAQs (top 5 by helpful votes)
  const popularFaqsList = useMemo(() => {
    return [...faqs]
      .sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
      .slice(0, 5);
  }, [faqs]);

  // Function to highlight search term
  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index} className="bg-yellow-200">{part}</mark> : part
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-bg dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>

        {/* Enhanced Search Functionality */}
        <SearchFunctionality
          faqs={faqs}
          onSearchResults={setFilteredFaqs}
          className="mb-8"
        />

        {/* Popular FAQs Section */}
        {popularFaqsList.length > 0 && !searchTerm && !selectedCategory && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Popular Questions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularFaqsList.map((faq) => (
                <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                    {faq.answer}
                  </p>
                  {faq.helpful && (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {faq.helpful} people found this helpful
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <CategoryTabs
          faqs={faqs}
          onCategoryChange={setSelectedCategory}
          className="mb-8"
        />

        {Object.keys(groupedFaqs).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory ? 'No FAQs match your criteria.' : 'No FAQs have been added yet.'}
            </p>
            <ContactForm searchQuery={searchTerm} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ List */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedFaqs).map(([category, faqsInCategory]) => (
                <div key={category}>
                  <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{category}</h2>
                  <div className="space-y-4">
                    {faqsInCategory.map((faq) => (
                      <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <details className="group">
                          <summary className="flex justify-between items-center cursor-pointer list-none p-6">
                            <span className="font-medium pr-4">{highlightText(faq.question, searchTerm)}</span>
                            <span className="transition-transform transform group-open:rotate-180 flex-shrink-0">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </span>
                          </summary>
                          <div className="px-6 pb-6">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {highlightText(faq.answer, searchTerm)}
                            </p>

                            {/* Voting System */}
                            <FAQVotingSystem
                              faq={faq}
                              onVote={async (faqId, type) => {
                                // Here you would update the FAQ's vote count in your database
                                console.log(`Vote for FAQ ${faqId}: ${type}`);
                              }}
                            />

                            {/* Related Questions */}
                            <RelatedQuestions
                              currentFaq={faq}
                              allFaqs={faqs}
                              onQuestionClick={(relatedFaq) => {
                                // Scroll to the related FAQ or open it
                                const element = document.getElementById(`faq-${relatedFaq.id}`);
                                element?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            />
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ContactForm searchQuery={searchTerm} />

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">FAQ Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-medium">{faqs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{Object.keys(groupedFaqs).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Showing:</span>
                    <span className="font-medium">{finalFilteredFaqs.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqPage;

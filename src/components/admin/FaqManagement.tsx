'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Edit, Trash2 } from 'lucide-react';

// Define the type for a single FAQ item
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
}

const FaqManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Fetch all FAQs on component mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/faq');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqs(data.faqs.sort((a: FAQ, b: FAQ) => a.sort_order - b.sort_order));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch FAQs';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      sort_order: index,
    }));

    setFaqs(updatedItems);

    // Save new order to backend
    try {
      await fetch('/api/faq/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs: updatedItems.map(item => ({ id: item.id, sort_order: item.sort_order })) }),
      });
    } catch (err) {
      console.error('Failed to save order:', err);
      // Revert on error
      fetchFaqs();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingFaq ? `/api/faq` : '/api/faq';
    const method = editingFaq ? 'PUT' : 'POST';

    const faqData = {
      id: editingFaq?.id,
      question: newQuestion,
      answer: newAnswer,
      category: newCategory,
      sort_order: editingFaq ? editingFaq.sort_order : faqs.length,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save FAQ');
      }

      // Reset form and state
      setNewQuestion('');
      setNewAnswer('');
      setNewCategory('');
      setEditingFaq(null);
      await fetchFaqs(); // Refresh the list
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save FAQ';
      setError(errorMessage);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setNewCategory(faq.category || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/api/faq`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to delete FAQ');
      }
      await fetchFaqs(); // Refresh the list
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete FAQ';
      setError(errorMessage);
    }
  };

  if (isLoading) return <div>Loading FAQs...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">FAQ Management</h2>

      {/* FAQ Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl mb-2">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
        <div className="mb-4">
          <label htmlFor="question" className="block mb-1">Question</label>
          <input
            id="question"
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="answer" className="block mb-1">Answer</label>
          <textarea
            id="answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-1">Category</label>
          <input
            id="category"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingFaq ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {editingFaq && (
            <button
              type="button"
              onClick={() => { setEditingFaq(null); setNewQuestion(''); setNewAnswer(''); setNewCategory(''); }}
              className="ml-4 px-4 py-2 rounded border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* FAQ List with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="faqs">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {faqs.map((faq, index) => (
                <Draggable key={faq.id} draggableId={faq.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-4 border rounded-lg bg-white dark:bg-gray-800 ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-1 cursor-grab active:cursor-grabbing"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{faq.question}</h4>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{faq.answer}</p>
                          {faq.category && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                              {faq.category}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(faq)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            aria-label="Edit FAQ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            aria-label="Delete FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default FaqManagement;

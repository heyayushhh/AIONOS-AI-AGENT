import React, { useState, useEffect } from 'react';
import { knowledgeService } from '../services/knowledgeService';
import { KnowledgeDoc } from '../types';
import { Search, Database, ExternalLink, Loader2 } from 'lucide-react';

export default function KnowledgeBase() {
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      const results = await knowledgeService.search(query);
      setDocs(results);
      setIsLoading(false);
    };
    
    const timeoutId = setTimeout(fetchDocs, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-display text-3xl text-white tracking-tight flex items-center gap-2">
            <Database className="w-8 h-8 text-emerald-400" />
            Knowledge Base
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Illustrative documents for Demo Retrieval (Mock RAG).
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search capabilities or methodology..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map(doc => (
            <div key={doc.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-400/10 inline-block px-2 py-0.5 rounded mb-3">
                  {doc.category}
                </div>
                <h3 className="text-lg font-medium text-white mb-2 leading-tight">{doc.title}</h3>
                <p className="text-sm text-white/60 mb-4">{doc.summary}</p>
                
                <div className="flex flex-wrap gap-2">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 text-sm text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10">
                <ExternalLink className="w-4 h-4" /> View Document
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

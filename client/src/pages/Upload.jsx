import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FileText, Link as LinkIcon, Type, Loader2, Sparkles } from 'lucide-react';

const Upload = () => {
    const [activeTab, setActiveTab] = useState('text');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'text') {
                if (!text) throw new Error("Please enter some text.");
                await api.post('/generate/text', { title, text });
            } else if (activeTab === 'url') {
                if (!url) throw new Error("Please enter a valid URL.");
                await api.post('/generate/url', { title, url });
            } else if (activeTab === 'pdf') {
                if (!file) throw new Error("Please select a valid PDF file.");
                const formData = new FormData();
                formData.append('file', file);
                if (title) formData.append('title', title);
                await api.post('/generate/pdf', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to generate materials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8 mt-12">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transform transition-all hover:scale-105 duration-300">Create Study Material</h1>
                    <p className="text-neutral-400 text-lg">Transform your notes, articles, and PDFs into interactive resources effortlessly.</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center max-w-2xl mx-auto shadow-lg shadow-red-500/5">{error}</div>}

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <div className="flex border-b border-white/10 bg-black/40">
                        <button
                            className={`flex-1 py-5 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 ${activeTab === 'text' ? 'text-blue-400 border-b-[3px] border-blue-400 bg-blue-500/5' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border-b-[3px] border-transparent'}`}
                            onClick={() => setActiveTab('text')}
                        >
                            <Type className="h-6 w-6" /> Paste Text
                        </button>
                        <button
                            className={`flex-1 py-5 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 ${activeTab === 'url' ? 'text-purple-400 border-b-[3px] border-purple-400 bg-purple-500/5' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border-b-[3px] border-transparent'}`}
                            onClick={() => setActiveTab('url')}
                        >
                            <LinkIcon className="h-6 w-6" /> Web Link
                        </button>
                        <button
                            className={`flex-1 py-5 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 ${activeTab === 'pdf' ? 'text-pink-400 border-b-[3px] border-pink-400 bg-pink-500/5' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border-b-[3px] border-transparent'}`}
                            onClick={() => setActiveTab('pdf')}
                        >
                            <FileText className="h-6 w-6" /> PDF Upload
                        </button>
                    </div>

                    <div className="p-10 space-y-8 bg-gradient-to-b from-transparent to-black/20">
                        <div className="group">
                            <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">Title (Optional)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Intro to Machine Learning..."
                                className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white hover:border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-neutral-700 font-medium"
                            />
                        </div>

                        {activeTab === 'text' && (
                            <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">Source Text</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your extensive study notes, transcription, or raw content here block by block..."
                                    className="w-full h-72 bg-black/60 border border-white/10 rounded-xl p-5 text-white hover:border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 resize-none font-mono text-sm leading-relaxed placeholder:text-neutral-700"
                                />
                            </div>
                        )}

                        {activeTab === 'url' && (
                            <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors">Article URL</label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://en.wikipedia.org/wiki/..."
                                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white hover:border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-neutral-700 font-medium"
                                />
                            </div>
                        )}

                        {activeTab === 'pdf' && (
                            <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="block text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wider group-focus-within:text-pink-400 transition-colors">PDF Document</label>
                                <div className="border-2 border-dashed border-white/20 rounded-2xl p-16 text-center hover:bg-pink-500/5 hover:border-pink-500/50 transition-all duration-300 group-hover:shadow-[inset_0_0_20px_rgba(236,72,153,0.1)] cursor-pointer relative overflow-hidden">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="pointer-events-none relative z-0 flex flex-col items-center">
                                        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:bg-pink-500/10">
                                            <FileText className="h-10 w-10 text-neutral-500 group-hover:text-pink-400 transition-colors" />
                                        </div>
                                        <p className="text-xl font-medium text-neutral-300 mb-1">{file ? file.name : 'Click or drop your PDF here'}</p>
                                        {!file && <p className="text-neutral-500 mt-2">Maximum file size: 10MB</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-6 w-6" />
                                    Generating Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-6 w-6 animate-pulse" />
                                    Generate Study Material
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;

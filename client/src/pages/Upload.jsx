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

    const tabActive = { color: '#00ADB5', borderBottom: '3px solid #00ADB5', background: 'rgba(0,173,181,0.06)' };
    const tabInactive = { color: 'rgba(238,238,238,0.4)', borderBottom: '3px solid transparent' };

    return (
        <div className="min-h-screen p-8" style={{ background: '#222831', color: '#EEEEEE' }}>
            <div className="max-w-4xl mx-auto space-y-8 mt-12">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold transform transition-all hover:scale-105 duration-300" style={{ color: '#00ADB5' }}>Create Study Material</h1>
                    <p className="text-lg" style={{ color: 'rgba(238,238,238,0.5)' }}>Transform your notes, articles, and PDFs into interactive resources effortlessly.</p>
                </div>

                {error && <div className="p-4 rounded-xl text-center max-w-2xl mx-auto" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>{error}</div>}

                <div className="rounded-2xl overflow-hidden" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)', boxShadow: '0 0 40px rgba(0,0,0,0.4)' }}>
                    <div className="flex" style={{ borderBottom: '1px solid rgba(0,173,181,0.15)', background: 'rgba(34,40,49,0.6)' }}>
                        <button
                            className="flex-1 py-5 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300"
                            style={activeTab === 'text' ? tabActive : tabInactive}
                            onClick={() => setActiveTab('text')}
                        >
                            <Type className="h-6 w-6" /> Paste Text
                        </button>
                        <button
                            className="flex-1 py-5 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300"
                            style={activeTab === 'url' ? tabActive : tabInactive}
                            onClick={() => setActiveTab('url')}
                        >
                            <LinkIcon className="h-6 w-6" /> Web Link
                        </button>
                        <button
                            className="flex-1 py-5 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300"
                            style={activeTab === 'pdf' ? tabActive : tabInactive}
                            onClick={() => setActiveTab('pdf')}
                        >
                            <FileText className="h-6 w-6" /> PDF Upload
                        </button>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'rgba(238,238,238,0.5)' }}>Title (Optional)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Intro to Machine Learning..."
                                className="w-full rounded-xl p-4 outline-none transition-all duration-300"
                                style={{ background: '#222831', border: '1px solid rgba(0,173,181,0.2)', color: '#EEEEEE' }}
                                onFocus={e => e.target.style.borderColor = '#00ADB5'}
                                onBlur={e => e.target.style.borderColor = 'rgba(0,173,181,0.2)'}
                            />
                        </div>

                        {activeTab === 'text' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'rgba(238,238,238,0.5)' }}>Source Text</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your extensive study notes, transcription, or raw content here block by block..."
                                    className="w-full h-72 rounded-xl p-5 outline-none transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
                                    style={{ background: '#222831', border: '1px solid rgba(0,173,181,0.2)', color: '#EEEEEE' }}
                                    onFocus={e => e.target.style.borderColor = '#00ADB5'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(0,173,181,0.2)'}
                                />
                            </div>
                        )}

                        {activeTab === 'url' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'rgba(238,238,238,0.5)' }}>Article URL</label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://en.wikipedia.org/wiki/..."
                                    className="w-full rounded-xl p-4 outline-none transition-all duration-300"
                                    style={{ background: '#222831', border: '1px solid rgba(0,173,181,0.2)', color: '#EEEEEE' }}
                                    onFocus={e => e.target.style.borderColor = '#00ADB5'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(0,173,181,0.2)'}
                                />
                            </div>
                        )}

                        {activeTab === 'pdf' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'rgba(238,238,238,0.5)' }}>PDF Document</label>
                                <div className="border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group" style={{ borderColor: 'rgba(0,173,181,0.3)' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#00ADB5'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,173,181,0.3)'}
                                >
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="pointer-events-none relative z-0 flex flex-col items-center">
                                        <div className="p-4 rounded-full mb-4 transition-transform duration-500" style={{ background: 'rgba(0,173,181,0.1)' }}>
                                            <FileText className="h-10 w-10" style={{ color: '#00ADB5' }} />
                                        </div>
                                        <p className="text-xl font-medium mb-1" style={{ color: '#EEEEEE' }}>{file ? file.name : 'Click or drop your PDF here'}</p>
                                        {!file && <p style={{ color: 'rgba(238,238,238,0.4)' }} className="mt-2">Maximum file size: 10MB</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-5 font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg mt-8"
                            style={{ background: '#00ADB5', color: '#222831', boxShadow: '0 0 30px rgba(0,173,181,0.35)' }}
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

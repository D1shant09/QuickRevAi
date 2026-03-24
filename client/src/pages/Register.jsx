import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#222831', color: '#EEEEEE' }}>
            {/* Background Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(0,173,181,0.15)' }}></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(0,173,181,0.10)' }}></div>

            <div className="w-full max-w-md backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.01]" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.2)' }}>
                <div className="flex justify-center mb-6">
                    <div className="p-3 rounded-xl shadow-lg" style={{ background: '#00ADB5', boxShadow: '0 0 20px rgba(0,173,181,0.4)' }}>
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#00ADB5' }}>Create Account</h2>
                <p className="text-center mb-8" style={{ color: 'rgba(238,238,238,0.6)' }}>Join QuickRev AI and start learning</p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(238,238,238,0.7)' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full rounded-xl p-3 outline-none transition-all duration-300"
                            style={{ background: '#222831', border: '1px solid rgba(0,173,181,0.25)', color: '#EEEEEE' }}
                            onFocus={e => e.target.style.borderColor = '#00ADB5'}
                            onBlur={e => e.target.style.borderColor = 'rgba(0,173,181,0.25)'}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(238,238,238,0.7)' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full rounded-xl p-3 outline-none transition-all duration-300"
                            style={{ background: '#222831', border: '1px solid rgba(0,173,181,0.25)', color: '#EEEEEE' }}
                            onFocus={e => e.target.style.borderColor = '#00ADB5'}
                            onBlur={e => e.target.style.borderColor = 'rgba(0,173,181,0.25)'}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(238,238,238,0.7)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full rounded-xl p-3 outline-none transition-all duration-300"
                            style={{ background: '#222831', border: '1px solid rgba(0,173,181,0.25)', color: '#EEEEEE' }}
                            onFocus={e => e.target.style.borderColor = '#00ADB5'}
                            onBlur={e => e.target.style.borderColor = 'rgba(0,173,181,0.25)'}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full font-semibold p-3 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] mt-2"
                        style={{ background: '#00ADB5', color: '#222831', boxShadow: '0 0 20px rgba(0,173,181,0.3)' }}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm" style={{ color: 'rgba(238,238,238,0.5)' }}>
                    Already have an account? <Link to="/login" className="font-medium transition-colors hover:underline" style={{ color: '#00ADB5' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

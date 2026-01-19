import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';

import {
    Book, Calendar, LayoutDashboard, Inbox, HelpCircle, Clock, CheckCircle,
    MessageSquare, FileText, ChevronRight, Bell, Search, MoreVertical, LogOut,
    Menu, X, Home, BookOpen, Award, Users, Paperclip, Image as ImageIcon,
    Send, Plus, Minus, Camera, Mic, List, Columns, Trash2, File, Check,
    Upload, PlayCircle, Sun, Moon, ChevronLeft, User, LogIn, Lock, GraduationCap, Download, Edit
} from 'https://esm.sh/lucide-react@0.263.1';

// --- Utils & Constants ---

const COLORS = [
    'bg-blue-500', 'bg-emerald-500', 'bg-rose-500',
    'bg-amber-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
];

const ICONS = ['💻', '📐', '📝', '🌍', '⚡', '🎨', '🔬', '📊', '🎵'];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const getRandomIcon = () => ICONS[Math.floor(Math.random() * ICONS.length)];

// Mock Tasks & Schedule
const SCHEDULE_TASKS = [
    {
        id: 101, title: 'Demo_task_1', assignedTo: 'Ifrad', due: '2026-03-26', dueTime: '23:59', priority: 'High',
        notes: [{ id: 1, user: 'Luis', text: 'Okay, make sure to complete the rest by Friday', time: '15:46', date: 'Jan 15', isMe: false }]
    },
];

// --- Data Persistence Helpers ---
const loadData = (key, initial) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
};

const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- Reusable UI Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 transform active:scale-95 flex items-center justify-center";
    const variants = {
        primary: "bg-[#2D3B45] text-white hover:bg-[#1a242c] shadow-lg shadow-slate-200 dark:shadow-none",
        accent: "bg-[#BF2604] text-white hover:bg-[#9e2003] shadow-lg shadow-orange-100 dark:shadow-none",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750",
        ghost: "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100 dark:shadow-none"
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({ label, ...props }) => (
    <div className="mb-4">
        {label && <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">{label}</label>}
        <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#BF2604]/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
            {...props}
        />
    </div>
);

const Select = ({ label, children, ...props }) => (
    <div className="mb-4">
        {label && <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">{label}</label>}
        <select
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#BF2604]/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none appearance-none"
            {...props}
        >
            {children}
        </select>
    </div>
);

// --- Modals ---

const ModalOverlay = ({ children, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-[modal-enter_0.3s_ease-out] border border-white/10 max-h-[90vh] overflow-y-auto">
            {children}
        </div>
    </div>
);

const AddEventModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ title, date, time, type: 'event' });
        setTitle(''); setDate(''); setTime('');
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">New Event</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X size={18} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <form onSubmit={handleSubmit}>
                <Input required value={title} onChange={e => setTitle(e.target.value)} label="Event Title" placeholder="e.g. Study Group" />
                <div className="grid grid-cols-2 gap-4">
                    <Input required type="date" value={date} onChange={e => setDate(e.target.value)} label="Date" />
                    <Input type="time" value={time} onChange={e => setTime(e.target.value)} label="Time (Optional)" />
                </div>
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Add Event</Button>
                </div>
            </form>
        </ModalOverlay>
    );
};

const CreateCourseModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [term, setTerm] = useState('Fall 2024');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({ name, code, term });
        setName(''); setCode('');
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">New Course</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X size={18} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <form onSubmit={handleSubmit}>
                <Input required value={name} onChange={e => setName(e.target.value)} label="Course Name" placeholder="e.g. Intro to Psychology" />
                <Input required value={code} onChange={e => setCode(e.target.value)} label="Course Code" placeholder="e.g. PSY 101" />
                <Input required value={term} onChange={e => setTerm(e.target.value)} label="Term" />
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Create Course</Button>
                </div>
            </form>
        </ModalOverlay>
    );
};

const EditCourseModal = ({ isOpen, onClose, onEdit, course }) => {
    const [name, setName] = useState(course?.name || '');
    const [code, setCode] = useState(course?.code || '');
    const [term, setTerm] = useState(course?.term || '');

    useEffect(() => {
        if(course) {
            setName(course.name);
            setCode(course.code);
            setTerm(course.term);
        }
    }, [course]);

    if (!isOpen || !course) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit({ ...course, name, code, term });
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">Edit Course</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X size={18} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <form onSubmit={handleSubmit}>
                <Input required value={name} onChange={e => setName(e.target.value)} label="Course Name" />
                <Input required value={code} onChange={e => setCode(e.target.value)} label="Course Code" />
                <Input required value={term} onChange={e => setTerm(e.target.value)} label="Term" />
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Save Changes</Button>
                </div>
            </form>
        </ModalOverlay>
    );
};

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ title, assignedTo, priority, due: dueDate, dueTime });
        setTitle(''); setAssignedTo(''); setPriority('Medium'); setDueDate(''); setDueTime('');
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">New Task</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X size={18} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <form onSubmit={handleSubmit}>
                <Input required value={title} onChange={e => setTitle(e.target.value)} label="Task Title" placeholder="e.g. Complete Project Report" />
                <Input required value={assignedTo} onChange={e => setAssignedTo(e.target.value)} label="Assigned To" placeholder="e.g. Ifrad" />
                <div className="grid grid-cols-2 gap-4">
                    <Input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} label="Due Date" />
                    <Input required type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} label="Due Time" />
                </div>
                <Select value={priority} onChange={e => setPriority(e.target.value)} label="Priority">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </Select>
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Add Task</Button>
                </div>
            </form>
        </ModalOverlay>
    );
};

const AddContentModal = ({ isOpen, onClose, onAdd, type }) => {
    const [title, setTitle] = useState('');
    const [itemType, setItemType] = useState('page');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ title, type: itemType });
        setTitle('');
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">Add {type === 'module' ? 'Module' : 'Item'}</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><X size={18} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <form onSubmit={handleSubmit}>
                <Input required autoFocus value={title} onChange={e => setTitle(e.target.value)} label="Title" placeholder={type === 'module' ? "e.g. Week 1" : "e.g. Syllabus"} />
                {type === 'item' && (
                    <Select value={itemType} onChange={e => setItemType(e.target.value)} label="Type">
                        <option value="page">Page</option>
                        <option value="assignment">Assignment</option>
                        <option value="quiz">Quiz</option>
                        <option value="file">File</option>
                        <option value="discussion">Discussion</option>
                    </Select>
                )}
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="accent" type="submit">Add</Button>
                </div>
            </form>
        </ModalOverlay>
    );
};

// --- Auth Screens ---

const AuthScreen = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const users = loadData('lms_users', []);

        if (isLogin) {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                onLogin(user);
            } else {
                setError('Invalid credentials');
            }
        } else {
            if (users.find(u => u.username === username)) {
                setError('Username already exists');
                return;
            }
            const newUser = { id: Date.now().toString(), username, password, role };
            saveData('lms_users', [...users, newUser]);
            onLogin(newUser);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl p-8 w-full max-w-md border border-slate-100 dark:border-slate-700">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#2D3B45] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <GraduationCap className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#2D3B45] dark:text-white tracking-tight">Welcome</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to access your dashboard</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-full p-1 mb-6">
                    <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${isLogin ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Login</button>
                    <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${!isLogin ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Sign Up</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div onClick={() => setRole('student')} className={`cursor-pointer p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${role === 'student' ? 'border-[#BF2604] bg-orange-50 dark:bg-slate-700' : 'border-slate-200 dark:border-slate-700'}`}>
                                <User size={20} className={role === 'student' ? 'text-[#BF2604]' : 'text-slate-400'} />
                                <span className={`text-xs font-bold mt-2 ${role === 'student' ? 'text-[#BF2604]' : 'text-slate-400'}`}>Student</span>
                            </div>
                            <div onClick={() => setRole('instructor')} className={`cursor-pointer p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${role === 'instructor' ? 'border-[#2D3B45] bg-blue-50 dark:bg-slate-700' : 'border-slate-200 dark:border-slate-700'}`}>
                                <Book size={20} className={role === 'instructor' ? 'text-[#2D3B45] dark:text-white' : 'text-slate-400'} />
                                <span className={`text-xs font-bold mt-2 ${role === 'instructor' ? 'text-[#2D3B45] dark:text-white' : 'text-slate-400'}`}>Instructor</span>
                            </div>
                        </div>
                    )}

                    <Input required value={username} onChange={e => setUsername(e.target.value)} label="Username" placeholder="Enter username" />
                    <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} label="Password" placeholder="••••••••" />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button variant="primary" type="submit" className="w-full py-3 mt-4">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

// --- Assignment & Quiz Modals ---

const AddAssignmentModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [files, setFiles] = useState([]);
    const [maxAttempts, setMaxAttempts] = useState('Unlimited');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ title, dueDate, dueTime, files, maxAttempts, type: 'file_assignment' });
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">Add Assignment</h2>
                <button onClick={onClose}><X size={18} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <form onSubmit={handleSubmit}>
                <Input required value={title} onChange={e => setTitle(e.target.value)} label="Name" placeholder="e.g. Research Paper" />
                <div className="grid grid-cols-2 gap-4">
                    <Input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} label="Date" />
                    <Input required type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} label="Time" />
                </div>
                <Select value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} label="Max Attempts">
                    <option value="Unlimited">Unlimited</option>
                    <option value="1">1 Attempt</option>
                    <option value="2">2 Attempts</option>
                    <option value="3">3 Attempts</option>
                    <option value="5">5 Attempts</option>
                </Select>
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Attachments</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative group">
                        <input type="file" multiple accept=".pdf,image/*,.docx,.zip" onChange={(e) => setFiles([...e.target.files])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <Upload size={20} className="mx-auto text-slate-400 mb-2" />
                        <span className="text-xs text-slate-500">Drop files or browse</span>
                    </div>
                </div>
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="accent" type="submit">Create</Button>
                </div>
            </form>
        </ModalOverlay>
    );
};

const CreateQuizModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [maxAttempts, setMaxAttempts] = useState('Unlimited');
    const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correct: 0 }]);

    if (!isOpen) return null;

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions]; newQuestions[index][field] = value; setQuestions(newQuestions);
    };
    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions]; newQuestions[qIndex].options[oIndex] = value; setQuestions(newQuestions);
    };
    const addQuestion = () => setQuestions([...questions, { text: '', options: ['', '', '', ''], correct: 0 }]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ title, dueDate, maxAttempts, questions, type: 'quiz' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative z-10 max-h-[85vh] overflow-y-auto animate-[modal-enter_0.3s_ease-out] border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">Create Quiz</h2>
                    <button onClick={onClose}><X size={18} className="text-slate-500"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input required value={title} onChange={e => setTitle(e.target.value)} label="Quiz Title" placeholder="e.g. Chapter 1 Quiz" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} label="Due Date" />
                        <Select value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} label="Max Attempts">
                            <option value="Unlimited">Unlimited</option>
                            <option value="1">1 Attempt</option>
                            <option value="2">2 Attempts</option>
                            <option value="3">3 Attempts</option>
                            <option value="5">5 Attempts</option>
                        </Select>
                    </div>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-5 bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700 rounded-2xl">
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Question {qIndex + 1}</label>
                                {questions.length > 1 && <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>}
                            </div>
                            <input required type="text" value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} className="w-full bg-white dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100 mb-3 shadow-sm" placeholder="Enter question text..." />
                            <div className="grid grid-cols-1 gap-2">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center group">
                                        <input type="radio" name={`correct-${qIndex}`} checked={q.correct === oIndex} onChange={() => handleQuestionChange(qIndex, 'correct', oIndex)} className="mr-3 w-4 h-4 text-[#BF2604] focus:ring-[#BF2604]" />
                                        <input required type="text" value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-1 bg-white dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 shadow-sm group-hover:ring-1 group-hover:ring-slate-200 transition-all" placeholder={`Option ${oIndex + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-600 text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">
                        + Add Question
                    </button>
                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700 space-x-3">
                        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Create Quiz</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TakeQuizModal = ({ quiz, onClose, onFinish }) => {
    const [answers, setAnswers] = useState({});
    const handleSelect = (qIndex, oIndex) => setAnswers({ ...answers, [qIndex]: oIndex });
    const handleSubmit = () => {
        let score = 0; quiz.questions.forEach((q, idx) => { if (answers[idx] === q.correct) score++; });
        onFinish(Math.round((score / quiz.questions.length) * 100));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative z-10 max-h-[85vh] overflow-y-auto animate-[modal-enter_0.3s_ease-out] border border-white/10">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white tracking-tight">{quiz.title}</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><X size={20} className="text-slate-500 dark:text-slate-400"/></button>
                </div>
                <div className="space-y-8">
                    {quiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{animationDelay: `${qIndex * 100}ms`}}>
                            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">{qIndex + 1}. {q.text}</p>
                            <div className="space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} onClick={() => handleSelect(qIndex, oIndex)}
                                         className={`p-4 rounded-xl cursor-pointer flex items-center transition-all duration-200 border ${
                                             answers[qIndex] === oIndex ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-700'
                                                 : 'bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                         }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                                            answers[qIndex] === oIndex ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                            {answers[qIndex] === oIndex && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <span className={`text-sm ${answers[qIndex] === oIndex ? 'text-indigo-900 dark:text-indigo-200 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>{opt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <Button variant="accent" onClick={handleSubmit} className="px-8">Submit Quiz</Button>
                </div>
            </div>
        </div>
    );
};

const AssignmentSubmissionModal = ({ assignment, user, onClose, onSubmit }) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);

    const handleSubmit = () => {
        onSubmit({
            text,
            fileNames: files.map(f => f.name), // In real app, upload blob
            date: new Date().toLocaleDateString()
        });
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-[#2D3B45] dark:text-white">{assignment.title}</h2>
                <p className="text-sm text-slate-500">Due: {assignment.dueDate}</p>
            </div>
            <div className="space-y-4">
                <textarea
                    value={text} onChange={e => setText(e.target.value)}
                    className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-xl p-4 text-sm resize-none focus:outline-none"
                    placeholder="Type your submission here..."
                ></textarea>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center relative hover:bg-slate-50 dark:hover:bg-slate-750">
                    <input type="file" multiple accept=".pdf,.docx,image/*" onChange={e => setFiles([...e.target.files])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={20} className="mx-auto text-slate-400 mb-2"/>
                    <span className="text-xs text-slate-500">{files.length > 0 ? `${files.length} files selected` : "Upload PDF, DOCX, Images"}</span>
                </div>
            </div>
            <div className="flex justify-end pt-6 space-x-3">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="accent" onClick={handleSubmit}>Submit Assignment</Button>
            </div>
        </ModalOverlay>
    );
};

const GradingModal = ({ assignment, submissions = [], onClose, onGrade }) => {
    return (
        <ModalOverlay onClose={onClose}>
            <h2 className="text-xl font-bold mb-4 text-[#2D3B45] dark:text-white">Grade: {assignment.title}</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {submissions.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No submissions yet.</p>
                ) : (
                    submissions.map((sub, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">User ID: {sub.studentId}</span>
                                <span className="text-xs text-slate-400">{sub.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 bg-white dark:bg-slate-800 p-2 rounded">{sub.text || "No text"}</p>
                            {sub.fileNames && sub.fileNames.map(f => (
                                <div key={f} className="text-xs text-[#BF2604] flex items-center mb-2"><File size={12} className="mr-1"/> {f}</div>
                            ))}
                            <div className="flex items-center gap-2 mt-3">
                                <input
                                    type="number"
                                    placeholder="Score"
                                    className="w-20 px-2 py-1 rounded border text-sm"
                                    onBlur={(e) => onGrade(sub.studentId, e.target.value)}
                                />
                                <span className="text-sm text-slate-500">/ 100</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-4 flex justify-end"><Button variant="ghost" onClick={onClose}>Done</Button></div>
        </ModalOverlay>
    );
};

// --- Main App Logic ---

const CalendarWidget = ({ courses, onAddEvent, onNavigate }) => {
    const [date, setDate] = useState(new Date());
    const [customEvents, setCustomEvents] = useState([]);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const monthName = date.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

    // Aggregate events
    const getAllEvents = () => {
        let events = [...customEvents];
        courses.forEach(course => {
            const courseItems = [...(course.assignments || []), ...(course.quizzes || [])];
            courseItems.forEach(item => {
                if (item.dueDate) {
                    events.push({
                        date: item.dueDate,
                        title: item.title,
                        type: item.type === 'quiz' ? 'quiz' : 'assignment',
                        course: course,
                        item: item
                    });
                }
            });
        });
        return events;
    };

    const events = getAllEvents();

    const renderCalendarDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toDateString() === new Date(date.getFullYear(), date.getMonth(), d).toDateString();

            days.push(
                <div key={d} className="h-10 w-10 flex items-center justify-center relative group cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className={`text-sm font-medium ${isToday ? 'bg-[#BF2604] text-white w-8 h-8 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>{d}</span>
                    {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 flex space-x-0.5">
                            {dayEvents.slice(0, 3).map((ev, i) => (
                                <div key={i} className={`w-1 h-1 rounded-full ${ev.type === 'event' ? 'bg-blue-500' : 'bg-[#BF2604]'}`}></div>
                            ))}
                        </div>
                    )}
                    {/* Hover Tooltip */}
                    {dayEvents.length > 0 && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl rounded-xl p-3 w-48 hidden group-hover:block z-50 border border-slate-100 dark:border-slate-700 text-left">
                            <p className="text-xs font-bold text-slate-400 mb-2 uppercase">{new Date(dateStr).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}</p>
                            <div className="space-y-2">
                                {dayEvents.map((ev, i) => (
                                    <div
                                        key={i}
                                        onClick={() => ev.type !== 'event' && onNavigate(ev.course, ev.item.type, ev.item)}
                                        className={`text-xs p-1.5 rounded cursor-pointer ${ev.type === 'event' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:underline'}`}
                                    >
                                        {ev.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    const handleAddCustomEvent = (data) => {
        setCustomEvents([...customEvents, { ...data }]);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <AddEventModal isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} onAdd={handleAddCustomEvent} />

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white">{monthName} {date.getFullYear()}</h3>
                <div className="flex space-x-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400"><ChevronLeft size={16}/></button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400"><ChevronRight size={16}/></button>
                    <button onClick={() => setIsAddEventOpen(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-[#BF2604]"><Plus size={16}/></button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-center mb-2">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-xs font-bold text-slate-400 dark:text-slate-500">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {renderCalendarDays()}
            </div>
        </div>
    );
};

const GlobalNav = ({ activeTab, setActiveTab, resetView, darkMode, toggleDarkMode, currentUser, onSignOut }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'schedule', icon: Calendar, label: 'Schedule' },
        { id: 'courses', icon: Book, label: 'Courses' },
        { id: 'inbox', icon: Inbox, label: 'Inbox', badge: 3 },
        { id: 'help', icon: HelpCircle, label: 'Help' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-[88px] bg-[#2D3B45] dark:bg-slate-950 flex flex-col items-center py-6 z-50 shadow-2xl text-white transition-colors duration-300">
            <div className="mb-10 cursor-pointer hover:scale-105 transition-transform" onClick={resetView}>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <div className="w-6 h-6 rounded-full border-[3px] border-[#BF2604]"></div>
                </div>
            </div>

            <div className="flex flex-col w-full space-y-4 px-3 flex-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            if (item.id === 'dashboard') resetView();
                        }}
                        className={`group w-full flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 relative ${
                            activeTab === item.id ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <div className="relative">
                            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} className="transition-all" />
                            {item.badge && (
                                <span className="absolute -top-1.5 -right-2 bg-[#BF2604] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#2D3B45] shadow-sm">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium tracking-wide transition-opacity duration-200 ${activeTab === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-auto flex flex-col space-y-4 mb-4 items-center">
                <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Toggle Dark Mode"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div
                    className="group relative"
                    ref={profileRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-10 h-10 bg-[#BF2604] rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/10 relative z-50"
                    >
                        {currentUser.username.charAt(0).toUpperCase()}
                    </button>

                    <div className={`absolute bottom-2 left-12 ml-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 transition-all z-40 border border-slate-100 dark:border-slate-700 ${isMenuOpen || isHovered ? 'block animate-in fade-in slide-in-from-left-2' : 'hidden'}`}>
                        <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300">
                                <User size={16} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{currentUser.username}</p>
                                <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                setIsHovered(false);
                                onSignOut();
                            }}
                            className="w-full flex items-center text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                        >
                            <LogOut size={16} className="mr-2" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseCard = ({ course, onClick, isInstructor, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            className="group bg-white dark:bg-slate-800 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-[280px] relative hover:-translate-y-1"
        >
            <div onClick={() => onClick(course)} className={`h-40 ${course.color} relative p-6 transition-opacity group-hover:opacity-95`}>
                <div className="absolute right-4 top-4 bg-white/20 p-2 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer text-white">
                    <MoreVertical size={18} />
                </div>
                <div className="absolute bottom-4 right-6 text-6xl opacity-30 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{course.icon}</div>
            </div>

            {isInstructor && (
                <div className="absolute right-4 top-4 z-10" onMouseLeave={() => setShowMenu(false)}>
                    <div
                        className="bg-white/20 p-2 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer text-white"
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    >
                        <MoreVertical size={18} />
                    </div>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(course); setShowMenu(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center"
                            >
                                <Edit size={14} className="mr-2"/> Edit
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(course.id); setShowMenu(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                            >
                                <Trash2 size={14} className="mr-2"/> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div onClick={() => onClick(course)} className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-[#2D3B45] dark:text-white text-xl leading-tight group-hover:text-[#BF2604] transition-colors line-clamp-2">
                        {course.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 font-semibold uppercase tracking-wider">
                        {course.code} • {course.term}
                    </p>
                </div>

                <div className="flex space-x-6 mt-4 text-slate-400">
                    <div className="flex items-center hover:text-[#2D3B45] dark:hover:text-white transition-colors">
                        <MessageSquare size={18} />
                        <span className="ml-2 text-xs font-bold">0</span>
                    </div>
                    <div className="flex items-center hover:text-[#2D3B45] dark:hover:text-white transition-colors">
                        <FileText size={18} />
                        <span className="ml-2 text-xs font-bold">{course.modules ? course.modules.reduce((acc, m) => acc + m.items.length, 0) : 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CoursesList = ({ courses, onCourseClick }) => {
    return (
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full flex flex-col">
            <h1 className="text-4xl font-extrabold text-[#2D3B45] dark:text-white mb-8 tracking-tight">All Courses</h1>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex-1">
                {courses.length === 0 ? (
                    <div className="p-20 text-center text-slate-400 flex flex-col items-center">
                        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-full mb-4"><Book size={48} className="text-slate-300 dark:text-slate-500"/></div>
                        <p className="text-lg">No courses available. Add one from the Dashboard.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50 dark:divide-slate-700">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => onCourseClick(course)}
                                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className={`w-14 h-14 rounded-2xl ${course.color} flex items-center justify-center text-3xl text-white shadow-md shadow-slate-200 dark:shadow-none`}>
                                        {course.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#2D3B45] dark:text-white text-lg group-hover:text-[#BF2604] transition-colors">{course.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{course.code} • {course.term}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-slate-300 group-hover:text-slate-500 transition-colors">
                                    <ChevronRight />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const RightSidebar = ({ courses, onNavigate }) => {
    // Flatten assignments and quizzes from all courses into a single To-Do list
    const allToDos = courses.flatMap(course => {
        const items = [...(course.assignments || []), ...(course.quizzes || [])];
        return items.map(item => ({
            ...item,
            courseName: course.name,
            courseCode: course.code,
            courseObject: course, // Reference to course for navigation
            courseColor: course.color
        }));
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return (
        <div className="w-full lg:w-80 flex-shrink-0 lg:pl-8 space-y-8 mt-10 lg:mt-0">
            <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-700 pb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">To Do</h3>
                </div>
                {allToDos.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4 italic">No pending assignments</p>
                ) : (
                    <ul className="space-y-4">
                        {allToDos.map((todo) => (
                            <li
                                key={todo.id}
                                className="flex items-start group cursor-pointer"
                                onClick={() => onNavigate(todo.courseObject, todo.type === 'quiz' ? 'quiz' : 'assignment', todo)}
                            >
                                <div className={`mt-1 text-slate-300 group-hover:text-[#BF2604] transition-colors bg-slate-50 dark:bg-slate-700 p-2 rounded-xl`}>
                                    {todo.type === 'quiz' ? <HelpCircle size={18} /> : <FileText size={18} />}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#2D3B45] dark:group-hover:text-white transition-colors leading-snug">
                                        {todo.title}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                                        {todo.courseCode} • <span className="text-slate-500 dark:text-slate-400">{todo.dueDate}</span>
                                    </p>
                                </div>
                                <button className="text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1 transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Live Calendar Widget */}
            <CalendarWidget courses={courses} onNavigate={onNavigate} />
        </div>
    );
};

const ScheduleView = ({ tasks, setTasks, currentUser }) => {
    const [selectedTask, setSelectedTask] = useState(tasks[0] || null);
    const [noteInput, setNoteInput] = useState('');
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (selectedTask) {
            const updatedSelected = tasks.find(t => t.id === selectedTask.id);
            if (updatedSelected) {
                setSelectedTask(updatedSelected);
            } else {
                setSelectedTask(tasks.length > 0 ? tasks[0] : null);
            }
        } else if (tasks.length > 0 && !selectedTask) {
            setSelectedTask(tasks[0]);
        }
    }, [tasks, selectedTask]);

    const handleSendMessage = () => {
        if (!noteInput.trim()) return;
        const newTask = { ...selectedTask };
        const newNote = {
            id: Date.now(),
            user: currentUser.username,
            text: noteInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today', isMe: true
        };
        const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, notes: [...t.notes, newNote] } : t);
        setTasks(updatedTasks);
        setNoteInput('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const isImage = file.type.startsWith('image/');
        const fileUrl = URL.createObjectURL(file);
        const newNote = {
            id: Date.now(),
            user: currentUser.username,
            text: isImage ? 'Sent an image' : `Sent a file: ${file.name}`,
            fileUrl, fileName: file.name, isImage, isFile: !isImage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today', isMe: true
        };
        const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, notes: [...t.notes, newNote] } : t);
        setTasks(updatedTasks);
        e.target.value = null;
    };

    const handleAddTask = (taskData) => {
        const newTask = { id: Date.now(), ...taskData, notes: [] };
        const newTasks = [...tasks, newTask];
        setTasks(newTasks);
        setSelectedTask(newTask);
    };

    const toggleDeleteSelection = (taskId) => {
        if (selectedForDeletion.includes(taskId)) setSelectedForDeletion(selectedForDeletion.filter(id => id !== taskId));
        else setSelectedForDeletion([...selectedForDeletion, taskId]);
    };

    const executeDeletion = () => {
        if (selectedForDeletion.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedForDeletion.length} task(s)?`)) {
            const remainingTasks = tasks.filter(t => !selectedForDeletion.includes(t.id));
            setTasks(remainingTasks);
            setDeleteMode(false);
            setSelectedForDeletion([]);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative">
            <AddTaskModal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} onAdd={handleAddTask} />

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 p-5 flex justify-between items-center h-20 sticky top-0 z-20">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-[#2D3B45] dark:text-white">Task Schedule</h2>
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-600">{tasks.length}</span>
                </div>

                {deleteMode ? (
                    <div className="flex items-center space-x-3 w-1/2 justify-end animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="text-sm text-slate-500 dark:text-slate-400 mr-2 font-medium">{selectedForDeletion.length} selected</span>
                        <Button variant="ghost" onClick={() => { setDeleteMode(false); setSelectedForDeletion([]); }} className="p-2.5 rounded-full"><X size={18}/></Button>
                        <Button variant="danger" onClick={executeDeletion} disabled={selectedForDeletion.length === 0} className="p-2.5 rounded-full"><Trash2 size={18}/></Button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3 w-1/2 justify-end">
                        <div className="relative w-full max-w-xs group">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                   className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border-none rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#2D3B45]/20 transition-all outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
                            />
                        </div>
                        <Button variant="secondary" onClick={() => setDeleteMode(true)} className="p-2.5 rounded-full"><Minus size={18} /></Button>
                        <Button variant="primary" onClick={() => setIsAddTaskOpen(true)} className="p-2.5 rounded-full bg-[#2D3B45] hover:bg-[#1f2930]"><Plus size={18} /></Button>
                    </div>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-full md:w-1/3 lg:w-[320px] border-r border-slate-100 dark:border-slate-700 flex flex-col bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {filteredTasks.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No tasks found</div>
                        ) : (
                            filteredTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => deleteMode ? toggleDeleteSelection(task.id) : setSelectedTask(task)}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-start group
                                    ${!deleteMode && selectedTask?.id === task.id ? 'bg-white dark:bg-slate-700 shadow-md shadow-slate-100 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-600 scale-[1.02]' : 'hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}
                                `}
                                >
                                    {deleteMode && (
                                        <div className={`mt-1 mr-3 w-5 h-5 rounded-lg border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${selectedForDeletion.includes(task.id) ? 'bg-red-500 border-red-500' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800'}`}>
                                            {selectedForDeletion.includes(task.id) && <Check size={12} className="text-white" />}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className={`font-semibold text-sm ${!deleteMode && selectedTask?.id === task.id ? 'text-[#2D3B45] dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>{task.title}</h3>
                                        <div className="flex flex-col mt-2 space-y-1">
                                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                <Users size={12} className="mr-1.5 opacity-70" /> {task.assignedTo}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                <Clock size={12} className="mr-1.5 opacity-70" />
                                                {new Date(task.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                {task.dueTime ? ` • ${task.dueTime}` : ''}
                                            </div>
                                        </div>
                                    </div>
                                    {!deleteMode && selectedTask?.id === task.id && <div className="w-1.5 h-1.5 rounded-full bg-[#BF2604] mt-2"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
                    {selectedTask ? (
                        <>
                            <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center z-10 sticky top-0">
                                <div>
                                    <h2 className="text-xl font-bold text-[#2D3B45] dark:text-white tracking-tight">{selectedTask.title}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                                        <span className="font-medium text-[#BF2604] mr-2">{selectedTask.assignedTo}</span>
                                        Due {new Date(selectedTask.due).toLocaleDateString()} {selectedTask.dueTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                                {selectedTask.notes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4"><MessageSquare size={32} className="opacity-30" /></div>
                                        <p className="text-sm font-medium">No notes yet.</p>
                                    </div>
                                ) : (
                                    selectedTask.notes.map((note, idx) => {
                                        const isMe = note.user === currentUser.username;
                                        return (
                                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-[modal-enter_0.3s_ease-out]`}>
                                                <span className="text-[10px] text-slate-400 mb-1 px-1">{note.user}</span>
                                                <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    {!isMe && (
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-2 mt-auto bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                            {note.user.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className={`max-w-[75%] p-3.5 shadow-sm text-sm ${
                                                        isMe
                                                            ? 'bg-[#2D3B45] text-white rounded-2xl rounded-tr-sm'
                                                            : 'bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm'
                                                    }`}>
                                                        {note.isImage ? (
                                                            <div className="mt-1">
                                                                <img src={note.fileUrl} alt="uploaded" className="max-w-full rounded-lg" />
                                                            </div>
                                                        ) : note.isFile ? (
                                                            <div className="flex items-center space-x-3 bg-black/10 dark:bg-white/10 p-3 rounded-lg">
                                                                <div className="bg-white/20 p-2 rounded-lg"><FileText size={20} /></div>
                                                                <span className="text-sm underline cursor-pointer font-medium">{note.fileName}</span>
                                                            </div>
                                                        ) : (
                                                            <p className="whitespace-pre-line leading-relaxed">{note.text}</p>
                                                        )}
                                                        <p className={`text-[10px] mt-1 text-right opacity-70 ${isMe ? 'text-slate-200' : 'text-slate-400'}`}>{note.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )})
                                )}
                            </div>

                            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-2 py-2 pr-2 shadow-inner">
                                    <button onClick={() => fileInputRef.current.click()} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-full transition-all" title="Attach">
                                        <Plus size={20} />
                                    </button>
                                    <input
                                        type="text" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="iMessage..."
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 px-3"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className={`p-2 rounded-full transition-all duration-200 ${noteInput.trim() ? 'bg-[#BF2604] text-white scale-100' : 'bg-slate-300 dark:bg-slate-600 text-white scale-90'}`}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center"><span className="text-xs font-bold">↑</span></div>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <List size={48} className="mb-4 opacity-10" />
                            <p className="font-medium">Select a task</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CourseView = ({ course, currentUser, onBack, onUpdateCourse, submissions, onSubmit, onGrade, initialActiveItem }) => {
    const [activeSubTab, setActiveSubTab] = useState(initialActiveItem && initialActiveItem.type === 'quiz' ? 'assignments' : 'home');
    const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
    const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState(initialActiveItem && initialActiveItem.type === 'quiz' ? initialActiveItem : null);
    const [submissionTarget, setSubmissionTarget] = useState(null); // For student submission
    const [gradingTarget, setGradingTarget] = useState(null); // For instructor grading
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState(null);

    const isInstructor = currentUser.role === 'instructor';

    // Handle automatic navigation if prop is provided
    useEffect(() => {
        if (initialActiveItem) {
            setActiveSubTab('assignments');
            if (initialActiveItem.type === 'quiz') {
                setActiveQuiz(initialActiveItem);
            }
        }
    }, [initialActiveItem]);

    const handleAddAssignment = (data) => {
        const newAssignment = { id: Date.now(), ...data };
        onUpdateCourse({ ...course, assignments: [...(course.assignments || []), newAssignment] });
    };

    const handleCreateQuiz = (data) => {
        const newQuiz = { id: Date.now(), ...data };
        onUpdateCourse({ ...course, quizzes: [...(course.quizzes || []), newQuiz] });
    };

    const handleAddModule = (data) => {
        const newModule = { id: Date.now(), title: data.title, items: [] };
        onUpdateCourse({ ...course, modules: [...(course.modules || []), newModule] });
    };

    const handleAddItem = (data) => {
        const newItem = { title: data.title, type: data.type };
        const updatedModules = course.modules.map(mod => mod.id === activeModuleId ? { ...mod, items: [...mod.items, newItem] } : mod);
        onUpdateCourse({ ...course, modules: updatedModules });
        setActiveModuleId(null);
    };

    const handleQuizFinished = (score) => {
        const gradeEntry = {
            id: Date.now(),
            assignmentId: activeQuiz.id,
            studentId: currentUser.id,
            title: activeQuiz.title,
            score,
            maxScore: 100,
            date: new Date().toLocaleDateString(),
            type: 'quiz'
        };
        onGrade(gradeEntry); // Save grade
        setActiveQuiz(null);
    };

    const handleStudentSubmit = (data) => {
        onSubmit({
            assignmentId: submissionTarget.id,
            studentId: currentUser.id,
            ...data
        });
        setSubmissionTarget(null);
    };

    // Helpers for rendering
    const getSubmissionStatus = (itemId) => {
        const sub = submissions.find(s => s.assignmentId === itemId && s.studentId === currentUser.id);
        if (sub) {
            return (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded flex items-center">
                    <CheckCircle size={14} className="mr-1"/>
                    Submitted {sub.fileNames && sub.fileNames.length > 0 ? "Files" : ""} on {sub.date}
                    {sub.fileNames && sub.fileNames.length > 0 && (
                        <span className="ml-2 underline cursor-pointer text-blue-500 flex items-center"><Download size={10} className="mr-1"/> Download</span>
                    )}
                </div>
            );
        }
        return null;
    };

    const assignmentsList = [...(course.assignments || []), ...(course.quizzes || [])];

    // Filter grades for current student, or all for instructor view (simplified)
    const myGrades = course.grades ? course.grades.filter(g => g.studentId === currentUser.id) : [];
    const averageGrade = myGrades.length > 0
        ? Math.round(myGrades.reduce((acc, curr) => acc + parseInt(curr.score), 0) / myGrades.length)
        : 0;

    return (
        <div className="flex flex-col min-h-screen">
            <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onAdd={handleAddAssignment} />
            <CreateQuizModal isOpen={isCreateQuizOpen} onClose={() => setIsCreateQuizOpen(false)} onAdd={handleCreateQuiz} />
            <AddContentModal isOpen={isAddModuleOpen} onClose={() => setIsAddModuleOpen(false)} onAdd={handleAddModule} type="module" />
            <AddContentModal isOpen={!!activeModuleId} onClose={() => setActiveModuleId(null)} onAdd={handleAddItem} type="item" />
            {activeQuiz && <div className="fixed inset-0 z-[100]"><TakeQuizModal quiz={activeQuiz} onClose={() => setActiveQuiz(null)} onFinish={handleQuizFinished} /></div>}
            {submissionTarget && <AssignmentSubmissionModal assignment={submissionTarget} user={currentUser} onClose={() => setSubmissionTarget(null)} onSubmit={handleStudentSubmit} />}
            {gradingTarget && <GradingModal assignment={gradingTarget} submissions={submissions.filter(s => s.assignmentId === gradingTarget.id)} onClose={() => setGradingTarget(null)} onGrade={(sid, score) => onGrade({ assignmentId: gradingTarget.id, studentId: sid, score, maxScore: 100, title: gradingTarget.title, date: new Date().toLocaleDateString() })} />}

            <div className="flex items-center justify-between py-6 border-b border-slate-200 dark:border-slate-700 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-20 px-8">
                <div className="flex items-center text-xl font-bold text-[#2D3B45] dark:text-white">
                    <button onClick={onBack} className="flex items-center text-slate-400 hover:text-[#BF2604] hover:underline mr-3 transition-colors">
                        <LayoutDashboard size={20} className="mr-1" /> Dashboard
                    </button>
                    <ChevronRight size={18} className="text-slate-300 mx-3" />
                    <span className="truncate max-w-[200px] text-slate-800 dark:text-slate-200">{course.code}</span>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-300 uppercase">{currentUser.role} View</div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 px-8 pb-8">
                <nav className="w-full md:w-56 flex-shrink-0 md:mr-10 mb-6 md:mb-0">
                    <ul className="space-y-2">
                        {['home', 'assignments', 'grades'].map(id => (
                            <li key={id}>
                                <button onClick={() => setActiveSubTab(id)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${activeSubTab === id ? 'bg-[#2D3B45] text-white shadow-lg shadow-slate-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{id}</button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[500px] p-8">
                    {activeSubTab === 'home' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-700 pb-4">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-[#2D3B45] dark:text-white tracking-tight">{course.name}</h1>
                                    <p className="text-slate-400 font-medium mt-1">Course Modules</p>
                                </div>
                                {isInstructor && (
                                    <Button variant="accent" onClick={() => setIsAddModuleOpen(true)} className="rounded-full pl-3 pr-4">
                                        <Plus size={18} className="mr-1.5" /> Module
                                    </Button>
                                )}
                            </div>

                            {(!course.modules || course.modules.length === 0) && (
                                <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                                    <p className="text-slate-400 mb-4 font-medium">This course has no content yet.</p>
                                    {isInstructor && <Button variant="secondary" onClick={() => setIsAddModuleOpen(true)}>Create Module</Button>}
                                </div>
                            )}

                            {course.modules && course.modules.map((module) => (
                                <div key={module.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-slate-50 dark:bg-slate-750 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">{module.title}</h3>
                                        <div className="flex items-center space-x-3">
                                            {isInstructor && <button onClick={() => setActiveModuleId(module.id)} className="text-slate-400 hover:text-[#BF2604] transition-colors"><Plus size={20} /></button>}
                                            <span className="text-[10px] font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">PUBLISHED</span>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {module.items.length === 0 && <div className="p-6 text-sm text-slate-400 italic text-center">No items. {isInstructor ? "Click + to add content." : ""}</div>}
                                        {module.items.map((item, idx) => (
                                            <div key={idx} className="p-4 pl-6 flex items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group cursor-pointer">
                                                <span className="text-slate-400 mr-4 group-hover:text-[#BF2604] transition-colors">
                                                    {item.type === 'page' && <FileText size={20} />}
                                                    {item.type === 'quiz' && <HelpCircle size={20} />}
                                                    {item.type === 'assignment' && <BookOpen size={20} />}
                                                    {item.type === 'discussion' && <MessageSquare size={20} />}
                                                    {item.type === 'video' && <Clock size={20} />}
                                                    {item.type === 'file' && <FileText size={20} />}
                                                </span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-[#2D3B45] group-hover:underline decoration-slate-300 underline-offset-4">{item.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSubTab === 'assignments' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-700 pb-4">
                                <h1 className="text-3xl font-extrabold text-[#2D3B45] dark:text-white tracking-tight">Assignments</h1>
                                {isInstructor && (
                                    <div className="flex space-x-3">
                                        <Button variant="secondary" onClick={() => setIsCreateQuizOpen(true)}><HelpCircle size={18} className="mr-2 text-purple-500" /> Quiz</Button>
                                        <Button variant="accent" onClick={() => setIsAddAssignmentOpen(true)}><Plus size={18} className="mr-2" /> Assignment</Button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                {assignmentsList.map((item) => (
                                    <div key={item.id} className="p-5 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className={`p-3 rounded-2xl mr-5 shadow-sm ${item.type === 'quiz' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'}`}>
                                                    {item.type === 'quiz' ? <HelpCircle size={24}/> : <FileText size={24}/>}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{item.title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                                                        Due: {item.dueDate || 'No Date'} | Max Attempts: {item.maxAttempts || 'Unlimited'}
                                                    </p>
                                                    {!isInstructor && getSubmissionStatus(item.id)}
                                                </div>
                                            </div>
                                            <div>
                                                {isInstructor ? (
                                                    item.type !== 'quiz' && <Button variant="secondary" onClick={() => setGradingTarget(item)} className="text-xs">Grade</Button>
                                                ) : (
                                                    item.type === 'quiz' ? (
                                                        <Button variant="primary" onClick={() => setActiveQuiz(item)} className="text-xs bg-purple-600">Take Quiz</Button>
                                                    ) : (
                                                        <Button variant="primary" onClick={() => setSubmissionTarget(item)} className="text-xs">Submit Assignment</Button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSubTab === 'grades' && (
                        <div className="space-y-8">
                            <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex justify-between items-end">
                                <h1 className="text-3xl font-extrabold text-[#2D3B45] dark:text-white tracking-tight">Grades</h1>
                                {!isInstructor && <div className="text-xl font-bold text-slate-700 dark:text-slate-200">Total Average: <span className="text-[#BF2604]">{averageGrade}%</span></div>}
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <table className="min-w-full bg-white dark:bg-slate-800">
                                    <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Assignment</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Score</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                    {myGrades.map((grade, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{grade.title}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{grade.date}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-200">{grade.score}/{grade.maxScore} ({grade.score}%)</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const DashboardHeader = ({ onAddCourse, isInstructor }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <h1 className="text-4xl font-extrabold text-[#2D3B45] dark:text-white tracking-tight">Dashboard</h1>
        {isInstructor && (
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button variant="primary" onClick={onAddCourse} className="pl-4 pr-6">
                    <Plus size={20} className="mr-2" /> New Course
                </Button>
            </div>
        )}
    </div>
);

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [courses, setCourses] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [scheduleTasks, setScheduleTasks] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
    const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    useEffect(() => {
        setCourses(loadData('lms_courses', []));
        setSubmissions(loadData('lms_submissions', []));
        setScheduleTasks(loadData('lms_schedule_tasks', SCHEDULE_TASKS));
        const savedUser = sessionStorage.getItem('lms_current_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    const handleLogin = (user) => {
        setCurrentUser(user);
        sessionStorage.setItem('lms_current_user', JSON.stringify(user));
    };

    const handleSignOut = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('lms_current_user');
    };

    const handleCreateCourse = (courseData) => {
        const newCourse = {
            id: Date.now(),
            ...courseData,
            color: getRandomColor(),
            icon: getRandomIcon(),
            assignments: [], quizzes: [], grades: []
        };
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
        saveData('lms_courses', updatedCourses);
    };

    const handleUpdateCourse = (updatedCourse) => {
        const updatedList = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
        setCourses(updatedList);
        saveData('lms_courses', updatedList);
        setSelectedCourse(updatedCourse);
    };

    const handleDeleteCourse = (courseId) => {
        if(confirm("Are you sure you want to delete this course?")) {
            const updatedCourses = courses.filter(c => c.id !== courseId);
            setCourses(updatedCourses);
            saveData('lms_courses', updatedCourses);
        }
    };

    const openEditCourseModal = (course) => {
        setEditingCourse(course);
        setIsEditCourseOpen(true);
    };

    const handleEditCourse = (updatedCourse) => {
        const updatedList = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
        setCourses(updatedList);
        saveData('lms_courses', updatedList);
        setEditingCourse(null);
    };

    const handleSubmitAssignment = (submissionData) => {
        const newSubmissions = [...submissions, submissionData];
        setSubmissions(newSubmissions);
        saveData('lms_submissions', newSubmissions);
    };

    const handleUpdateScheduleTasks = (newTasks) => {
        setScheduleTasks(newTasks);
        saveData('lms_schedule_tasks', newTasks);
    };

    const handleGrade = (gradeData) => {
        const courseIndex = courses.findIndex(c => c.assignments?.find(a => a.id === gradeData.assignmentId) || c.quizzes?.find(q => q.id === gradeData.assignmentId));
        if (courseIndex > -1) {
            const course = courses[courseIndex];
            const cleanGrades = (course.grades || []).filter(g => !(g.assignmentId === gradeData.assignmentId && g.studentId === gradeData.studentId));
            const updatedCourse = { ...course, grades: [...cleanGrades, gradeData] };
            handleUpdateCourse(updatedCourse);
        }
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setActiveItem(null);
        setActiveTab('courses');
    };

    const handleNavigateToItem = (course, type, item) => {
        setSelectedCourse(course);
        setActiveItem(item);
        setActiveTab('courses');
    };

    const resetView = () => {
        setSelectedCourse(null);
        setActiveTab('dashboard');
    };

    if (!currentUser) {
        return <AuthScreen onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen w-full bg-slate-50/50 dark:bg-slate-900 font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <CreateCourseModal isOpen={isCreateCourseOpen} onClose={() => setIsCreateCourseOpen(false)} onCreate={handleCreateCourse} />
            <EditCourseModal isOpen={isEditCourseOpen} onClose={() => setIsEditCourseOpen(false)} onEdit={handleEditCourse} course={editingCourse} />

            <div className="fixed inset-y-0 left-0 z-40">
                <GlobalNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    resetView={resetView}
                    darkMode={darkMode}
                    toggleDarkMode={() => setDarkMode(!darkMode)}
                    currentUser={currentUser}
                    onSignOut={handleSignOut}
                />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden pt-0 ml-[88px] bg-[#F5F7FA] dark:bg-slate-950 transition-colors duration-300">
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto h-full">
                        {selectedCourse ? (
                            <CourseView
                                course={selectedCourse}
                                currentUser={currentUser}
                                onBack={resetView}
                                onUpdateCourse={handleUpdateCourse}
                                submissions={submissions}
                                onSubmit={handleSubmitAssignment}
                                onGrade={handleGrade}
                                initialActiveItem={activeItem}
                            />
                        ) : activeTab === 'dashboard' ? (
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex-1 lg:mr-12">
                                    <DashboardHeader onAddCourse={() => setIsCreateCourseOpen(true)} isInstructor={currentUser.role === 'instructor'} />
                                    {courses.length === 0 ? (
                                        <div className="text-center py-32 text-slate-400">No courses available. {currentUser.role === 'instructor' ? 'Create one!' : 'Ask your instructor to add one.'}</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                            {courses.map(course => (
                                                <CourseCard
                                                    key={course.id}
                                                    course={course}
                                                    onClick={handleCourseClick}
                                                    isInstructor={currentUser.role === 'instructor'}
                                                    onEdit={openEditCourseModal}
                                                    onDelete={handleDeleteCourse}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <RightSidebar courses={courses} onNavigate={handleNavigateToItem} />
                            </div>
                        ) : activeTab === 'schedule' ? (
                            <ScheduleView tasks={scheduleTasks} setTasks={handleUpdateScheduleTasks} currentUser={currentUser} />
                        ) : activeTab === 'courses' ? (
                            <CoursesList courses={courses} onCourseClick={handleCourseClick} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                    {activeTab === 'inbox' && <Inbox size={48} className="text-slate-300 dark:text-slate-500"/>}
                                    {activeTab === 'help' && <HelpCircle size={48} className="text-slate-300 dark:text-slate-500"/>}
                                </div>
                                <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-300 capitalize mb-2">{activeTab}</h2>
                                <p className="font-medium text-slate-400">This module is under construction.</p>
                                <Button variant="primary" onClick={() => setActiveTab('dashboard')} className="mt-8 px-8 py-3 rounded-full">
                                    Return to Dashboard
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

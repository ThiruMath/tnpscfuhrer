import React, { useState, useEffect, useRef } from 'react';

/* ────────────────── Types ────────────────── */
export interface ExtractedQuestion {
  id: string;
  serial: number;
  question: string;
  questionTamil: string;
  options: string[];
  optionsTamil: string[];
  answer: string; // 'A' | 'B' | 'C' | 'D'
  syllabusTag: string;
  syllabusTagTamil: string;
  unit: string;
  unitTamil: string;
  explanation: string;
  explanationTamil: string;
  pageNumber: number;
  qcApproved: boolean;
  reportedIssue?: string;
}

export interface QuestionPaperMeta {
  id: string;
  title: string;
  titleTamil: string;
  year: string;
  examCode: string;
  totalQuestions: number;
  pdfUrl: string;
  pdfFileName: string;
  jsonPath?: string;
  status: 'active' | 'draft' | 'archived';
}

const SYLLABUS_CATALOG = [
  { tagEn: 'General Tamil (Grammar)', tagTa: 'பொதுத்தமிழ் (பகுதி அ - இலக்கணம்)', unitEn: 'Part A', unitTa: 'பகுதி அ' },
  { tagEn: 'Tamil Literature', tagTa: 'பொதுத்தமிழ் (பகுதி ஆ - இலக்கியம்)', unitEn: 'Part B', unitTa: 'பகுதி ஆ' },
  { tagEn: 'Tamil Scholars & Service', tagTa: 'பொதுத்தமிழ் (பகுதி இ - தமிழ் அறிஞர்கள்)', unitEn: 'Part C', unitTa: 'பகுதி இ' },
  { tagEn: 'General Science', tagTa: 'பொது அறிவியல்', unitEn: 'Unit 1', unitTa: 'அலகு 1' },
  { tagEn: 'Current Affairs', tagTa: 'நடப்பு நிகழ்வுகள்', unitEn: 'Unit 2', unitTa: 'அலகு 2' },
  { tagEn: 'Geography of India & TN', tagTa: 'இந்தியா & தமிழகப் புவியியல்', unitEn: 'Unit 3', unitTa: 'அலகு 3' },
  { tagEn: 'History and Culture of India', tagTa: 'இந்திய வரலாறு & பண்பாடு', unitEn: 'Unit 4', unitTa: 'அலகு 4' },
  { tagEn: 'Indian Polity', tagTa: 'இந்திய ஆட்சியியல்', unitEn: 'Unit 5', unitTa: 'அலகு 5' },
  { tagEn: 'Indian Economy', tagTa: 'இந்தியப் பொருளாதாரம்', unitEn: 'Unit 6', unitTa: 'அலகு 6' },
  { tagEn: 'Indian National Movement', tagTa: 'இந்திய தேசிய இயக்கம்', unitEn: 'Unit 7', unitTa: 'அலகு 7' },
  { tagEn: 'History & Culture of TN', tagTa: 'தமிழ்நாடு வரலாறு, மரபு & பண்பாடு', unitEn: 'Unit 8', unitTa: 'அலகு 8' },
  { tagEn: 'Development Administration in TN', tagTa: 'தமிழக வளர்ச்சி நிர்வாகம்', unitEn: 'Unit 9', unitTa: 'அலகு 9' },
  { tagEn: 'Aptitude & Mental Ability', tagTa: 'கணிதம் & திறனறி தேர்வு', unitEn: 'Unit 10', unitTa: 'அலகு 10' },
];

const PAPERS_REGISTRY: QuestionPaperMeta[] = [
  {
    id: 'grp4-2025',
    title: 'TNPSC Group 4 (2025) Master Question Paper',
    titleTamil: 'டி.என்.பி.எஸ்.சி குரூப் 4 (2025) முதன்மை வினாத்தாள் (200 வினாக்கள்)',
    year: '2025',
    examCode: 'GRP4',
    totalQuestions: 200,
    pdfUrl: '/sample-question-paper.pdf',
    pdfFileName: 'TNPSC_Group4_2025_Master_200Q.pdf',
    jsonPath: '/data/pyq/tnpsc-2025-GRP4.json',
    status: 'active',
  },
  {
    id: 'grp2a-2026',
    title: 'TNPSC Group 2A (2026) General Studies Paper',
    titleTamil: 'டி.என்.பி.எஸ்.சி குரூப் 2A (2026) பொது அறிவு வினாத்தாள்',
    year: '2026',
    examCode: 'GRP2A',
    totalQuestions: 100,
    pdfUrl: '/sample-question-paper.pdf',
    pdfFileName: 'TNPSC_Group2A_2026_General_Studies.pdf',
    jsonPath: '/data/pyq/tnpsc-2026-GRP2A.json',
    status: 'draft',
  },
];

function generateFallbackQuestions(count: number, paperId: string): ExtractedQuestion[] {
  const letters = ['A', 'B', 'C', 'D'];
  const res: ExtractedQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const s = SYLLABUS_CATALOG[(i - 1) % SYLLABUS_CATALOG.length];
    const ans = letters[(i * 3 + 1) % 4];
    const page = Math.max(1, Math.ceil(i / 6));
    res.push({
      id: String(paperId) + '-q' + i,
      serial: i,
      question: 'Question #' + i + ': Select the correct statement relating to ' + s.tagEn + '.',
      questionTamil: 'வினா எண் ' + i + ': ' + s.tagTa + ' தொடர்பான சரியான விடையைத் தேர்ந்தெடுக்கவும்.',
      options: [
        'Option A: Statement on ' + s.tagEn + ' principle (A)',
        'Option B: Statement on ' + s.tagEn + ' standard rule (B)',
        'Option C: Statement on ' + s.tagEn + ' verified answer (C)',
        'Option D: Statement on ' + s.tagEn + ' reference point (D)',
      ],
      optionsTamil: [
        'விருப்பம் A: ' + s.tagTa + ' தொடர்பான அடிப்படைக் கூற்று (A)',
        'விருப்பம் B: ' + s.tagTa + ' தொடர்பான பொது விளக்கம் (B)',
        'விருப்பம் C: ' + s.tagTa + ' தொடர்பான சரியான விடைக்குறிப்பு (C)',
        'விருப்பம் D: ' + s.tagTa + ' தொடர்பான விதிமுறை (D)',
      ],
      answer: ans,
      syllabusTag: s.tagEn,
      syllabusTagTamil: s.tagTa,
      unit: s.unitEn,
      unitTamil: s.unitTa,
      explanation: 'Official syllabus verification for question #' + i + ' under ' + s.tagEn + '.',
      explanationTamil: 'அதிகாரப்பூர்வ TNPSC விடைக்குறிப்பு மற்றும் பாடநூல் விளக்கம்: வினா எண் ' + i + '.',
      pageNumber: page,
      qcApproved: i <= 25,
    });
  }
  return res;
}

export const ProjectDashboard: React.FC = () => {
  /* ── Auth State ── */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [currentPasscode, setCurrentPasscode] = useState<string>('Thiru@1432');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [newPasscode, setNewPasscode] = useState<string>('');

  /* ── Studio Layout & Mode State ── */
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'pdf'>('split');
  const [studioLang, setStudioLang] = useState<'ta' | 'en'>('ta');
  const [toastMessage, setToastMessage] = useState<string>('');

  /* ── Active Paper & Questions State ── */
  const [activePaper, setActivePaper] = useState<QuestionPaperMeta>(PAPERS_REGISTRY[0]);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);

  /* ── 25-Question Partition & Filter State ── */
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusedQuestionSerial, setFocusedQuestionSerial] = useState<number | null>(null);

  /* ── Live PDF Reader State ── */
  const [pdfUrl, setPdfUrl] = useState<string>(activePaper.pdfUrl);
  const [pdfFileName, setPdfFileName] = useState<string>(activePaper.pdfFileName);
  const [currentPdfPage, setCurrentPdfPage] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const questionCardsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  /* ── Initial Load & Auth Check ── */
  useEffect(() => {
    try {
      const storedPass = localStorage.getItem('tnpsc_studio_pass') || 'Thiru@1432';
      setCurrentPasscode(storedPass);
      const isAuth = sessionStorage.getItem('tnpsc_studio_auth') || localStorage.getItem('tnpsc_studio_auth');
      if (isAuth === 'true') {
        setIsAuthenticated(true);
      }
      const savedLang = localStorage.getItem('tnpsc_studio_lang') as 'ta' | 'en';
      if (savedLang) setStudioLang(savedLang);
    } catch {}
  }, []);

  /* ── Load Active Paper Questions ── */
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingQuestions(true);

    async function loadQuestions() {
      const storageKey = 'tnpsc_studio_q_' + activePaper.id;
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (!isCancelled) {
              setQuestions(parsed);
              setIsLoadingQuestions(false);
              return;
            }
          }
        }
      } catch {}

      if (activePaper.jsonPath) {
        try {
          const res = await fetch(activePaper.jsonPath);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.questions)) {
              const letters = ['A', 'B', 'C', 'D'];
              const mapped: ExtractedQuestion[] = data.questions.map((q: any, idx: number) => {
                const sIndex = idx % SYLLABUS_CATALOG.length;
                const s = SYLLABUS_CATALOG[sIndex];
                const ansLetter = typeof q.answer === 'number' ? letters[q.answer] : (q.answer || 'A');
                const page = Math.max(1, Math.ceil((idx + 1) / 6));
                return {
                  id: activePaper.id + '-q' + (q.id || (idx + 1)),
                  serial: q.id || (idx + 1),
                  question: q.question_en || q.question || ('Question #' + (idx + 1)),
                  questionTamil: q.question || ('வினா எண் ' + (idx + 1)),
                  options: (q.options || []).map((opt: string, oi: number) => opt || ('Option ' + letters[oi])),
                  optionsTamil: (q.options || []).map((opt: string, oi: number) => opt || ('விருப்பம் ' + letters[oi])),
                  answer: ansLetter,
                  syllabusTag: q.topic || s.tagEn,
                  syllabusTagTamil: s.tagTa,
                  unit: q.part ? ('Part ' + q.part) : s.unitEn,
                  unitTamil: q.part ? ('பகுதி ' + q.part) : s.unitTa,
                  explanation: q.explanation || ('Official syllabus verification for question #' + (idx + 1) + '.'),
                  explanationTamil: q.explanation || ('அதிகாரப்பூர்வ TNPSC விடைக்குறிப்பு விளக்கம்: வினா எண் ' + (idx + 1) + '.'),
                  pageNumber: page,
                  qcApproved: idx < 25,
                };
              });

              if (!isCancelled) {
                setQuestions(mapped);
                setIsLoadingQuestions(false);
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Failed to fetch JSON, using generated questions', e);
        }
      }

      const fallback = generateFallbackQuestions(activePaper.totalQuestions, activePaper.id);
      if (!isCancelled) {
        setQuestions(fallback);
        setIsLoadingQuestions(false);
      }
    }

    loadQuestions();
    setPdfUrl(activePaper.pdfUrl);
    setPdfFileName(activePaper.pdfFileName);

    return () => {
      isCancelled = true;
    };
  }, [activePaper]);

  const persistQuestions = (updated: ExtractedQuestion[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem('tnpsc_studio_q_' + activePaper.id, JSON.stringify(updated));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === currentPasscode) {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('tnpsc_studio_auth', 'true');
        localStorage.setItem('tnpsc_studio_auth', 'true');
      } catch {}
      showToast('Welcome to Studio Command Center!');
    } else {
      setAuthError(studioLang === 'ta' ? 'தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.' : 'Incorrect passcode. Try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('tnpsc_studio_auth');
      localStorage.removeItem('tnpsc_studio_auth');
    } catch {}
  };

  const handleUpdatePasscode = () => {
    if (newPasscode.trim().length >= 6) {
      setCurrentPasscode(newPasscode.trim());
      try {
        localStorage.setItem('tnpsc_studio_pass', newPasscode.trim());
      } catch {}
      setShowSettingsModal(false);
      setNewPasscode('');
      showToast(studioLang === 'ta' ? 'கடவுச்சொல் மாற்றப்பட்டது!' : 'Passcode successfully updated!');
    }
  };

  const handleUploadLocalPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setPdfFileName(file.name);
      setCurrentPdfPage(1);
      showToast('Loaded PDF: ' + file.name);
    }
  };

  const jumpPdfToPage = (pageNum: number) => {
    setCurrentPdfPage(pageNum);
    const cleanUrl = pdfUrl.split('#')[0];
    setPdfUrl(cleanUrl + '#page=' + pageNum + '&zoom=' + pdfZoom);
  };

  const scrollToQuestionCard = (serial: number, pageNum: number) => {
    setFocusedQuestionSerial(serial);
    jumpPdfToPage(pageNum);
    const el = questionCardsRef.current[serial];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const updateQuestionField = (serial: number, field: keyof ExtractedQuestion, val: any) => {
    const updated = questions.map((q) => (q.serial === serial ? { ...q, [field]: val } : q));
    persistQuestions(updated);
  };

  const updateOptionText = (serial: number, optIndex: number, text: string, isTamil: boolean) => {
    const updated = questions.map((q) => {
      if (q.serial !== serial) return q;
      if (isTamil) {
        const nextOpts = [...q.optionsTamil];
        nextOpts[optIndex] = text;
        return { ...q, optionsTamil: nextOpts };
      } else {
        const nextOpts = [...q.options];
        nextOpts[optIndex] = text;
        return { ...q, options: nextOpts };
      }
    });
    persistQuestions(updated);
  };

  const toggleQcApproval = (serial: number) => {
    const updated = questions.map((q) => {
      if (q.serial === serial) {
        const nextStatus = !q.qcApproved;
        return { ...q, qcApproved: nextStatus, reportedIssue: nextStatus ? undefined : q.reportedIssue };
      }
      return q;
    });
    persistQuestions(updated);
    showToast(studioLang === 'ta' ? ('வினா #' + serial + ' சரிபார்க்கப்பட்டது!') : ('Question #' + serial + ' verified!'));
  };

  const flagQuestionIssue = (serial: number) => {
    const note = prompt(
      studioLang === 'ta' ? 'இந்த வினாவில் உள்ள சந்தேகத்தை / பிழையைக் குறிப்பிடவும்:' : 'Enter report note or typo for this question:',
      questions.find((q) => q.serial === serial)?.reportedIssue || ''
    );
    if (note !== null) {
      const updated = questions.map((q) => (q.serial === serial ? { ...q, reportedIssue: note.trim() || undefined, qcApproved: false } : q));
      persistQuestions(updated);
      showToast(studioLang === 'ta' ? ('வினா #' + serial + ' குறிக்கப்பட்டது.') : ('Question #' + serial + ' flagged.'));
    }
  };

  const deleteQuestion = (serial: number) => {
    if (confirm(studioLang === 'ta' ? ('வினா எண் #' + serial + ' ஐ நீக்கவா?') : ('Are you sure you want to delete Question #' + serial + '?'))) {
      const filtered = questions.filter((q) => q.serial !== serial);
      persistQuestions(filtered);
      showToast(studioLang === 'ta' ? ('வினா #' + serial + ' நீக்கப்பட்டது.') : ('Question #' + serial + ' deleted.'));
    }
  };

  const addNewQuestion = () => {
    const nextSerial = questions.length > 0 ? Math.max(...questions.map((q) => q.serial)) + 1 : 1;
    const newQ: ExtractedQuestion = {
      id: activePaper.id + '-q' + nextSerial,
      serial: nextSerial,
      question: 'New Question Text in English',
      questionTamil: 'புதிய வினா உரை (தமிழில்)',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      optionsTamil: ['விருப்பம் A', 'விருப்பம் B', 'விருப்பம் C', 'விருப்பம் D'],
      answer: 'A',
      syllabusTag: SYLLABUS_CATALOG[0].tagEn,
      syllabusTagTamil: SYLLABUS_CATALOG[0].tagTa,
      unit: SYLLABUS_CATALOG[0].unitEn,
      unitTamil: SYLLABUS_CATALOG[0].unitTa,
      explanation: 'Official explanation in English',
      explanationTamil: 'அதிகாரப்பூர்வ TNPSC விளக்கம் (தமிழில்)',
      pageNumber: Math.max(1, Math.ceil(nextSerial / 6)),
      qcApproved: false,
    };
    const updated = [...questions, newQ];
    persistQuestions(updated);
    showToast(studioLang === 'ta' ? ('புதிய வினா #' + nextSerial + ' சேர்க்கப்பட்டது!') : ('Added new question #' + nextSerial + '!'));
    setTimeout(() => scrollToQuestionCard(nextSerial, newQ.pageNumber), 150);
  };

  const approveCurrentQuizSet = () => {
    if (selectedQuizIndex === 0) {
      const updated = questions.map((q) => ({ ...q, qcApproved: true, reportedIssue: undefined }));
      persistQuestions(updated);
      showToast(studioLang === 'ta' ? 'அனைத்து 200 வினாக்களும் சரிபார்க்கப்பட்டன!' : 'All 200 questions approved!');
    } else {
      const start = (selectedQuizIndex - 1) * 25 + 1;
      const end = selectedQuizIndex * 25;
      const updated = questions.map((q) => (q.serial >= start && q.serial <= end ? { ...q, qcApproved: true, reportedIssue: undefined } : q));
      persistQuestions(updated);
      showToast(
        studioLang === 'ta'
          ? ('வினாடி வினா ' + selectedQuizIndex + ' (Q' + start + '-Q' + end + ') சரிபார்க்கப்பட்டது!')
          : ('Quiz Set ' + selectedQuizIndex + ' (Q' + start + '-Q' + end + ') fully approved!')
      );
    }
  };

  const exportDatabaseJson = () => {
    const exportData = {
      meta: {
        exam: activePaper.title,
        examTamil: activePaper.titleTamil,
        year: activePaper.year,
        paper_code: activePaper.examCode,
        total_questions: questions.length,
        approved_count: questions.filter((q) => q.qcApproved).length,
        exported_at: new Date().toISOString(),
        quizzes_generated: Math.ceil(questions.length / 25),
      },
      questions: questions.map((q) => ({
        id: q.serial,
        part: q.unit,
        topic: q.syllabusTag,
        question: q.questionTamil,
        question_en: q.question,
        options: q.optionsTamil,
        options_en: q.options,
        answer: q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : 3,
        explanation: q.explanationTamil,
        explanation_en: q.explanation,
        page_in_pdf: q.pageNumber,
        qc_approved: q.qcApproved,
      })),
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activePaper.examCode + '_' + activePaper.year + '_Database_Export.json';
    a.click();
    showToast(studioLang === 'ta' ? 'வினா வங்கி JSON தரவிறக்கம் செய்யப்பட்டது!' : 'Database JSON exported successfully!');
  };

  const totalQuestions = questions.length;
  const approvedCount = questions.filter((q) => q.qcApproved).length;
  const quizSetsCount = Math.max(1, Math.ceil(totalQuestions / 25));

  const filteredQuestions = questions.filter((q) => {
    if (selectedQuizIndex > 0) {
      const start = (selectedQuizIndex - 1) * 25 + 1;
      const end = selectedQuizIndex * 25;
      if (q.serial < start || q.serial > end) return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchNum = q.serial.toString() === query.replace('#', '');
      const matchText =
        q.question.toLowerCase().includes(query) ||
        q.questionTamil.toLowerCase().includes(query) ||
        q.syllabusTag.toLowerCase().includes(query) ||
        q.syllabusTagTamil.toLowerCase().includes(query);
      return matchNum || matchText;
    }
    return true;
  });

  /* ── Login Overlay ── */
  if (!isAuthenticated) {
    return (
      <div className="studio-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '420px',
            width: '90%',
            background: 'var(--s-bg-surface)',
            border: '1px solid var(--s-border-default)',
            borderRadius: 'var(--s-radius-lg)',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚡</div>
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontSize: '1.4rem', margin: '0 0 0.5rem', color: 'var(--s-text-primary)' }}>
            TNPSC Fuhrer Studio
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--s-text-muted)', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
            {studioLang === 'ta'
              ? 'அனைத்து வினாத்தாள்களையும் தரவுத்தளமாக மாற்றி 25-வினா வினாடி வினாக்களை உருவாக்கும் கட்டுப்பாட்டு அறை.'
              : 'Master Command Center: Convert Question Papers to Database & Generate 25-Q Quizzes.'}
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input
              type="password"
              placeholder={studioLang === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்...' : 'Enter Studio Passcode...'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.75rem 1rem',
                background: 'var(--s-bg-input)',
                border: '1px solid var(--s-border-default)',
                borderRadius: 'var(--s-radius-sm)',
                color: 'var(--s-text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            {authError && <div style={{ color: 'var(--s-red)', fontSize: '0.8rem', textAlign: 'left' }}>{authError}</div>}
            <button type="submit" className="s-btn s-btn-primary" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}>
              {studioLang === 'ta' ? 'உள்நுழைக' : 'Enter Studio'} →
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--s-text-faint)' }}>
            Default Passcode: <code style={{ color: 'var(--s-blue)', fontFamily: 'var(--s-font-mono)' }}>Thiru@1432</code>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full Page Edge-to-Edge Workspace ── */
  return (
    <div className="studio-root">
      {/* ── Top Header Navigation Bar (58px) ── */}
      <header className="studio-header">
        <div className="studio-brand">
          <a href="/" className="studio-logo-badge" title="Go to TNPSC Fuhrer Home">
            <span>⚡</span> TNPSC STUDIO
          </a>

          {/* Active Question Paper Selector */}
          <select
            className="studio-project-select"
            value={activePaper.id}
            onChange={(e) => {
              const selected = PAPERS_REGISTRY.find((p) => p.id === e.target.value);
              if (selected) setActivePaper(selected);
            }}
          >
            {PAPERS_REGISTRY.map((p) => (
              <option key={p.id} value={p.id}>
                {studioLang === 'ta' ? p.titleTamil : p.title} ({p.totalQuestions} Qs)
              </option>
            ))}
          </select>
        </div>

        {/* Live Stats Ribbon */}
        <div className="studio-stats-ribbon">
          <span className="studio-stat-pill">
            📊 {studioLang === 'ta' ? 'மொத்தம்' : 'Total'}: <strong>{totalQuestions} Qs</strong>
          </span>
          <span className={'studio-stat-pill ' + (approvedCount === totalQuestions ? 'success' : '')}>
            🟢 {studioLang === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'QC Approved'}: <strong>{approvedCount}/{totalQuestions}</strong>
          </span>
          <span className="studio-stat-pill">
            📦 {studioLang === 'ta' ? 'வினாடி வினாக்கள்' : 'Quizzes'}: <strong>{quizSetsCount} Sets (25Q)</strong>
          </span>
        </div>

        {/* View Mode & Actions Toolbar */}
        <div className="studio-header-actions">
          {/* Split / Editor / PDF View Toggles */}
          <div className="studio-view-toggle">
            <button
              type="button"
              className={'studio-view-btn ' + (viewMode === 'split' ? 'active' : '')}
              onClick={() => setViewMode('split')}
              title="Split View (PDF + Editor)"
            >
              <span>◫</span> {studioLang === 'ta' ? 'இருபக்க பார்வை' : 'Split View'}
            </button>
            <button
              type="button"
              className={'studio-view-btn ' + (viewMode === 'editor' ? 'active' : '')}
              onClick={() => setViewMode('editor')}
              title="Editor Only"
            >
              <span>📝</span> {studioLang === 'ta' ? 'கேள்விகள் மட்டும்' : 'Editor Only'}
            </button>
            <button
              type="button"
              className={'studio-view-btn ' + (viewMode === 'pdf' ? 'active' : '')}
              onClick={() => setViewMode('pdf')}
              title="PDF Reader Only"
            >
              <span>📄</span> {studioLang === 'ta' ? 'PDF மட்டும்' : 'PDF Only'}
            </button>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            className="s-btn s-btn-secondary"
            onClick={() => {
              const next = studioLang === 'ta' ? 'en' : 'ta';
              setStudioLang(next);
              try {
                localStorage.setItem('tnpsc_studio_lang', next);
              } catch {}
            }}
          >
            🌐 {studioLang === 'ta' ? 'English' : 'தமிழ்'}
          </button>

          {/* Add Question Button */}
          <button type="button" className="s-btn s-btn-secondary" onClick={addNewQuestion} title="Add New Question">
            + {studioLang === 'ta' ? 'புதிய வினா' : 'Add Question'}
          </button>

          {/* Export Database JSON */}
          <button type="button" className="s-btn s-btn-success" onClick={exportDatabaseJson} title="Export Database JSON">
            📥 {studioLang === 'ta' ? 'JSON தரவிறக்கு' : 'Export JSON'}
          </button>

          {/* Settings Modal Toggle */}
          <button type="button" className="s-btn s-btn-ghost" onClick={() => setShowSettingsModal(true)} title="Passcode Settings">
            ⚙
          </button>

          {/* Logout Button */}
          <button type="button" className="s-btn s-btn-ghost" onClick={handleLogout} title="Lock & Logout">
            🔒
          </button>
        </div>
      </header>

      {/* ── Sub Partition Bar: 25-Question Quizzes & Filters (48px) ── */}
      <div className="studio-partition-bar">
        {/* Horizontal Quiz Set Tabs */}
        <div className="studio-quiz-tabs">
          <button
            type="button"
            className={'studio-tab-btn ' + (selectedQuizIndex === 0 ? 'active' : '')}
            onClick={() => setSelectedQuizIndex(0)}
          >
            <span>📚</span> {studioLang === 'ta' ? 'அனைத்து வினாக்களும்' : 'All Questions'} ({totalQuestions})
          </button>

          {Array.from({ length: quizSetsCount }, (_, i) => {
            const quizNum = i + 1;
            const startQ = i * 25 + 1;
            const endQ = Math.min(totalQuestions, (i + 1) * 25);
            const inSet = questions.filter((q) => q.serial >= startQ && q.serial <= endQ);
            const setApproved = inSet.length > 0 && inSet.every((q) => q.qcApproved);
            return (
              <button
                key={quizNum}
                type="button"
                className={'studio-tab-btn ' + (selectedQuizIndex === quizNum ? 'active' : '') + (setApproved ? ' approved' : '')}
                onClick={() => setSelectedQuizIndex(quizNum)}
              >
                <span>{setApproved ? '✔' : '🧩'}</span>
                {studioLang === 'ta' ? ('வினாடி வினா ' + quizNum) : ('Quiz ' + quizNum)} [Q{startQ}-{endQ}]
              </button>
            );
          })}
        </div>

        {/* Search & Bulk QC Actions */}
        <div className="studio-partition-controls">
          <input
            type="text"
            className="studio-search-input"
            placeholder={studioLang === 'ta' ? 'தேடு (#25, இலக்கணம்)...' : 'Search (#25, topic)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            type="button"
            className="s-btn s-btn-primary"
            onClick={approveCurrentQuizSet}
            title="Approve all questions in this active quiz view"
          >
            ✔ {selectedQuizIndex === 0 ? (studioLang === 'ta' ? 'அனைத்தும் சரிபார்' : 'Approve All') : (studioLang === 'ta' ? 'இந்த 25Q சரிபார்' : 'Approve This 25Q')}
          </button>

          <a href="/quiz/gemini" target="_blank" rel="noopener noreferrer" className="s-btn s-btn-secondary" title="Preview Gemini Quiz">
            ↗ {studioLang === 'ta' ? 'மாதிரித் தேர்வு' : 'Test Quiz'}
          </a>
        </div>
      </div>

      {/* ── Main Workspace Body (Edge-to-Edge) ── */}
      <main className={'studio-workspace view-' + viewMode}>
        {/* ── Left Pane: Live PDF Document Reader ── */}
        {(viewMode === 'split' || viewMode === 'pdf') && (
          <section className="studio-pdf-panel">
            {/* PDF Toolbar */}
            <div className="studio-pdf-toolbar">
              <div className="studio-pdf-meta" title={pdfFileName}>
                <span>📄</span>
                <strong>{pdfFileName}</strong>
              </div>

              <div className="studio-pdf-controls">
                {/* Page Jump */}
                <span style={{ fontSize: '0.75rem', color: 'var(--s-text-muted)' }}>{studioLang === 'ta' ? 'பக்கம்:' : 'Page:'}</span>
                <input
                  type="number"
                  min="1"
                  max="40"
                  className="studio-page-jump-input"
                  value={currentPdfPage}
                  onChange={(e) => {
                    const p = parseInt(e.target.value) || 1;
                    jumpPdfToPage(p);
                  }}
                />

                {/* Zoom Controls */}
                <button
                  type="button"
                  className="s-btn s-btn-ghost"
                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                  onClick={() => {
                    const next = Math.max(50, pdfZoom - 15);
                    setPdfZoom(next);
                    jumpPdfToPage(currentPdfPage);
                  }}
                  title="Zoom Out"
                >
                  -
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--s-text-muted)', fontFamily: 'var(--s-font-mono)' }}>{pdfZoom}%</span>
                <button
                  type="button"
                  className="s-btn s-btn-ghost"
                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                  onClick={() => {
                    const next = Math.min(200, pdfZoom + 15);
                    setPdfZoom(next);
                    jumpPdfToPage(currentPdfPage);
                  }}
                  title="Zoom In"
                >
                  +
                </button>

                {/* Upload or Switch Local PDF */}
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleUploadLocalPdf}
                />
                <button
                  type="button"
                  className="s-btn s-btn-secondary"
                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Open any local Question Paper PDF from your computer"
                >
                  📂 {studioLang === 'ta' ? 'PDF மாற்று' : 'Switch PDF'}
                </button>

                {/* Open in full tab */}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="s-btn s-btn-ghost"
                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                  title="Open PDF in new tab"
                >
                  ↗
                </a>
              </div>
            </div>

            {/* Embedded Live PDF Frame */}
            <div className="studio-pdf-frame-wrapper">
              <iframe
                title="Live Question Paper PDF Viewer"
                src={pdfUrl}
                className="studio-pdf-frame"
              />
            </div>
          </section>
        )}

        {/* ── Right Pane: Full Question Bank & Inline Customization Editor ── */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <section className="studio-editor-panel">
            {isLoadingQuestions ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--s-text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>{studioLang === 'ta' ? 'வினாத்தாள் தரவுகள் ஏற்றப்படுகின்றன...' : 'Loading question bank data...'}</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: 'var(--s-bg-surface)',
                  border: '1px dashed var(--s-border-default)',
                  borderRadius: 'var(--s-radius-lg)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
                <p style={{ color: 'var(--s-text-muted)', marginBottom: '1rem' }}>
                  {studioLang === 'ta' ? 'பொருத்தமான வினாக்கள் எதுவும் இல்லை.' : 'No questions match the current filter.'}
                </p>
                <button type="button" className="s-btn s-btn-secondary" onClick={() => setSearchQuery('')}>
                  {studioLang === 'ta' ? 'தேடலை அழிக்கவும்' : 'Clear Search'}
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = focusedQuestionSerial === q.serial;
                const optLetters = ['A', 'B', 'C', 'D'];
                return (
                  <article
                    key={q.serial}
                    ref={(el) => (questionCardsRef.current[q.serial] = el)}
                    className={'studio-q-card' + (q.qcApproved ? ' is-approved' : '') + (q.reportedIssue ? ' is-flagged' : '')}
                    style={{
                      outline: isSelected ? '2px solid var(--s-blue)' : 'none',
                    }}
                  >
                    {/* Question Card Header */}
                    <div className="studio-q-header">
                      <div className="studio-q-badge-wrap">
                        <span className="studio-q-num">Q {q.serial}</span>
                        <span className="studio-q-unit-pill">
                          {studioLang === 'ta' ? (q.unitTamil || q.unit) : q.unit} · {studioLang === 'ta' ? (q.syllabusTagTamil || q.syllabusTag) : q.syllabusTag}
                        </span>

                        {/* PDF Page Cross-Check Jump Button */}
                        <button
                          type="button"
                          className="studio-q-pdf-ref-btn"
                          onClick={() => jumpPdfToPage(q.pageNumber)}
                          title="Jump PDF Reader to this question page"
                        >
                          📄 {studioLang === 'ta' ? ('பக்கம் ' + q.pageNumber) : ('Page ' + q.pageNumber)}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {/* QC Approved Toggle */}
                        <button
                          type="button"
                          className={'s-btn ' + (q.qcApproved ? 's-btn-success' : 's-btn-secondary')}
                          onClick={() => toggleQcApproval(q.serial)}
                          title="Toggle QC Approval"
                        >
                          {q.qcApproved ? '✔ Verified' : '⏳ Approve'}
                        </button>

                        {/* Report Issue / Flag Note */}
                        <button
                          type="button"
                          className="s-btn s-btn-ghost"
                          style={{ color: q.reportedIssue ? 'var(--s-red)' : 'var(--s-text-muted)' }}
                          onClick={() => flagQuestionIssue(q.serial)}
                          title="Flag typo or doubt"
                        >
                          🚩 {q.reportedIssue ? 'Issue Flagged' : 'Report'}
                        </button>

                        {/* Delete Question */}
                        <button
                          type="button"
                          className="s-btn s-btn-ghost"
                          style={{ color: 'var(--s-red)' }}
                          onClick={() => deleteQuestion(q.serial)}
                          title="Delete this question"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    {/* Reported Issue Banner (if any) */}
                    {q.reportedIssue && (
                      <div
                        style={{
                          background: 'var(--s-red-soft)',
                          border: '1px solid rgba(242, 139, 130, 0.4)',
                          color: 'var(--s-red)',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--s-radius-sm)',
                          fontSize: '0.78rem',
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span>⚠️ <strong>Doubt / QC Note:</strong> {q.reportedIssue}</span>
                      </div>
                    )}

                    {/* Question Text Editor (Tamil) */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="studio-field-label">
                        {studioLang === 'ta' ? 'வினா உரை (தமிழ்)' : 'Question Text (Tamil)'}:
                      </label>
                      <textarea
                        className="studio-textarea"
                        value={q.questionTamil}
                        onChange={(e) => updateQuestionField(q.serial, 'questionTamil', e.target.value)}
                        placeholder="வினா உரையை உள்ளிடவும்..."
                        rows={2}
                      />
                    </div>

                    {/* Question Text Editor (English) */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="studio-field-label">
                        {studioLang === 'ta' ? 'வினா உரை (ஆங்கிலம்)' : 'Question Text (English)'}:
                      </label>
                      <textarea
                        className="studio-textarea"
                        value={q.question}
                        onChange={(e) => updateQuestionField(q.serial, 'question', e.target.value)}
                        placeholder="Enter English question text..."
                        rows={2}
                        style={{ fontFamily: 'var(--s-font-sans)', fontSize: '0.88rem' }}
                      />
                    </div>

                    {/* Options (A, B, C, D) Editor */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="studio-field-label">
                        {studioLang === 'ta' ? 'விடைகள் & சரியான விடைக்குறிப்பு (Options & Answer Key)' : 'Options & Correct Answer'}:
                      </label>
                      <div className="studio-options-grid">
                        {optLetters.map((letter, optIdx) => {
                          const isCorrect = q.answer === letter;
                          return (
                            <div key={letter} className={'studio-option-row' + (isCorrect ? ' is-correct' : '')}>
                              <input
                                type="radio"
                                name={'answer-' + q.serial}
                                checked={isCorrect}
                                onChange={() => updateQuestionField(q.serial, 'answer', letter)}
                                className="studio-opt-radio"
                                title={'Mark option ' + letter + ' as correct answer'}
                              />
                              <span className="studio-opt-letter">{letter}</span>

                              {/* Tamil Option Input */}
                              <input
                                type="text"
                                className="studio-opt-input"
                                value={q.optionsTamil[optIdx] || ''}
                                onChange={(e) => updateOptionText(q.serial, optIdx, e.target.value, true)}
                                placeholder={'விருப்பம் ' + letter + ' (தமிழ்)...'}
                              />

                              {/* English Option Input */}
                              <input
                                type="text"
                                className="studio-opt-input"
                                style={{ fontFamily: 'var(--s-font-sans)', opacity: 0.85, fontSize: '0.82rem' }}
                                value={q.options[optIdx] || ''}
                                onChange={(e) => updateOptionText(q.serial, optIdx, e.target.value, false)}
                                placeholder={'Option ' + letter + ' (English)...'}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Syllabus Tagging & Page Selector */}
                    <div className="studio-q-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--s-text-muted)' }}>
                          {studioLang === 'ta' ? 'பாடத்திட்டம்:' : 'Syllabus:'}
                        </span>
                        <select
                          className="studio-syllabus-select"
                          value={q.syllabusTag}
                          onChange={(e) => {
                            const found = SYLLABUS_CATALOG.find((s) => s.tagEn === e.target.value);
                            if (found) {
                              const updated = questions.map((item) =>
                                item.serial === q.serial
                                  ? {
                                      ...item,
                                      syllabusTag: found.tagEn,
                                      syllabusTagTamil: found.tagTa,
                                      unit: found.unitEn,
                                      unitTamil: found.unitTa,
                                    }
                                  : item
                              );
                              persistQuestions(updated);
                            }
                          }}
                        >
                          {SYLLABUS_CATALOG.map((cat) => (
                            <option key={cat.tagEn} value={cat.tagEn}>
                              {studioLang === 'ta' ? cat.tagTa : cat.tagEn} ({cat.unitEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--s-text-muted)' }}>
                          {studioLang === 'ta' ? 'PDF பக்கம்:' : 'PDF Page:'}
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={q.pageNumber}
                          onChange={(e) => updateQuestionField(q.serial, 'pageNumber', parseInt(e.target.value) || 1)}
                          style={{
                            width: '45px',
                            padding: '0.2rem 0.4rem',
                            background: 'var(--s-bg-input)',
                            border: '1px solid var(--s-border-subtle)',
                            color: 'var(--s-text-primary)',
                            borderRadius: 'var(--s-radius-sm)',
                            textAlign: 'center',
                            fontSize: '0.78rem',
                          }}
                        />
                      </div>
                    </div>

                    {/* Detailed Explanation / Solution Notes */}
                    <details style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
                      <summary style={{ fontSize: '0.75rem', color: 'var(--s-blue)', fontWeight: 600 }}>
                        💡 {studioLang === 'ta' ? 'விளக்கம் & விடைக்குறிப்பு குறிப்புகள்' : 'Explanation & Notes'}
                      </summary>
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <textarea
                          className="studio-textarea"
                          value={q.explanationTamil}
                          onChange={(e) => updateQuestionField(q.serial, 'explanationTamil', e.target.value)}
                          placeholder="தமிழ் விளக்கம்..."
                          rows={2}
                          style={{ fontSize: '0.82rem' }}
                        />
                        <textarea
                          className="studio-textarea"
                          value={q.explanation}
                          onChange={(e) => updateQuestionField(q.serial, 'explanation', e.target.value)}
                          placeholder="English explanation..."
                          rows={2}
                          style={{ fontSize: '0.82rem', fontFamily: 'var(--s-font-sans)' }}
                        />
                      </div>
                    </details>
                  </article>
                );
              })
            )}
          </section>
        )}
      </main>

      {/* ── Settings Modal (Change Passcode) ── */}
      {showSettingsModal && (
        <div className="studio-modal-backdrop" onClick={() => setShowSettingsModal(false)}>
          <div className="studio-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="studio-modal-title">⚙ Studio Passcode Settings</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>
              Change the security passcode protecting this Studio Command Center.
            </p>
            <div style={{ margin: '1rem 0' }}>
              <label className="studio-field-label">Current Passcode:</label>
              <div style={{ fontFamily: 'var(--s-font-mono)', color: 'var(--s-blue)', marginBottom: '1rem' }}>
                {currentPasscode}
              </div>
              <label className="studio-field-label">New Passcode:</label>
              <input
                type="text"
                className="studio-textarea"
                style={{ minHeight: 'auto', padding: '0.6rem 0.8rem' }}
                placeholder="Enter new password (min 6 chars)..."
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="s-btn s-btn-ghost" onClick={() => setShowSettingsModal(false)}>
                Cancel
              </button>
              <button type="button" className="s-btn s-btn-primary" onClick={handleUpdatePasscode}>
                Save Passcode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Notification Toast ── */}
      {toastMessage && (
        <div className="studio-toast">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

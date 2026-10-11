import React, { useState, useEffect } from 'react';

/* ────────────────── Types ────────────────── */
type PipelineStatus =
  | 'uploading'
  | 'splitting'
  | 'ocr'
  | 'tagging'
  | 'quiz_ready'
  | 'qc_in_progress'
  | 'qc_done'
  | 'published'
  | 'error';

interface PdfProject {
  id: string;
  pdfName: string;
  year: string;
  examName: string;
  examNameTamil?: string;
  status: PipelineStatus;
  pages: number;
  questionsExtracted: number;
  quizCount: number;
  uploadedAt: string;
  progress: number;
  syllabusTagged: number;
  publishedAt?: string;
}

interface ExtractedQuestion {
  id: string;
  projectId: string;
  serial: number;
  question: string;
  questionTamil: string;
  options: string[];
  optionsTamil: string[];
  answer: string;
  syllabusTag: string;
  syllabusTagTamil: string;
  unit: string;
  unitTamil: string;
  explanation?: string;
  explanationTamil?: string;
  reportFlag?: string;
  qcApproved?: boolean;
}

const STATUS_META: Record<PipelineStatus, { labelEn: string; labelTa: string; color: string; icon: string }> = {
  uploading:      { labelEn: 'Uploading',         labelTa: 'பதிவேற்றம்',           color: 'var(--g-blue)',        icon: '⬆' },
  splitting:      { labelEn: 'Splitting Pages',   labelTa: 'பக்கப் பிரிப்பு',       color: 'var(--g-blue)',        icon: '✂' },
  ocr:            { labelEn: 'OCR Scanning',      labelTa: 'OCR வாசிப்பு',          color: '#FDD663',              icon: '🔍' },
  tagging:        { labelEn: 'Tagging Syllabus',  labelTa: 'பாடத்திட்டக் குறியீடு', color: '#A78BFA',              icon: '🏷' },
  quiz_ready:     { labelEn: 'Quiz Ready (QC)',   labelTa: 'சரிபார்ப்புக்கு தயார்', color: 'var(--g-skip-text)',   icon: '✅' },
  qc_in_progress: { labelEn: 'QC In Progress',   labelTa: 'சரிபார்ப்பு நடப்பில்',   color: '#FB923C',              icon: '🔄' },
  qc_done:        { labelEn: 'QC Complete',       labelTa: 'சரிபார்ப்பு நிறைவு',    color: 'var(--g-correct-text)',icon: '✔' },
  published:      { labelEn: 'Published Live',    labelTa: 'நேரலையில் வெளியீடு',    color: 'var(--g-correct-text)',icon: '🌐' },
  error:          { labelEn: 'Error',             labelTa: 'பிழை',                 color: 'var(--g-error-text)',  icon: '⚠️' },
};

const PIPELINE_STEPS: PipelineStatus[] = ['uploading', 'splitting', 'ocr', 'tagging', 'quiz_ready'];

const DEMO_PROJECT: PdfProject = {
  id: 'proj-1',
  pdfName: 'TNPSC_Group4_2025_Master_200Q.pdf',
  year: '2025',
  examName: 'TNPSC Group 4 (General Tamil & General Studies - 200 Questions)',
  examNameTamil: 'டி.என்.பி.எஸ்.சி குரூப் 4 (பொதுத்தமிழ் & பொது அறிவு - 200 வினாக்கள்)',
  status: 'quiz_ready',
  pages: 36,
  questionsExtracted: 200,
  quizCount: 8,
  uploadedAt: '2026-10-11 10:00',
  progress: 100,
  syllabusTagged: 200,
};

// Generates fallback 200 questions if offline or JSON not yet fetched
function generateFallbackQuestions(count: number, projectId: string): ExtractedQuestion[] {
  const syllabusUnits = [
    { tagEn: 'General Tamil (Grammar)', tagTa: 'பொதுத்தமிழ் (இலக்கணம்)', unitEn: 'Part A', unitTa: 'பகுதி அ' },
    { tagEn: 'Tamil Literature', tagTa: 'தமிழ் இலக்கியம்', unitEn: 'Part B', unitTa: 'பகுதி ஆ' },
    { tagEn: 'Tamil Scholars & Service', tagTa: 'தமிழ் அறிஞர்களும் தொண்டும்', unitEn: 'Part C', unitTa: 'பகுதி இ' },
    { tagEn: 'General Science', tagTa: 'பொது அறிவியல்', unitEn: 'Unit 1', unitTa: 'அலகு 1' },
    { tagEn: 'Current Affairs', tagTa: 'நடப்பு நிகழ்வுகள்', unitEn: 'Unit 2', unitTa: 'அலகு 2' },
    { tagEn: 'Geography of India & TN', tagTa: 'இந்தியா & தமிழகப் புவியியல்', unitEn: 'Unit 3', unitTa: 'அலகு 3' },
    { tagEn: 'History and Culture of India', tagTa: 'இந்திய வரலாறு & பண்பாடு', unitEn: 'Unit 4', unitTa: 'அலகு 4' },
    { tagEn: 'Indian Polity', tagTa: 'இந்திய ஆட்சியியல்', unitEn: 'Unit 5', unitTa: 'அலகு 5' },
    { tagEn: 'Indian Economy', tagTa: 'இந்தியப் பொருளாதாரம்', unitEn: 'Unit 6', unitTa: 'அலகு 6' },
    { tagEn: 'Indian National Movement', tagTa: 'இந்திய தேசிய இயக்கம்', unitEn: 'Unit 7', unitTa: 'அலகு 7' },
    { tagEn: 'History & Culture of TN', tagTa: 'தமிழ்நாடு வரலாறு & மரபு', unitEn: 'Unit 8', unitTa: 'அலகு 8' },
    { tagEn: 'Development Administration in TN', tagTa: 'தமிழக வளர்ச்சி நிர்வாகம்', unitEn: 'Unit 9', unitTa: 'அலகு 9' },
    { tagEn: 'Aptitude & Mental Ability', tagTa: 'கணிதம் & திறனறி தேர்வு', unitEn: 'Unit 10', unitTa: 'அலகு 10' },
  ];

  const letters = ['A', 'B', 'C', 'D'];
  const res: ExtractedQuestion[] = [];

  for (let i = 1; i <= count; i++) {
    const s = syllabusUnits[(i - 1) % syllabusUnits.length];
    const ans = letters[(i * 3 + 1) % 4];

    res.push({
      id: `q-${i}`,
      projectId,
      serial: i,
      question: `TNPSC Exam Question #${i}: Select the correct factual statement or matched pair according to the syllabus syllabus.`,
      questionTamil: `டி.என்.பி.எஸ்.சி வினா எண் ${i}: பாடத்திட்டக் குறிப்புகளின்படி சரியான விடை அல்லது பொருத்தமான இணையைத் தேர்ந்தெடுக்கவும்.`,
      options: [
        `Option A: Statement relating to ${s.tagEn} principle (A)`,
        `Option B: Statement relating to ${s.tagEn} standard fact (B)`,
        `Option C: Statement relating to ${s.tagEn} verified answer (C)`,
        `Option D: Statement relating to ${s.tagEn} reference (D)`,
      ],
      optionsTamil: [
        `விருப்பம் A: ${s.tagTa} தொடர்பான கூற்று (A)`,
        `விருப்பம் B: ${s.tagTa} தொடர்பான விளக்கம் (B)`,
        `விருப்பம் C: ${s.tagTa} தொடர்பான சரியான விடைக்குறிப்பு (C)`,
        `விருப்பம் D: ${s.tagTa} தொடர்பான விதிமுறை (D)`,
      ],
      answer: ans,
      syllabusTag: s.tagEn,
      syllabusTagTamil: s.tagTa,
      unit: s.unitEn,
      unitTamil: s.unitTa,
      explanation: `Official syllabus verification for question #${i} under ${s.tagEn}.`,
      explanationTamil: `அதிகாரப்பூர்வ TNPSC விடைக்குறிப்பு மற்றும் பாடப்புத்தக விளக்கம்: வினா எண் ${i} (${s.tagTa}).`,
    });
  }
  return res;
}

/* ────────────────── Components ────────────────── */

function Badge({ status, lang }: { status: PipelineStatus; lang: 'en' | 'ta' }) {
  const m = STATUS_META[status];
  const label = lang === 'ta' ? m.labelTa : m.labelEn;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.65rem',
        borderRadius: 'var(--g-radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: `${m.color}18`,
        color: m.color,
        border: `1px solid ${m.color}40`,
      }}
    >
      {m.icon} {label}
    </span>
  );
}

function ProgressBar({ value, color = 'var(--g-blue)' }: { value: number; color?: string }) {
  return (
    <div style={{ height: '6px', background: 'var(--g-surface-elevated)', borderRadius: '99px', overflow: 'hidden', marginTop: '0.4rem' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '99px', transition: 'width 0.6s ease' }} />
    </div>
  );
}

function PipelineTracker({ status, lang }: { status: PipelineStatus; lang: 'en' | 'ta' }) {
  const active = PIPELINE_STEPS.indexOf(status);
  const done = status === 'qc_in_progress' || status === 'qc_done' || status === 'published';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '1rem 0', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {PIPELINE_STEPS.map((step, i) => {
        const isActive = active === i && !done;
        const isDone = done || i < active;
        const meta = STATUS_META[step];
        const label = lang === 'ta' ? meta.labelTa : meta.labelEn;
        return (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '95px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  background: isDone ? 'var(--g-correct-solid)' : isActive ? meta.color : 'var(--g-surface-elevated)',
                  border: `2px solid ${isDone ? 'var(--g-correct-solid)' : isActive ? meta.color : 'var(--g-border)'}`,
                  transition: 'all 0.3s',
                }}
              >
                {isDone ? '✔' : meta.icon}
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: lang === 'ta' ? 'var(--g-font-tamil)' : 'inherit',
                  color: isDone ? 'var(--g-correct-text)' : isActive ? meta.color : 'var(--g-text-muted)',
                  marginTop: '0.3rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: isDone && i < active - 1 ? 'var(--g-correct-solid)' : 'var(--g-border)',
                  minWidth: '20px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ────────────────── QC Quiz View (With 25-Question Sets) ────────────────── */
function QCQuizView({
  project,
  questions,
  onFinish,
  dashboardLang,
}: {
  project: PdfProject;
  questions: ExtractedQuestion[];
  onFinish: (updated: ExtractedQuestion[]) => void;
  dashboardLang: 'en' | 'ta';
}) {
  const [localQ, setLocalQ] = useState(questions.map((q) => ({ ...q })));
  const [activeSetIndex, setActiveSetIndex] = useState<number>(-1); // -1 = All, 0 = Set 1 (Q1-25), etc.
  const [idx, setIdx] = useState(0); // Index in localQ
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [flagModal, setFlagModal] = useState(false);
  const [flagText, setFlagText] = useState('');
  const [flagTag, setFlagTag] = useState('');
  const [langMode, setLangMode] = useState<'bilingual' | 'ta' | 'en'>('bilingual');
  const [jumpInput, setJumpInput] = useState('');

  const total = localQ.length;
  const current = localQ[idx] || localQ[0];

  // 25-Question Quiz Sets computation
  const SET_SIZE = 25;
  const totalSets = Math.max(1, Math.ceil(total / SET_SIZE));

  // Determine subset based on active set
  const filteredIndices: number[] = [];
  if (activeSetIndex === -1) {
    for (let i = 0; i < total; i++) filteredIndices.push(i);
  } else {
    const start = activeSetIndex * SET_SIZE;
    const end = Math.min(start + SET_SIZE, total);
    for (let i = start; i < end; i++) filteredIndices.push(i);
  }

  const handleSelectSet = (setIdx: number) => {
    setActiveSetIndex(setIdx);
    if (setIdx === -1) {
      setIdx(0);
    } else {
      setIdx(setIdx * SET_SIZE);
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= total) {
      setIdx(num - 1);
      const setOfNum = Math.floor((num - 1) / SET_SIZE);
      if (activeSetIndex !== -1 && activeSetIndex !== setOfNum) {
        setActiveSetIndex(setOfNum);
      }
      setJumpInput('');
    }
  };

  const handleReport = () => {
    const finalReport = [flagTag, flagText.trim()].filter(Boolean).join(' - ');
    if (!finalReport) return;
    const updated = [...localQ];
    updated[idx] = { ...updated[idx], reportFlag: finalReport, qcApproved: false };
    setLocalQ(updated);
    setFlagText('');
    setFlagTag('');
    setFlagModal(false);
  };

  const handleApprove = () => {
    const updated = [...localQ];
    updated[idx] = { ...updated[idx], qcApproved: true, reportFlag: undefined };
    setLocalQ(updated);

    // Advance to next question in active view
    const currentPosInFiltered = filteredIndices.indexOf(idx);
    if (currentPosInFiltered !== -1 && currentPosInFiltered < filteredIndices.length - 1) {
      setIdx(filteredIndices[currentPosInFiltered + 1]);
    } else if (idx < total - 1) {
      setIdx(idx + 1);
    }
  };

  const handleApproveEntireSet = () => {
    const updated = [...localQ];
    for (const i of filteredIndices) {
      if (updated[i].qcApproved === undefined) {
        updated[i] = { ...updated[i], qcApproved: true, reportFlag: undefined };
      }
    }
    setLocalQ(updated);
  };

  const approved = localQ.filter((q) => q.qcApproved === true).length;
  const flagged = localQ.filter((q) => q.qcApproved === false).length;
  const setApprovedCount = filteredIndices.filter((i) => localQ[i]?.qcApproved === true).length;

  const QUICK_FLAG_TAGS = [
    { en: 'Tamil OCR Typo', ta: 'தமிழ் எழுத்துப் பிழை' },
    { en: 'Wrong Answer Key', ta: 'தவறான விடைக்குறிப்பு' },
    { en: 'Ambiguous Options', ta: 'பொருந்தாத விருப்பங்கள்' },
    { en: 'Wrong Syllabus Unit', ta: 'தவறான பாடப்பிரிவு' },
    { en: 'Missing Translation', ta: 'மொழிபெயர்ப்பு விடுபட்டுள்ளது' },
  ];

  return (
    <div style={{ animation: 'g-fade-in 0.3s ease' }}>
      {/* QC Header & Language Mode Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="g-quiz-badge">
              {dashboardLang === 'ta' ? 'QC சரிபார்ப்பு முறைமை' : 'QC Mode Active'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)' }}>
              {total} {dashboardLang === 'ta' ? 'வினாக்கள்' : 'Questions'} · {totalSets} {dashboardLang === 'ta' ? 'தேர்வுத் தொகுப்புகள்' : 'Quiz Sets'}
            </span>
          </div>
          <h2 className="g-results-title" style={{ fontSize: '1.35rem', marginTop: '0.3rem', fontFamily: 'var(--g-font-display)' }}>
            {dashboardLang === 'ta'
              ? `தரக் கட்டுப்பாடு — ${project.examNameTamil || project.examName}`
              : `Quality Control — ${project.examName}`}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Language Switcher for Questions */}
          <div
            style={{
              display: 'flex',
              background: 'var(--g-surface-elevated)',
              padding: '2px',
              borderRadius: 'var(--g-radius-full)',
              border: '1px solid var(--g-border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => setLangMode('bilingual')}
              style={{
                background: langMode === 'bilingual' ? 'var(--g-blue)' : 'transparent',
                color: langMode === 'bilingual' ? '#041E49' : 'var(--g-text-secondary)',
                border: 'none',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              இருமொழி
            </button>
            <button
              type="button"
              onClick={() => setLangMode('ta')}
              style={{
                background: langMode === 'ta' ? 'var(--g-blue)' : 'transparent',
                color: langMode === 'ta' ? '#041E49' : 'var(--g-text-secondary)',
                border: 'none',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLangMode('en')}
              style={{
                background: langMode === 'en' ? 'var(--g-blue)' : 'transparent',
                color: langMode === 'en' ? '#041E49' : 'var(--g-text-secondary)',
                border: 'none',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              English
            </button>
          </div>

          <span
            style={{
              padding: '0.25rem 0.65rem',
              background: 'var(--g-correct-bg)',
              color: 'var(--g-correct-text)',
              borderRadius: 'var(--g-radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            ✔ {approved} / {total}
          </span>
          {flagged > 0 && (
            <span
              style={{
                padding: '0.25rem 0.65rem',
                background: 'var(--g-error-bg)',
                color: 'var(--g-error-text)',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              🚩 {flagged}
            </span>
          )}
        </div>
      </div>

      {/* 25-Question Quiz Sets Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => handleSelectSet(-1)}
          style={{
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--g-radius-full)',
            border: `1px solid ${activeSetIndex === -1 ? 'var(--g-blue)' : 'var(--g-border)'}`,
            background: activeSetIndex === -1 ? 'var(--g-blue-soft)' : 'var(--g-surface-elevated)',
            color: activeSetIndex === -1 ? 'var(--g-blue)' : 'var(--g-text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {dashboardLang === 'ta' ? `அனைத்தும் (${total} Qs)` : `All (${total} Qs)`}
        </button>

        {Array.from({ length: totalSets }).map((_, sIdx) => {
          const startQ = sIdx * SET_SIZE + 1;
          const endQ = Math.min((sIdx + 1) * SET_SIZE, total);
          const isCurrent = activeSetIndex === sIdx;
          return (
            <button
              key={sIdx}
              type="button"
              onClick={() => handleSelectSet(sIdx)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--g-radius-full)',
                border: `1px solid ${isCurrent ? 'var(--g-blue)' : 'var(--g-border)'}`,
                background: isCurrent ? 'var(--g-blue-soft)' : 'var(--g-surface-elevated)',
                color: isCurrent ? 'var(--g-blue)' : 'var(--g-text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {dashboardLang === 'ta' ? `தேர்வு ${sIdx + 1} (Q${startQ}-${endQ})` : `Quiz ${sIdx + 1} (Q${startQ}-${endQ})`}
            </button>
          );
        })}

        {/* Jump to question form */}
        <form onSubmit={handleJump} style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto' }}>
          <input
            type="number"
            min="1"
            max={total}
            placeholder={dashboardLang === 'ta' ? 'வினா #' : 'Q #'}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            style={{
              width: '65px',
              padding: '0.3rem 0.5rem',
              background: 'var(--g-surface-elevated)',
              border: '1px solid var(--g-border)',
              borderRadius: 'var(--g-radius-sm)',
              color: 'var(--g-text-primary)',
              fontSize: '0.78rem',
            }}
          />
          <button
            type="submit"
            className="g-btn g-btn-ghost"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          >
            Go
          </button>
        </form>
      </div>

      {/* Progress for Active View */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--g-text-muted)', marginBottom: '0.3rem' }}>
          <span>
            {dashboardLang === 'ta'
              ? activeSetIndex === -1
                ? `வினா ${idx + 1} / ${total}`
                : `தேர்வு ${activeSetIndex + 1}: வினா ${idx + 1} (இந்த தொகுப்பில் ${setApprovedCount} / ${filteredIndices.length} சரிபார்க்கப்பட்டது)`
              : activeSetIndex === -1
              ? `Question ${idx + 1} of ${total}`
              : `Quiz Set ${activeSetIndex + 1}: Question ${idx + 1} (${setApprovedCount} of ${filteredIndices.length} approved)`}
          </span>
          <span>{Math.round((approved / total) * 100)}% {dashboardLang === 'ta' ? 'மொத்த நிறைவு' : 'Total Reviewed'}</span>
        </div>
        <ProgressBar value={(approved / total) * 100} color="var(--g-correct-solid)" />
      </div>

      {/* Main Question Review Card */}
      {current && (
        <div
          className="g-question-card"
          style={{
            border: current.reportFlag
              ? '1.5px solid var(--g-error-border)'
              : current.qcApproved
              ? '1.5px solid var(--g-correct-border)'
              : '1px solid var(--g-border-subtle)',
          }}
        >
          {/* Syllabus Topic & Unit Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                background: 'rgba(167,139,250,0.12)',
                color: '#A78BFA',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'var(--g-font-tamil)',
              }}
            >
              🏷 {dashboardLang === 'ta' || langMode === 'ta' ? current.syllabusTagTamil || current.syllabusTag : current.syllabusTag}
            </span>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                background: 'var(--g-surface-elevated)',
                color: 'var(--g-text-muted)',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {dashboardLang === 'ta' || langMode === 'ta' ? current.unitTamil || current.unit : current.unit}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                padding: '0.2rem 0.65rem',
                background: 'var(--g-surface-elevated)',
                color: 'var(--g-text-secondary)',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              Q{current.serial} of {total}
            </span>
          </div>

          {/* Tamil Question */}
          {langMode !== 'en' && current.questionTamil && (
            <div
              className="g-question-tamil"
              lang="ta"
              style={{
                fontSize: '1.2rem',
                fontWeight: 500,
                color: 'var(--g-text-primary)',
                lineHeight: 1.7,
                marginBottom: langMode === 'bilingual' ? '0.75rem' : '1.25rem',
                paddingBottom: langMode === 'bilingual' ? '0.5rem' : '1rem',
                borderBottom: langMode === 'bilingual' ? '1px dashed var(--g-border-subtle)' : 'none',
              }}
            >
              {current.questionTamil}
            </div>
          )}

          {/* English Question */}
          {langMode !== 'ta' && (
            <p
              className="g-question-text"
              style={{
                fontSize: langMode === 'bilingual' ? '1rem' : '1.15rem',
                color: langMode === 'bilingual' ? 'var(--g-text-secondary)' : 'var(--g-text-primary)',
                marginBottom: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              {current.question}
            </p>
          )}

          {/* Options */}
          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {current.options.map((optEn, oi) => {
              const letter = String.fromCharCode(65 + oi);
              const optTa = current.optionsTamil?.[oi];
              const isCorrect = letter === current.answer;
              const isSelected = picked[current.id] === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setPicked((p) => ({ ...p, [current.id]: letter }))}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.95rem 1.15rem',
                    borderRadius: 'var(--g-radius-md)',
                    border: `1.5px solid ${
                      isSelected && isCorrect
                        ? 'var(--g-correct-border)'
                        : isSelected
                        ? 'var(--g-error-border)'
                        : isCorrect
                        ? 'rgba(129, 201, 149, 0.4)'
                        : 'var(--g-border-subtle)'
                    }`,
                    background:
                      isSelected && isCorrect
                        ? 'var(--g-correct-bg)'
                        : isSelected
                        ? 'var(--g-error-bg)'
                        : 'var(--g-surface-elevated)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      background: isCorrect ? 'var(--g-correct-solid)' : 'var(--g-surface-overlay)',
                      color: isCorrect ? '#fff' : 'var(--g-text-secondary)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {letter}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
                    {langMode !== 'en' && optTa && (
                      <span
                        lang="ta"
                        style={{
                          fontFamily: 'var(--g-font-tamil)',
                          fontSize: '1rem',
                          color: 'var(--g-text-primary)',
                          lineHeight: 1.5,
                        }}
                      >
                        {optTa}
                      </span>
                    )}
                    {langMode !== 'ta' && (
                      <span
                        style={{
                          fontSize: langMode === 'bilingual' ? '0.88rem' : '0.98rem',
                          color: langMode === 'bilingual' ? 'var(--g-text-secondary)' : 'var(--g-text-primary)',
                          lineHeight: 1.45,
                        }}
                      >
                        {optEn}
                      </span>
                    )}
                  </div>

                  {isCorrect && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--g-correct-text)',
                        background: 'rgba(168, 218, 181, 0.15)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--g-radius-full)',
                        alignSelf: 'center',
                      }}
                    >
                      Key: {letter}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {(current.explanationTamil || current.explanation) && (
            <div
              style={{
                padding: '0.85rem 1.15rem',
                background: 'rgba(138, 180, 248, 0.06)',
                border: '1px solid rgba(138, 180, 248, 0.18)',
                borderRadius: 'var(--g-radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--g-blue)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                💡 {dashboardLang === 'ta' ? 'விளக்கம் (Explanation)' : 'Verified Explanation'}
              </div>
              {current.explanationTamil && (
                <div lang="ta" style={{ fontFamily: 'var(--g-font-tamil)', color: 'var(--g-text-primary)', lineHeight: 1.6, marginBottom: '0.3rem' }}>
                  {current.explanationTamil}
                </div>
              )}
              {current.explanation && current.explanation !== current.explanationTamil && (
                <div style={{ color: 'var(--g-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {current.explanation}
                </div>
              )}
            </div>
          )}

          {/* Reported Notice */}
          {current.reportFlag && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--g-error-bg)',
                border: '1px solid var(--g-error-border)',
                borderRadius: 'var(--g-radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                color: 'var(--g-error-text)',
              }}
            >
              <strong>🚩 {dashboardLang === 'ta' ? 'சுட்டிக்காட்டப்பட்ட பிழை:' : 'Flagged:'}</strong> {current.reportFlag}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ flex: 1, minWidth: '130px' }}
              onClick={handleApprove}
            >
              ✔ {dashboardLang === 'ta' ? 'ஒப்புதல் அளித்து அடுத்து செல்' : 'Approve & Next'}
            </button>
            <button
              type="button"
              className="g-btn g-btn-ghost"
              style={{ color: 'var(--g-error-text)', borderColor: 'var(--g-error-border)', flex: 1, minWidth: '130px' }}
              onClick={() => setFlagModal(true)}
            >
              🚩 {dashboardLang === 'ta' ? 'பிழையைப் புகாரளி' : 'Report Issue'}
            </button>
            {activeSetIndex !== -1 && (
              <button
                type="button"
                className="g-btn g-btn-secondary"
                style={{ fontSize: '0.85rem' }}
                onClick={handleApproveEntireSet}
              >
                ✔ {dashboardLang === 'ta' ? `தேர்வு ${activeSetIndex + 1} முழுவதையும் ஒப்புதல் செய்` : `Approve Entire Quiz Set ${activeSetIndex + 1}`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Pills Navigator */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
        {filteredIndices.map((i) => {
          const q = localQ[i];
          if (!q) return null;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIdx(i)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `2px solid ${
                  q.qcApproved === true
                    ? 'var(--g-correct-border)'
                    : q.qcApproved === false
                    ? 'var(--g-error-border)'
                    : i === idx
                    ? 'var(--g-blue)'
                    : 'var(--g-border)'
                }`,
                background:
                  q.qcApproved === true
                    ? 'var(--g-correct-bg)'
                    : q.qcApproved === false
                    ? 'var(--g-error-bg)'
                    : i === idx
                    ? 'var(--g-blue-soft)'
                    : 'transparent',
                color:
                  q.qcApproved === true
                    ? 'var(--g-correct-text)'
                    : q.qcApproved === false
                    ? 'var(--g-error-text)'
                    : 'var(--g-text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {q.serial}
            </button>
          );
        })}
      </div>

      {/* QC Completion Summary Bar */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem 1.25rem',
          background: 'var(--g-surface)',
          border: '1px solid var(--g-border-subtle)',
          borderRadius: 'var(--g-radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: 'var(--g-text-primary)' }}>
            {dashboardLang === 'ta' ? 'QC சரிபார்ப்பு நிலை' : 'QC Completion Status'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', marginTop: '0.2rem' }}>
            {approved} {dashboardLang === 'ta' ? 'ஒப்புதல்' : 'approved'} · {flagged} {dashboardLang === 'ta' ? 'பிழைகள்' : 'flagged'} · {total - approved - flagged} {dashboardLang === 'ta' ? 'நிலுவை' : 'pending'}
          </div>
        </div>

        <button
          type="button"
          className="g-btn g-btn-primary"
          onClick={() => onFinish(localQ)}
        >
          🌐 {dashboardLang === 'ta' ? 'QC முடித்து பொதுவெளியில் வெளியிடு →' : 'Finish QC & Publish to Public →'}
        </button>
      </div>

      {/* Report Modal */}
      {flagModal && current && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--g-surface)',
              border: '1px solid var(--g-border)',
              borderRadius: 'var(--g-radius-lg)',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              animation: 'g-fade-in 0.2s ease',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontFamily: 'var(--g-font-display)' }}>
              🚩 {dashboardLang === 'ta' ? `பிழையைப் புகாரளி — வினா ${current.serial}` : `Report Issue — Q${current.serial}`}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', marginBottom: '1rem' }}>
              {dashboardLang === 'ta'
                ? 'தமிழ் தட்டச்சுப் பிழை, தவறான விடை, அல்லது பொருந்தாத விருப்பங்களை தேர்வு செய்து குறிப்பு எழுதவும்.'
                : 'Select an issue tag or describe OCR mistakes, answer key errors, etc.'}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {QUICK_FLAG_TAGS.map((tag) => {
                const label = dashboardLang === 'ta' ? tag.ta : tag.en;
                const isSelected = flagTag === label;
                return (
                  <button
                    key={tag.en}
                    type="button"
                    onClick={() => setFlagTag(label)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--g-radius-full)',
                      border: `1px solid ${isSelected ? 'var(--g-error-border)' : 'var(--g-border)'}`,
                      background: isSelected ? 'var(--g-error-bg)' : 'var(--g-surface-elevated)',
                      color: isSelected ? 'var(--g-error-text)' : 'var(--g-text-secondary)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--g-font-tamil)',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <textarea
              className="g-input"
              rows={4}
              placeholder={
                dashboardLang === 'ta'
                  ? 'எ.கா: விடைக்குறிப்பு தவறு — சரியான விடை C அல்ல, B ஆகும்...'
                  : 'e.g. Answer key incorrect — correct option is B not C...'
              }
              value={flagText}
              onChange={(e) => setFlagText(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="g-btn g-btn-primary"
                style={{ flex: 1, background: 'var(--g-error-solid)', borderColor: 'var(--g-error-solid)' }}
                onClick={handleReport}
              >
                🚩 {dashboardLang === 'ta' ? 'பதிவு செய்' : 'Submit Flag'}
              </button>
              <button
                type="button"
                className="g-btn g-btn-ghost"
                onClick={() => {
                  setFlagModal(false);
                  setFlagText('');
                  setFlagTag('');
                }}
              >
                {dashboardLang === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────── Upload Modal (With 200 Questions Support) ────────────────── */
function UploadModal({
  onClose,
  onUpload,
  lang,
}: {
  onClose: () => void;
  onUpload: (p: PdfProject, questions: ExtractedQuestion[]) => void;
  lang: 'en' | 'ta';
}) {
  const [pdfName, setPdfName] = useState('');
  const [year, setYear] = useState('2025');
  const [examName, setExamName] = useState('TNPSC Group 4 (General Tamil & General Studies)');
  const [examNameTamil, setExamNameTamil] = useState('TNPSC குரூப் 4 (பொதுத்தமிழ் & பொது அறிவு)');
  const [questionCount, setQuestionCount] = useState<number>(200); // Standard TNPSC full paper = 200 questions
  const [simulating, setSimulating] = useState(false);
  const [step, setStep] = useState(0);
  const [jsonQuestions, setJsonQuestions] = useState<ExtractedQuestion[] | null>(null);

  const EXAM_OPTIONS = [
    { en: 'TNPSC Group 4 (General Tamil & General Studies)', ta: 'TNPSC குரூப் 4 (பொதுத்தமிழ் & பொது அறிவு)', defaultCount: 200 },
    { en: 'TNPSC Group 2 / 2A (Combined Civil Services II)', ta: 'TNPSC குரூப் 2 / 2A (ஒருங்கிணைந்த குடிமைப் பணிகள் II)', defaultCount: 200 },
    { en: 'TNPSC Group 1 (Combined Civil Services I)', ta: 'TNPSC குரூப் 1 (முதன்மை குடிமைப் பணிகள்)', defaultCount: 200 },
    { en: 'TNPSC VAO (Village Administrative Officer)', ta: 'TNPSC VAO (கிராம நிர்வாக அலுவலர்)', defaultCount: 200 },
    { en: 'TNPSC Combined Technical Services Exam', ta: 'TNPSC ஒருங்கிணைந்த தொழில்நுட்பப் பணிகள் தேர்வு', defaultCount: 100 },
    { en: 'UPSC Civil Services Preliminary', ta: 'UPSC குடிமைப் பணிகள் முதல்நிலைத் தேர்வு', defaultCount: 100 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfName(file.name);

    // If a JSON question bank is uploaded directly
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (parsed && Array.isArray(parsed.questions)) {
            const mapped = parsed.questions.map((q: any, qi: number) => {
              const letter = typeof q.answer === 'number' ? ['A', 'B', 'C', 'D'][q.answer] || 'A' : q.answer || 'A';
              const unit = q.id <= 100 ? (q.id <= 25 ? 'Part A' : q.id <= 50 ? 'Part B' : q.id <= 75 ? 'Part C' : 'Part D') : 'Unit ' + ((q.id % 10) + 1);
              const unitTa = q.id <= 100 ? (q.id <= 25 ? 'பகுதி அ' : q.id <= 50 ? 'பகுதி ஆ' : q.id <= 75 ? 'பகுதி இ' : 'பகுதி ஈ') : 'அலகு ' + ((q.id % 10) + 1);
              return {
                id: `q-${q.id || qi + 1}`,
                projectId: '',
                serial: q.id || qi + 1,
                question: q.question,
                questionTamil: q.question,
                options: q.options || [],
                optionsTamil: q.options || [],
                answer: letter,
                syllabusTag: q.topic || 'General Studies',
                syllabusTagTamil: q.topic === 'Tamil' ? 'பொதுத்தமிழ்' : 'பொது அறிவு',
                unit,
                unitTamil: unitTa,
                explanation: q.explanation || '',
                explanationTamil: q.explanation || '',
              };
            });
            setJsonQuestions(mapped);
            setQuestionCount(mapped.length);
          }
        } catch (err) {
          console.error('Failed to parse uploaded JSON', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setExamName(val);
    const found = EXAM_OPTIONS.find((o) => o.en === val);
    if (found) {
      setExamNameTamil(found.ta);
      setQuestionCount(found.defaultCount);
    }
  };

  const handleSimulate = async () => {
    if (!pdfName || !examName) return;
    setSimulating(true);

    for (let s = 0; s <= 4; s++) {
      await new Promise((r) => setTimeout(r, 600));
      setStep(s + 1);
    }

    const projId = `proj-${Date.now()}`;
    const count = questionCount || 200;
    const quizSets = Math.max(1, Math.ceil(count / 25));

    // Try to fetch real 200 questions from local PYQ bank if count is 200
    let finalQuestions: ExtractedQuestion[] = [];
    if (jsonQuestions && jsonQuestions.length > 0) {
      finalQuestions = jsonQuestions.map((q) => ({ ...q, projectId: projId }));
    } else {
      try {
        const resp = await fetch('/data/pyq/tnpsc-2025-GRP4.json');
        if (resp.ok) {
          const pyqData = await resp.json();
          if (pyqData && Array.isArray(pyqData.questions)) {
            finalQuestions = pyqData.questions.slice(0, count).map((q: any) => {
              const letter = typeof q.answer === 'number' ? ['A', 'B', 'C', 'D'][q.answer] || 'A' : q.answer || 'A';
              const unit = q.id <= 100 ? (q.id <= 25 ? 'Part A' : q.id <= 50 ? 'Part B' : q.id <= 75 ? 'Part C' : 'Part D') : 'Unit ' + ((q.id % 10) + 1);
              const unitTa = q.id <= 100 ? (q.id <= 25 ? 'பகுதி அ' : q.id <= 50 ? 'பகுதி ஆ' : q.id <= 75 ? 'பகுதி இ' : 'பகுதி ஈ') : 'அலகு ' + ((q.id % 10) + 1);
              return {
                id: `q-${q.id}`,
                projectId: projId,
                serial: q.id,
                question: q.question,
                questionTamil: q.question,
                options: q.options || [],
                optionsTamil: q.options || [],
                answer: letter,
                syllabusTag: q.topic || 'General Studies',
                syllabusTagTamil: q.topic === 'Tamil' ? 'பொதுத்தமிழ்' : 'பொது அறிவு',
                unit,
                unitTamil: unitTa,
                explanation: q.explanation || '',
                explanationTamil: q.explanation || '',
              };
            });
          }
        }
      } catch (err) {
        console.warn('Fallback to generated questions', err);
      }

      if (finalQuestions.length === 0) {
        finalQuestions = generateFallbackQuestions(count, projId);
      }
    }

    const proj: PdfProject = {
      id: projId,
      pdfName,
      year,
      examName,
      examNameTamil: examNameTamil || examName,
      status: 'quiz_ready',
      pages: Math.max(12, Math.round(count * 0.18)),
      questionsExtracted: finalQuestions.length,
      quizCount: quizSets,
      uploadedAt: new Date().toLocaleString('en-IN', { hour12: false }).slice(0, 16),
      progress: 100,
      syllabusTagged: finalQuestions.length,
    };

    onUpload(proj, finalQuestions);
  };

  const STEP_LABELS = [
    { en: 'Uploading PDF to Cloud Storage', ta: 'PDF கோப்பு மேகக்கணியில் பதிவேற்றம்' },
    { en: `Splitting ${Math.round(questionCount * 0.18)} Pages Automatically`, ta: `${Math.round(questionCount * 0.18)} பக்கங்கள் தானாகப் பிரிக்கப்படுகிறது` },
    { en: `OCR Scanning & Extracting All ${questionCount} Questions`, ta: `முழு ${questionCount} வினாக்களும் OCR மூலம் பிரித்தெடுக்கப்படுகிறது` },
    { en: 'Tagging TNPSC Syllabus Units (Unit 1 to 10)', ta: 'TNPSC பாடத்திட்ட அலகுகளுடன் குறியிடல் (அலகு 1-10)' },
    { en: `Generating ${Math.ceil(questionCount / 25)} Quizzes (25 Questions each)`, ta: `${Math.ceil(questionCount / 25)} தேர்வுகள் ஆக்கம் (ஒவ்வொன்றும் 25 வினாக்கள்)` },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--g-surface)',
          border: '1px solid var(--g-border)',
          borderRadius: 'var(--g-radius-lg)',
          padding: '2rem',
          maxWidth: '540px',
          width: '100%',
          animation: 'g-fade-in 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--g-font-display)' }}>
            📤 {lang === 'ta' ? 'PDF வினாத்தாள் பதிவேற்றம் & பிரிப்பு' : 'Upload PDF & Auto-Extract 200 Questions'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--g-text-muted)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {!simulating ? (
          <>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                {lang === 'ta' ? 'PDF அல்லது JSON வினாத்தாள் கோப்பு (.pdf, .json)' : 'Select PDF or JSON Question File (.pdf, .json)'}
              </span>
              <input
                type="file"
                accept=".pdf,.json"
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.7rem',
                  background: 'var(--g-surface-elevated)',
                  border: '1px solid var(--g-border)',
                  borderRadius: 'var(--g-radius-sm)',
                  color: 'var(--g-text-primary)',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  {lang === 'ta' ? 'தேர்வு ஆண்டு (Year)' : 'Exam Year'}
                </span>
                <input
                  className="g-input"
                  type="number"
                  min="2000"
                  max="2030"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{ margin: 0 }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  {lang === 'ta' ? 'வினாக்கள் எண்ணிக்கை (Total Qs)' : 'Total Questions in Paper'}
                </span>
                <select
                  className="g-input"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                  style={{ margin: 0 }}
                >
                  <option value={200}>200 வினாக்கள் (8 Quizzes of 25 Qs)</option>
                  <option value={100}>100 வினாக்கள் (4 Quizzes of 25 Qs)</option>
                  <option value={75}>75 வினாக்கள் (3 Quizzes of 25 Qs)</option>
                  <option value={25}>25 வினாக்கள் (1 Quiz of 25 Qs)</option>
                </select>
              </label>
            </div>

            <label style={{ display: 'block', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                {lang === 'ta' ? 'தேர்வுப் பெயர் (Exam Name)' : 'Exam Name'}
              </span>
              <select className="g-input" value={examName} onChange={handleExamChange} style={{ margin: 0 }}>
                {EXAM_OPTIONS.map((o) => (
                  <option key={o.en} value={o.en}>
                    {lang === 'ta' ? o.ta : o.en}
                  </option>
                ))}
              </select>
            </label>

            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(138, 180, 248, 0.08)',
                borderRadius: 'var(--g-radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
                color: 'var(--g-blue)',
                lineHeight: 1.5,
              }}
            >
              ℹ {lang === 'ta'
                ? `பிரித்தெடுக்கப்படும் ${questionCount} வினாக்களும் தானாக தலா 25 வினாக்கள் கொண்ட ${Math.ceil(questionCount / 25)} தனித்தனி வினாடிவினாக்களாகப் பிரிக்கப்பட்டு சரிபார்ப்புக்கு வைக்கப்படும்.`
                : `All ${questionCount} extracted questions will be auto-partitioned into ${Math.ceil(questionCount / 25)} quizzes of 25 questions each for QC review.`}
            </div>

            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ width: '100%' }}
              disabled={!pdfName || !examName}
              onClick={handleSimulate}
            >
              🚀 {lang === 'ta' ? `${questionCount} வினாக்களையும் பிரித்து செயல்முறையைத் தொடங்கு` : `Extract All ${questionCount} Questions & Start Pipeline`}
            </button>
          </>
        ) : (
          <div>
            <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {lang === 'ta' ? 'செயலாக்கம் நடப்பில்: ' : 'Processing: '}
              <strong style={{ color: 'var(--g-text-primary)' }}>{pdfName}</strong>…
            </p>
            {STEP_LABELS.map((item, i) => {
              const label = lang === 'ta' ? item.ta : item.en;
              const done = step > i;
              const active = step === i;
              return (
                <div
                  key={item.en}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid var(--g-border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      background: done ? 'var(--g-correct-solid)' : active ? 'var(--g-blue-soft)' : 'var(--g-surface-elevated)',
                      border: `2px solid ${done ? 'var(--g-correct-solid)' : active ? 'var(--g-blue)' : 'var(--g-border)'}`,
                      transition: 'all 0.3s',
                    }}
                  >
                    {done ? '✔' : active ? '●' : '○'}
                  </div>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontFamily: lang === 'ta' ? 'var(--g-font-tamil)' : 'inherit',
                      color: done ? 'var(--g-correct-text)' : active ? 'var(--g-blue)' : 'var(--g-text-muted)',
                    }}
                  >
                    {label}
                    {active && <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.78rem' }}>…</span>}
                    {done && <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.78rem' }}>✔</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────── Project Row ────────────────── */
function ProjectRow({
  project,
  onStartQC,
  onPublish,
  onDelete,
  lang,
}: {
  project: PdfProject;
  onStartQC: () => void;
  onPublish: () => void;
  onDelete: () => void;
  lang: 'en' | 'ta';
}) {
  const [expanded, setExpanded] = useState(false);
  const examTitle = lang === 'ta' && project.examNameTamil ? project.examNameTamil : project.examName;

  return (
    <div
      style={{
        background: 'var(--g-surface)',
        border: '1px solid var(--g-border-subtle)',
        borderRadius: 'var(--g-radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '1rem 1.25rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--g-radius-sm)',
            background: 'rgba(138,180,248,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0,
          }}
        >
          📄
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--g-text-primary)' }}>
            {project.pdfName}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)', marginTop: '0.2rem', fontFamily: 'var(--g-font-tamil)' }}>
            {examTitle} · {project.year}
          </div>
        </div>

        <Badge status={project.status} lang={lang} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--g-text-muted)', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--g-text-primary)' }}>
            {project.questionsExtracted} {lang === 'ta' ? 'வினா' : 'Q'}
          </span>
          <span style={{ color: 'var(--g-border)' }}>|</span>
          <span style={{ color: 'var(--g-blue)' }}>
            {project.quizCount} {lang === 'ta' ? 'தேர்வுகள் (25-Q)' : 'Quizzes (25-Q)'}
          </span>
          <span style={{ color: 'var(--g-border)' }}>|</span>
          <span>{project.pages} {lang === 'ta' ? 'பக்கம்' : 'pg'}</span>
        </div>

        <span
          style={{
            color: 'var(--g-text-muted)',
            fontSize: '1.1rem',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            display: 'inline-block',
          }}
        >
          ⌄
        </span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--g-border-subtle)', padding: '1.25rem', animation: 'g-fade-in 0.2s ease' }}>
          <PipelineTracker status={project.status} lang={lang} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.65rem',
              marginBottom: '1.25rem',
            }}
          >
            {[
              { labelEn: 'Pages Split', labelTa: 'பிரித்த பக்கங்கள்', val: project.pages },
              { labelEn: 'Questions Extracted', labelTa: 'பிரித்தெடுத்த வினாக்கள்', val: project.questionsExtracted },
              { labelEn: 'Syllabus Tagged', labelTa: 'பாடத்திட்டக் குறியீடு', val: project.syllabusTagged },
              { labelEn: '25-Q Quiz Sets', labelTa: '25-Q தேர்வுத் தொகுப்புகள்', val: project.quizCount },
              { labelEn: 'Uploaded At', labelTa: 'பதிவேற்றிய நேரம்', val: project.uploadedAt },
            ].map((m) => (
              <div key={m.labelEn} style={{ background: 'var(--g-surface-elevated)', borderRadius: 'var(--g-radius-sm)', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--g-text-muted)', marginBottom: '0.2rem', fontFamily: lang === 'ta' ? 'var(--g-font-tamil)' : 'inherit' }}>
                  {lang === 'ta' ? m.labelTa : m.labelEn}
                </div>
                <div style={{ fontWeight: 700, fontSize: typeof m.val === 'number' ? '1.1rem' : '0.8rem', color: 'var(--g-text-primary)' }}>
                  {m.val}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {project.status === 'quiz_ready' && (
              <button type="button" className="g-btn g-btn-primary" onClick={onStartQC}>
                🔍 {lang === 'ta' ? `QC சரிபார்ப்பைத் தொடங்கு (${project.questionsExtracted} வினாக்கள்)` : `Start QC Review (${project.questionsExtracted} Qs)`}
              </button>
            )}
            {project.status === 'qc_in_progress' && (
              <button type="button" className="g-btn g-btn-primary" onClick={onStartQC}>
                🔄 {lang === 'ta' ? 'QC சரிபார்ப்பைத் தொடர்' : 'Continue QC'}
              </button>
            )}
            {project.status === 'qc_done' && (
              <button
                type="button"
                className="g-btn g-btn-primary"
                style={{ background: 'var(--g-correct-solid)', borderColor: 'var(--g-correct-solid)' }}
                onClick={onPublish}
              >
                🌐 {lang === 'ta' ? 'பொதுவெளியில் நேரலை வெளியிடு' : 'Publish to Public'}
              </button>
            )}
            {project.status === 'published' && (
              <>
                <a href="/quiz/gemini" className="g-btn g-btn-ghost" style={{ color: 'var(--g-correct-text)' }}>
                  ↗ {lang === 'ta' ? 'நேரலை வினாடிவினா காண்' : 'View Live Quiz'}
                </a>
                <button
                  type="button"
                  className="g-btn g-btn-ghost"
                  style={{ color: 'var(--g-error-text)' }}
                  onClick={onDelete}
                >
                  🗑 {lang === 'ta' ? 'PDF & படங்களை நீக்கு (Cleanup)' : 'Delete PDF & Images'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────── Main Dashboard ────────────────── */
export const ProjectDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPassword, setCurrentPassword] = useState('Thiru@1432');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');
  const [view, setView] = useState<'dashboard' | 'qc'>('dashboard');
  const [activeProject, setActiveProject] = useState<PdfProject | null>(null);
  const [qcQuestions, setQcQuestions] = useState<ExtractedQuestion[]>([]);
  const [projects, setProjects] = useState<PdfProject[]>([DEMO_PROJECT]);
  const [showUpload, setShowUpload] = useState(false);
  const [publishedToast, setPublishedToast] = useState(false);
  const [dashboardLang, setDashboardLang] = useState<'ta' | 'en'>('ta');

  useEffect(() => {
    try {
      const storedPass = localStorage.getItem('tnpsc_portal_pass') || 'Thiru@1432';
      setCurrentPassword(storedPass);
      const auth = sessionStorage.getItem('tnpsc_portal_auth') || localStorage.getItem('tnpsc_portal_auth');
      if (auth === 'true') setIsAuthenticated(true);
      const stored = localStorage.getItem('tnpsc_dashboard_projects');
      if (stored) {
        setProjects(JSON.parse(stored));
      }
      const storedLang = localStorage.getItem('tnpsc_dashboard_lang') as 'ta' | 'en';
      if (storedLang) setDashboardLang(storedLang);
    } catch {}
  }, []);

  const saveProjects = (p: PdfProject[]) => {
    setProjects(p);
    try {
      localStorage.setItem('tnpsc_dashboard_projects', JSON.stringify(p));
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang = dashboardLang === 'ta' ? 'en' : 'ta';
    setDashboardLang(nextLang);
    try {
      localStorage.setItem('tnpsc_dashboard_lang', nextLang);
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === currentPassword) {
      setIsAuthenticated(true);
      setErrorMsg('');
      try {
        sessionStorage.setItem('tnpsc_portal_auth', 'true');
        localStorage.setItem('tnpsc_portal_auth', 'true');
      } catch {}
    } else {
      setErrorMsg(dashboardLang === 'ta' ? 'கடவுச்சொல் தவறு. மீண்டும் முயற்சிக்கவும்.' : 'Incorrect password. Try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    try {
      sessionStorage.removeItem('tnpsc_portal_auth');
      localStorage.removeItem('tnpsc_portal_auth');
    } catch {}
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.trim().length < 4) {
      setStatusFeedback(dashboardLang === 'ta' ? 'குறைந்தது 4 எழுத்துக்கள் தேவை.' : 'Minimum 4 characters required.');
      return;
    }
    const updated = newPasswordInput.trim();
    setCurrentPassword(updated);
    try {
      localStorage.setItem('tnpsc_portal_pass', updated);
    } catch {}
    setStatusFeedback(dashboardLang === 'ta' ? 'கடவுச்சொல் மாற்றப்பட்டது ✔' : 'Password updated ✔');
    setNewPasswordInput('');
    setTimeout(() => {
      setStatusFeedback('');
      setShowPasswordChange(false);
    }, 2000);
  };

  const handleStartQC = async (proj: PdfProject) => {
    setActiveProject(proj);

    // 1. Try to load saved questions for this project from localStorage
    let loaded: ExtractedQuestion[] = [];
    try {
      const storedQStr = localStorage.getItem(`tnpsc_project_questions_${proj.id}`);
      if (storedQStr) {
        loaded = JSON.parse(storedQStr);
      }
    } catch {}

    // 2. If not stored, try fetching full 200 questions from public JSON
    if (loaded.length === 0) {
      try {
        const resp = await fetch('/data/pyq/tnpsc-2025-GRP4.json');
        if (resp.ok) {
          const pyqData = await resp.json();
          if (pyqData && Array.isArray(pyqData.questions)) {
            const count = proj.questionsExtracted || 200;
            loaded = pyqData.questions.slice(0, count).map((q: any) => {
              const letter = typeof q.answer === 'number' ? ['A', 'B', 'C', 'D'][q.answer] || 'A' : q.answer || 'A';
              const unit = q.id <= 100 ? (q.id <= 25 ? 'Part A' : q.id <= 50 ? 'Part B' : q.id <= 75 ? 'Part C' : 'Part D') : 'Unit ' + ((q.id % 10) + 1);
              const unitTa = q.id <= 100 ? (q.id <= 25 ? 'பகுதி அ' : q.id <= 50 ? 'பகுதி ஆ' : q.id <= 75 ? 'பகுதி இ' : 'பகுதி ஈ') : 'அலகு ' + ((q.id % 10) + 1);
              return {
                id: `q-${q.id}`,
                projectId: proj.id,
                serial: q.id,
                question: q.question,
                questionTamil: q.question,
                options: q.options || [],
                optionsTamil: q.options || [],
                answer: letter,
                syllabusTag: q.topic || 'General Studies',
                syllabusTagTamil: q.topic === 'Tamil' ? 'பொதுத்தமிழ்' : 'பொது அறிவு',
                unit,
                unitTamil: unitTa,
                explanation: q.explanation || '',
                explanationTamil: q.explanation || '',
              };
            });
            try {
              localStorage.setItem(`tnpsc_project_questions_${proj.id}`, JSON.stringify(loaded));
            } catch {}
          }
        }
      } catch (e) {
        console.warn('Failed to fetch pyq questions', e);
      }
    }

    // 3. Fallback to generated 200 questions
    if (loaded.length === 0) {
      loaded = generateFallbackQuestions(proj.questionsExtracted || 200, proj.id);
      try {
        localStorage.setItem(`tnpsc_project_questions_${proj.id}`, JSON.stringify(loaded));
      } catch {}
    }

    setQcQuestions(loaded);
    const updated = projects.map((p) => (p.id === proj.id ? { ...p, status: 'qc_in_progress' as PipelineStatus } : p));
    saveProjects(updated);
    setView('qc');
  };

  const handleQCFinish = (updatedQ: ExtractedQuestion[]) => {
    if (activeProject) {
      const updated = projects.map((p) => (p.id === activeProject.id ? { ...p, status: 'qc_done' as PipelineStatus } : p));
      saveProjects(updated);
      try {
        localStorage.setItem(`tnpsc_project_questions_${activeProject.id}`, JSON.stringify(updatedQ));
      } catch {}
    }
    setQcQuestions(updatedQ);
    setView('dashboard');
  };

  const handlePublish = (proj: PdfProject) => {
    const updated = projects.map((p) =>
      p.id === proj.id ? { ...p, status: 'published' as PipelineStatus, publishedAt: new Date().toISOString() } : p
    );
    saveProjects(updated);
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 3500);
  };

  const handleDelete = (proj: PdfProject) => {
    const msg =
      dashboardLang === 'ta'
        ? `"${proj.pdfName}" வினாத்தாளுக்கான PDF மற்றும் அனைத்து பக்கப் படங்களையும் நீக்கவா? இதை மீட்டெடுக்க முடியாது.`
        : `Delete PDF and all images for "${proj.pdfName}"? This cannot be undone.`;
    if (!confirm(msg)) return;
    saveProjects(projects.filter((p) => p.id !== proj.id));
    try {
      localStorage.removeItem(`tnpsc_project_questions_${proj.id}`);
    } catch {}
  };

  const handleNewUpload = (proj: PdfProject, questions: ExtractedQuestion[]) => {
    saveProjects([proj, ...projects]);
    try {
      localStorage.setItem(`tnpsc_project_questions_${proj.id}`, JSON.stringify(questions));
    } catch {}
    setShowUpload(false);
  };

  const totalQ = projects.reduce((s, p) => s + p.questionsExtracted, 0);
  const totalQuizzes = projects.reduce((s, p) => s + p.quizCount, 0);
  const published = projects.filter((p) => p.status === 'published').length;
  const qcReady = projects.filter((p) => p.status === 'quiz_ready' || p.status === 'qc_in_progress').length;

  /* ── 1. Login Screen ── */
  if (!isAuthenticated) {
    return (
      <div className="gemini-quiz-root" style={{ justifyContent: 'center' }}>
        <div className="g-gate-card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleLanguage}
              style={{
                background: 'var(--g-surface-elevated)',
                border: '1px solid var(--g-border-subtle)',
                color: 'var(--g-blue)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {dashboardLang === 'ta' ? 'English' : 'தமிழ்'}
            </button>
          </div>

          <div className="g-gate-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="g-results-title" style={{ fontSize: '1.75rem', marginBottom: '0.4rem', fontFamily: 'var(--g-font-display)' }}>
            {dashboardLang === 'ta' ? 'கட்டுப்பாட்டக உள்நுழைவு' : 'Pipeline Dashboard Login'}
          </h1>
          <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6, fontFamily: 'var(--g-font-tamil)' }}>
            {dashboardLang === 'ta'
              ? 'உங்கள் பிரத்யேக TNPSC வினாத்தாள் கட்டுப்பாட்டு மையம். PDF பதிவேற்றம், OCR வாசிப்பு, தமிழ் கேள்வி சரிபார்ப்பு மற்றும் நேரலை வெளியீடு.'
              : 'Your private PDF-to-Quiz pipeline control centre. Upload question papers, run OCR, QC bilingual questions, and publish live quizzes.'}
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="g-input"
              placeholder={dashboardLang === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Enter passcode'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              required
            />
            {errorMsg && (
              <p style={{ color: 'var(--g-error-text)', fontSize: '0.85rem', marginBottom: '1rem' }}>{errorMsg}</p>
            )}
            <button type="submit" className="g-btn g-btn-primary" style={{ width: '100%' }}>
              {dashboardLang === 'ta' ? 'கட்டுப்பாட்டகத்தைத் திறக்க →' : 'Unlock Dashboard →'}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              background: 'var(--g-surface-elevated)',
              borderRadius: 'var(--g-radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--g-text-muted)',
            }}
          >
            {dashboardLang === 'ta' ? 'இயல்புநிலை கடவுச்சொல்: ' : 'Default Passcode: '}
            <code style={{ color: 'var(--g-blue)', background: 'rgba(138,180,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              Thiru@1432
            </code>
          </div>
        </div>
      </div>
    );
  }

  /* ── 2. QC View ── */
  if (view === 'qc' && activeProject) {
    return (
      <div className="gemini-quiz-root">
        <div className="gemini-quiz-container">
          <button
            type="button"
            className="g-btn g-btn-ghost"
            style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}
            onClick={() => setView('dashboard')}
          >
            ← {dashboardLang === 'ta' ? 'கட்டுப்பாட்டகத்திற்குத் திரும்பு' : 'Back to Dashboard'}
          </button>
          <QCQuizView
            project={activeProject}
            questions={qcQuestions}
            onFinish={handleQCFinish}
            dashboardLang={dashboardLang}
          />
        </div>
      </div>
    );
  }

  /* ── 3. Main Dashboard Screen ── */
  return (
    <div className="gemini-quiz-root">
      <div className="gemini-quiz-container">
        {publishedToast && (
          <div
            style={{
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              zIndex: 999,
              background: 'var(--g-correct-solid)',
              color: '#fff',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--g-radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              animation: 'g-fade-in 0.25s ease',
            }}
          >
            🌐 {dashboardLang === 'ta' ? 'வினாடிவினா பொதுமக்களுக்கு வெளியிடப்பட்டது! ✔' : 'Quiz published to public live! ✔'}
          </div>
        )}

        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} onUpload={handleNewUpload} lang={dashboardLang} />
        )}

        {/* Top Navbar */}
        <header className="g-quiz-header">
          <div className="g-header-title-wrap">
            <span
              className="g-quiz-badge"
              style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.25)' }}
            >
              🛠 {dashboardLang === 'ta' ? 'நிர்வாகக் கட்டுப்பாட்டகம்' : 'Admin Pipeline Portal'}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--g-text-secondary)', fontFamily: 'var(--g-font-tamil)' }}>
              {dashboardLang === 'ta' ? '200 வினாக்கள் → 8 தேர்வுகள் (25-Q) → QC சரிபார்ப்பு → நேரலை' : '200 Questions → 8 Quizzes (25-Q) → QC Review → Live Publish'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggleLanguage}
              style={{
                background: 'var(--g-surface-elevated)',
                border: '1px solid var(--g-border-subtle)',
                color: 'var(--g-blue)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🌐 {dashboardLang === 'ta' ? 'English' : 'தமிழ்'}
            </button>

            <button
              type="button"
              className="g-btn g-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              onClick={() => setShowPasswordChange((s) => !s)}
            >
              ⚙ {dashboardLang === 'ta' ? 'பாதுகாப்பு' : 'Security'}
            </button>

            <button
              type="button"
              className="g-btn g-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--g-error-text)' }}
              onClick={handleLogout}
            >
              {dashboardLang === 'ta' ? 'வெளியேறு' : 'Sign Out'}
            </button>
          </div>
        </header>

        {/* Change Password Panel */}
        {showPasswordChange && (
          <div className="g-question-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.65rem' }}>
              {dashboardLang === 'ta' ? 'கடவுச்சொல்லை மாற்று' : 'Update Passcode'}
            </h3>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="password"
                className="g-input"
                style={{ maxWidth: '300px', margin: 0 }}
                placeholder={dashboardLang === 'ta' ? 'புதிய கடவுச்சொல்' : 'New passcode'}
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                required
              />
              <button type="submit" className="g-btn g-btn-primary" style={{ padding: '0.7rem 1.25rem' }}>
                {dashboardLang === 'ta' ? 'சேமி' : 'Save'}
              </button>
              {statusFeedback && (
                <span style={{ color: 'var(--g-correct-text)', fontSize: '0.85rem', alignSelf: 'center' }}>
                  {statusFeedback}
                </span>
              )}
            </form>
          </div>
        )}

        {/* Hero Control Stats */}
        <section className="g-report-card" style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h1 className="g-results-title" style={{ fontSize: '1.85rem', marginBottom: '0.3rem', fontFamily: 'var(--g-font-display)' }}>
                {dashboardLang === 'ta' ? 'தானியங்கி வினாத்தாள் கட்டுப்பாட்டகம்' : 'Automated Pipeline Control Centre'}
              </h1>
              <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, fontFamily: 'var(--g-font-tamil)' }}>
                {dashboardLang === 'ta'
                  ? 'PDF பதிவேற்றம் · 200 வினாக்கள் பிரித்தெடுத்தல் · தலா 25 வினாக்கள் கொண்ட 8 தேர்வுகள் ஆக்கம் · QC சரிபார்ப்பு · நேரலை வெளியீடு'
                  : 'PDF Upload · Full 200 Questions Extraction · Auto-Split into 8 Quizzes (25-Q each) · QC Review · Live Publish'}
              </p>
            </div>
            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.85rem 1.5rem' }}
              onClick={() => setShowUpload(true)}
            >
              + {dashboardLang === 'ta' ? '200 வினாத்தாள் PDF பதிவேற்று' : 'Upload 200-Q PDF'}
            </button>
          </div>

          <div className="g-score-metrics-grid">
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: 'var(--g-blue)' }}>{projects.length}</span>
              <span className="g-metric-label">{dashboardLang === 'ta' ? 'PDF திட்டங்கள்' : 'PDF Projects'}</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val correct">{totalQ}</span>
              <span className="g-metric-label">{dashboardLang === 'ta' ? 'பிரித்தெடுத்த வினாக்கள்' : 'Questions Extracted'}</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: '#A78BFA' }}>{totalQuizzes}</span>
              <span className="g-metric-label">{dashboardLang === 'ta' ? '25-Q தேர்வுத் தொகுப்புகள்' : '25-Q Quiz Sets'}</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: 'var(--g-correct-text)' }}>{published}</span>
              <span className="g-metric-label">{dashboardLang === 'ta' ? 'பொதுவெளியில் நேரலை' : 'Published Live'}</span>
            </div>
          </div>
        </section>

        {/* 8-Step Pipeline Visual Guide */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 className="g-section-heading" style={{ marginBottom: '0.85rem' }}>
            <span>⚡</span> {dashboardLang === 'ta' ? 'தானியங்கி செயல்முறை வரைபடம் (8 நிலைகள்)' : 'Automated 8-Step Pipeline'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {[
              { icon: '📤', stepEn: '1. Upload',   stepTa: '1. பதிவேற்றம்',  descEn: '200-Q PDF question paper', descTa: '200 வினாக்கள் PDF பதிவேற்றம்' },
              { icon: '✂',  stepEn: '2. Split',    stepTa: '2. பக்கப் பிரிப்பு', descEn: 'Page-by-page to cloud', descTa: 'மேகக்கணியில் பக்கப் பிரிப்பு' },
              { icon: '🔍', stepEn: '3. OCR',      stepTa: '3. OCR வாசிப்பு', descEn: 'Extract all 200 questions', descTa: 'முழு 200 வினாக்களும் எடுப்பு' },
              { icon: '🏷', stepEn: '4. Tag',      stepTa: '4. குறியீடு',    descEn: 'Tag to TNPSC Unit 1-10', descTa: 'அலகு 1-10 பாடத்திட்ட இணைவு' },
              { icon: '📋', stepEn: '5. Quiz Sets', stepTa: '5. தேர்வு ஆக்கம்',descEn: 'Split into 8x 25-Q sets', descTa: '8 தேர்வுகள் (தலா 25 வினாக்கள்)' },
              { icon: '✅', stepEn: '6. QC Review',stepTa: '6. சரிபார்ப்பு', descEn: 'QC by 25-Q set & flag', descTa: '25-Q தேர்வு வாரியாக சரிபார்த்தல்' },
              { icon: '🌐', stepEn: '7. Publish',  stepTa: '7. நேரலை',      descEn: 'Live to public students', descTa: 'மாணவர்களுக்கு நேரலை வெளியீடு' },
              { icon: '🗑', stepEn: '8. Cleanup',  stepTa: '8. கோப்பு நீக்கம்', descEn: 'Delete PDF & raw images', descTa: 'தற்காலிக மூலக் கோப்பு நீக்கம்' },
            ].map((s) => (
              <div
                key={s.stepEn}
                style={{
                  background: 'var(--g-surface)',
                  border: '1px solid var(--g-border-subtle)',
                  borderRadius: 'var(--g-radius-sm)',
                  padding: '0.85rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--g-text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--g-font-tamil)' }}>
                  {dashboardLang === 'ta' ? s.stepTa : s.stepEn}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--g-text-muted)', lineHeight: 1.4, fontFamily: 'var(--g-font-tamil)' }}>
                  {dashboardLang === 'ta' ? s.descTa : s.descEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PDF Projects List */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="g-section-heading" style={{ margin: 0 }}>
              <span>📁</span> {dashboardLang === 'ta' ? 'PDF வினாத்தாள் திட்டங்கள்' : 'PDF Question Paper Projects'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)' }}>
              {projects.length} {dashboardLang === 'ta' ? 'திட்டங்கள்' : 'total'}
            </span>
          </div>

          {projects.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'var(--g-surface)',
                border: '1px dashed var(--g-border)',
                borderRadius: 'var(--g-radius-md)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📁</div>
              <p style={{ color: 'var(--g-text-muted)', marginBottom: '1rem', fontFamily: 'var(--g-font-tamil)' }}>
                {dashboardLang === 'ta' ? 'திட்டங்கள் எதுவும் இல்லை. புதிய வினாத்தாளைப் பதிவேற்றவும்!' : 'No PDF projects yet. Upload your first exam paper!'}
              </p>
              <button type="button" className="g-btn g-btn-primary" onClick={() => setShowUpload(true)}>
                + {dashboardLang === 'ta' ? 'PDF பதிவேற்று' : 'Upload PDF'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {projects.map((proj) => (
                <ProjectRow
                  key={proj.id}
                  project={proj}
                  onStartQC={() => handleStartQC(proj)}
                  onPublish={() => handlePublish(proj)}
                  onDelete={() => handleDelete(proj)}
                  lang={dashboardLang}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="g-report-card" style={{ marginTop: '2rem' }}>
          <h2 className="g-section-heading">
            <span>🌐</span> {dashboardLang === 'ta' ? 'TNPSC வழிகாட்டல் மற்றும் வினா வங்கி' : 'Quick Study & PYQ Bank Links'}
          </h2>
          <div className="g-keep-learning-grid" style={{ marginTop: '1rem' }}>
            <a href="/quiz/gemini" className="g-learn-card">
              <span className="g-learn-icon">🧪</span>
              <span className="g-learn-title">{dashboardLang === 'ta' ? 'ஜெமினி மாதிரித் தேர்வு' : 'Gemini Quiz'}</span>
              <span className="g-learn-desc">{dashboardLang === 'ta' ? 'மாணவர்களுக்கான பொது தேர்வு தளம் & AI அறிக்கை.' : 'Public diagnostic exam with AI performance report.'}</span>
            </a>
            <a href="/pyq" className="g-learn-card">
              <span className="g-learn-icon">📝</span>
              <span className="g-learn-title">{dashboardLang === 'ta' ? 'முந்தைய ஆண்டு வினா வங்கி' : 'PYQ Bank'}</span>
              <span className="g-learn-desc">{dashboardLang === 'ta' ? 'அதிகாரப்பூர்வ TNPSC முந்தைய தேர்வு வினாக்கள்.' : 'Official past year questions with answer keys.'}</span>
            </a>
            <a href="/syllabus" className="g-learn-card">
              <span className="g-learn-icon">📋</span>
              <span className="g-learn-title">{dashboardLang === 'ta' ? 'பாடத்திட்ட அலகுகள்' : 'Syllabus Matrix'}</span>
              <span className="g-learn-desc">{dashboardLang === 'ta' ? 'குரூப் 1, 2, 4 அலகுகளின் முழுமையான வரைபடம்.' : 'Comprehensive unit mapping for TNPSC groups.'}</span>
            </a>
            <a href="/notes" className="g-learn-card">
              <span className="g-learn-icon">📚</span>
              <span className="g-learn-title">{dashboardLang === 'ta' ? 'பாடக் குறிப்புகள்' : 'Study Notes'}</span>
              <span className="g-learn-desc">{dashboardLang === 'ta' ? '600+ தமிழ் & சமச்சீர் கல்வி பாடக் குறிப்புகள்.' : '600+ structured lesson notes & summaries.'}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

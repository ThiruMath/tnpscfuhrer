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
  options: string[];
  answer: string;
  syllabusTag: string;
  unit: string;
  reportFlag?: string;
  qcApproved?: boolean;
}

const STATUS_META: Record<PipelineStatus, { label: string; color: string; icon: string }> = {
  uploading:      { label: 'Uploading',         color: 'var(--g-blue)',        icon: '⬆' },
  splitting:      { label: 'Splitting Pages',   color: 'var(--g-blue)',        icon: '✂' },
  ocr:            { label: 'OCR Scanning',      color: '#FDD663',              icon: '🔍' },
  tagging:        { label: 'Tagging Syllabus',  color: '#A78BFA',              icon: '🏷' },
  quiz_ready:     { label: 'Quiz Ready (QC)',   color: 'var(--g-skip-text)',   icon: '✅' },
  qc_in_progress: { label: 'QC In Progress',   color: '#FB923C',              icon: '🔄' },
  qc_done:        { label: 'QC Complete',       color: 'var(--g-correct-text)',icon: '✔' },
  published:      { label: 'Published Live',    color: 'var(--g-correct-text)',icon: '🌐' },
  error:          { label: 'Error',             color: 'var(--g-error-text)',  icon: '⚠️' },
};

const PIPELINE_STEPS: PipelineStatus[] = ['uploading','splitting','ocr','tagging','quiz_ready'];

const DEMO_QUESTIONS: ExtractedQuestion[] = [
  { id:'q1', projectId:'proj-1', serial:1, question:'The Preamble to the Indian Constitution declares India as a:', options:['Socialist Secular Democratic Republic','Sovereign Democratic Republic','Sovereign Socialist Secular Democratic Republic','Federal Secular Democratic Republic'], answer:'C', syllabusTag:'Indian Polity', unit:'Unit 3' },
  { id:'q2', projectId:'proj-1', serial:2, question:'Which article of the Indian Constitution abolishes untouchability?', options:['Article 14','Article 15','Article 17','Article 21'], answer:'C', syllabusTag:'Indian Polity', unit:'Unit 3' },
  { id:'q3', projectId:'proj-1', serial:3, question:'The Battle of Plassey was fought in the year:', options:['1757','1764','1526','1857'], answer:'A', syllabusTag:'Modern History', unit:'Unit 6' },
  { id:'q4', projectId:'proj-1', serial:4, question:'Which Five Year Plan introduced the concept of "Growth with Social Justice"?', options:['Third Plan','Fifth Plan','Sixth Plan','Ninth Plan'], answer:'C', syllabusTag:'Indian Economy', unit:'Unit 5' },
  { id:'q5', projectId:'proj-1', serial:5, question:'Photosynthesis primarily occurs in which part of the plant?', options:['Root','Stem','Chloroplast','Mitochondria'], answer:'C', syllabusTag:'General Science', unit:'Unit 4' },
  { id:'q6', projectId:'proj-1', serial:6, question:'Sangam Literature belongs to which language?', options:['Sanskrit','Pali','Tamil','Telugu'], answer:'C', syllabusTag:'Tamil Literature', unit:'Unit 8' },
  { id:'q7', projectId:'proj-1', serial:7, question:'The headquarters of ISRO is located in:', options:['Mumbai','New Delhi','Bengaluru','Chennai'], answer:'C', syllabusTag:'Current Affairs', unit:'Unit 9' },
  { id:'q8', projectId:'proj-1', serial:8, question:'Which river is known as the "Ganges of South India"?', options:['Krishna','Cauvery','Godavari','Tungabhadra'], answer:'B', syllabusTag:'Geography', unit:'Unit 2' },
  { id:'q9', projectId:'proj-1', serial:9, question:'The "Right to Education" is a Fundamental Right under Article:', options:['21','21A','22','45'], answer:'B', syllabusTag:'Indian Polity', unit:'Unit 3' },
  { id:'q10', projectId:'proj-1', serial:10, question:'Thirukkural was composed by:', options:['Ilango Adigal','Avvaiyar','Thiruvalluvar','Kambar'], answer:'C', syllabusTag:'Tamil Literature', unit:'Unit 8' },
];

const DEMO_PROJECT: PdfProject = {
  id: 'proj-1',
  pdfName: 'TNPSC_Group2_2024_Paper.pdf',
  year: '2024',
  examName: 'TNPSC Group 2 (Combined Civil Services)',
  status: 'quiz_ready',
  pages: 24,
  questionsExtracted: 10,
  quizCount: 1,
  uploadedAt: '2026-10-10 09:15',
  progress: 100,
  syllabusTagged: 10,
};

/* ────────────────── Helpers ────────────────── */
function Badge({ status }: { status: PipelineStatus }) {
  const m = STATUS_META[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.2rem 0.65rem', borderRadius: 'var(--g-radius-full)',
      fontSize: '0.75rem', fontWeight: 600,
      background: `${m.color}18`, color: m.color,
      border: `1px solid ${m.color}40`,
    }}>
      {m.icon} {m.label}
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

function PipelineTracker({ status }: { status: PipelineStatus }) {
  const active = PIPELINE_STEPS.indexOf(status);
  const done = status === 'qc_in_progress' || status === 'qc_done' || status === 'published';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '1rem 0', overflowX: 'auto' }}>
      {PIPELINE_STEPS.map((step, i) => {
        const isActive = active === i && !done;
        const isDone = done || i < active;
        const meta = STATUS_META[step];
        return (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem',
                background: isDone ? 'var(--g-correct-solid)' : isActive ? meta.color : 'var(--g-surface-elevated)',
                border: `2px solid ${isDone ? 'var(--g-correct-solid)' : isActive ? meta.color : 'var(--g-border)'}`,
                transition: 'all 0.3s',
              }}>
                {isDone ? 'âœ“' : meta.icon}
              </div>
              <span style={{ fontSize: '0.6rem', color: isDone ? 'var(--g-correct-text)' : isActive ? meta.color : 'var(--g-text-muted)', marginTop: '0.25rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {meta.label}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: isDone && i < active - 1 ? 'var(--g-correct-solid)' : 'var(--g-border)', minWidth: '16px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ────────────────── QC Quiz View ────────────────── */
function QCQuizView({ project, questions, onFinish }: {
  project: PdfProject;
  questions: ExtractedQuestion[];
  onFinish: (updated: ExtractedQuestion[]) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [flagModal, setFlagModal] = useState(false);
  const [flagText, setFlagText] = useState('');
  const [localQ, setLocalQ] = useState(questions.map(q => ({ ...q })));

  const current = localQ[idx];
  const total = localQ.length;

  const handleReport = () => {
    if (!flagText.trim()) return;
    const updated = [...localQ];
    updated[idx] = { ...updated[idx], reportFlag: flagText.trim(), qcApproved: false };
    setLocalQ(updated);
    setFlagText('');
    setFlagModal(false);
  };

  const handleApprove = () => {
    const updated = [...localQ];
    updated[idx] = { ...updated[idx], qcApproved: true, reportFlag: undefined };
    setLocalQ(updated);
    if (idx < total - 1) setIdx(idx + 1);
  };

  const done = localQ.every(q => q.qcApproved !== undefined);
  const approved = localQ.filter(q => q.qcApproved === true).length;
  const flagged = localQ.filter(q => q.qcApproved === false).length;

  return (
    <div style={{ animation: 'g-fade-in 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span className="g-quiz-badge">QC Mode Active</span>
          <h2 className="g-results-title" style={{ fontSize: '1.4rem', marginTop: '0.4rem' }}>
            Quality Control — {project.examName}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ padding: '0.25rem 0.65rem', background: 'var(--g-correct-bg)', color: 'var(--g-correct-text)', borderRadius: 'var(--g-radius-full)', fontSize: '0.8rem', fontWeight: 600 }}>
            ✔ {approved} Approved
          </span>
          <span style={{ padding: '0.25rem 0.65rem', background: 'var(--g-error-bg)', color: 'var(--g-error-text)', borderRadius: 'var(--g-radius-full)', fontSize: '0.8rem', fontWeight: 600 }}>
            🚩 {flagged} Flagged
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--g-text-muted)', marginBottom: '0.3rem' }}>
          <span>Question {idx + 1} of {total}</span>
          <span>{Math.round((localQ.filter(q => q.qcApproved !== undefined).length / total) * 100)}% Reviewed</span>
        </div>
        <ProgressBar value={(localQ.filter(q => q.qcApproved !== undefined).length / total) * 100} color="var(--g-correct-solid)" />
      </div>

      {!done ? (
        <div className="g-question-card" style={{
          border: current.reportFlag
            ? '1px solid var(--g-error-border)'
            : current.qcApproved
            ? '1px solid var(--g-correct-border)'
            : '1px solid var(--g-border-subtle)',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.15rem 0.55rem', background: 'rgba(167,139,250,0.12)', color: '#A78BFA', borderRadius: 'var(--g-radius-full)', fontSize: '0.72rem', fontWeight: 600 }}>
              ðŸ· {current.syllabusTag}
            </span>
            <span style={{ padding: '0.15rem 0.55rem', background: 'var(--g-surface-elevated)', color: 'var(--g-text-muted)', borderRadius: 'var(--g-radius-full)', fontSize: '0.72rem' }}>
              {current.unit}
            </span>
            <span style={{ marginLeft: 'auto', padding: '0.15rem 0.55rem', background: 'var(--g-surface-elevated)', color: 'var(--g-text-faint)', borderRadius: 'var(--g-radius-full)', fontSize: '0.72rem' }}>
              Q{current.serial}
            </span>
          </div>

          <p className="g-question-text" style={{ fontSize: '1.05rem', marginBottom: '1.25rem', lineHeight: '1.65' }}>
            {current.question}
          </p>

          <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1.5rem' }}>
            {current.options.map((opt, oi) => {
              const letter = String.fromCharCode(65 + oi);
              const isCorrect = letter === current.answer;
              const isSelected = picked[current.id] === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setPicked(p => ({ ...p, [current.id]: letter }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.9rem 1rem', borderRadius: 'var(--g-radius-sm)',
                    border: `1px solid ${isSelected && isCorrect ? 'var(--g-correct-border)' : isSelected ? 'var(--g-error-border)' : 'var(--g-border-subtle)'}`,
                    background: isSelected && isCorrect ? 'var(--g-correct-bg)' : isSelected ? 'var(--g-error-bg)' : 'var(--g-surface-elevated)',
                    color: isSelected && isCorrect ? 'var(--g-correct-text)' : isSelected ? 'var(--g-error-text)' : 'var(--g-text-primary)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: '0.9rem',
                  }}
                >
                  <span style={{
                    minWidth: '28px', height: '28px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.8rem',
                    background: isCorrect ? 'var(--g-correct-solid)' : 'var(--g-surface-overlay)',
                    color: isCorrect ? '#fff' : 'var(--g-text-secondary)',
                  }}>
                    {letter}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {current.reportFlag && (
            <div style={{ padding: '0.65rem 0.9rem', background: 'var(--g-error-bg)', border: '1px solid var(--g-error-border)', borderRadius: 'var(--g-radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--g-error-text)' }}>
              <strong>🚩 Flagged:</strong> {current.reportFlag}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="g-btn g-btn-primary" style={{ flex: 1, minWidth: '120px' }} onClick={handleApprove}>
              ✔ Approve &amp; Next
            </button>
            <button
              type="button"
              className="g-btn g-btn-ghost"
              style={{ color: 'var(--g-error-text)', borderColor: 'var(--g-error-border)', flex: 1, minWidth: '120px' }}
              onClick={() => setFlagModal(true)}
            >
              🚩 Report Issue
            </button>
            {idx < total - 1 && (
              <button type="button" className="g-btn g-btn-ghost" style={{ padding: '0.7rem 1rem' }} onClick={() => setIdx(idx + 1)}>
                Skip →
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="g-report-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 className="g-results-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>QC Complete!</h3>
          <p style={{ color: 'var(--g-text-secondary)', marginBottom: '1.5rem' }}>
            {approved} questions approved · {flagged} flagged for review
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="g-btn g-btn-primary" onClick={() => onFinish(localQ)}>
              ðŸŒ Publish to Public Quiz →
            </button>
            <button type="button" className="g-btn g-btn-ghost" onClick={() => setIdx(0)}>
              Review Again
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
        {localQ.map((q, i) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: `2px solid ${q.qcApproved === true ? 'var(--g-correct-border)' : q.qcApproved === false ? 'var(--g-error-border)' : i === idx ? 'var(--g-blue)' : 'var(--g-border)'}`,
              background: q.qcApproved === true ? 'var(--g-correct-bg)' : q.qcApproved === false ? 'var(--g-error-bg)' : i === idx ? 'var(--g-blue-soft)' : 'transparent',
              color: q.qcApproved === true ? 'var(--g-correct-text)' : q.qcApproved === false ? 'var(--g-error-text)' : 'var(--g-text-primary)',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {flagModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border)', borderRadius: 'var(--g-radius-lg)', padding: '2rem', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Report Issue — Q{current.serial}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', marginBottom: '1rem' }}>
              Describe the problem: wrong answer, OCR error, ambiguous options, etc.
            </p>
            <textarea
              className="g-input"
              rows={4}
              placeholder="e.g. Answer key incorrect — should be option B not C..."
              value={flagText}
              onChange={e => setFlagText(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="g-btn g-btn-primary" style={{ flex: 1, background: 'var(--g-error-solid)', borderColor: 'var(--g-error-solid)' }} onClick={handleReport}>
                🚩 Submit Flag
              </button>
              <button type="button" className="g-btn g-btn-ghost" onClick={() => { setFlagModal(false); setFlagText(''); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────── Upload Modal ────────────────── */
function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (p: PdfProject) => void }) {
  const [pdfName, setPdfName] = useState('');
  const [year, setYear] = useState('2024');
  const [examName, setExamName] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [step, setStep] = useState(0);

  const EXAM_OPTIONS = [
    'TNPSC Group 1 (Combined Civil Services I)',
    'TNPSC Group 2 (Combined Civil Services II)',
    'TNPSC Group 2A (Combined Civil Services II-A)',
    'TNPSC Group 4 (Combined Civil Services IV)',
    'TNPSC VAO (Village Administrative Officer)',
    'UPSC Civil Services Preliminary',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfName(file.name);
  };

  const handleSimulate = async () => {
    if (!pdfName || !examName) return;
    setSimulating(true);
    for (let s = 0; s <= 4; s++) {
      await new Promise(r => setTimeout(r, 700));
      setStep(s + 1);
    }
    const proj: PdfProject = {
      id: `proj-${Date.now()}`,
      pdfName,
      year,
      examName,
      status: 'quiz_ready',
      pages: Math.floor(Math.random() * 20) + 10,
      questionsExtracted: Math.floor(Math.random() * 30) + 10,
      quizCount: Math.floor(Math.random() * 3) + 1,
      uploadedAt: new Date().toLocaleString('en-IN', { hour12: false }).slice(0, 16),
      progress: 100,
      syllabusTagged: Math.floor(Math.random() * 25) + 8,
    };
    onUpload(proj);
  };

  const STEP_LABELS = ['Uploading PDF', 'Splitting Pages', 'OCR Scanning', 'Tagging Syllabus', 'Building Quizzes'];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 900,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border)', borderRadius: 'var(--g-radius-lg)', padding: '2rem', maxWidth: '520px', width: '100%', animation: 'g-fade-in 0.25s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--g-font-display)' }}>
            📤 Upload New PDF
          </h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--g-text-muted)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {!simulating ? (
          <>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Select PDF File</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'block', width: '100%', padding: '0.7rem', background: 'var(--g-surface-elevated)', border: '1px solid var(--g-border)', borderRadius: 'var(--g-radius-sm)', color: 'var(--g-text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Exam Year</span>
              <input
                className="g-input"
                type="number"
                min="2000"
                max="2030"
                value={year}
                onChange={e => setYear(e.target.value)}
                style={{ margin: 0 }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Exam Name</span>
              <select
                className="g-input"
                value={examName}
                onChange={e => setExamName(e.target.value)}
                style={{ margin: 0 }}
              >
                <option value="">Select exam…</option>
                {EXAM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ width: '100%' }}
              disabled={!pdfName || !examName}
              onClick={handleSimulate}
            >
              🚀 Start Pipeline
            </button>
          </>
        ) : (
          <div>
            <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Processing <strong style={{ color: 'var(--g-text-primary)' }}>{pdfName}</strong>…
            </p>
            {STEP_LABELS.map((label, i) => {
              const done = step > i;
              const active = step === i;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0', borderBottom: '1px solid var(--g-border-subtle)' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem',
                    background: done ? 'var(--g-correct-solid)' : active ? 'var(--g-blue-soft)' : 'var(--g-surface-elevated)',
                    border: `2px solid ${done ? 'var(--g-correct-solid)' : active ? 'var(--g-blue)' : 'var(--g-border)'}`,
                    transition: 'all 0.3s',
                  }}>
                    {done ? 'âœ“' : active ? 'â—' : '○'}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: done ? 'var(--g-correct-text)' : active ? 'var(--g-blue)' : 'var(--g-text-muted)' }}>
                    {label}
                    {active && <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.8rem' }}>in progress…</span>}
                    {done && <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.8rem' }}>done</span>}
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
  project, onStartQC, onPublish, onDelete,
}: {
  project: PdfProject;
  onStartQC: () => void;
  onPublish: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--g-surface)',
      border: '1px solid var(--g-border-subtle)',
      borderRadius: 'var(--g-radius-md)',
      overflow: 'hidden',
    }}>
      <div
        style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--g-radius-sm)', background: 'rgba(138,180,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
          📄
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--g-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {project.pdfName}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)', marginTop: '0.2rem' }}>
            {project.examName} · {project.year}
          </div>
        </div>
        <Badge status={project.status} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--g-text-muted)', fontSize: '0.85rem' }}>
          <span>{project.questionsExtracted} Q</span>
          <span style={{ color: 'var(--g-border)' }}>|</span>
          <span>{project.pages} pg</span>
        </div>
        <span style={{ color: 'var(--g-text-muted)', fontSize: '1.1rem', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>⌄</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--g-border-subtle)', padding: '1.25rem', animation: 'g-fade-in 0.2s ease' }}>
          <PipelineTracker status={project.status} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Pages Split', val: project.pages },
              { label: 'Questions', val: project.questionsExtracted },
              { label: 'Tagged', val: project.syllabusTagged },
              { label: 'Quizzes', val: project.quizCount },
              { label: 'Uploaded', val: project.uploadedAt },
            ].map(m => (
              <div key={m.label} style={{ background: 'var(--g-surface-elevated)', borderRadius: 'var(--g-radius-sm)', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--g-text-muted)', marginBottom: '0.2rem' }}>{m.label}</div>
                <div style={{ fontWeight: 700, fontSize: typeof m.val === 'number' ? '1.1rem' : '0.78rem', color: 'var(--g-text-primary)' }}>{m.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {project.status === 'quiz_ready' && (
              <button type="button" className="g-btn g-btn-primary" onClick={onStartQC}>
                ðŸ” Start QC Review
              </button>
            )}
            {project.status === 'qc_in_progress' && (
              <button type="button" className="g-btn g-btn-primary" onClick={onStartQC}>
                🔄 Continue QC
              </button>
            )}
            {project.status === 'qc_done' && (
              <button type="button" className="g-btn g-btn-primary" style={{ background: 'var(--g-correct-solid)', borderColor: 'var(--g-correct-solid)' }} onClick={onPublish}>
                ðŸŒ Publish to Public
              </button>
            )}
            {project.status === 'published' && (
              <>
                <a href="/quiz/gemini" className="g-btn g-btn-ghost" style={{ color: 'var(--g-correct-text)' }}>
                  ↗ View Live Quiz
                </a>
                <button type="button" className="g-btn g-btn-ghost" style={{ color: 'var(--g-error-text)' }} onClick={onDelete}>
                  🗑 Delete PDF &amp; Images
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
  const [qcQuestions, setQcQuestions] = useState<ExtractedQuestion[]>(DEMO_QUESTIONS);
  const [projects, setProjects] = useState<PdfProject[]>([DEMO_PROJECT]);
  const [showUpload, setShowUpload] = useState(false);
  const [publishedToast, setPublishedToast] = useState(false);

  useEffect(() => {
    try {
      const storedPass = localStorage.getItem('tnpsc_portal_pass') || 'Thiru@1432';
      setCurrentPassword(storedPass);
      const auth = sessionStorage.getItem('tnpsc_portal_auth') || localStorage.getItem('tnpsc_portal_auth');
      if (auth === 'true') setIsAuthenticated(true);
      const stored = localStorage.getItem('tnpsc_dashboard_projects');
      if (stored) setProjects(JSON.parse(stored));
    } catch {}
  }, []);

  const saveProjects = (p: PdfProject[]) => {
    setProjects(p);
    try { localStorage.setItem('tnpsc_dashboard_projects', JSON.stringify(p)); } catch {}
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
      setErrorMsg('Incorrect password. Try again.');
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
      setStatusFeedback('Minimum 4 characters required.');
      return;
    }
    const updated = newPasswordInput.trim();
    setCurrentPassword(updated);
    try { localStorage.setItem('tnpsc_portal_pass', updated); } catch {}
    setStatusFeedback('Password updated âœ“');
    setNewPasswordInput('');
    setTimeout(() => { setStatusFeedback(''); setShowPasswordChange(false); }, 2000);
  };

  const handleStartQC = (proj: PdfProject) => {
    setActiveProject(proj);
    setQcQuestions(DEMO_QUESTIONS.map(q => ({ ...q, projectId: proj.id })));
    const updated = projects.map(p => p.id === proj.id ? { ...p, status: 'qc_in_progress' as PipelineStatus } : p);
    saveProjects(updated);
    setView('qc');
  };

  const handleQCFinish = (updatedQ: ExtractedQuestion[]) => {
    if (activeProject) {
      const updated = projects.map(p => p.id === activeProject.id ? { ...p, status: 'qc_done' as PipelineStatus } : p);
      saveProjects(updated);
    }
    setQcQuestions(updatedQ);
    setView('dashboard');
  };

  const handlePublish = (proj: PdfProject) => {
    const updated = projects.map(p => p.id === proj.id ? { ...p, status: 'published' as PipelineStatus, publishedAt: new Date().toISOString() } : p);
    saveProjects(updated);
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 3500);
  };

  const handleDelete = (proj: PdfProject) => {
    if (!confirm(`Delete PDF and all images for "${proj.pdfName}"? This cannot be undone.`)) return;
    saveProjects(projects.filter(p => p.id !== proj.id));
  };

  const handleNewUpload = (proj: PdfProject) => {
    saveProjects([proj, ...projects]);
    setShowUpload(false);
  };

  const totalQ = projects.reduce((s, p) => s + p.questionsExtracted, 0);
  const published = projects.filter(p => p.status === 'published').length;
  const qcReady = projects.filter(p => p.status === 'quiz_ready' || p.status === 'qc_in_progress').length;

  /* ── Login Screen ── */
  if (!isAuthenticated) {
    return (
      <div className="gemini-quiz-root" style={{ justifyContent: 'center' }}>
        <div className="g-gate-card">
          <div className="g-gate-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="g-results-title" style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            Pipeline Dashboard
          </h1>
          <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Your private PDF→Quiz pipeline control centre.
            Upload answer keys, run OCR, QC questions, and publish live quizzes.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="g-input"
              placeholder="Enter your passcode"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              autoFocus
              required
            />
            {errorMsg && (
              <p style={{ color: 'var(--g-error-text)', fontSize: '0.85rem', marginBottom: '1rem' }}>{errorMsg}</p>
            )}
            <button type="submit" className="g-btn g-btn-primary" style={{ width: '100%' }}>
              Unlock Dashboard →
            </button>
          </form>
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--g-surface-elevated)', borderRadius: 'var(--g-radius-sm)', fontSize: '0.8rem', color: 'var(--g-text-muted)' }}>
            Default passcode: <code style={{ color: 'var(--g-blue)', background: 'rgba(138,180,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Thiru@1432</code>
          </div>
        </div>
      </div>
    );
  }

  /* ── QC View ── */
  if (view === 'qc' && activeProject) {
    return (
      <div className="gemini-quiz-root">
        <div className="gemini-quiz-container">
          <button type="button" className="g-btn g-btn-ghost" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }} onClick={() => setView('dashboard')}>
            â† Back to Dashboard
          </button>
          <QCQuizView
            project={activeProject}
            questions={qcQuestions}
            onFinish={handleQCFinish}
          />
        </div>
      </div>
    );
  }

  /* ── Main Dashboard ── */
  return (
    <div className="gemini-quiz-root">
      <div className="gemini-quiz-container">

        {publishedToast && (
          <div style={{
            position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 999,
            background: 'var(--g-correct-solid)', color: '#fff',
            padding: '0.75rem 1.25rem', borderRadius: 'var(--g-radius-md)',
            fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            animation: 'g-fade-in 0.25s ease',
          }}>
            ðŸŒ Quiz published to public! âœ“
          </div>
        )}

        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} onUpload={handleNewUpload} />
        )}

        <header className="g-quiz-header">
          <div className="g-header-title-wrap">
            <span className="g-quiz-badge" style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.25)' }}>
              🛠 Admin Pipeline
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--g-text-secondary)' }}>
              PDF → OCR → Quiz → Publish
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="button" className="g-btn g-btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setShowPasswordChange(s => !s)}>
              ⚙ Security
            </button>
            <button type="button" className="g-btn g-btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--g-error-text)' }} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {showPasswordChange && (
          <div className="g-question-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.65rem' }}>Update Passcode</h3>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="password"
                className="g-input"
                style={{ maxWidth: '300px', margin: 0 }}
                placeholder="New passcode"
                value={newPasswordInput}
                onChange={e => setNewPasswordInput(e.target.value)}
                required
              />
              <button type="submit" className="g-btn g-btn-primary" style={{ padding: '0.7rem 1.25rem' }}>
                Save
              </button>
              {statusFeedback && <span style={{ color: 'var(--g-correct-text)', fontSize: '0.85rem', alignSelf: 'center' }}>{statusFeedback}</span>}
            </form>
          </div>
        )}

        {/* Hero Stats */}
        <section className="g-report-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h1 className="g-results-title" style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>
                Pipeline Control Centre
              </h1>
              <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Upload PDFs · Auto-OCR · Tag Syllabus · QC → Publish
              </p>
            </div>
            <button type="button" className="g-btn g-btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 1.5rem' }} onClick={() => setShowUpload(true)}>
              + Upload PDF
            </button>
          </div>

          <div className="g-score-metrics-grid">
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: 'var(--g-blue)' }}>{projects.length}</span>
              <span className="g-metric-label">PDF Projects</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val correct">{totalQ}</span>
              <span className="g-metric-label">Questions Extracted</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: '#FDD663' }}>{qcReady}</span>
              <span className="g-metric-label">Pending QC</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: 'var(--g-correct-text)' }}>{published}</span>
              <span className="g-metric-label">Published Live</span>
            </div>
          </div>
        </section>

        {/* Pipeline Guide */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 className="g-section-heading" style={{ marginBottom: '0.85rem' }}>
            <span>⚡</span> Automated Pipeline
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {[
              { icon: '📤', step: '1. Upload',   desc: 'Drop PDF exam paper' },
              { icon: '✂',  step: '2. Split',    desc: 'Page-by-page to cloud' },
              { icon: '🏷', step: '3. OCR',      desc: 'Extract Q+options+answer' },
              { icon: '🏷', step: '4. Tag',      desc: 'Map to syllabus topics' },
              { icon: '📋', step: '5. Quiz',     desc: '25-question sets auto-built' },
              { icon: '✅', step: '6. QC',       desc: 'Review & flag per question' },
              { icon: '🏷', step: '7. Publish',  desc: 'Live to public users' },
              { icon: '🗑', step: '8. Cleanup',  desc: 'PDF & images deleted' },
            ].map(s => (
              <div key={s.step} style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border-subtle)', borderRadius: 'var(--g-radius-sm)', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--g-text-primary)', marginBottom: '0.2rem' }}>{s.step}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--g-text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="g-section-heading" style={{ margin: 0 }}>
              <span>ðŸ“</span> PDF Projects
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)' }}>{projects.length} total</span>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--g-surface)', border: '1px dashed var(--g-border)', borderRadius: 'var(--g-radius-md)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📁</div>
              <p style={{ color: 'var(--g-text-muted)', marginBottom: '1rem' }}>No PDF projects yet. Upload your first exam paper!</p>
              <button type="button" className="g-btn g-btn-primary" onClick={() => setShowUpload(true)}>
                + Upload PDF
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {projects.map(proj => (
                <ProjectRow
                  key={proj.id}
                  project={proj}
                  onStartQC={() => handleStartQC(proj)}
                  onPublish={() => handlePublish(proj)}
                  onDelete={() => handleDelete(proj)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="g-report-card" style={{ marginTop: '2rem' }}>
          <h2 className="g-section-heading">
            <span>ðŸŒ</span> Quick Links
          </h2>
          <div className="g-keep-learning-grid" style={{ marginTop: '1rem' }}>
            <a href="/quiz/gemini" className="g-learn-card">
              <span className="g-learn-icon">🧪</span>
              <span className="g-learn-title">Gemini Quiz</span>
              <span className="g-learn-desc">Public quiz app with AI report.</span>
            </a>
            <a href="/pyq" className="g-learn-card">
              <span className="g-learn-icon">ðŸ“</span>
              <span className="g-learn-title">PYQ Bank</span>
              <span className="g-learn-desc">Official past year questions.</span>
            </a>
            <a href="/syllabus" className="g-learn-card">
              <span className="g-learn-icon">📋</span>
              <span className="g-learn-title">Syllabus</span>
              <span className="g-learn-desc">Unit mapping for all groups.</span>
            </a>
            <a href="/notes" className="g-learn-card">
              <span className="g-learn-icon">📚</span>
              <span className="g-learn-title">Notes</span>
              <span className="g-learn-desc">600+ structured lesson notes.</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

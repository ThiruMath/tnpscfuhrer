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

const DEMO_QUESTIONS: ExtractedQuestion[] = [
  {
    id: 'q1',
    projectId: 'proj-1',
    serial: 1,
    question: 'The Preamble to the Indian Constitution declares India as a:',
    questionTamil: 'இந்திய அரசியலமைப்பின் முகப்புரை இந்தியாவை எவ்வாறு பிரகடனப்படுத்துகிறது?',
    options: [
      'Sovereign Democratic Republic',
      'Socialist Secular Democratic Republic',
      'Sovereign Socialist Secular Democratic Republic',
      'Federal Secular Democratic Republic',
    ],
    optionsTamil: [
      'இறையாண்மை கொண்ட மக்களாட்சிக் குடியரசு',
      'சமதர்ம, மதச்சார்பற்ற மக்களாட்சிக் குடியரசு',
      'இறையாண்மை, சமதர்ம, மதச்சார்பற்ற மக்களாட்சிக் குடியரசு',
      'கூட்டாட்சி, மதச்சார்பற்ற மக்களாட்சிக் குடியரசு',
    ],
    answer: 'C',
    syllabusTag: 'Indian Polity',
    syllabusTagTamil: 'இந்திய ஆட்சியியல்',
    unit: 'Unit 5',
    unitTamil: 'அலகு 5',
    explanation: 'The 42nd Amendment Act 1976 added Socialist, Secular and Integrity to the Preamble.',
    explanationTamil: '1976-ஆம் ஆண்டின் 42-வது சட்டத்திருத்தத்தின் மூலம் சமதர்ம, மதச்சார்பற்ற, ஒருமைப்பாடு ஆகிய சொற்கள் முகப்புரையில் சேர்க்கப்பட்டன.',
  },
  {
    id: 'q2',
    projectId: 'proj-1',
    serial: 2,
    question: 'Which article of the Indian Constitution abolishes untouchability?',
    questionTamil: 'தீண்டாமை ஒழிப்பு பற்றி கூறும் இந்திய அரசியலமைப்பு விதி எது?',
    options: ['Article 14', 'Article 15', 'Article 17', 'Article 21'],
    optionsTamil: ['விதி 14', 'விதி 15', 'விதி 17', 'விதி 21'],
    answer: 'C',
    syllabusTag: 'Indian Polity',
    syllabusTagTamil: 'இந்திய ஆட்சியியல்',
    unit: 'Unit 5',
    unitTamil: 'அலகு 5',
    explanation: 'Article 17 strictly forbids the practice of untouchability in any form.',
    explanationTamil: 'விதி 17 எந்த வடிவிலும் தீண்டாமையை கடைப்பிடிப்பதைத் தடைசெய்து குற்றமாக அறிவிக்கிறது.',
  },
  {
    id: 'q3',
    projectId: 'proj-1',
    serial: 3,
    question: 'Who composed the immortal Sangam line "Yaadhum Oore Yaavarum Kelir"?',
    questionTamil: '"யாதும் ஊரே யாவரும் கேளிர்" என்ற அமரத்துவம் வாய்ந்த சங்கப் பாடலை இயற்றியவர் யார்?',
    options: ['Kapilar', 'Kaniyan Poongundranar', 'Avvaiyar', 'Paranar'],
    optionsTamil: ['கபிலர்', 'கணியன் பூங்குன்றனார்', 'ஔவையார்', 'பரணர்'],
    answer: 'B',
    syllabusTag: 'Tamil Literature & Heritage',
    syllabusTagTamil: 'தமிழ் இலக்கியம் & பண்பாடு',
    unit: 'Unit 8',
    unitTamil: 'அலகு 8',
    explanation: 'Kaniyan Poongundranar composed this universal humanist philosophy in Purananuru (Poem 192).',
    explanationTamil: 'புறநானூற்றின் 192-வது பாடலில் "யாதும் ஊரே யாவரும் கேளிர்; தீதும் நன்றும் பிறர்தர வாரா" என்று கணியன் பூங்குன்றனார் பாடியுள்ளார்.',
  },
  {
    id: 'q4',
    projectId: 'proj-1',
    serial: 4,
    question: 'In which chapter of Thirukkural does the couplet "Pirappokkum Ella Uyirkkum" appear?',
    questionTamil: '"பிறப்பொக்கும் எல்லா உயிர்க்கும்" - என்ற திருக்குறள் எந்த அதிகாரத்தில் இடம்பெற்றுள்ளது?',
    options: ['Anbudaimai (Love)', 'Perumai (Greatness)', 'Arivudaimai (Wisdom)', 'Naduvunilaimai (Impartiality)'],
    optionsTamil: ['அன்புடைமை', 'பெருமை', 'அறிவுடைமை', 'நடுவுநிலைமை'],
    answer: 'B',
    syllabusTag: 'Thirukkural',
    syllabusTagTamil: 'திருக்குறள்',
    unit: 'Unit 8',
    unitTamil: 'அலகு 8',
    explanation: 'Thirukkural 972 in the chapter "Perumai" establishes the universal equality of all living beings by birth.',
    explanationTamil: 'குறள் 972 (பெருமை அதிகாரம்): "பிறப்பொக்கும் எல்லா உயிர்க்கும் சிறப்பொவ்வா செய்தொழில் வேற்றுமை யான்" - அனைத்து மனிதர்களும் பிறப்பால் சமமானவர்களே.',
  },
  {
    id: 'q5',
    projectId: 'proj-1',
    serial: 5,
    question: 'Which city is celebrated as the "Manchester of South India"?',
    questionTamil: 'தென்னிந்தியாவின் மான்செஸ்டர் என்று போற்றப்படும் நகரம் எது?',
    options: ['Madurai', 'Salem', 'Coimbatore', 'Tiruchirappalli'],
    optionsTamil: ['மதுரை', 'சேலம்', 'கோயம்புத்தூர்', 'திருச்சிராப்பள்ளி'],
    answer: 'C',
    syllabusTag: 'Geography & Economy of TN',
    syllabusTagTamil: 'தமிழ்நாடு புவியியல் & பொருளாதாரம்',
    unit: 'Unit 9',
    unitTamil: 'அலகு 9',
    explanation: 'Coimbatore is known as the Manchester of South India due to its extensive textile spinning and cotton mills.',
    explanationTamil: 'கோயம்புத்தூர் அதன் பிரம்மாண்ட பருத்தி நெசவாலைகள் மற்றும் ஆடைத் தொழிலகங்களுக்காக தென்னிந்தியாவின் மான்செஸ்டர் என அழைக்கப்படுகிறது.',
  },
  {
    id: 'q6',
    projectId: 'proj-1',
    serial: 6,
    question: 'In which year did Periyar E.V. Ramasamy launch the Self-Respect Movement in Tamil Nadu?',
    questionTamil: 'தமிழ்நாட்டில் தந்தை பெரியார் ஈ.வே.ரா சுயமரியாதை இயக்கத்தை எந்த ஆண்டு தொடங்கினார்?',
    options: ['1920', '1925', '1930', '1937'],
    optionsTamil: ['1920', '1925', '1930', '1937'],
    answer: 'B',
    syllabusTag: 'Socio-Political Movements in TN',
    syllabusTagTamil: 'தமிழ்நாட்டின் சமூக - அரசியல் இயக்கங்கள்',
    unit: 'Unit 8',
    unitTamil: 'அலகு 8',
    explanation: 'Periyar founded the Self-Respect Movement in 1925 to establish rationalism, women emancipation, and equality.',
    explanationTamil: 'பகுத்தறிவு, பெண்ணுரிமை, சாதி ஒழிப்பு மற்றும் சமத்துவத்தை நிலைநாட்ட 1925-ல் பெரியார் சுயமரியாதை இயக்கத்தைத் தொடங்கினார்.',
  },
  {
    id: 'q7',
    projectId: 'proj-1',
    serial: 7,
    question: 'The historic Battle of Plassey was fought in the year:',
    questionTamil: 'வரலாற்றுச் சிறப்புமிக்க பிளாசிப் போர் நடைபெற்ற ஆண்டு எது?',
    options: ['1757', '1764', '1526', '1857'],
    optionsTamil: ['1757', '1764', '1526', '1857'],
    answer: 'A',
    syllabusTag: 'Modern History of India',
    syllabusTagTamil: 'இந்திய வரலாறு',
    unit: 'Unit 4',
    unitTamil: 'அலகு 4',
    explanation: 'The Battle of Plassey took place on 23 June 1757 between British East India Company and Nawab Siraj-ud-Daulah.',
    explanationTamil: '1757 ஜூன் 23 அன்று ஆங்கிலேய கிழக்கிந்திய படைக்கும் வங்காள நவாப் சிராஜ்-உத்-தௌலாவிற்கும் இடையே பிளாசிப் போர் நடந்தது.',
  },
  {
    id: 'q8',
    projectId: 'proj-1',
    serial: 8,
    question: 'Which Five Year Plan explicitly prioritized "Growth with Social Justice"?',
    questionTamil: 'எந்த ஐந்தாண்டு திட்டம் "சமூக நீதியுடன் கூடிய வளர்ச்சி" என்பதை முதன்மை இலக்காகக் கொண்டது?',
    options: ['Third Plan', 'Fifth Plan', 'Ninth Plan', 'Tenth Plan'],
    optionsTamil: ['மூன்றாம் திட்டம்', 'ஐந்தாம் திட்டம்', 'ஒன்பதாம் திட்டம்', 'பத்தாம் திட்டம்'],
    answer: 'C',
    syllabusTag: 'Indian Economy',
    syllabusTagTamil: 'இந்தியப் பொருளாதாரம்',
    unit: 'Unit 6',
    unitTamil: 'அலகு 6',
    explanation: 'The Ninth Five-Year Plan (1997-2002) focused on Growth with Social Justice and Equity.',
    explanationTamil: 'ஒன்பதாம் ஐந்தாண்டுத் திட்டம் (1997-2002) சமூக நீதியுடன் கூடிய சமத்துவ வளர்ச்சியை மையமாகக் கொண்டு உருவாக்கப்பட்டது.',
  },
  {
    id: 'q9',
    projectId: 'proj-1',
    serial: 9,
    question: 'In which plant cell organelle does photosynthesis primarily take place?',
    questionTamil: 'தாவரங்களில் ஒளிச்சேர்க்கை பிரதானமாக எந்த செல்லுறுப்பில் நடைபெறுகிறது?',
    options: ['Mitochondria', 'Chloroplast', 'Golgi Complex', 'Nucleus'],
    optionsTamil: ['மைட்டோகாண்ட்ரியா', 'பசங்கணிகம் (குளோரோபிளாஸ்ட்)', 'கோல்கை உறுப்பு', 'உட்கரு (நியூக்ளியஸ்)'],
    answer: 'B',
    syllabusTag: 'General Science',
    syllabusTagTamil: 'பொது அறிவியல்',
    unit: 'Unit 1',
    unitTamil: 'அலகு 1',
    explanation: 'Chloroplasts contain chlorophyll pigments that absorb solar photons for the photosynthesis cycle.',
    explanationTamil: 'பசங்கணிகங்களில் உள்ள பச்சையம் (குளோரோபில்) சூரிய ஒளியை ஈர்த்து ஒளிச்சேர்க்கையை நிகழ்த்துகிறது.',
  },
  {
    id: 'q10',
    projectId: 'proj-1',
    serial: 10,
    question: 'The headquarters of the Indian Space Research Organisation (ISRO) is situated in:',
    questionTamil: 'இந்திய விண்வெளி ஆராய்ச்சி நிறுவனத்தின் (ISRO) தலைமை மையம் எங்கு அமைந்துள்ளது?',
    options: ['Chennai', 'Bengaluru', 'New Delhi', 'Thiruvananthapuram'],
    optionsTamil: ['சென்னை', 'பெங்களூரு', 'புது தில்லி', 'திருவனந்தபுரம்'],
    answer: 'B',
    syllabusTag: 'Current Affairs & Science Tech',
    syllabusTagTamil: 'நடப்பு நிகழ்வுகள் & அறிவியல் தொழில்நுட்பம்',
    unit: 'Unit 2',
    unitTamil: 'அலகு 2',
    explanation: 'ISRO headquarters is located in Antariksh Bhavan, Bengaluru, Karnataka.',
    explanationTamil: 'இஸ்ரோவின் (ISRO) தலைமை செயலகம் கர்நாடக மாநிலம் பெங்களூருவில் உள்ள அந்தரிக்ஷ் பவனில் அமைந்துள்ளது.',
  },
];

const DEMO_PROJECT: PdfProject = {
  id: 'proj-1',
  pdfName: 'TNPSC_Group2_2024_Paper.pdf',
  year: '2024',
  examName: 'TNPSC Group 2 (Combined Civil Services II)',
  examNameTamil: 'டி.என்.பி.எஸ்.சி குரூப் 2 (ஒருங்கிணைந்த குடிமைப் பணிகள் II)',
  status: 'quiz_ready',
  pages: 24,
  questionsExtracted: 10,
  quizCount: 1,
  uploadedAt: '2026-10-10 09:15',
  progress: 100,
  syllabusTagged: 10,
};

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

/* ────────────────── QC Quiz View ────────────────── */
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
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [flagModal, setFlagModal] = useState(false);
  const [flagText, setFlagText] = useState('');
  const [flagTag, setFlagTag] = useState('');
  const [langMode, setLangMode] = useState<'bilingual' | 'ta' | 'en'>('bilingual');
  const [localQ, setLocalQ] = useState(questions.map((q) => ({ ...q })));

  const current = localQ[idx];
  const total = localQ.length;

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
    if (idx < total - 1) setIdx(idx + 1);
  };

  const done = localQ.every((q) => q.qcApproved !== undefined);
  const approved = localQ.filter((q) => q.qcApproved === true).length;
  const flagged = localQ.filter((q) => q.qcApproved === false).length;

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
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <span className="g-quiz-badge">
            {dashboardLang === 'ta' ? 'QC சரிபார்ப்பு முறைமை' : 'QC Mode Active'}
          </span>
          <h2 className="g-results-title" style={{ fontSize: '1.4rem', marginTop: '0.4rem', fontFamily: 'var(--g-font-display)' }}>
            {dashboardLang === 'ta'
              ? `தரக் கட்டுப்பாடு — ${project.examNameTamil || project.examName}`
              : `Quality Control — ${project.examName}`}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Language display switcher for questions */}
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
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              இருமொழி (Bilingual)
            </button>
            <button
              type="button"
              onClick={() => setLangMode('ta')}
              style={{
                background: langMode === 'ta' ? 'var(--g-blue)' : 'transparent',
                color: langMode === 'ta' ? '#041E49' : 'var(--g-text-secondary)',
                border: 'none',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              தமிழ் மட்டும்
            </button>
            <button
              type="button"
              onClick={() => setLangMode('en')}
              style={{
                background: langMode === 'en' ? 'var(--g-blue)' : 'transparent',
                color: langMode === 'en' ? '#041E49' : 'var(--g-text-secondary)',
                border: 'none',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--g-radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              English
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              ✔ {approved} {dashboardLang === 'ta' ? 'ஒப்புதல்' : 'Approved'}
            </span>
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
              🚩 {flagged} {dashboardLang === 'ta' ? 'சுட்டிக்காட்டப்பட்டது' : 'Flagged'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--g-text-muted)', marginBottom: '0.3rem' }}>
          <span>
            {dashboardLang === 'ta' ? `வினா ${idx + 1} / ${total}` : `Question ${idx + 1} of ${total}`}
          </span>
          <span>
            {Math.round((localQ.filter((q) => q.qcApproved !== undefined).length / total) * 100)}%{' '}
            {dashboardLang === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Reviewed'}
          </span>
        </div>
        <ProgressBar
          value={(localQ.filter((q) => q.qcApproved !== undefined).length / total) * 100}
          color="var(--g-correct-solid)"
        />
      </div>

      {/* Question Card */}
      {!done ? (
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
              🏷 {dashboardLang === 'ta' || langMode === 'ta' ? current.syllabusTagTamil : current.syllabusTag}
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
              {dashboardLang === 'ta' || langMode === 'ta' ? current.unitTamil : current.unit}
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
              Q{current.serial}
            </span>
          </div>

          {/* Tamil Question (Primary for TNPSC) */}
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
                    {/* Tamil Option */}
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
                    {/* English Option */}
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
                      விடைக்குறிப்பு (Key: {letter})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
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
              {current.explanation && (
                <div style={{ color: 'var(--g-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {current.explanation}
                </div>
              )}
            </div>
          )}

          {/* Reported Flag Notice */}
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
              🚩 {dashboardLang === 'ta' ? 'பிழையைப் புகாரளி (Report)' : 'Report Issue'}
            </button>
            {idx < total - 1 && (
              <button
                type="button"
                className="g-btn g-btn-ghost"
                style={{ padding: '0.7rem 1.25rem' }}
                onClick={() => setIdx(idx + 1)}
              >
                {dashboardLang === 'ta' ? 'தவிர் →' : 'Skip →'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Finished State */
        <div className="g-report-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 className="g-results-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--g-font-display)' }}>
            {dashboardLang === 'ta' ? 'சரிபார்ப்பு (QC) நிறைவடைந்தது!' : 'QC Review Complete!'}
          </h3>
          <p style={{ color: 'var(--g-text-secondary)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
            {dashboardLang === 'ta'
              ? `${approved} வினாக்கள் ஒப்புதல் அளிக்கப்பட்டது · ${flagged} வினாக்கள் திருத்தத்திற்கு சுட்டிக்காட்டப்பட்டது`
              : `${approved} questions approved · ${flagged} flagged for review`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="g-btn g-btn-primary" onClick={() => onFinish(localQ)}>
              🌐 {dashboardLang === 'ta' ? 'பொது வினாடிவினாவில் நேரலையாக வெளியிடு →' : 'Publish to Public Quiz →'}
            </button>
            <button type="button" className="g-btn g-btn-ghost" onClick={() => setIdx(0)}>
              {dashboardLang === 'ta' ? 'மீண்டும் சரிபார்' : 'Review Again'}
            </button>
          </div>
        </div>
      )}

      {/* Question Pills Navigator */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
        {localQ.map((q, i) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              width: '34px',
              height: '34px',
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
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Report Modal */}
      {flagModal && (
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

            {/* Quick tags */}
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

/* ────────────────── Upload Modal ────────────────── */
function UploadModal({
  onClose,
  onUpload,
  lang,
}: {
  onClose: () => void;
  onUpload: (p: PdfProject) => void;
  lang: 'en' | 'ta';
}) {
  const [pdfName, setPdfName] = useState('');
  const [year, setYear] = useState('2024');
  const [examName, setExamName] = useState('');
  const [examNameTamil, setExamNameTamil] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [step, setStep] = useState(0);

  const EXAM_OPTIONS = [
    { en: 'TNPSC Group 4 (General Tamil & General Studies)', ta: 'TNPSC குரூப் 4 (பொதுத்தமிழ் & பொது அறிவு)' },
    { en: 'TNPSC Group 2 / 2A (Combined Civil Services II)', ta: 'TNPSC குரூப் 2 / 2A (ஒருங்கிணைந்த குடிமைப் பணிகள் II)' },
    { en: 'TNPSC Group 1 (Combined Civil Services I)', ta: 'TNPSC குரூப் 1 (முதன்மை குடிமைப் பணிகள்)' },
    { en: 'TNPSC VAO (Village Administrative Officer)', ta: 'TNPSC VAO (கிராம நிர்வாக அலுவலர்)' },
    { en: 'TNPSC Combined Technical Services Exam', ta: 'TNPSC ஒருங்கிணைந்த தொழில்நுட்பப் பணிகள் தேர்வு' },
    { en: 'UPSC Civil Services Preliminary', ta: 'UPSC குடிமைப் பணிகள் முதல்நிலைத் தேர்வு' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfName(file.name);
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setExamName(val);
    const found = EXAM_OPTIONS.find((o) => o.en === val);
    if (found) setExamNameTamil(found.ta);
  };

  const handleSimulate = async () => {
    if (!pdfName || !examName) return;
    setSimulating(true);
    for (let s = 0; s <= 4; s++) {
      await new Promise((r) => setTimeout(r, 650));
      setStep(s + 1);
    }
    const proj: PdfProject = {
      id: `proj-${Date.now()}`,
      pdfName,
      year,
      examName,
      examNameTamil: examNameTamil || examName,
      status: 'quiz_ready',
      pages: Math.floor(Math.random() * 20) + 12,
      questionsExtracted: 25,
      quizCount: 1,
      uploadedAt: new Date().toLocaleString('en-IN', { hour12: false }).slice(0, 16),
      progress: 100,
      syllabusTagged: 25,
    };
    onUpload(proj);
  };

  const STEP_LABELS = [
    { en: 'Uploading PDF to Cloud', ta: 'PDF கோப்பு மேகக்கணியில் பதிவேற்றம்' },
    { en: 'Splitting Pages Automatically', ta: 'பக்கங்கள் தானாகப் பிரிக்கப்படுகிறது' },
    { en: 'OCR Scanning & Tamil Extraction', ta: 'OCR வாசிப்பு மற்றும் தமிழ் வினாக்கள் எடுப்பு' },
    { en: 'Tagging Syllabus Units (Unit 1-10)', ta: 'TNPSC பாடத்திட்ட அலகுகளுடன் குறியிடல்' },
    { en: 'Generating 25-Question Quiz Sets', ta: '25 வினாக்கள் கொண்ட பயிற்சித் தேர்வு உருவாக்கம்' },
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
          maxWidth: '520px',
          width: '100%',
          animation: 'g-fade-in 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--g-font-display)' }}>
            📤 {lang === 'ta' ? 'புதிய PDF வினாத்தாள் பதிவேற்றம்' : 'Upload New PDF Question Paper'}
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
                {lang === 'ta' ? 'PDF வினாத்தாள் கோப்பைத் தேர்ந்தெடுக்கவும்' : 'Select PDF File'}
              </span>
              <input
                type="file"
                accept=".pdf"
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

            <label style={{ display: 'block', marginBottom: '1rem' }}>
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

            <label style={{ display: 'block', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--g-text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                {lang === 'ta' ? 'தேர்வுப் பெயர் (Exam Name)' : 'Exam Name'}
              </span>
              <select className="g-input" value={examName} onChange={handleExamChange} style={{ margin: 0 }}>
                <option value="">{lang === 'ta' ? 'தேர்வைத் தேர்ந்தெடுக்கவும்…' : 'Select exam…'}</option>
                {EXAM_OPTIONS.map((o) => (
                  <option key={o.en} value={o.en}>
                    {lang === 'ta' ? o.ta : o.en}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ width: '100%' }}
              disabled={!pdfName || !examName}
              onClick={handleSimulate}
            >
              🚀 {lang === 'ta' ? 'தானியங்கி செயல்முறையைத் தொடங்கு' : 'Start Automated Pipeline'}
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
          <span>{project.questionsExtracted} {lang === 'ta' ? 'வினா' : 'Q'}</span>
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
              { labelEn: 'Questions', labelTa: 'வினாக்கள்', val: project.questionsExtracted },
              { labelEn: 'Tagged Units', labelTa: 'குறியிட்ட அலகுகள்', val: project.syllabusTagged },
              { labelEn: '25-Q Sets', labelTa: 'தேர்வுத் தொகுப்புகள்', val: project.quizCount },
              { labelEn: 'Uploaded', labelTa: 'பதிவேற்றம்', val: project.uploadedAt },
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
                🔍 {lang === 'ta' ? 'QC சரிபார்ப்பைத் தொடங்கு' : 'Start QC Review'}
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
  const [qcQuestions, setQcQuestions] = useState<ExtractedQuestion[]>(DEMO_QUESTIONS);
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
      if (stored) setProjects(JSON.parse(stored));
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

  const handleStartQC = (proj: PdfProject) => {
    setActiveProject(proj);
    setQcQuestions(DEMO_QUESTIONS.map((q) => ({ ...q, projectId: proj.id })));
    const updated = projects.map((p) => (p.id === proj.id ? { ...p, status: 'qc_in_progress' as PipelineStatus } : p));
    saveProjects(updated);
    setView('qc');
  };

  const handleQCFinish = (updatedQ: ExtractedQuestion[]) => {
    if (activeProject) {
      const updated = projects.map((p) => (p.id === activeProject.id ? { ...p, status: 'qc_done' as PipelineStatus } : p));
      saveProjects(updated);
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
  };

  const handleNewUpload = (proj: PdfProject) => {
    saveProjects([proj, ...projects]);
    setShowUpload(false);
  };

  const totalQ = projects.reduce((s, p) => s + p.questionsExtracted, 0);
  const published = projects.filter((p) => p.status === 'published').length;
  const qcReady = projects.filter((p) => p.status === 'quiz_ready' || p.status === 'qc_in_progress').length;

  /* ── 1. Login Gate Screen ── */
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
              {dashboardLang === 'ta' ? 'PDF → OCR → தமிழ் வினாக்கள் → சரிபார்ப்பு → நேரலை' : 'PDF → OCR → Bilingual Quiz → QC → Publish'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {/* Language Switcher */}
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
                  ? 'PDF பதிவேற்றம் · பக்கப் பிரிப்பு · OCR வாசிப்பு · பாடத்திட்டக் குறியீடு · 25 வினாக்கள் பயிற்சி · QC சரிபார்ப்பு · நேரலை வெளியீடு'
                  : 'Upload PDFs · Auto-Split · OCR Extraction · Syllabus Tagging · 25-Q Sets · QC Review · Live Publish'}
              </p>
            </div>
            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.85rem 1.5rem' }}
              onClick={() => setShowUpload(true)}
            >
              + {dashboardLang === 'ta' ? 'PDF வினாத்தாள் பதிவேற்று' : 'Upload PDF'}
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
              <span className="g-metric-val" style={{ color: '#FDD663' }}>{qcReady}</span>
              <span className="g-metric-label">{dashboardLang === 'ta' ? 'சரிபார்ப்பு நிலுவை (QC)' : 'Pending QC'}</span>
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
              { icon: '📤', stepEn: '1. Upload',   stepTa: '1. பதிவேற்றம்',  descEn: 'PDF exam question paper', descTa: 'PDF வினாத்தாள் பதிவேற்றம்' },
              { icon: '✂',  stepEn: '2. Split',    stepTa: '2. பக்கப் பிரிப்பு', descEn: 'Page-by-page to cloud', descTa: 'மேகக்கணியில் பக்கப் பிரிப்பு' },
              { icon: '🔍', stepEn: '3. OCR',      stepTa: '3. OCR வாசிப்பு', descEn: 'Extract Q+options+answer', descTa: 'கேள்வி & விடை OCR எடுப்பு' },
              { icon: '🏷', stepEn: '4. Tag',      stepTa: '4. குறியீடு',    descEn: 'Tag to TNPSC syllabus', descTa: 'அலகு 1-10 பாடத்திட்ட இணைவு' },
              { icon: '📋', stepEn: '5. Quiz',     stepTa: '5. தேர்வு ஆக்கம்',descEn: '25-Q practice sets', descTa: '25 வினாக்கள் பயிற்சித் தேர்வு' },
              { icon: '✅', stepEn: '6. QC',       stepTa: '6. சரிபார்ப்பு', descEn: 'Review & flag per question', descTa: 'வினா வாரியாக சரிபார்த்தல்' },
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

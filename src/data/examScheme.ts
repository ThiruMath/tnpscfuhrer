export const prelims = {
  title: "Combined Civil Services (Preliminary) Examination",
  subtitle: "Common to Group II and Group IIA Services · Code 495",
  note: "Single paper, single sitting. All three sections are objective type and qualifying only — marks are not carried forward to Mains.",
  totalMarks: 200,
  totalQuestions: 200,
  sections: [
    { key: "A", name: "General Studies", standard: "Degree", type: "Objective", nature: "Qualifying", questions: 75, marks: 75 },
    { key: "B", name: "Aptitude and Mental Ability", standard: "SSLC", type: "Objective", nature: "Qualifying", questions: 25, marks: 25 },
    { key: "C", name: "Language (General Tamil or General English)", standard: "SSLC", type: "Objective", nature: "Qualifying", questions: 100, marks: 100 },
  ],
};

export const mainsGroup2 = {
  title: "Combined Civil Services (Main) Examination — II",
  subtitle: "Group II Services",
  totalMarks: 400,
  papers: [
    {
      code: "I",
      name: "Tamil Eligibility Test",
      standard: "SSLC",
      type: "Descriptive",
      nature: "Qualifying",
      marks: "100",
      note: "Marks not counted for ranking — candidates must only clear the qualifying minimum.",
    },
    {
      code: "II",
      name: "General Studies",
      standard: "Degree",
      type: "Descriptive",
      nature: "Scoring",
      marks: "300",
      note: "300 marks carried forward for merit ranking, followed by an oral interview for interview posts.",
    },
  ],
  followedBy: "Oral Interview (for Group II interview posts only)",
};

export const mainsGroup2A = {
  title: "Combined Civil Services (Main) Examination — II",
  subtitle: "Group IIA Services",
  totalMarks: 400,
  papers: [
    {
      code: "I",
      name: "Tamil Eligibility Test",
      standard: "SSLC",
      type: "Descriptive",
      nature: "Qualifying",
      marks: "100",
      note: "Marks not counted for ranking — candidates must only clear the qualifying minimum.",
    },
    {
      code: "II",
      name: "General Studies + General Intelligence and Reasoning",
      standard: "Degree / SSLC",
      type: "Objective",
      nature: "Scoring",
      marks: "300",
      subparts: [
        { name: "A. General Studies", standard: "Degree", questions: 150, marks: 150 },
        { name: "B. General Intelligence and Reasoning", standard: "SSLC", questions: 50, marks: 50 },
      ],
      note: "No interview stage — final selection is on the written Mains score alone.",
    },
  ],
  followedBy: "No interview — direct selection on Mains marks",
};

export const paper2Pattern = {
  title: "Group II — Paper II, General Studies: Descriptive Pattern",
  totalMarks: 300,
  duration: "3 Hours",
  parts: [
    {
      part: "A",
      label: "10-mark questions",
      instruction: "Answer all questions",
      rows: [
        { unit: "Unit I", count: 1 },
        { unit: "Unit III", count: 2 },
        { unit: "Unit IV", count: 1 },
        { unit: "Unit V", count: 3 },
        { unit: "Unit VI", count: 1 },
        { unit: "Unit VII", count: 1 },
      ],
      totalQuestions: 9,
      answered: 9,
      marks: 90,
      words: "100 words each · 900 words total",
    },
    {
      part: "B",
      label: "10-mark questions",
      instruction: "Answer any 3 of 5 (Unit II) — answerable in Tamil or English",
      rows: [{ unit: "Unit II", count: 5 }],
      totalQuestions: 5,
      answered: 3,
      marks: 30,
      words: "100 words each · 300 words total",
    },
    {
      part: "C",
      label: "15-mark questions",
      instruction: "Answer any 2 of 3 in each section",
      rows: [
        { unit: "Unit I", section: "A", count: 3 },
        { unit: "Unit III", section: "B", count: 3 },
        { unit: "Unit IV", section: "C", count: 3 },
        { unit: "Unit V", section: "D", count: 3 },
        { unit: "Unit VI", section: "E", count: 3 },
        { unit: "Unit VII", section: "F", count: 3 },
      ],
      totalQuestions: 18,
      answered: 12,
      marks: 180,
      words: "200 words each · 2400 words total",
    },
  ],
};

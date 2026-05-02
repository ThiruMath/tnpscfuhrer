export const works = [
  {
    slug: "tolkappiyam",
    title: "Tolkappiyam",
    tamil: "தொல்காப்பியம்",
    author: "Tolkappiyar",
    author_slug: "tolkappiyar",
    period: "pre-sangam",
    era_label: "Pre-Sangam / Second Sangam",
    dates: "~300–200 BCE (debated; may have multiple compositional layers)",
    form: "Grammar treatise (இலக்கணம்)",
    metre: "Nūṟpā (நூற்பா) — short aphoristic sutras in veṇpā metre",
    verses: "1,612 sutras across three books",
    language: "Old Tamil (சங்கத் தமிழ்)",
    religion_context: "Pre-sectarian Tamil — no Brahminic, Jain, or Buddhist allegiance; the gods mentioned are Tamil deities",

    overview: `Tolkappiyam is the oldest surviving Tamil text and the oldest surviving grammar of any language in India. It predates Panini's Ashtadhyayi in some formulations — though the dating debate is fierce and unresolved. What is not debated: this text is extraordinary. It does three things simultaneously that no other ancient text does: it describes a language with phonemic precision, it describes a society through its morphology, and it constructs a complete theory of literary aesthetics through its treatment of poetic subject matter. The grammar IS the aesthetics. The aesthetics IS the grammar.`,

    political_context: `Tolkappiyam was composed within the institutional framework of the Second Sangam — the legendary literary academy at Kapatapuram, a city that has since been swallowed by the sea. Whether the Sangam was literally a formal institution or a retroactive claim of institutional legitimacy is debated. What is clear: the text asserts itself as authoritative, not tentative. It is not one grammatical opinion — it is the grammar. This kind of confident systematization implies a strong cultural institution behind it, royal patronage, and a tradition of formal literary education. The Pandya kings, who are the primary royal patrons of the Sangam tradition, had political reasons to support the systematization of Tamil literary culture as distinct from Sanskrit.`,

    structure: {
      overview: "Three books (அதிகாரம் — Athikaram), each subdivided into chapters (இயல் — Iyal)",
      books: [
        {
          name: "Ezhutthathikaram (எழுத்ததிகாரம்)",
          meaning: "The Book of Letters",
          sutras: 483,
          chapters: 9,
          content: `Covers Tamil phonology — the alphabet, vowels, consonants, their classification by place of articulation (throat, palate, teeth, lips), the rules of euphonic combination (sandhi), and the system of grantha letters (used for Sanskrit loanwords). This book proves that ancient Tamil scholars understood phonetics with a precision not matched in European linguistics until the 19th century. The classification of consonants by voicing, aspiration, and place is systematic and largely accurate by modern phonological standards.`,
          key_sutra: {
            text: "எழுத்தெனப் படுவ அகரமுதல் னகர இறுவாய் முப்பஃ தென்ப",
            translation: "What are called letters: from 'a' to 'ṉ' — they number thirty, it is said.",
            note: "The Tamil alphabet formally recognized as 30 primary letters. Modern Tamil has 247 combined forms derived from these 30."
          }
        },
        {
          name: "Solladhikaram (சொல்லதிகாரம்)",
          meaning: "The Book of Words",
          sutras: 463,
          chapters: 9,
          content: `Tamil morphology and syntax. Case endings (the 8 Tamil cases are defined here), verb conjugation by tense, person, and number, the distinction between kuṟiṉmai (short syllable) and neṭimai (long syllable) in semantic differentiation, the classification of nouns as rational (உயர்திணை — uyartiṇai, referring to gods and humans) and non-rational (அஃறிணை — aḵṟiṇai, referring to everything else). This binary — which has no equivalent in Greek or Latin grammar — structures the entire Tamil grammatical worldview. Personhood is a grammatical category.`,
          key_sutra: {
            text: "உயர்திணை மக்களும் தேவரும் என்றிரு திணையே",
            translation: "The higher class (uyartiṇai) consists of two: humans and gods.",
            note: "This sutra establishes that Tamil grammar gives equal grammatical status to humans and gods — but distinguishes both sharply from everything else in the universe."
          }
        },
        {
          name: "Poruladhikaram (பொருளதிகாரம்)",
          meaning: "The Book of Subject Matter",
          sutras: 665,
          chapters: 9,
          content: `The extraordinary heart of Tolkappiyam. This is not morphology or phonology — this is a complete theory of poetry, aesthetics, emotion, and the relationship between nature and human feeling. It establishes the tinai system: five landscape-themes (Kurinji, Mullai, Marutam, Neytal, Paalai) each with its assigned season, time of day, flower, tree, bird, animal, deity, and emotional theme. It defines akam (interior/love) and puram (exterior/public) poetry and their respective conventions. It codifies what a Tamil poem can and cannot say, and through those rules, what Tamil civilization considers significant.`,
          key_sutra: {
            text: "முல்லை குறிஞ்சி மருதம் நெய்தல் என்றிந் நான்கின் பகுதியே பாலை",
            translation: "Paalai is derived from the qualities of these four: Mullai, Kurinji, Marutam, and Neytal.",
            note: "Paalai (wasteland, separation) is not a separate landscape but a synthesis of the harshest elements of all four others — it emerges when love's normal landscape has been destroyed. A profoundly sophisticated ecological-emotional theory."
          }
        }
      ]
    },

    tinai_system: {
      overview: `The tinai system is the central intellectual contribution of Tolkappiyam to world literature. It is simultaneously an ecological classification, a psychological theory, a poetic convention, and a philosophical claim about the relationship between nature and human emotion. No other ancient poetics system creates this four-way integration.`,
      tinais: [
        {
          name: "Kurinji (குறிஞ்சி)", region: "Mountains", season: "Cool season / winter",
          time: "Night and pre-dawn", flower: "Kurinji (Strobilanthes kunthiana — blooms once in 12 years)",
          tree: "Kāntaḷ (red lily)", bird: "Peacock (மயில்)", animal: "Elephant",
          deity: "Murugan (முருகன்)", theme: "Union — first meeting, secret trysts, the joy of love",
          note: "The kurinji flower's 12-year bloom cycle makes it the rarest flower in the Tamil landscape. A poem in kurinji tinai implies something rare, temporary, and precious — exactly the quality of first love."
        },
        {
          name: "Mullai (முல்லை)", region: "Forests / pastoral land", season: "Rainy season",
          time: "Evening", flower: "Jasmine (mullai)", tree: "Kōngu (coral tree)",
          bird: "Kuyil (Indian cuckoo)", animal: "Cow",
          deity: "Mayon (மாயோன் — the dark one, later identified with Vishnu/Krishna)",
          theme: "Waiting — patient longing for the husband who has gone to war or business",
          note: "The rainy season evening is the most melancholy time in the Tamil landscape — the rain comes but the lover does not. The jasmine blooms and perfumes an empty house."
        },
        {
          name: "Marutam (மருதம்)", region: "Fertile farmland, river valleys",
          season: "All seasons", time: "Dawn",
          flower: "Marutam blossom (Indian Kino tree)", tree: "Kadamba",
          bird: "Heron (நாரை)", animal: "Buffalo",
          deity: "Indra (இந்திரன்)", theme: "Quarrel — infidelity, lovers' dispute, sulking, reconciliation",
          note: "The most socially realistic of the tinais. Marutam poems describe urban, prosperous life — and its temptations. The woman speaks with anger; the man speaks with excuses. The heron stands alone in the paddy field — watching."
        },
        {
          name: "Neytal (நெய்தல்)", region: "Seashore", season: "All seasons",
          time: "Afternoon", flower: "Blue waterlily (neytal)",
          tree: "Punnai (Calophyllum inophyllum)", bird: "Seagull (கடல் காகம்)",
          animal: "Shark / dolphin", deity: "Varuṇan (வருணன்)",
          theme: "Longing and anxiety — the lover has gone across the sea; will he return?",
          note: "The seashore is the Tamil landscape of maximum uncertainty. The sea is both highway and abyss. Sangam merchants who went by sea might never return. Neytal poems have a particular quality of controlled panic."
        },
        {
          name: "Paalai (பாலை)", region: "Wasteland / forest in drought",
          season: "Summer and drought (when normal landscapes are destroyed)",
          time: "Midday (the harshest sun)", flower: "Paalai blossom / Mullai in drought",
          tree: "Dried kōngu / cactus", bird: "Cuckoo (in distress)", animal: "Tiger",
          deity: "Koṟṟavai (கொற்றவை — goddess of war and victory)",
          theme: "Separation — the hero leaves on a long journey; the woman is left alone in harsh conditions",
          note: "Paalai is the tinai of maximum suffering. It is not a natural landscape — it is what happens when natural landscapes fail. A Paalai poem begins where the others end: after the rain has not come, after the fields have dried, after the man has gone. The tiger walking through the wasteland is no longer magnificent — it is simply dangerous."
        }
      ]
    },

    what_it_says: `Tolkappiyam says: Tamil is a complete, rule-governed, sophisticated language — and Tamil poetry is a complete, rule-governed, sophisticated art. These rules are not arbitrary conventions; they are derived from observations about the natural world (ecology) and the human world (emotion). The poem and the landscape are not separate things — they are the same thing seen from different angles. This is an ecological theory of aesthetics that the Western tradition did not develop until the Romantic period, 2,000 years later.

More radically: Tolkappiyam treats love as the primary subject of serious literature. Not war, not politics, not the gods — love, in its five forms, in its five landscapes. The private life of the inner person is the highest subject of art. Puram (public poetry) exists — but it exists alongside akam (private poetry), as an equal. This is not how any other ancient literary tradition ranks things.`,

    political_ethical_context: `Tolkappiyam's political claim is the claim of Tamil autonomy. In the period of its composition, Sanskrit was expanding southward — the Brahminic tradition, with its Vedas, its grammars (Panini's Ashtadhyayi, ~4th century BCE), its ritual literature, was establishing itself as the prestige linguistic and cultural system of the subcontinent. Tolkappiyam says: we have our own grammar, our own aesthetics, our own theory of language and poetry. We do not need to borrow these things from Sanskrit. Tamil is not a dialect or a regional variant. Tamil is a civilization.

The text also encodes a specific social world. The Poruladhikaram's akam sections describe love across caste and social lines without anxiety — the Sangam world Tolkappiyam describes is one where a Brahmin woman can love a fisherman and a poem can record it without judgment. This social openness is either a description of how the early Sangam world actually worked, or an idealization of how it should work. Either way, it is a political statement about the relationship between love and social order.`,

    greek_latin_compare: `Aristotle's Poetics (350 BCE) is the Greek equivalent. It analyzes tragedy and epic. It establishes mimesis (imitation of action) as the basis of poetry. It ranks genres hierarchically: tragedy above comedy above epic. Tolkappiyam establishes no such hierarchy — love poetry (akam) and public poetry (puram) are equal. Aristotle is interested in plot; Tolkappiyam is interested in emotion. Aristotle extracts universal principles from specific Greek examples; Tolkappiyam integrates specific Tamil ecological observations into universal aesthetic principles. Both are extraordinary — they are not comparable in terms of sophistication. They are incomparable in terms of method and assumption.`,

    school_syllabus: [
      { grade: "Std. 6", content: "Introduction to tinai system; Kurinji and Mullai overview" },
      { grade: "Std. 8", content: "Ezhutthathikaram basics; Tamil alphabet theory" },
      { grade: "Std. 10", content: "Poruladhikaram — tinai system in detail; akam/puram distinction" },
      { grade: "Std. 11", content: "Solladhikaram; uyartiṇai/aḵṟiṇai distinction; selected sutras" },
      { grade: "Std. 12", content: "Comparative analysis with later grammars; Tolkappiyam and Sangam poetry" },
      { grade: "UG", content: "Full textual study; commentary traditions (Ilampuranar, Nachinarkiniyar, Peracciriyar)" },
      { grade: "PG", content: "Critical edition scholarship; Tolkappiyam and Panini comparison; dating controversy" },
    ],

    project_madurai: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0001.html",
    tamilvu: "https://www.tamilvu.org/courses/degree/p101/p1011/html/p1011ind.htm",
    tamilvu_lesson: "Tolkappiyam full course with commentary",
  },

  {
    slug: "purananuru",
    title: "Purananuru",
    tamil: "புறநானூறு",
    author: "Multiple poets (~150 named poets)",
    author_slug: null,
    period: "sangam",
    era_label: "Sangam Age",
    dates: "~1st century BCE – 3rd century CE (poems composed over several centuries)",
    form: "Anthology (தொகை) — puram (public/exterior) poetry",
    metre: "Akaval (ஆசிரியப்பா) primarily; some veṇpā and mixed",
    verses: "400 poems",
    language: "Old Tamil (சங்கத் தமிழ்)",
    religion_context: "Secular — pre-sectarian Tamil worldview; death, heroism, and generosity as primary values",

    overview: `Purananuru is the most politically important Tamil anthology. It is the record of a civilization at war with itself and at peace with the universe. 400 poems. 150 named poets. Every major Sangam dynasty represented. The full range of human experience in the public sphere: kings being praised, kings being buried, heroes dying on battlefields, cities burning, generous chieftains being mourned, mean kings being shamed, and — in Purananuru 192 — a single poet stepping outside the whole system to say: none of this matters the way you think it matters.`,

    political_context: `The Purananuru is a political document of the first order. It records the activities of the three crowned kingdoms (Chera, Chola, Pandya) and the minor Velir chieftains across several centuries. The praise poems establish political legitimacy — a king praised by a great poet is a king whose power is real. The elegies establish historical memory — a dead king remembered in a great poem is a king who cannot be forgotten. The critical poems — there are several — establish that poets held a kind of moral authority over kings: they could shame the ungenerous, and that shame had consequences.

The Pandya-Chola-Chera triangle was not a peaceful coexistence. These kingdoms fought constantly. Some poems record specific battles. Some record the aftermath — the widows, the orphans, the hero stones being raised for the dead. Purananuru is one of the few ancient South Asian texts that gives us war from the civilian perspective, not just the warrior perspective.`,

    structure: {
      overview: "400 poems organized loosely by sub-genre and tinai theme within puram poetry",
      books: [
        {
          name: "Veṭchi (வெட்சி) — poems of cattle-raids",
          content: "Poems celebrating the taking of enemy cattle — the traditional beginning of a war cycle in the Sangam world"
        },
        {
          name: "Karanthai (கரந்தை) — poems of counter-raid",
          content: "Response to the cattle-raid; counter-attack poetry"
        },
        {
          name: "Vaañci (வஞ்சி) — poems of conquest",
          content: "The march to battle; the gathering of armies; the declaration of war aims"
        },
        {
          name: "Kāñci (காஞ்சி) — poems of impermanence",
          content: "The most philosophically dense category — poems about the brevity of life, the certainty of death, the emptiness of power. These are the poems that survive beyond the political moment."
        },
        {
          name: "Pāṭāṇ (பாடாண்) — poems of praise",
          content: "Direct praise of kings and chieftains for specific acts of generosity or valor"
        },
        {
          name: "Potuviyalmoli (பொதுவியல்மொழி) — general wisdom",
          content: "Poems that transcend any specific patron or situation — of which Purananuru 192 is the supreme example"
        }
      ]
    },

    what_it_says: `Purananuru says that the Tamil world was organized around three core values: generosity (ஈகை — eekai), valor (வீரம் — veeram), and fame (புகழ் — pugazh). These three are not separate — they are a single integrated value system. A king who is not generous is not truly valorous. A hero who dies in battle but has no one to mourn him has no real fame. The poems measure every king and chieftain against these standards relentlessly. The ones who fail are recorded with the same precision as the ones who succeed.

The most radical thing Purananuru says — through Kaniyan Pungundranar, through Avvaiyar, through the kañci poems on impermanence — is that all of this: the valor, the generosity, the fame, the kingdoms, the battles — is temporary. Death comes for everyone. The earth persists. The poems persist. The king does not.`,

    key_poems: [
      {
        number: "192",
        poet: "Kaniyan Pungundranar",
        tinai: "Potuviyalmoli (General wisdom)",
        grade: "TN Std. 9, 10, 11, 12; UG; PG",
        tamil: `யாதும் ஊரே யாவரும் கேளிர்
தீதும் நன்றும் பிறர்தர வாரா
நோதலும் தணிதலும் அவற்றோ ரன்ன
சாதலும் புதுவது அன்றே வாழ்தல்
இனிதென மகிழ்ந்தன்றும் இலமே முனிவின்
இன்னாது என்றலும் இலமே மின்னொடு
வானம் தண்துளி தலைஇ யானாது
கல்பொருது இரங்கும் மல்லல் பேர்யாற்று
நீர்வழிப் படூஉம் புணைபோல் ஆருயிர்
முறைவழிப் படூஉம் என்பது திறவோர்
காட்சியின் தெளிந்தனம் ஆகலின் மாட்சி
எஞ்ஞான்றும் இகழ்ந்தனம் அன்றி
அகழ்வாரைத் தாங்கும் நிலம்போல்
தொல்லாண்மை மேற்கொண் டேம்.`,
        translation: `Every town is my own; every person is kin.
Good and evil come not from others — they are within.
Pain and its relief are like that too.
Death itself is nothing new.
We do not rejoice that life is sweet.
We do not complain that it is bitter.
Like a raft on a great roaring river
where lightning-rain falls and boulders thunder —
our precious lives move according to their nature.
This is what the clear-eyed know.
Therefore we have never chased greatness,
and we have not bowed to those who would destroy us.
Like the earth that bears even those who dig into it,
we have taken the old valor as our own.`,
        line_commentary: [
          { lines: "1–2", comment: "The cosmopolitan thesis stated as a simple fact, not an aspiration. Every town is already my own. This is not a goal to work toward — it is a perception of what is already true." },
          { lines: "3–4", comment: "The ethical consequence: if belonging is universal, then good and evil are internal matters, not things done to you by strangers. This removes the logic of tribalism at its root." },
          { lines: "5–6", comment: "Equanimity without stoic detachment. We do not perform happiness or unhappiness. We simply live without those performances." },
          { lines: "7–10", comment: "The great image: life as a raft on a flood-river. You cannot fight the current. You can only be clear-eyed about where the river goes. This is not fatalism — it is lucidity." },
          { lines: "11–14", comment: "The political conclusion. 'We have never chased greatness' — meaning: we have not competed for power. 'Like the earth that bears those who dig it' — we endure, with the patient strength of the ground itself. The 'old valor' (tol ānmai) is not martial valor — it is the valor of endurance and clarity." }
        ]
      },
      {
        number: "182",
        poet: "Avvaiyar",
        tinai: "Kāñci (impermanence)",
        grade: "TN Std. 11; UG",
        tamil: `ஆற்று இடைக் குறைந்த அம்பி போல
மாற்றரும் செல்வம் குன்றும் — ஒருவர்
தாற்றலும் தவிரார் — சான்றோர் சேர்ந்தோர்க்கு
இல்லது பகர்தல் வேண்டும்
உள்ளது காத்தல் தேற்றா தோரே.`,
        translation: `Like a boat that capsized midstream —
wealth that seemed permanent diminishes.
Those who have valor do not stop giving even then.
The wise give what they do not have to those who come to them.
Only those who do not know how to protect what they have fail.`,
        line_commentary: [
          { lines: "1–2", comment: "The boat image is precise: a boat that capsized in the middle of the river, not at the shore. Wealth fails at the moment of greatest security." },
          { lines: "3–5", comment: "Avvaiyar's ethics of generosity: the truly generous give even when they have nothing. This is not irrationality — it is the recognition that the habit of generosity must continue regardless of material circumstances, or it was never really generosity, only distribution of surplus." }
        ]
      },
      {
        number: "295",
        poet: "Poet to the Chera king Cheran Senguttuvan",
        tinai: "Pāṭāṇ (praise)",
        grade: "TN Std. 10",
        tamil: `ஒருவன் ஒரு பகல் உண்டு அமர்ந்தாள்
இருவர் கூடி இரவு உண்டாடல்
மூவர் முன்னர் ஊன் தின்றல் ஆடல்
நால்வர் நட்பு நடுவண் கேளிர்
இவரினும் சிறந்தோன் யாவனோ?`,
        translation: `One who eats alone by day and stays content —
Two who share food and pleasure through the night —
Three who together eat meat and celebrate —
Four friends in the center of a gathering —
Who among them is the greatest?`,
        line_commentary: [
          { lines: "1–5", comment: "A riddle-poem about social gradations of trust. The answer the context implies: the king who can be trusted by all four — alone, in pairs, in small groups, in large gatherings — is the greatest. It is a poem about political trust built through shared hospitality." }
        ]
      }
    ],

    greek_latin_compare: `The closest Greek equivalent is the Greek Anthology (Palatine Anthology) — a collection of epigrams across centuries by hundreds of named poets. Like Purananuru, it covers the full range of public and private life: love, war, death, philosophy, humor. But the Greek Anthology was compiled in the 10th century CE from texts going back to the 7th century BCE — it spans 1,700 years. Purananuru was compiled within a narrower window (roughly 200 BCE–300 CE) and is more thematically focused. Purananuru has no equivalent of Greek erotic epigram — that content is in the akam anthologies. And Purananuru has something the Greek Anthology does not: a unified ecological-aesthetic framework (the tinai system) that makes every poem part of a system, not just a collection.

The Latin equivalent might be Horace's Odes — public poetry addressing political realities through personal ethical reflection. But Horace writes as a single named poet with a consistent persona. Purananuru's 150 voices create something more like a civilization's conversation with itself.`,

    school_syllabus: [
      { grade: "Std. 9", content: "Purananuru 192 (Kaniyan Pungundranar) — full text and basic commentary" },
      { grade: "Std. 10", content: "Purananuru 182 (Avvaiyar) — generosity; selected praise poems" },
      { grade: "Std. 11", content: "Kañci poems on impermanence; political poems; Kapilar elegies for Pari" },
      { grade: "Std. 12", content: "The anthology as political document; war poetry in context" },
      { grade: "UG", content: "Full text reading; commentary traditions; social history from Purananuru" },
      { grade: "PG", content: "Critical edition; comparison with Akananuru and other puram texts; archaeological corroboration" },
    ],

    project_madurai: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0003.html",
    tamilvu: "https://www.tamilvu.org/courses/degree/p101/p1012/html/p1012ind.htm",
  },

  {
    slug: "thirukkural",
    title: "Thirukkural",
    tamil: "திருக்குறள்",
    author: "Thiruvalluvar",
    author_slug: "thiruvalluvar",
    period: "post-sangam",
    era_label: "Post-Sangam",
    dates: "~1st century CE (most accepted); range: 300 BCE–500 CE",
    form: "Didactic couplets (குறட்பா)",
    metre: "Kuṟaḷ veṇpā (குறள் வெண்பா) — two lines, 4+3 syllable feet",
    verses: "1,330 couplets in 133 chapters of 10 each",
    language: "Classical Tamil (often called the purest literary Tamil)",
    religion_context: "Contested: Jain ethics dominant in content; no sectarian deity named; universalist frame",

    overview: `Thirukkural is the most translated, most quoted, most politically weaponized text in Tamil history. It is also the most misunderstood — because every reader projects their own framework onto its carefully maintained neutrality. The text does not name a god. It does not name a caste. It does not name a king. It names ethics, statecraft, and love — and it treats all three with equal seriousness, equal compression, equal elegance. The kural metre (four syllable-feet in line one, three in line two) forces maximum compression. Every word is irreplaceable. The 10 major ancient commentators wrote thousands of pages explaining these 1,330 couplets — and they still disagree on what many of them mean.`,

    political_context: `Thirukkural emerged from the post-Sangam world — the period when the Kalabhras had disrupted traditional Tamil royal order, Jainism and Buddhism were the dominant intellectual forces, and the Sangam patronage system had broken down. The Kural's silence about kingship-by-dynasty and its focus on kingship-by-conduct is a response to this political moment: when traditional legitimacy collapses, conduct becomes the only legitimate basis for authority. Book II (Porul) — which is longer than Book I (Aram) and Book III (Inbam) combined — is a comprehensive political science manual. It covers the ideal minister, the ideal army, the ideal fortress, the ideal diplomatic strategy, the conditions for war and the conditions for peace. It is more practically useful than most political science written before Kautilya's Arthashastra — and less ruthless.`,

    structure: {
      overview: "Three books (பால் — Pāl), 133 chapters (அதிகாரம்), 1,330 couplets",
      books: [
        {
          name: "Aram (அறம்) — Book of Virtue",
          chapters: "1–38 (380 couplets)",
          content: `Personal ethics: the praise of God, rain (as the source of all life), the greatness of ascetics, domestic virtue, hospitality, speaking gently, gratitude, non-killing, not lying, refraining from anger, avoiding slander, refraining from evil. The domestic section (chapters 5–7) treats the householder's life as equally sacred to the ascetic's — a Jain-influenced departure from Brahminic hierarchy that placed the renunciant above the householder.`,
          key_chapter: "Chapter 26: Pulaanmaruththal (Not Eating Flesh) — the most politically controversial chapter in the Kural. Argues against meat-eating on compassion grounds, not ritual purity grounds. Ignored by mainstream Hindu readings; central to Jain and rationalist readings."
        },
        {
          name: "Porul (பொருள்) — Book of Wealth / Statecraft",
          chapters: "39–108 (700 couplets)",
          content: `Public life and governance: the qualities of a good king, the ideal minister, diplomatic strategy, the nature of friendship and enmity, how to know the right moment to act, the value of education, the nature of nobility, the dangers of sloth and addiction. The political theory is sophisticated and empirical — not based on divine right or Brahminic legitimacy, but on conduct, wisdom, and the genuine welfare of the people.`,
          key_chapter: "Chapter 44: Wisdom (அறிவுடைமை) — 'The wise learn from others' mistakes; fools learn only from their own.' This is a theory of political intelligence."
        },
        {
          name: "Inbam (இன்பம்) — Book of Love",
          chapters: "109–133 (250 couplets)",
          content: `Erotic love — spoken in the voice of the woman (following the akam convention) and the man. The sequence: the man sees the woman and is struck by desire; the woman is struck back; they meet; they are separated; she endures; he returns. The sequence maps exactly onto the tinai emotional arc. Thiruvalluvar uses the entire Sangam poetic apparatus — the akam conventions — to write love poetry that is technically within the Sangam tradition but philosophically stands alone.`,
          key_chapter: "Chapter 110: The Praise of Her Eyes — ten couplets in which the woman's eyes are the instrument of love's beginning. 'What she did with her eyes / a warrior's spear cannot do.' The erotic is treated as seriously as the ethical."
        }
      ]
    },

    what_it_says: `Thirukkural says that a complete human life has three domains — virtue, prosperity, and love — and that all three deserve equal intellectual attention and equal ethical seriousness. This is the classical Tamil view (the three aims: Aram, Porul, Inbam) without the fourth Sanskrit aim (Veedu/Moksha — liberation). Thiruvalluvar does not include liberation. The Kural is a text about how to live in this world well — not how to escape it.

The compression of the kural metre means that the text rewards re-reading indefinitely. A couplet read at age 12 means one thing; at 35, another; at 65, another. The great commentators understood this — Parimelazhagar's commentary runs to thousands of pages on 1,330 couplets, and it is not padding. Every word is contested.`,

    key_poems: [
      {
        number: "Kural 1",
        chapter: "Chapter 1: The Praise of God",
        grade: "TN Std. 6 onwards; every grade",
        tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு.",
        translation: "As 'A' is the first of all letters,\nso the Primal One is first in the world.",
        commentary: `The first word: 'Akara' (அகர) — the letter A. The Kural begins with language, not God. It begins with the system (the alphabet) and uses it to argue for a first principle (the Primal One). This is logic, not prayer. The 'Primal One' (Bhagavan — பகவன்) is unnamed — deliberately. No Shiva, no Vishnu, no specific theology. Just: something was first, as A is first. Commentators spent centuries filling in who that first being was. Thiruvalluvar left the space blank.`,
        political_note: `The blank space of the unnamed God in Kural 1 became the most fought-over theological space in Tamil intellectual history. The rationalist movement (Periyar) said: the blank space proves there is no God here. The Shaiva tradition said: the blank space is Shiva, unnamed because he is beyond names. The Jain tradition said: it is the tirthankara. The Christian missionaries of the 19th century said: it is God the Father. Each reading tells us more about the reader than the text.`
      },
      {
        number: "Kural 241",
        chapter: "Chapter 25: Compassion (அருளினமை)",
        grade: "TN Std. 10, 11",
        tamil: "அருட்செல்வம் செல்வத்துள் செல்வம் — பொருட்செல்வம்\nபண்பிலார் கண்ணும் உள.",
        translation: "Among all wealth, compassion-wealth is the highest wealth.\nMaterial wealth exists even among the ignoble.",
        commentary: `The argument is simple and devastating: material wealth is not a mark of character — even bad people can have it. Compassion is the only wealth that requires character to possess. This is an anti-aristocratic argument: birth-wealth, land-wealth, trade-wealth — all of these can be inherited or seized. Compassion cannot. This single couplet demolishes the logic of caste-based aristocracy more thoroughly than any polemic.`,
        political_note: `This chapter (25) and the following chapter (26, on not eating flesh) together constitute the Kural's clearest Jain-ethical statement. They were de-emphasized in mainstream Tamil education under Brahminic influence and re-emphasized by the Dravidian movement in the 20th century.`
      },
      {
        number: "Kural 380",
        chapter: "Chapter 38: Renunciation (துறவு)",
        grade: "TN Std. 12; UG",
        tamil: "யான் எனது என்னும் செருக்கு அறுப்பான்\nவானோர்க்கு உயர்ந்த உலகம் புகும்.",
        translation: "One who cuts off the pride of 'I' and 'mine'\nenters a world higher than the gods.",
        commentary: `The last chapter of Book I. The entire first book moves from personal ethics to domestic life to renunciation — and the culmination is not Brahminic ritual purity or caste obligation, but the dissolution of ego. 'I' and 'mine' — these two words are the source of all suffering in both Buddhist and Jain ethics. Thiruvalluvar places this dissolution above even the gods. The one who loses the self goes somewhere the gods have not been. This is radical theology — it makes liberation (moksha) accessible through ego-dissolution, not ritual, not birth, not caste.`,
        political_note: `Kural 380 ends Book I. Thiruvalluvar begins Book II (Porul/Statecraft) immediately with Kural 381 on the qualities of a good king. The transition is deliberate: the person who has renounced 'I' and 'mine' is now ready to govern. Good governance requires the absence of ego. This is the most anti-autocratic principle in the entire text.`
      },
      {
        number: "Kural 544",
        chapter: "Chapter 55: Justice (ஒற்றாண்மை)",
        grade: "TN Std. 11",
        tamil: "கண்ணின்று கண்ணறச் செய்யும் — கொலைவல்லான்\nகோல்போல் தொழுதுவிடும்.",
        translation: "The king's scepter is like a spear in the hands of an executioner —\nit destroys the eye that should have protected.",
        commentary: `One of the most direct political couplets in the entire Kural. A king who uses his power (the scepter/kol) to destroy his own people is using a protective instrument as a weapon. The image is viscerally specific: an eye destroying itself. This couplet is the abstract principle behind Silappadikaram's story — the Pandya king who had Kovalan executed without proper investigation was using his scepter in exactly this way.`,
        political_note: `The Porul sections on governance are closer to Kautilya's Arthashastra than to any Indian devotional text. But where Kautilya is willing to sanction deception, cruelty, and manipulation in the service of state power, Thiruvalluvar is not. The Kural is an ethics-first political theory: statecraft that violates ethics is not statecraft, it is destruction.`
      },
      {
        number: "Kural 1080",
        chapter: "Chapter 108: Hatred of the Beloved (வரைவு மறுத்தல்)",
        grade: "TN Std. 12; UG",
        tamil: "நலத்தகை நல்லவர் என்பர் — அவருள்\nகலத்தகை யாரோடும் இல்.",
        translation: "They call her 'the good one with good qualities' —\nbut among those who call her so, none is her equal.",
        commentary: `This is from Book III (Inbam — Love), spoken about the woman by a narrator who has seen her. The couplet is in the voice of someone observing: everyone praises her, but none of them deserve her. This is erotic praise that simultaneously critiques the social convention of male praise of women — the praise is accurate but the praisers are unworthy. A subtle feminist irony embedded in a love poem.`,
        political_note: `Book III of the Kural has historically received less scholarly and educational attention than Books I and II. It was considered embarrassing by later Brahminic commentators — the explicit eroticism was incompatible with the image of Thiruvalluvar as a pure moral sage. The Dravidian movement rehabilitated it; contemporary scholars treat it as an equal part of the whole.`
      }
    ],

    greek_latin_compare: `The closest Western parallel is not one text — it is three: Aristotle's Nicomachean Ethics (personal virtue), Aristotle's Politics (governance), and Ovid's Ars Amatoria (love). Together, these three texts cover what the Kural covers in 1,330 couplets. The three Aristotle-Ovid texts run to hundreds of pages. Thiruvalluvar does it in one book, in couplets, each of which can be memorized.

Seneca's moral letters (Epistulae Morales) are perhaps the closest in spirit — personal ethics written for practical use, not academic debate. Marcus Aurelius's Meditations (180 CE) are the closest in tone — stoic, compressed, written without an audience. But neither Seneca nor Marcus Aurelius wrote about statecraft and love with equal seriousness. Thiruvalluvar did. And he did it in a language that is still spoken.`,

    school_syllabus: [
      { grade: "Std. 6", content: "Selected kurals from Aram: Kural 1, 2; gratitude; truth" },
      { grade: "Std. 7", content: "Hospitality (chapters 8–9); not lying; domestic virtue" },
      { grade: "Std. 8", content: "Education (chapters 39–40); compassion; anger management" },
      { grade: "Std. 9", content: "Porul — governance basics; knowing the right moment; friendship" },
      { grade: "Std. 10", content: "Full Aram chapters on compassion and non-killing; selected Porul" },
      { grade: "Std. 11", content: "Political theory chapters (50–60); Inbam overview" },
      { grade: "Std. 12", content: "Kural as literary masterpiece; metre; commentators compared" },
      { grade: "UG", content: "Full text; 10 commentators compared; Jain vs Hindu vs secular readings" },
      { grade: "PG", content: "Critical edition; dating; translation history (80+ languages); political reception" },
    ],

    project_madurai: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0025.html",
    tamilvu: "https://www.tamilvu.org/courses/degree/p101/p1014/html/p1014ind.htm",
  },

  {
    slug: "silappadikaram",
    title: "Silappadikaram",
    tamil: "சிலப்பதிகாரம்",
    author: "Ilango Adigal",
    author_slug: "ilango-adigal",
    period: "post-sangam",
    era_label: "Post-Sangam / Kalabhra Period",
    dates: "~2nd–5th century CE (debated; traditional: 2nd century CE)",
    form: "Epic (காப்பியம்)",
    metre: "Akaval (ஆசிரியப்பா) with prose passages; mixed lyrical forms (koothu songs)",
    verses: "~5,730 verses across 30 cantos; plus prose sections",
    language: "Classical Tamil with traces of later linguistic layers",
    religion_context: "Multi-religious: Jain authorship claimed; Buddhist, Shaiva, Vaishnava, and folk religion all represented; cosmic justice framework rather than sectarian theology",

    overview: `Silappadikaram — The Tale of the Anklet — is the first great narrative in Tamil literature, and it remains the most structurally ambitious work in the entire classical canon. It is three things at once: a love story that ends in catastrophe; a sociological document of extraordinary precision describing three Tamil cities in the first centuries CE; and a theological statement about the relationship between justice, dharma, and divine power. The anklet of the title — Kannagi's golden anklet, which proves her husband's innocence after he has been executed — is the instrument through which private grief becomes public judgment and a woman becomes a goddess.`,

    political_context: `Silappadikaram is set in the era of the three Tamil kingdoms at their height — Chola, Pandya, and Chera — with the Chola port city of Puhar (Kaveripattinam) as the opening location. The Roman trade that made Puhar wealthy is in the text: the poem mentions Yavana (Greek/Roman) merchants, their ships, their goods. This is not decoration — it is the material world the poem inhabits.

The central political act of the poem is the Pandya king's failure to follow due process in Kovalan's execution. He acts on the word of a goldsmith without investigation. This is not presented as the act of an evil king — it is the act of a careless king, a king who trusted his officials and did not check. Ilango's judgment is severe: carelessness by the powerful has the same consequences as deliberate cruelty. Madurai burns. The king dies of remorse. The queen dies beside him.

The Chera section (Book III) adds another political layer: King Senguttuvan travels to the Himalayas to bring back a stone for a Kannagi shrine — a journey that involves battles with northern kings. Ilango uses this to make a Tamil civilizational claim: the Tamil king, to honor a Tamil woman's justice, goes to the Himalayas and defeats the northern kings. Tamil moral order corrects northern political disorder.`,

    structure: {
      overview: "Three books (காண்டம் — Kāṇdam) following the epic's three cities",
      books: [
        {
          name: "Puhar Kandam (புகார் காண்டம்) — The Puhar Book",
          cantos: "1–10",
          content: `Puhar (Kaveripattinam) — the great Chola port. Kovalan and Kannagi's happy married life. Kovalan's infatuation with the dancer Madhavi. The birth of their daughter Manimekalai (from Madhavi). Kovalan's return to Kannagi. Their decision to travel to Madurai. The city descriptions: the harbor, the festivals, the castes and guilds, the foreign merchants. The most detailed urban portrait in early Tamil literature.`
        },
        {
          name: "Madurai Kandam (மதுரைக் காண்டம்) — The Madurai Book",
          cantos: "11–22",
          content: `Madurai — the Pandya capital. Kovalan attempts to sell Kannagi's golden anklet. The royal goldsmith falsely accuses him of stealing the queen's anklet. The Pandya king sentences Kovalan to death without investigation. He is executed. Kannagi arrives at the execution ground, learns the truth, and goes to the king's court with the remaining anklet. She opens it — it contains rubies, not pearls (the queen's anklet had pearls). The king realizes his error. He dies of shame. The queen dies beside him. Kannagi tears off her left breast and throws it at the city. Madurai burns for 14 days. The fire goddess appears and explains what has happened. A divine voice tells Kannagi she will join her husband in 14 days.`
        },
        {
          name: "Vanji Kandam (வஞ்சி காண்டம்) — The Vanji Book",
          cantos: "23–30",
          content: `Vanji — the Chera capital. Kannagi's journey to the Chera country after Madurai burns. She meets a shepherd woman, Kavunti Adigal, and they travel together. Kannagi is received by the Chera king Senguttuvan. She becomes divine — a goddess. Senguttuvan builds her a shrine. He travels to the Himalayas for the shrine stone, defeating northern kings. The epic closes with Senguttuvan's victory and the consecration of the Kannagi shrine.`
        }
      ]
    },

    what_it_says: `Silappadikaram says several things simultaneously, which is why it has been read in so many different ways:

1. **About women:** Kannagi is not passive. She investigates. She argues. She proves. She destroys. She becomes divine not because she is meek but because she is right and she acts on it. The anklet is not a symbol of marriage — it is a instrument of evidence. Kannagi is Tamil literature's first detective.

2. **About the state:** A king who executes without investigation has forfeited his sacred protection. The city of Madurai — not just the king, but the whole city — burns because one king was careless. This is a theory of collective responsibility for state action.

3. **About religion:** Every major religion of the post-Sangam world appears in Silappadikaram without any being privileged. Jain ascetics, Buddhist monks, Brahmin priests, Shaiva devotees, Vaishnava traditions, and folk goddess worship all exist in the same world. The cosmic justice that operates through Kannagi is not the justice of any single deity — it is the justice of dharma itself, which transcends sectarian boundaries.

4. **About cities:** Puhar, Madurai, and Vanji are described with the detail of a sociologist's field report. We know what the streets look like, what guilds exist, what festivals are celebrated, who the foreign merchants are, how the harbor is organized. Silappadikaram is archaeology before archaeology existed.`,

    key_poems: [
      {
        number: "Canto 14: Kovalan's Execution (Katturai Kaathai)",
        grade: "TN Std. 11, 12; UG",
        tamil: `அரசன் ஆணை வழி நிற்பார்
பிழைத்தோர்க்கு உரிய தண்டம் இடுவார்
குற்றம் காணாத நீதி யில்லோர்
கோல் கோடியவர் — தண்டனை தப்பாமல்
நிறைந்தார்க்கு நிறைந்த தண்டம் பெறுவார்...`,
        translation: `Those who stand under the king's command
give punishment to those who have erred.
Those without justice who cannot see the crime —
those whose scepter bends —
will themselves receive full punishment in full measure...`,
        commentary: `This passage comes from the section describing the legal proceedings around Kovalan's execution. Ilango is explicit about what went wrong: the king's officials carried out the execution without properly investigating the accusation. The phrase 'kol kodiya var' (கோல் கோடியவர் — those whose scepter bends) directly invokes the Thirukkural image of the bent scepter as a sign of corrupted justice. Ilango knew Thiruvalluvar.`,
        political_note: `The execution of Kovalan is the pivot of the entire epic. The question Ilango raises — and does not answer — is whether the goldsmith's lie makes him the primary villain, or the king's carelessness makes him the primary failure. The text suggests both are true, but the consequence falls on the city: Madurai burns for the king's failure, not the goldsmith's malice. Power carries responsibility; malice without power cannot destroy a city. Power without justice can.`
      },
      {
        number: "Canto 16: Kannagi's Accusation (Vazhakkurai Kaathai)",
        grade: "TN Std. 11, 12; UG; PG",
        tamil: `நாடா காவலன் நாடு கெடுதலும்
கோடா வேந்தன் குடிக்கொன்றோனும்
தீதுசெய் கோலன் தென்னவன் தேவி!
யாது செய்கேன் யான் என் கணவனுக்கே?
பொய்யாக் கோலம் சான்றா தாகும் — என்
கணவன் தன்னோடு கடவுளும் கோபம்`,
        translation: `"A king who does not protect destroys his own kingdom.
A king who bends his scepter kills his own people.
The king of the south is such a king of crooked justice, O Queen!
What can I do for my husband now?
A scepter that bends cannot last — 
the god himself is angry alongside my husband."`,
        commentary: `The most extraordinary political speech in classical Tamil literature. Kannagi is in the Pandya king's court, addressing the queen, in the presence of the king who has just killed her husband. She speaks not in grief but in constitutional argument: she cites the principles of just kingship and proves the king violated them. The two lines — 'A king who does not protect destroys his own kingdom / A king who bends his scepter kills his own people' — are the clearest statement of the Tamil theory of conditional kingship: royal power is contingent on just conduct. Kingship is not absolute.`,
        political_note: `This speech was used by Tamil nationalist politicians in Sri Lanka in the 20th century to articulate the claim that a state that does not protect its citizens loses legitimacy. The speech was composed in the 2nd century CE. It became a political weapon 1,800 years later.`
      }
    ],

    greek_latin_compare: `Silappadikaram is most naturally compared to the Oresteia of Aeschylus (458 BCE) — both are about a woman whose husband is unjustly killed, who demands justice from a system that fails her, and whose action precipitates divine intervention. In the Oresteia, Clytemnestra kills Agamemnon (different scenario — but the theme of private grief intersecting with public justice is the same). The key difference: in Aeschylus, justice is ultimately institutionalized — the Areopagus court is established. In Silappadikaram, justice operates through divine fire, not institutional reform. The city burns; there is no new institution afterward. This is a different theory of justice: it is cosmic, not institutional.

With Vergil's Aeneid (19 BCE): both are epics of displacement, city-founding, and divine will. Aeneas moves from Troy to Rome; Senguttuvan builds a shrine for Kannagi. Both texts make a civilizational claim through narrative. But Silappadikaram's central figure is a woman — not a warrior-king.`,

    school_syllabus: [
      { grade: "Std. 9", content: "Overview: story, structure, three cities" },
      { grade: "Std. 10", content: "Puhar description; Kovalan-Kannagi story" },
      { grade: "Std. 11", content: "Madurai book — execution, Kannagi's accusation, burning of Madurai" },
      { grade: "Std. 12", content: "Silappadikaram as social document; music and dance theory in the text" },
      { grade: "UG", content: "Full text; commentary tradition; archaeological evidence for the cities" },
      { grade: "PG", content: "Feminist readings; political theory; Silappadikaram and Manimekalai as paired texts" },
    ],

    project_madurai: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0018.html",
    tamilvu: "https://www.tamilvu.org/courses/degree/p201/p2011/html/p2011ind.htm",
  },
];

export function getWorkBySlug(slug) {
  return works.find(w => w.slug === slug);
}

export function getWorksByPeriod(period) {
  return works.filter(w => w.period === period);
}

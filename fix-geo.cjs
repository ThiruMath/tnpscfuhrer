const fs = require('fs');

const file = './public/data/vle-downloads.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Remove the corrupted last 13 items
data = data.filter(item => !item.id.startsWith('vle-geo-'));

const newFiles = [
  { title: "ஆற்றல் வளங்கள்", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%86%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AE%B2%E0%AF%8D%20%E0%AE%B5%E0%AE%B3%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D_1st_chapter.pdf" },
  { title: "இயற்கைத் தாவரச் செறிவு", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%87%E0%AE%AF%E0%AE%B1%E0%AF%8D%E0%AE%95%E0%AF%88%E0%AE%A4%E0%AF%8D%20%E0%AE%A4%E0%AE%BE%E0%AE%B5%E0%AE%B0%E0%AE%9A%E0%AF%8D%20%E0%AE%9A%E0%AF%86%E0%AE%B1%E0%AE%BF%E0%AE%B5%E0%AF%81_1st_chapter.pdf" },
  { title: "கனிமங்கள்", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%95%E0%AE%A9%E0%AE%BF%E0%AE%AE%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D_1st_chapter.pdf" },
  { title: "காலநிலை", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%95%E0%AE%BE%E0%AE%B2%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AF%88_1st_chapter.pdf" },
  { title: "சுற்றுச்சூழல்", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%9A%E0%AF%81%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AF%82%E0%AE%B4%E0%AE%B2%E0%AF%8D_1st_chapter.pdf" },
  { title: "தொழிற்சாலைகள்", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%A4%E0%AF%8A%E0%AE%B4%E0%AE%BF%E0%AE%B1%E0%AF%8D%E0%AE%9A%E0%AE%BE%E0%AE%B2%E0%AF%88%E0%AE%95%E0%AE%B3%E0%AF%8D_1st_chapter.pdf" },
  { title: "நிலையான வளர்ச்சி", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AF%88%E0%AE%AF%E0%AE%BE%E0%AE%A9%20%E0%AE%B5%E0%AE%B3%E0%AE%B0%E0%AF%8D%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AE%BF_1st_chapter.pdf" },
  { title: "பல்லுயிர் மற்றும் பாதுகாப்பு", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%AA%E0%AE%B2%E0%AF%8D%E0%AE%B2%E0%AF%81%E0%AE%AF%E0%AE%BF%E0%AE%B0%E0%AF%8D%20%E0%AE%AE%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%AE%E0%AF%8D%20%E0%AE%AA%E0%AE%BE%E0%AE%A4%E0%AF%81%E0%AE%95%E0%AE%BE%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AF%81_1st_chapter.pdf" },
  { title: "புவியியல் அமைவிடம் - புறநிலைப் பிரிவுகள் - ஆறுகளின் அமைப்பு", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%AA%E0%AF%81%E0%AE%B5%E0%AE%BF%E0%AE%AF%E0%AE%BF%E0%AE%AF%E0%AE%B2%E0%AF%8D%20%E0%AE%85%E0%AE%AE%E0%AF%88%E0%AE%B5%E0%AE%BF%E0%AE%9F%E0%AE%AE%E0%AF%8D%20-%20%E0%AE%AA%E0%AF%81%E0%AE%B1%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AF%88%E0%AE%AA%E0%AF%8D%20%E0%AE%AA%E0%AE%BF%E0%AE%B0%E0%AE%BF%E0%AE%B5%E0%AF%81%E0%AE%95%E0%AE%B3%E0%AF%8D%20-%20%E0%AE%86%E0%AE%B1%E0%AF%81%E0%AE%95%E0%AE%B3%E0%AE%BF%E0%AE%A9%E0%AF%8D%20%E0%AE%85%E0%AE%AE%E0%AF%88%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AF%81_1st_chapter.pdf" },
  { title: "பேரிடர் மேலாண்மை", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%AA%E0%AF%87%E0%AE%B0%E0%AE%BF%E0%AE%9F%E0%AE%B0%E0%AF%8D%20%E0%AE%AE%E0%AF%87%E0%AE%B2%E0%AE%BE%E0%AE%A3%E0%AF%8D%E0%AE%AE%E0%AF%88_1st_chapter.pdf" },
  { title: "போக்குவரத்து", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%AA%E0%AF%8B%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%81%E0%AE%B5%E0%AE%B0%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AF%81_1st_chapter.pdf" },
  { title: "மண்", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%AE%E0%AE%A3%E0%AF%8D_1st_chapter.pdf" },
  { title: "வேளாண்மை மற்றும் கால்நடைகள்", url: "https://files.tnpscfuhrer.in/New%20folder/Geography%20of%20India%20(5%20Questions)/%E0%AE%B5%E0%AF%87%E0%AE%B3%E0%AE%BE%E0%AE%A3%E0%AF%8D%E0%AE%AE%E0%AF%88%20%E0%AE%AE%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%AE%E0%AF%8D%20%E0%AE%95%E0%AE%BE%E0%AE%B2%E0%AF%8D%E0%AE%A8%E0%AE%9F%E0%AF%88%E0%AE%95%E0%AE%B3%E0%AF%8D_1st_chapter.pdf" }
];

let idCounter = 1;
for (const item of newFiles) {
  data.push({
    id: 'vle-geo-' + idCounter,
    unit: 'Unit III - Geography of India',
    title: item.title,
    subject: 'Geography',
    exam: 'Group I/II - Prelims',
    size: 'PDF',
    url: item.url
  });
  idCounter++;
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');

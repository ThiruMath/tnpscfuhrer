const fs = require('fs');
const s = JSON.parse(fs.readFileSync('public/data/syllabus.json', 'utf8'));
let err = 0;
const paths = new Set();
const duplicates = new Set();

Object.keys(s).forEach(e => {
  Object.keys(s[e]).forEach(sub => {
    s[e][sub].forEach(k => {
      if(typeof k==='string' && k.trim()) {
        let slug = k.trim().toLowerCase().replace(/\s+/g, '-').replace(/[#?/\\%&]/g, '');
        if(!slug || slug.includes('/') || slug.includes('.')) {
          console.log('BAD SLUG:', k, '->', slug);
          err++;
        }
        if (paths.has(slug)) {
          console.log('DUPLICATE SLUG:', slug);
          duplicates.add(slug);
        }
        paths.add(slug);
      }
    });
  });
});
console.log('Total paths:', paths.size);
console.log('Total errors:', err);
console.log('Total duplicates:', duplicates.size);

import fs from 'fs';
import path from 'path';

const dir = 'transcripts';
const files = fs.readdirSync(dir);
console.log(files);
files.forEach((file) => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath);
    const json = JSON.parse(raw);
    const transcript = json.text;
    const output = path.join('transcripts-txt', `${path.basename(file, '.json')}.txt`);
    fs.writeFileSync(output, transcript);
    console.log(`Processed and saved: ${output}`);
  }
});

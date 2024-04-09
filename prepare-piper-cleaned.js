import { execSync } from 'child_process';
import fs from 'fs';

// first convert all videos to wav
// const videos = fs.readdirSync('videos');
// for (let video of videos) {
//   // check that video has .mp4 extension
//   if (!video.endsWith('.mp4')) continue;
//   console.log('Converting: ', video);
//   let regex = /\[([^\[\]]+)\]\.mp4/;
//   let id = regex.exec(video)[1];
//   console.log('Found id: ', id);
//   videoToWav(`videos/${video}`, `dataset5/extracted/${id}.wav`);
// }

const raw = fs.readFileSync('cleaned_segments-250ms.json', 'utf-8');
const json = JSON.parse(raw);

let counter = 0;
let output = '';

for (let chunk of json) {
  let { timestamp, text, video_id } = chunk;
  const audioPath = `dataset5/extracted/${video_id}.wav`;
  const start = timestamp[0] - 0.05;
  const end = timestamp[1] + 0.15;
  sliceAudio(audioPath, start, end, `dataset6/wavs/${counter}.wav`);
  output += `wavs/${counter}.wav|${text}\n`;
  counter++;
}

fs.writeFileSync(`dataset6/metadata.csv`, output);

function videoToWav(videoPath, audioPath) {
  const cmd = `ffmpeg -i "${videoPath}" -acodec pcm_s16le -ar 22050 -ac 1 "${audioPath}"`;
  execSync(cmd);
}

function sliceAudio(audioPath, start, end, segmentPath) {
  const cmd = `ffmpeg -i "${audioPath}" -ss ${start} -to ${end} -c copy "${segmentPath}"`;
  execSync(cmd);
}

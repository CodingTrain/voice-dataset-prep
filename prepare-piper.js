import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import pkg from 'webvtt-parser';
const { WebVTTParser } = pkg;

const videos = ['file1', 'file2'];

let counter = 0;
let output = '';

for (let video of videos) {
  processVideo(`videos/${video}.mp4`, `videos/${video}.en.vtt`, 'dataset2');
}

writeFileSync(`dataset2/metadata.csv`, output);

function processVideo(videoPath, vttPath, outputPath) {
  const audioPath = `${outputPath}/extracted_audio-${counter}.wav`;
  videoToWav(videoPath, audioPath);

  const vttData = readFileSync(vttPath, 'utf-8');
  const parser = new WebVTTParser();
  const tree = parser.parse(vttData, 'metadata');

  for (let cue of tree.cues) {
    sliceAudio(audioPath, cue.startTime, cue.endTime, `${outputPath}/wavs/${counter}.wav`);
    let txt = cue.text.replace(/\n+/g, ' ');
    txt = txt.replace(/(\&nbsp;)+\s*/g, ' ');
    output += `wavs/${counter}.wav|${txt}\n`;
    counter++;
  }
}

function videoToWav(videoPath, audioPath) {
  const cmd = `ffmpeg -i "${videoPath}" -acodec pcm_s16le -ar 22050 -ac 1 "${audioPath}"`;
  execSync(cmd);
}

function sliceAudio(audioPath, start, end, segmentPath) {
  const cmd = `ffmpeg -i "${audioPath}" -ss ${start} -to ${end} -c copy "${segmentPath}"`;
  execSync(cmd);
}

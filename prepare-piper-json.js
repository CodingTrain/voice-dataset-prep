import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import pkg from 'webvtt-parser';
const { WebVTTParser } = pkg;
import fs from 'fs';

const videos = ['file1', 'file2'];

let counter = 0;
let output = '';

for (let video of videos) {
  processVideo(`videos/${video}.mp4`, 'dataset3');
}

writeFileSync(`dataset3/metadata.csv`, output);

function processVideo(videoPath, outputPath) {
  let regex = /\[(.*?)\]/;
  let id = regex.exec(videoPath)[1];
  let raw = fs.readFileSync(`transcripts/${id}.json`, 'utf-8');
  let json = JSON.parse(raw);

  const audioPath = `${outputPath}/extracted_audio-${counter}.wav`;
  videoToWav(videoPath, audioPath);

  for (let i = 0; i < json.chunks.length; i++) {
    let chunk = json.chunks[i];
    sliceAudio(audioPath, chunk.timestamp[0], chunk.timestamp[1], `${outputPath}/wavs/${counter}.wav`);
    output += `wavs/${counter}.wav|${chunk.text}\n`;
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

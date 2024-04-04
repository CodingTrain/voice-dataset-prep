import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import pkg from 'webvtt-parser';
const { WebVTTParser } = pkg;

const video = 'videos/file.mp4';
const vtt = 'videos/file.en.vtt';
const output = 'dataset';

processVideo(video, vtt, output);

function videoToWav(videoPath, audioPath) {
  const cmd = `ffmpeg -i "${videoPath}" -acodec pcm_s16le -ar 22050 -ac 1 "${audioPath}"`;
  execSync(cmd);
}

function sliceAudio(audioPath, start, end, segmentPath) {
  const cmd = `ffmpeg -i "${audioPath}" -ss ${start} -to ${end} -c copy "${segmentPath}"`;
  execSync(cmd);
}

function processVideo(videoPath, vttPath, outputPath) {
  const audioPath = `${outputPath}/extracted_audio.wav`;
  videoToWav(videoPath, audioPath);

  const vttData = readFileSync(vttPath, 'utf-8');
  const parser = new WebVTTParser();
  const tree = parser.parse(vttData, 'metadata');

  let counter = 0;
  let output = '';
  for (let cue of tree.cues) {
    sliceAudio(audioPath, cue.startTime, cue.endTime, `${outputPath}/wav/${counter}.wav`);
    let txt = cue.text.replace(/\n+/g, ' ');
    txt = txt.replace(/(\&nbsp;)+\s*/g, ' ');
    output += `${counter}|${txt}\n`;
    counter++;
  }
  writeFileSync(`${outputPath}/metadata.csv`, output);
}

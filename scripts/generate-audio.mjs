import fs from "fs";
import path from "path";

function generateSpeechWav(durationSeconds, isPaced) {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  const baseFreq = isPaced ? 130 : 160;
  const syllableRate = isPaced ? 4.2 : 6.2;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sentencePhase = (t % (isPaced ? 6.5 : 4.5)) / (isPaced ? 6.5 : 4.5);
    const inPause = isPaced ? sentencePhase > 0.82 : sentencePhase > 0.96;

    let sampleVal = 0;
    if (!inPause) {
      const syllMod = Math.max(0, Math.sin(2 * Math.PI * syllableRate * t));
      const pitchInflection = Math.sin(2 * Math.PI * 0.4 * t) * 15;
      const f0 = baseFreq + pitchInflection;

      const h1 = Math.sin(2 * Math.PI * f0 * t);
      const h2 = 0.5 * Math.sin(2 * Math.PI * (f0 * 2) * t);
      const h3 = 0.25 * Math.sin(2 * Math.PI * (f0 * 3) * t);
      const formant = 0.2 * Math.sin(2 * Math.PI * 1200 * t);

      const raw = (h1 + h2 + h3 + formant) * syllMod;
      sampleVal = Math.floor(raw * 8000);
      sampleVal = Math.max(-32767, Math.min(32767, sampleVal));
    }

    buffer.writeInt16LE(sampleVal, offset);
    offset += 2;
  }

  return buffer;
}

const samples = [
  { name: "ideal-rag.wav", duration: 80, isPaced: true },
  { name: "flawed-rag.wav", duration: 75, isPaced: false },
  { name: "ideal-pitch.wav", duration: 70, isPaced: true },
  { name: "flawed-pitch.wav", duration: 65, isPaced: false },
  { name: "ideal-distributed.wav", duration: 85, isPaced: true },
  { name: "flawed-distributed.wav", duration: 70, isPaced: false },
];

const outDir = path.join(process.cwd(), "public", "samples");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

samples.forEach((sample) => {
  const buf = generateSpeechWav(sample.duration, sample.isPaced);
  const outPath = path.join(outDir, sample.name);
  fs.writeFileSync(outPath, buf);
  console.log(`Generated ${sample.name} (${sample.duration}s, ${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
});
console.log("All sample audio files generated successfully.");

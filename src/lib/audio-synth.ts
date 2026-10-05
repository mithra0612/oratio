/**
 * Generates a valid RIFF WAV audio buffer with realistic speech-like prosody,
 * syllabic modulations, and natural pauses.
 */
export function generateSpeechWavBuffer(
  durationSeconds: number = 60,
  sampleRate: number = 22050,
  isPaced: boolean = true
): Buffer {
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
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Synthesize speech-like acoustic signal
  let offset = 44;
  const baseFreq = isPaced ? 130 : 155; // Pitch in Hz
  const syllableRate = isPaced ? 4.2 : 6.0; // Syllables per second

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Macro phrasing (sentences with natural pauses)
    const sentencePhase = (t % (isPaced ? 6.5 : 4.5)) / (isPaced ? 6.5 : 4.5);
    const inPause = isPaced ? sentencePhase > 0.82 : sentencePhase > 0.95;

    let sampleVal = 0;
    if (!inPause) {
      // Syllabic envelope modulation (vocal pulses)
      const syllMod = Math.max(0, Math.sin(2 * Math.PI * syllableRate * t));
      
      // Pitch inflection
      const pitchInflection = Math.sin(2 * Math.PI * 0.4 * t) * 15;
      const f0 = baseFreq + pitchInflection;

      // Harmonic formant synthesizers
      const h1 = Math.sin(2 * Math.PI * f0 * t);
      const h2 = 0.5 * Math.sin(2 * Math.PI * (f0 * 2) * t);
      const h3 = 0.25 * Math.sin(2 * Math.PI * (f0 * 3) * t);
      const formant = 0.2 * Math.sin(2 * Math.PI * 1200 * t); // vocal tract resonance

      const raw = (h1 + h2 + h3 + formant) * syllMod;
      // Scale to 16-bit integer
      sampleVal = Math.floor(raw * 8500);
      sampleVal = Math.max(-32767, Math.min(32767, sampleVal));
    }

    buffer.writeInt16LE(sampleVal, offset);
    offset += 2;
  }

  return buffer;
}

# ORATOR
### Multimodal Speech Intelligence & Temporal Evaluation Platform

> **Hackathon Track C**: Contrastive Speech Analytics & Temporal Flaw Grounding  
> **Challenge**: Develop a speech evaluation system by constructing a custom contrastive dataset of "ideal" vs. "flawed" speeches, generating reproducible custom evaluative rubric-based scores and actionable delivery feedback via an interactive analytical dashboard.

---

## 1. Product Overview

**ORATOR** is an empirical speech intelligence and temporal flaw grounding workstation. Rather than relying on unstructured, non-reproducible LLM prompts, ORATOR analyzes communication through multi-modal acoustic, temporal, linguistic, and structural telemetry.

Every detected speech delivery flaw (pace spikes, filler clusters, unintentional dead air pauses, weak transitions, imprecise nomenclature) is grounded with exact timestamps, acoustic signal evidence, and actionable rehearsal drills.

---

## 2. Core Capabilities & Architectural Pillars

- **Reproducible Rubric Scoring Engine**:
  - Calibrated across six core communication dimensions:
    - **Delivery** (20% default weight): WPM bounds, cadence stability, pause quality.
    - **Clarity** (20% default weight): Filler density (<2.0% ideal), absence of colloquial verbal crutches.
    - **Structure** (20% default weight): Explicit transitional signposting, distinct thesis, and conclusion.
    - **Content** (15% default weight): Empirical citations, numerical grounding, informational density.
    - **Fluency** (15% default weight): Absence of cognitive hesitations or awkward dead air (>2.5s).
    - **Engagement** (10% default weight): Dynamic prosodic inflections and conversational vocal energy.
  - Weights are fully configurable via the `/settings` interface.
  - Every score retains deterministic signal evidence, detected issues, explanations, and concrete recommendations.

- **Contrastive Speech Lab**:
  - Side-by-side comparative analysis between paired **IDEAL** and **FLAWED** speech archetypes.
  - Direct quantitative deltas: Words Per Minute (WPM), Filler Density (%), Pause Consistency, Delivery Stability, Clarity, and Structure.
  - Auto-generated **Detected Contrast** observations (e.g. "+33% pace acceleration", "+6.6% filler surge").

- **Temporal Flaw Grounding & WaveSurfer Audio Experience**:
  - Interactive multi-track timeline visualizing pacing curves, flaw intervals, and structural sections.
  - Built with **WaveSurfer.js** rendering real audio waveforms from synthesized multi-tone prosodic WAV recordings.
  - Scrubbing and marker interaction: clicking any flaw jumps playback to the timestamp and highlights the synchronized transcript segment.

- **Synchronized Interactive Transcript**:
  - Time-aligned segments displaying inline grounded flaw badges with signal evidence and recommendations.
  - Click-to-seek audio navigation.

- **Speaker Intelligence & Longitudinal Trajectory**:
  - Profiles for multiple speakers (*Dr. Elena Vance*, *Marcus Chen*).
  - Score progression tracking across historical sessions (e.g. 64 &rarr; 69 &rarr; 74 &rarr; 81).
  - Automatically derived **Persistent Patterns** (e.g. *Pace tends to accelerate during technical architecture descriptions*).

- **AI Speech Coach**:
  - Diagnostic coaching engine grounded in stored speech evidence and timestamps.
  - Addresses specific queries (*"Where did I speak too quickly?"*, *"What was my biggest weakness?"*, *"What should I practice?"*).
  - Autonomous local fallback engine ensures 100% operation without API keys.

- **Autonomous Demo Mode (Mandatory Zero-Key Operation)**:
  - 100% functional out of the box with zero external API credentials.
  - Seeded with 6 full speech recordings (3 Ideal, 3 Flawed) across 3 benchmark pairs, 2 speaker profiles, transcripts, and grounded flaws.
  - Ready for immediate offline hackathon evaluation.

---

## 3. Technology Stack

- **Framework**: Next.js (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS v4, custom analytical dark palette
- **Typography**: Editorial serif (*Newsreader*, *Fraunces*) and neutral technical sans (*IBM Plex Sans*, *IBM Plex Mono*)
- **Database**: Prisma ORM with SQLite (`prisma/schema.prisma`, `dev.db`)
- **Audio & Waveforms**: WaveSurfer.js + Web Audio API harmonic prosody synthesizer
- **Charts & Visualizations**: Recharts (Pace Curves, Score Progressions, Flaw Histograms)
- **AI Inference**: Google Gemini API (`@google/genai`) with strict Zod schema validation + Deterministic Offline Intelligence Engine
- **Validation**: Zod 3

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mithra0612/orator.git
cd orator
npm install
```

### 2. Initialize Database & Seed Demo Data
```bash
# Push Prisma schema to SQLite
npm run db:push

# Generate sample prosodic audio recordings
node scripts/generate-audio.mjs

# Seed the database with 6 speeches (3 Ideal, 3 Flawed), speaker profiles, and flaws
npm run db:seed
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"

# Optional: Add Google Gemini API Key for live LLM inference
# GEMINI_API_KEY="your-gemini-api-key"

# Optional: Add OpenAI API Key for Whisper transcription
# OPENAI_API_KEY="your-openai-api-key"
```

> **Note**: External API keys are entirely optional. If keys are omitted, ORATOR automatically operates in **Demo Mode**, using deterministic signal calculations and offline evaluation fallbacks.

---

## 6. Main Demo Flow (2-Minute Hackathon Walkthrough)

1. **Step 1 - Overview Dashboard**:  
   Open `http://localhost:3000`. Inspect the composite score (78.4), rubric radar breakdown, and recent speech library.
2. **Step 2 - Detailed Speech Inspection**:  
   Click **"Demo Speech (Ideal RAG)"** or open `/speeches/speech-rag-ideal`.
3. **Step 3 - Audio Waveform & Seeking**:  
   Press **Play** on the WaveSurfer player. Notice the real waveform, speed toggles, and flaw markers.
4. **Step 4 - Temporal Flaw Grounding**:  
   Open `/speeches/speech-rag-flawed` (Flawed Archetype). Click the **Pace Spike** marker at `00:25`. Notice the audio seeks to 25s, the transcript highlights the exact segment, and the flaw inspector displays:
   - *Evidence*: `Spoke 38 words in 13 seconds (175 WPM, +40 WPM over baseline).`
   - *Recommendation*: `Reduce delivery speed during technical mechanism descriptions.`
5. **Step 5 - Contrastive Speech Lab**:  
   Navigate to `/contrastive-lab`. Inspect the side-by-side metric table comparing the Ideal vs. Flawed speeches with auto-generated contrast insights.
6. **Step 6 - Speaker Profile & Trajectory**:  
   Navigate to `/speaker-profile`. Review Dr. Elena Vance's score progression over time (64 &rarr; 69 &rarr; 74 &rarr; 81) and automatically detected persistent patterns.
7. **Step 7 - AI Speech Coach**:  
   Navigate to `/ai-coach`. Click the prompt chip *"Where did I speak too quickly?"* to receive a timestamp-grounded response citing empirical evidence.
8. **Step 8 - Dossier Report Generation**:  
   Navigate to `/reports/speech-rag-ideal` and click **"Print / Export PDF Dossier"**.

---

## 7. Limitations & Ethical Boundary

ORATOR provides communication delivery and acoustic pacing analysis. The platform does **not** make clinical, psychological, or medical assertions. Voice metrics represent delivery stability, cadence variation, and prosodic telemetry, and must not be used to infer psychological health or mental state.

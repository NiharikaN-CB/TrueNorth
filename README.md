# 🌊 TrueNorth — A Calmer Way to Date

> **A private space to pause, reflect, and understand yourself — instead of overthinking someone else.**

<p align="center">
  <img width="900" alt="banner" src="https://github.com/user-attachments/assets/90dbec60-a2cb-4cda-9a2f-36b5fcf32cc4" />

</p>

<p align="center">
  <strong>Something happened. You feel unsettled. TrueNorth helps you come back to yourself.</strong>
</p>

<p align="center">
  🎥 <a href="YOUR_YOUTUBE_DEMO_URL">Watch the Demo</a>
</p>

---

## 💭 The Problem

Modern dating can create a cycle of **mixed signals, inconsistent communication, ghosting, waiting, and overthinking**.

After an interaction, it's easy to spend hours asking:

> *"What did they mean?"*
> *"Why did they act like that?"*
> *"Did I do something wrong?"*

The problem is that we can become so focused on decoding another person that we lose touch with **our own feelings, needs, boundaries, and values**.

Traditional notes apps provide a blank page but little guidance. Dating apps optimize for outcomes. Generic AI chat provides flexibility but isn't designed around private post-date reflection.

---

## 🧭 Our Solution

**TrueNorth is a private, women-centered digital journal and reflection companion for navigating modern dating.**

Instead of helping users decode another person's behavior, TrueNorth asks:

> **"How did this experience make me feel?"**

The core experience is intentionally simple:

```text
Something happened
        ↓
I feel unsettled
        ↓
I open TrueNorth
        ↓
I write / draw / decorate
        ↓
I press "Reflect ✦"
        ↓
TrueNorth reflects my experience
        ↓
I notice my feelings, needs & values
        ↓
I feel a little more grounded
```

TrueNorth is **not** a dating coach, therapist, or relationship decision-maker.

It doesn't tell users to stay, leave, confront, or pursue someone. It helps them understand **themselves**.

---

## ✨ Core Features

### 1. Creative Digital Journal

A tactile journal canvas designed to feel like a **private digital scrapbook**, not another productivity dashboard.

* Freehand drawing
* Text boxes
* Eraser
* Undo / redo
* Multiple journal pages
* Dotted / paper-style backgrounds
* Mouse and touch interaction

### 2. AI Reflection

Users explicitly choose **Reflect ✦** when they're ready.

TrueNorth transforms the written entry into a structured reflection containing:

* **Summary** of the experience
* **Emotions** detected from the user's own words
* **Gentle reflection**
* **Questions to sit with**
* **Recovery / self-care suggestion**
* **Pattern observations**
* **Gentle red-flag observations**, when appropriate

The AI is designed to use tentative language and avoid diagnosing people, inventing context, or making relationship decisions for the user.

### 3. Private & Local by Design

No account is required for the MVP.

Journal content is stored locally in the browser using **IndexedDB**.

```text
Journal → Browser State → IndexedDB
```

AI reflection only happens after an explicit **Reflect ✦** action, and only the necessary journal text is sent to the server-side AI endpoint.

### 4. Pattern Recognition

TrueNorth can surface recurring emotions and themes across journal entries.

For example:

> *"You've mentioned feeling unsettled in several recent interactions."*

Patterns are presented as **observations, not diagnoses**.

### 5. Personalization

Users can make the journal feel like their own private notebook through:

* Stickers
* Roses
* Seashells
* Flowers
* Bows
* Stars
* Photos
* Paper / tape elements
* Optional reflection checklists

---

## 🎨 The Visual Experience

TrueNorth intentionally avoids the look of a conventional SaaS dashboard.

The design direction combines a **rosy seaside sunset** with the tactile feeling of a **handmade digital scrapbook / planner**.

### Brand Palette

| Color            | Hex       | Purpose                       |
| ---------------- | --------- | ----------------------------- |
| Gold Pink     | `#F7D7CD` | Soft backgrounds & highlights |
| Berry Blush   | `#D79B95` | Primary accent                |
| Pastel Maroon | `#984343` | Text, emphasis & CTAs         |
| Cherub        | `#91BDC2` | Seaside contrast              |
| Cashmere      | `#F1E4D9` | Paper & background surfaces   |

**Design principles:**
Soft, not clinical.
Personal, not corporate.
Elegant, not childish.
Nostalgic, not futuristic.
Calming, not distracting.

---

## 🛠️ Tech Stack

| Layer                 | Technology                    |
| --------------------- | ----------------------------- |
| **Framework**         | Next.js + React + App Router  |
| **Styling**           | Tailwind CSS                  |
| **Journal Canvas**    | Fabric.js                     |
| **Client State**      | Zustand                       |
| **Local Persistence** | IndexedDB                     |
| **AI Boundary**       | Next.js Server-side API Route |
| **AI**                | Google Gemini                 |
| **Deployment**        | Vercel                        |
| **Version Control**   | GitHub                        |

### Development & AI Tooling

* **Antigravity** — primary AI-assisted development environment
* **ChatGPT** — debugging, error analysis, explanations, and technical problem solving
* **Claude** — planning and architecture decomposition

The project deliberately used a **role-based AI workflow** rather than asking one AI agent to generate the entire application at once.

---

## 🏗️ Architecture / How It Works

TrueNorth uses a deliberately small **local-first architecture**.

```text
                    ┌─────────────────────┐
                    │      Browser        │
                    │                     │
                    │  Next.js + React    │
                    │  Tailwind CSS       │
                    │  Fabric.js          │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ↓                     ↓
             ┌─────────────┐       ┌─────────────┐
             │   Zustand   │◄─────►│  IndexedDB  │
             │ Client State│       │Local Journal│
             └──────┬──────┘       └─────────────┘
                    │
             User presses
              "Reflect ✦"
                    │
                    ↓
             ┌─────────────┐
             │ Next.js API │
             │ /api/reflect│
             └──────┬──────┘
                    │
                    ↓
             ┌─────────────┐
             │  AI Provider│
             └──────┬──────┘
                    │
                    ↓
             Structured Reflection
                    │
                    ↓
             ┌─────────────┐
             │ Reflection UI│
             └─────────────┘
```

### Why Local-First?

The technical design intentionally avoids unnecessary infrastructure for the MVP:

* No authentication
* No cloud journal database
* No microservices
* No real-time backend
* No payment infrastructure
* No cloud AI memory

This keeps the architecture lightweight while making **privacy part of the product itself**.

---

## Privacy & AI Safety

Privacy isn't just a feature — it's part of the architecture.

### Journal Data

```text
User
 ↓
Journal Canvas
 ↓
React / Zustand
 ↓
IndexedDB
```

Normal journal data stays inside the user's browser.

### AI Reflection

```text
User presses "Reflect ✦"
 ↓
Required text extracted
 ↓
POST /api/reflect
 ↓
Next.js server route
 ↓
AI provider
 ↓
Structured response
 ↓
Browser
 ↓
Local journal
```

TrueNorth follows several important boundaries:

* API keys stay server-side
* No API keys committed to GitHub
* AI is only triggered by explicit user action
* Only necessary journal text is sent for reflection
* AI does not diagnose mental-health conditions
* AI does not diagnose or label dating partners
* AI does not claim certainty about another person's intentions
* AI does not make relationship decisions for the user
* AI failure never deletes the user's journal

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/NiharikaN-CB/true-north.git
cd true-north
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add the required server-side AI configuration to `.env.local`.

> **Never commit `.env.local` or API keys to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

### 5. Open TrueNorth

Visit:

```text
http://localhost:3000
```

### 6. Test the core journey

```text
Landing
  ↓
Start Journaling
  ↓
Write / Draw
  ↓
Reflect ✦
  ↓
Receive Reflection
```

No account is required for the local MVP experience.

---

## 🧪 What to Test

### First Reflection

* Open TrueNorth
* Start a journal entry
* Write what happened
* Press **Reflect ✦**
* Verify the reflection appears

### Local Autosave

* Write something
* Wait for the **Saved ✓** state
* Refresh the browser
* Confirm the entry remains

### Canvas

* Draw
* Add text
* Erase
* Undo
* Redo
* Navigate pages
* Return to the previous page

### AI Failure

Simulate an API/network failure and verify:

> Your journal entry remains safely saved locally.

---

# 🏆 The Hackathon Journey

Building TrueNorth in a fast-paced hackathon meant constantly balancing **ambition, reliability, and time**.

We wanted the product to feel emotionally meaningful while keeping the technical architecture small enough to actually finish.

## 🐛 Challenges We Ran Into

### 1. The Canvas Challenge

The journal canvas was one of the highest-risk parts of the build.

Fabric.js had to support drawing, text, erasing, object manipulation, serialization, restoration, and responsive interaction without allowing canvas-specific logic to spread throughout the application.

Getting the canvas to behave like a **digital notebook rather than a generic whiteboard** required careful debugging and iteration.

### 2. Spotify Integration

We also ran into issues while exploring Spotify integration.

The integration introduced technical constraints that didn't contribute enough to the core TrueNorth experience, reinforcing an important hackathon lesson:

> **Not every interesting feature belongs in the MVP.**

The focus stayed on the central journey: **journal → reflect → understand yourself better**.

---

## 🌟 Accomplishments We're Proud Of

### We Built a Journal That Feels Like a Journal

Rather than creating another clinical AI interface, we created a visual experience inspired by **digital planners, handmade scrapbooks, paper textures, seaside elements, and nostalgic stationery**.

The goal was simple:

> **It should feel like opening a private notebook, not launching another productivity app.**

### We Created a Distinctive Product Identity

The combination of:

**dating context + emotional self-reflection + creative journaling + local privacy**

gives TrueNorth a clear identity.

The visual language, reflective AI experience, and privacy-first architecture all reinforce the same product idea:

> **Come back to yourself.**

---

## 💡 What We Learned

The biggest lesson wasn't technical.

**Hackathons aren't just competitions. They're opportunities to find solutions to meaningful problems.**

TrueNorth started with a simple observation: modern dating can leave people spending more time trying to understand someone else than understanding themselves.

Building around that problem taught us to:

* Start with the user's emotional need, not the technology.
* Keep the MVP focused on one meaningful loop.
* Use AI as a development partner without giving up architectural control.
* Test AI-generated code instead of blindly trusting it.
* Treat privacy as an architectural decision.
* Cut features when they distract from the core experience.
* Prioritize **"works perfectly"** before adding more polish.

Most importantly, we learned that a successful product doesn't always need to solve everything.

Sometimes it just needs to create **one genuinely useful moment**.

---

# What's Next

TrueNorth's MVP deliberately leaves several possibilities open for future versions.

### 1. Private Cloud Sync

Optional encrypted accounts and cross-device synchronization while preserving TrueNorth's privacy-first philosophy.

### 2. Deeper Pattern Insights

More sophisticated visualizations of recurring emotions, values, themes, and experiences across the user's journal history.

### 3. Richer Journal Experience

Future versions could add:

* Advanced journal templates
* Expanded decorative libraries
* PNG / PDF export
* More sophisticated multi-page exports
* Additional reflection experiences

The rule remains the same:

> **Expand the product only after the core reflection experience proves valuable.**

---

# 🎯 The Product Hypothesis

TrueNorth succeeds if it can reliably help someone move from:

> **"Something happened and I can't stop thinking about it."**

to:

> **"I understand what I'm feeling a little better, and I can put my phone down."**

That is the north star.

---

# 👩‍💻 The Team

### Built by

**Komal Harshita**
Computer Science · AI-Assisted Builder · Product & UI/UX

* GitHub: [@komalharshita](https://github.com/komalharshita)
* LinkedIn: [komalharshita](https://www.linkedin.com/in/komalharshita/)


**Niharika Niranjan**  
Cyber Security · AI/ML · Full-Stack Developer

* GitHub: [@NiharikaN-CB](https://github.com/NiharikaN-CB)
* LinkedIn: [Niharika Niranjan](https://www.linkedin.com/in/niharika-niranjan-19778a290/)


**Abhijna Laxmi**  
VLSI · Frontend · Product and Design

* GitHub: [@Abhijna Laxmi](https://github.com/HanAbhi)
* LinkedIn: [Abhijna Laxmi](www.linkedin.com/in/abhijna-laxmi-659143298)
* 
---
# Project Documentation

The MVP was designed around a structured product → technical design → implementation workflow.

* **Product Requirements Document** — product vision, users, features, success criteria, privacy and scope
* **Technical Design Document** — architecture, data model, canvas strategy, AI architecture, testing and deployment

The technical design establishes the local-first architecture and the core flow from the browser to IndexedDB and, only after explicit **Reflect ✦**, through the server-side AI boundary.

The PRD defines the central product experience as **dating context + emotional self-reflection + creative journaling + local privacy**, with the goal of moving users from emotional uncertainty toward greater self-awareness.

---

<p align="center">

### 🌊 TrueNorth

**A calmer way to date.**

*Less decoding. More self-understanding.*

**Made with curiosity, empathy, and a little bit of seaside nostalgia.**

</p>

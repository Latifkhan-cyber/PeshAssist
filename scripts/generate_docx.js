import fs from 'fs'
import path from 'path'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip
} from 'docx'

const PRIMARY_COLOR = '0D9488' // Teal / Emerald
const SECONDARY_COLOR = '1E293B' // Slate Dark
const TEXT_DARK = '334155'
const BG_LIGHT = 'F8FAFC'
const BORDER_COLOR = 'CBD5E1'

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    run: {
      color: PRIMARY_COLOR,
      bold: true,
      size: 32, // 16pt
      font: 'Calibri'
    }
  })
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    run: {
      color: SECONDARY_COLOR,
      bold: true,
      size: 26, // 13pt
      font: 'Calibri'
    }
  })
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    run: {
      color: '475569',
      bold: true,
      size: 22, // 11pt
      font: 'Calibri'
    }
  })
}

function createPara(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 100, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        size: 21, // 10.5pt
        color: TEXT_DARK,
        font: 'Calibri',
        ...options
      })
    ]
  })
}

function createBullet(text, boldPrefix = '') {
  const children = []
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix,
        bold: true,
        size: 21,
        color: SECONDARY_COLOR,
        font: 'Calibri'
      })
    )
  }
  children.push(
    new TextRun({
      text: text,
      size: 21,
      color: TEXT_DARK,
      font: 'Calibri'
    })
  )

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 260 },
    children
  })
}

function createCodeBlock(codeLines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 12, color: PRIMARY_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR }
            },
            children: codeLines.map(
              (line) =>
                new Paragraph({
                  spacing: { before: 30, after: 30 },
                  children: [
                    new TextRun({
                      text: line,
                      font: 'Consolas',
                      size: 19,
                      color: '0F172A'
                    })
                  ]
                })
            )
          })
        ]
      })
    ]
  })
}

function createTable(headers, rowsData) {
  const tableRows = []

  // Header Row
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map(
        (h) =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: '0F766E' },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '0F766E' },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: '0F766E' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '14B8A6' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '14B8A6' }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: h,
                    bold: true,
                    color: 'FFFFFF',
                    size: 20,
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
      )
    })
  )

  // Data Rows
  rowsData.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0
    tableRows.push(
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: isEven ? 'FFFFFF' : 'F8FAFC' },
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
                left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
                right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR }
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: 19,
                      color: TEXT_DARK,
                      font: 'Calibri'
                    })
                  ]
                })
              ]
            })
        )
      })
    )
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  })
}

function createCallout(title, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'F0FDFA' },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '99F6E4' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '99F6E4' },
              left: { style: BorderStyle.SINGLE, size: 16, color: PRIMARY_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: '99F6E4' }
            },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: `💡 ${title}`,
                    bold: true,
                    size: 21,
                    color: '0F766E',
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: text,
                    size: 20,
                    color: '134E4A',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  })
}

async function buildDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1)
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'PeshAssist — Complete Project Documentation',
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // TITLE COVER AREA
          new Paragraph({
            spacing: { before: 400, after: 120 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '🌸 PeshAssist (AI Peshawar Assistant)',
                bold: true,
                size: 44, // 22pt
                color: PRIMARY_COLOR,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 300 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'The Definitive, Grounded AI Discovery Engine & Local Companion for Peshawar, Khyber Pakhtunkhwa, Pakistan',
                italics: true,
                size: 24, // 12pt
                color: '64748B',
                font: 'Calibri'
              })
            ]
          }),

          createCallout(
            'Executive Summary',
            'PeshAssist is an intelligent full-stack conversational guide and geographic discovery web application designed specifically for Peshawar. It unifies English, Urdu, and Roman Urdu language processing with zero-hallucination database grounding, Leaflet/OpenStreetMap routing, and an administrative control suite.'
          ),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT
          createHeading1('1. Problem Space & Solution Overview'),
          createHeading2('1.1 The Challenge'),
          createPara('Navigating Peshawar presents distinctive challenges for locals, students, patients, tourists, and business travelers:'),
          createBullet(' Local information is dispersed across social media, word of mouth, and obsolete business directories.', 'Fragmented Local Knowledge:'),
          createBullet(' Mainstream LLMs invent closed businesses, incorrect phone numbers, invalid coordinates, or confuse Peshawar with other cities.', 'LLM Hallucinations:'),
          createBullet(' Queries are heavily formulated in Roman Urdu (e.g., "Saddar mein motherboard repair kahan se hogi?") which off-the-shelf engines misinterpret.', 'Linguistic Diversity:'),

          createHeading2('1.2 The PeshAssist Solution'),
          createBullet(' Queries are matched against verified local records before being synthesized by Google Gemini 1.5.', 'Zero-Hallucination Grounding:'),
          createBullet(' Full natural understanding across English, formal Urdu script, and colloquial Roman Urdu.', 'Trilingual Fluency:'),
          createBullet(' Dynamic place cards, star ratings, directions, contact info, and Leaflet OpenStreetMap navigation embedded in chat and search.', 'Interactive Visual UX:'),

          // 2. TECHNOLOGY STACK
          createHeading1('2. Technology Stack & Specifications'),
          createTable(
            ['Layer', 'Technology', 'Version', 'Purpose & Key Role'],
            [
              ['Frontend SPA', 'React.js', '18.3.1', 'Component-based single-page application UI'],
              ['Build Tool', 'Vite', '5.4.2', 'High-performance bundling & Hot Module Replacement'],
              ['Styling', 'Tailwind CSS', '3.4.1', 'Responsive modern utility design system'],
              ['Iconography', 'Lucide React', '0.344.0', 'Vector icons across directory and navigation'],
              ['Maps & Routing', 'Leaflet / React-Leaflet', '1.9.4 / 4.2.1', 'OpenStreetMap tiles, custom markers & coordinates'],
              ['Routing', 'React Router DOM', '6.22.3', 'Client-side SPA multi-page navigation'],
              ['Backend Server', 'Node.js & Express.js', 'Node 18+ / Express 4.19', 'Modular RESTful API with controllers & services'],
              ['AI Engine', 'Google Generative AI SDK', 'Gemini 1.5 Flash', 'Grounded conversational response generation'],
              ['Database', 'PostgreSQL / Supabase', 'Postgres 15+', 'Relational store with full-text search & indexes'],
              ['Dataset Fallback', 'Embedded peshawarData.js', 'Custom', 'High-fidelity in-memory ground truth data']
            ]
          ),

          // 3. REPOSITORY STRUCTURE
          createHeading1('3. Repository Architecture & Layout'),
          createPara('The monorepo contains decoupled frontend and backend applications configured for independent or unified execution:'),
          createCodeBlock([
            'PeshAssist/',
            '├── client/                         # Frontend React 18 + Vite SPA',
            '│   ├── src/',
            '│   │   ├── components/             # Reusable UI (MapView, PlaceCard, ChatPlaceCard, etc.)',
            '│   │   ├── context/                # React Contexts (AuthContext, ChatContext, FavoritesContext)',
            '│   │   ├── pages/                  # Route views (Home, Explore, Chat, PlaceDetails, Admin)',
            '│   │   ├── services/api.js         # Centralized API network client',
            '│   │   └── App.jsx                 # Route definitions & layout wrappers',
            '│   ├── .env.example                # Client environment template',
            '│   └── package.json                # Client dependencies',
            '├── server/                         # Backend Express.js REST API',
            '│   ├── config/supabase.js          # Supabase client connector',
            '│   ├── controllers/                # Controllers (admin, chat, places, reviews, favorites)',
            '│   ├── data/peshawarData.js        # Comprehensive local dataset',
            '│   ├── data/schema.sql             # PostgreSQL / Supabase schema',
            '│   ├── routes/api.js               # Express route declarations',
            '│   ├── services/geminiService.js   # Gemini AI prompt synthesis & grounding',
            '│   ├── services/searchService.js   # Multi-factor search & ranking engine',
            '│   ├── .env.example                # Server environment template',
            '│   └── server.js                   # Application entry point',
            '├── package.json                    # Root monorepo orchestrator scripts',
            '├── README.md                       # Complete Markdown documentation',
            '└── DOCUMENTATION.md                # In-depth technical reference'
          ]),

          // 4. CORE MODULES & FEATURES
          createHeading1('4. Core Features & Capabilities'),
          createHeading2('4.1 Conversational AI Guide with Grounded Truth'),
          createPara('The chat engine processes user messages through an anti-hallucination retrieval pipeline:'),
          createBullet(' Recognizes Urdu and English greetings (Salam, Aoa, Hello) and cultural small-talk with polite Pashtun hospitality.', 'Intent & Small-Talk Parsing:'),
          createBullet(' Extracts areas, categories, tags, and keywords to fetch matching entities from the database.', 'Entity Extraction:'),
          createBullet(' Injects verified candidate places into the Gemini prompt with strict operational guardrails.', 'Grounded AI Synthesis:'),
          createBullet(' Accompanies conversational advice with clickable place preview cards.', 'Visual Card Payloads:'),

          createHeading2('4.2 Categorized Discovery Directory'),
          createPara('Contains verified records categorized across 8 major domains and 10 geographic zones:'),
          createTable(
            ['Category', 'Representative Points of Interest in Peshawar'],
            [
              ['Restaurants & Dining', 'Charsi Tikka Namak Mandi, Jalil Chapli Kabab, Habibi Hayatabad, Jan’s Deli Saddar, Chief Burger'],
              ['Hospitals & Healthcare', 'Lady Reading Hospital (LRH), Khyber Teaching Hospital (KTH), Hayatabad Medical Complex (HMC), NWGH'],
              ['Heritage & Tourism', 'Bala Hissar Fort, Sethi Houses, Peshawar Museum, Mahabat Khan Mosque, Bab-e-Khyber'],
              ['Shopping & Bazaars', 'Qissa Khwani Bazaar, Karkhano Markets, Deans Trade Center, Mina Bazaar'],
              ['Education & Universities', 'Islamia College University, UET Peshawar, Edwardes College, KMU, IMSciences'],
              ['Tech & Hardware Repairs', 'Gul Haji Plaza (Laptop & Motherboard repair city), Bilour Plaza, Deans Computer Market'],
              ['Hotels & Accommodations', 'Serena Hotel Peshawar, Pearl Continental (PC), Shelton Rezidor, Emaraat Hotel'],
              ['Transport & Transit', 'Zu Peshawar BRT Corridor Stations, Bacha Khan Airport, Peshawar Cantt Railway Station']
            ]
          ),

          createHeading2('4.3 Interactive Mapping & Geolocation'),
          createBullet(' Interactive OpenStreetMap canvas rendered using Leaflet with smooth pan, zoom, and category-themed pins.', 'Leaflet Map View:'),
          createBullet(' Every entity includes a direct action button opening turn-by-turn navigation in Google Maps.', 'Turn-by-Turn GPS Navigation:'),

          createHeading2('4.4 Reviews, Ratings & Bookmarks'),
          createBullet(' Authenticated feedback with 1 to 5 star ratings and verified moderation status.', 'User Reviews:'),
          createBullet(' One-click bookmarking of favorite spots with instant sync across sessions.', 'Personal Wishlist:'),

          createHeading2('4.5 Administrative Control Portal'),
          createBullet(' Live counters for total spots, verified percentage, category distributions, and review metrics.', 'Dashboard Analytics:'),
          createBullet(' Full Add, Edit, Delete, and Verified-badge toggle operations.', 'Place Management CRUD:'),

          // 5. DATABASE SCHEMA
          createHeading1('5. Database Architecture (PostgreSQL / Supabase)'),
          createPara('The relational schema defined in server/data/schema.sql includes:'),
          createTable(
            ['Table Name', 'Primary Key', 'Foreign Keys', 'Key Indexes & Description'],
            [
              ['categories', 'id (SERIAL)', 'None', 'name (UNIQUE), slug (UNIQUE)'],
              ['areas', 'id (SERIAL)', 'None', 'name (UNIQUE), slug (UNIQUE), zone, coordinates'],
              ['places', 'id (UUID)', 'category_id, area_id', 'GIN full-text search index, rating index, area index'],
              ['reviews', 'id (UUID)', 'place_id (FK)', 'Rating check (1-5), status (approved/pending)'],
              ['favorites', 'id (UUID)', 'place_id (FK)', 'Unique composite constraint on (user_id, place_id)'],
              ['conversations', 'id (UUID)', 'None', 'user_id, title, timestamps'],
              ['messages', 'id (UUID)', 'conversation_id (FK)', 'sender (user/assistant/system), places_payload (JSONB)']
            ]
          ),

          // 6. REST API SPECIFICATION
          createHeading1('6. REST API Specification'),
          createTable(
            ['Method', 'Endpoint', 'Description', 'Sample Query / Body'],
            [
              ['GET', '/api/health', 'System health probe & DB status', 'None'],
              ['POST', '/api/chat', 'AI chat query with grounding', '{ "message": "Namak Mandi karahi" }'],
              ['GET', '/api/chat/suggestions', 'Suggested prompt pills', 'None'],
              ['GET', '/api/places', 'Filtered directory search', '?category=restaurants&area=hayatabad'],
              ['GET', '/api/places/:id', 'Single place full details', 'Place UUID / ID slug'],
              ['GET', '/api/categories', 'All taxonomy categories', 'None'],
              ['GET', '/api/areas', 'All Peshawar zones & bounds', 'None'],
              ['GET', '/api/reviews/:placeId', 'Approved reviews for place', 'Place UUID'],
              ['POST', '/api/reviews', 'Submit new user review', '{ "place_id": "...", "rating": 5 }'],
              ['GET', '/api/favorites', 'List bookmarked places', 'None (User Session)'],
              ['POST', '/api/favorites/:id', 'Toggle place in wishlist', 'Place UUID'],
              ['GET', '/api/admin/stats', 'System statistics & metrics', 'None'],
              ['GET', '/api/admin/places', 'Admin places management list', 'None'],
              ['POST', '/api/admin/places', 'Create new verified place', 'Place JSON payload'],
              ['PUT', '/api/admin/places/:id', 'Update existing place', 'Place JSON payload'],
              ['DELETE', '/api/admin/places/:id', 'Delete place record', 'None']
            ]
          ),

          // 7. INSTALLATION & SETUP GUIDE
          createHeading1('7. Installation & Local Setup Guide'),
          createHeading2('7.1 Prerequisites'),
          createBullet(' v18.0.0 or higher', 'Node.js:'),
          createBullet(' v9.0.0 or higher', 'npm:'),
          createBullet(' Git installed for repository cloning', 'Git:'),

          createHeading2('7.2 Setup Steps'),
          createPara('1. Clone the repository and install all dependencies:'),
          createCodeBlock([
            'git clone https://github.com/Latifkhan-cyber/PeshAssist.git',
            'cd PeshAssist',
            'npm run install:all'
          ]),

          createPara('2. Configure environment variables in server/.env:'),
          createCodeBlock([
            'PORT=5000',
            'NODE_ENV=development',
            'CLIENT_URL=http://localhost:5173',
            'GEMINI_API_KEY=your_google_gemini_api_key',
            '# Optional Supabase database keys:',
            'SUPABASE_URL=https://your-project.supabase.co',
            'SUPABASE_ANON_KEY=your_supabase_anon_key'
          ]),

          createPara('3. Configure environment variables in client/.env:'),
          createCodeBlock(['VITE_API_URL=http://localhost:5000/api']),

          createPara('4. Launch local servers in development mode:'),
          createCodeBlock([
            '# In Terminal 1 (Backend API):',
            'npm run dev:server',
            '',
            '# In Terminal 2 (Frontend Client):',
            'npm run dev:client'
          ]),
          createPara('Access the application at http://localhost:5173 and API at http://localhost:5000/api/health.'),

          // 8. PRODUCTION DEPLOYMENT & TROUBLESHOOTING
          createHeading1('8. Production Deployment & FAQ'),
          createHeading2('8.1 Production Build'),
          createCodeBlock(['npm run build']),
          createPara('Static assets are built to client/dist for deployment to Vercel, Netlify, or Cloudflare Pages.'),

          createHeading2('8.2 Frequently Asked Questions'),
          createBullet(' Yes. If no Gemini API key is provided, the hybrid NLU engine answers queries accurately with verified local dataset entities.', 'Does PeshAssist run without an API key?'),
          createBullet(' English, Urdu script (اردو), and colloquial Roman Urdu.', 'What languages are supported?'),
          createBullet(' Leaflet provides fast, zero-cost, privacy-friendly mapping, while one-click deep links connect users to Google Maps for turn-by-turn driving directions.', 'Why Leaflet + OpenStreetMap?'),

          // FOOTER / SIGN-OFF
          new Paragraph({ spacing: { before: 400, after: 100 } }),
          createCallout('Verification & Credits', 'PeshAssist is developed for the citizens and visitors of Peshawar, Khyber Pakhtunkhwa, Pakistan. Codebase licensed under ISC.')
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  const outputPath = path.resolve(process.cwd(), 'PeshAssist_Complete_Documentation.docx')
  fs.writeFileSync(outputPath, buffer)
  console.log(`✅ Word Document generated successfully at: ${outputPath}`)
}

buildDocx().catch((err) => {
  console.error('❌ Error generating Word document:', err)
  process.exit(1)
})

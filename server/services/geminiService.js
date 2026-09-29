import { GoogleGenerativeAI } from '@google/generative-ai'
import { searchPlaces, getPlaceById, getAllCategories, getAllAreas } from './searchService.js'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GEMINI_API_KEY
let genAI = null

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey)
  console.log('✅ Google Gemini API initialized successfully')
} else {
  console.log('ℹ️ GEMINI_API_KEY not provided. Using Intelligent Hybrid PeshAssist NLU Engine.')
}

// System prompt setting strict Peshawar knowledge & anti-hallucination guardrails
const SYSTEM_INSTRUCTION = `
You are PeshAssist (AI Peshawar Assistant), an intelligent, friendly, and knowledgeable local guide dedicated to Peshawar, Khyber Pakhtunkhwa, Pakistan.

CRITICAL OPERATIONAL RULES:
1. Grounded Truth: NEVER invent or hallucinate places, opening hours, prices, phone numbers, or addresses. Rely strictly on retrieved data.
2. Languages: You understand English, Urdu, and Roman Urdu seamlessly (e.g., "Saddar mein laptop repair kahan se hoga?", "Hayatabad mein emergency hospital", "Namak Mandi tikka"). Respond warmly in the language or mix of languages the user used.
3. Culture & Warmth: Be respectful of Pashtun culture and traditions (Pukhtunwali, hospitality, local references like Hujra, Namak Mandi, Qissa Khwani, University Road, Zu BRT).
4. Clarity: Provide direct recommendations, highlighting key details like location, specialties, and contact info when available.
`

/**
 * Detect Conversational & Small Talk Intents (Greetings, How are you, Help, Thanks, Bye)
 */
const checkConversationalIntent = (userMessage) => {
  const cleanMsg = userMessage.toLowerCase().trim().replace(/[?!.,]/g, '')

  // 1. Greetings
  const greetingsEnglish = ['hi', 'hello', 'hey', 'heyy', 'hiya', 'good morning', 'good afternoon', 'good evening', 'howdy']
  const greetingsUrdu = ['salam', 'assalam o alaikum', 'assalamu alaikum', 'assalam-o-alaikum', 'aoa', 'salaam', 'wsalam', 'walekum assalam']
  
  if (greetingsEnglish.includes(cleanMsg)) {
    return {
      isConversational: true,
      reply: `Hi there! 👋 I am **PeshAssist**, your local AI guide for Peshawar.\n\nHow are you doing today? How can I help you explore Peshawar? You can ask me about:\n• 🍽️ **Famous food & restaurants** (Namak Mandi karahi, Chapli kababs, cafes)\n• 🏥 **Hospitals & emergency care** (KTH, HMC, LRH, NWGH, SKMCH)\n• 🎓 **Top universities & colleges** (ICP, UoP, Edwardes, KMC, UET, IMSciences)\n• 💻 **Tech & laptop repairs** (Gul Haji Plaza, Deans, Bilour Plaza)\n• 🏛️ **Historical landmarks** (Bala Hissar, Sethi Houses, Peshawar Museum)\n• 🛍️ **Bazaars & shopping** (Karkhano, Qissa Khwani, Mina Bazaar)`,
      places: [],
    }
  }

  if (greetingsUrdu.includes(cleanMsg)) {
    return {
      isConversational: true,
      reply: `Wa Alaikum Assalam! 🌸 Mein **PeshAssist** hoon — Peshawar ka dedicated AI local guide.\n\nAap kese hain? Aaj mein aapki Peshawar mein kya madad kar sakta hoon? Aap mujh se kisi bhi jagah, khane, hospital, college ya electronics market ke baray mein pooch saktay hain!`,
      places: [],
    }
  }

  // 2. "How are you" / "Kaise ho"
  if (
    cleanMsg.includes('how are you') || cleanMsg.includes('how r u') ||
    cleanMsg.includes('kese ho') || cleanMsg.includes('kaise ho') || cleanMsg.includes('kese hain') ||
    cleanMsg.includes('kia haal hai') || cleanMsg.includes('kya hal hai') || cleanMsg.includes('kya haal')
  ) {
    const isUrdu = /kese|kaise|haal|kya|kia|hain|ho/.test(cleanMsg)
    return {
      isConversational: true,
      reply: isUrdu
        ? `Alhamdulillah, mein bilkul theek hoon! 😊 PeshAssist aapki khidmat mein hazir hai. Aaj Peshawar mein aap kya dhoond rahe hain?`
        : `I am doing fantastic, thank you for asking! 😊 I'm ready to assist you. What would you like to discover or find in Peshawar today?`,
      places: [],
    }
  }

  // 3. "Who are you" / "What can you do" / "Help"
  if (
    cleanMsg === 'who are you' || cleanMsg === 'what can you do' || cleanMsg === 'what are you' ||
    cleanMsg === 'help' || cleanMsg === 'help me' || cleanMsg.includes('what do you do') ||
    cleanMsg.includes('aap kon ho') || cleanMsg.includes('tum kon ho') || cleanMsg.includes('madad')
  ) {
    const isUrdu = /aap|tum|kon|madad|kya/.test(cleanMsg)
    return {
      isConversational: true,
      reply: isUrdu
        ? `Mein **PeshAssist** hoon, Peshawar city ka intelligent AI guide. 🏛️✨\n\nMein aapko Peshawar ke mashhoor restaurants, emergency hospitals, universities, colleges, laptop repair plazas (jese Gul Haji Plaza), aur historic places ke verified addresses, phone numbers aur timings bata sakta hoon.`
        : `I am **PeshAssist**, your intelligent AI guide and discovery assistant for Peshawar, Pakistan! 🏛️✨\n\nI provide instant, verified details on:\n- 🍽️ Food & Dining (Authentic Karahi, Kababs, Continental Cafes)\n- 🏥 Hospitals & Emergency Centers (24/7 Trauma, Sehat Card info)\n- 🎓 Universities & Historic Colleges (Admissions, faculties, locations)\n- 💻 Tech & Computer Plazas (Gul Haji Plaza, Bilour, Deans Repairs)\n- 🏛️ Heritage Tourism (Bala Hissar Fort, Sethi Houses, Museums)\n- 🛍️ Famous Bazaars (Karkhano, Qissa Khwani, Mina Bazaar)\n\nJust tell me what you are looking for!`,
      places: [],
    }
  }

  // 4. Thank you
  if (
    cleanMsg.includes('thank you') || cleanMsg.includes('thanks') ||
    cleanMsg.includes('shukriya') || cleanMsg.includes('jazakallah') || cleanMsg.includes('meherbani')
  ) {
    const isUrdu = /shukriya|jazakallah|meherbani/.test(cleanMsg)
    return {
      isConversational: true,
      reply: isUrdu
        ? `Aap ka bohat shukriya! ❤️ PeshAssist hamesha aapki rahnumai ke liye hazir hai. Agar koi aur sawal ho to zaroor poochein.`
        : `You are most welcome! ❤️ Let me know if you need any more recommendations or directions in Peshawar.`,
      places: [],
    }
  }

  // 5. Bye / Farewell
  if (
    cleanMsg === 'bye' || cleanMsg === 'goodbye' || cleanMsg === 'see you' ||
    cleanMsg.includes('khuda hafiz') || cleanMsg.includes('allah hafiz') || cleanMsg.includes('fi amanillah')
  ) {
    return {
      isConversational: true,
      reply: `Khuda Hafiz! 👋 Have a wonderful time in Peshawar. Feel free to chat with me anytime you need assistance.`,
      places: [],
    }
  }

  return null
}

/**
 * Intelligent Local Intent Parser & Heuristic Generator (Zero-downtime Fallback)
 */
const handleLocalHeuristicChat = async (userMessage) => {
  // 1. Check if user is simply greeting or making small talk
  const conversationalResponse = checkConversationalIntent(userMessage)
  if (conversationalResponse) {
    return conversationalResponse
  }

  const msgLower = userMessage.toLowerCase()

  // Detect category keywords with rich multi-lingual terms
  let category = ''
  if (
    msgLower.includes('food') || msgLower.includes('restaurant') || msgLower.includes('resturent') ||
    msgLower.includes('khana') || msgLower.includes('tikka') || msgLower.includes('karahi') ||
    msgLower.includes('kabab') || msgLower.includes('kebab') || msgLower.includes('chapli') ||
    msgLower.includes('burger') || msgLower.includes('cafe') || msgLower.includes('coffee') ||
    msgLower.includes('tea') || msgLower.includes('chai') || msgLower.includes('qahwa') ||
    msgLower.includes('shinwari') || msgLower.includes('charsi') || msgLower.includes('pulao') ||
    msgLower.includes('dumba') || msgLower.includes('dumbah') || msgLower.includes('breakfast') ||
    msgLower.includes('nashta') || msgLower.includes('dinner') || msgLower.includes('lunch')
  ) {
    category = 'restaurants'
  } else if (
    msgLower.includes('hospital') || msgLower.includes('hosptal') || msgLower.includes('doctor') ||
    msgLower.includes('emergency') || msgLower.includes('clinic') || msgLower.includes('sehat') ||
    msgLower.includes('ill') || msgLower.includes('bimar') || msgLower.includes('dawa') ||
    msgLower.includes('pharmacy') || msgLower.includes('medical') || msgLower.includes('kth') ||
    msgLower.includes('hmc') || msgLower.includes('lrh') || msgLower.includes('rmi') ||
    msgLower.includes('nwgh') || msgLower.includes('cancer') || msgLower.includes('shaukat')
  ) {
    category = 'hospitals'
  } else if (
    msgLower.includes('hotel') || msgLower.includes('stay') || msgLower.includes('room') ||
    msgLower.includes('guest house') || msgLower.includes('residence') || msgLower.includes('pc hotel') ||
    msgLower.includes('serena') || msgLower.includes('lodging') || msgLower.includes('shelton')
  ) {
    category = 'hotels'
  } else if (
    msgLower.includes('visit') || msgLower.includes('ghoomne') || msgLower.includes('tour') ||
    msgLower.includes('history') || msgLower.includes('fort') || msgLower.includes('qila') ||
    msgLower.includes('museum') || msgLower.includes('monument') || msgLower.includes('bala hissar') ||
    msgLower.includes('bab-e-khyber') || msgLower.includes('mahabat khan') || msgLower.includes('masjid') ||
    msgLower.includes('sethi') || msgLower.includes('gor khatri') || msgLower.includes('yadgar') ||
    msgLower.includes('ghanta ghar') || msgLower.includes('clock tower') || msgLower.includes('shahi bagh')
  ) {
    category = 'tourism'
  } else if (
    msgLower.includes('repair') || msgLower.includes('laptop') || msgLower.includes('computer') ||
    msgLower.includes('mobile') || msgLower.includes('screen') || msgLower.includes('service') ||
    msgLower.includes('gul haji') || msgLower.includes('gulhaji') || msgLower.includes('bilour') ||
    msgLower.includes('tech') || msgLower.includes('cctv') || msgLower.includes('gpu') ||
    msgLower.includes('graphic card') || msgLower.includes('printer') || msgLower.includes('motherboard') ||
    msgLower.includes('macbook') || msgLower.includes('ssd') || msgLower.includes('hardware') ||
    msgLower.includes('software') || msgLower.includes('accessories')
  ) {
    category = 'services'
  } else if (
    msgLower.includes('shop') || msgLower.includes('market') || msgLower.includes('bazaar') ||
    msgLower.includes('bazar') || msgLower.includes('buy') || msgLower.includes('khareed') ||
    msgLower.includes('karkhano') || msgLower.includes('deans') || msgLower.includes('cloth') ||
    msgLower.includes('chappal') || msgLower.includes('dry fruit') || msgLower.includes('jewel') ||
    msgLower.includes('mina') || msgLower.includes('shaheen')
  ) {
    category = 'shopping'
  } else if (
    msgLower.includes('uni') || msgLower.includes('college') || msgLower.includes('education') ||
    msgLower.includes('parhai') || msgLower.includes('islamia') || msgLower.includes('uet') ||
    msgLower.includes('kmu') || msgLower.includes('school') || msgLower.includes('admission') ||
    msgLower.includes('uop') || msgLower.includes('edwardes') || msgLower.includes('kmc') ||
    msgLower.includes('imsciences') || msgLower.includes('aup') || msgLower.includes('aps')
  ) {
    category = 'education'
  } else if (
    msgLower.includes('brt') || msgLower.includes('bus') || msgLower.includes('transport') ||
    msgLower.includes('airport') || msgLower.includes('zu') || msgLower.includes('transit') ||
    msgLower.includes('train') || msgLower.includes('daewoo') || msgLower.includes('railway') ||
    msgLower.includes('station')
  ) {
    category = 'transport'
  }

  // Detect area keywords
  let area = ''
  if (msgLower.includes('namak mandi') || msgLower.includes('namakmandi')) area = 'Namak Mandi'
  else if (msgLower.includes('hayatabad')) area = 'Hayatabad'
  else if (msgLower.includes('university road') || msgLower.includes('uni road') || msgLower.includes('campus') || msgLower.includes('board bazar')) area = 'University Road'
  else if (msgLower.includes('saddar') || msgLower.includes('cantt')) area = 'Saddar'
  else if (msgLower.includes('qissa khwani') || msgLower.includes('qisa khwani') || msgLower.includes('andar shehr')) area = 'Qissa Khwani'
  else if (msgLower.includes('gulbahar')) area = 'Gulbahar'
  else if (msgLower.includes('warsak')) area = 'Warsak Road'
  else if (msgLower.includes('jamrud') || msgLower.includes('khyber')) area = 'Khyber Pass / Jamrud'

  // Query verified database with fuzzy matching & relevance scoring
  let matchingPlaces = await searchPlaces({
    query: userMessage,
    category,
    area,
    limit: 4,
  })

  // If filtered by category/area produced nothing, try without category/area constraints to see if place name matches
  if (matchingPlaces.length === 0) {
    matchingPlaces = await searchPlaces({
      query: userMessage,
      limit: 4,
    })
  }

  // Determine language mode
  const isRomanUrdu = /batao|chahiye|kahan|kidhar|achha|acha|hai|hein|hain|mein|main|ke qareeb|ke paas|ki jagah|shukriya|sasta|bohat|mujhe|kya|konsa|konsi|dastiyab|waqia/.test(msgLower)

  let textResponse = ''

  if (matchingPlaces.length > 0) {
    const topPlace = matchingPlaces[0]

    // If query was looking for a specific single place (high relevance score or single match)
    const isSpecificSinglePlace = matchingPlaces.length === 1 || (topPlace._relevanceScore && topPlace._relevanceScore >= 80)
    const returnPlaces = isSpecificSinglePlace ? [topPlace] : matchingPlaces

    if (isRomanUrdu) {
      textResponse = `**${topPlace.name}** (${topPlace.urdu_name || ''})\n\n`
      textResponse += `📍 **Location:** ${topPlace.address}\n`
      textResponse += `⭐ **Rating:** ${topPlace.rating}/5.0 (${topPlace.review_count || 0} reviews)\n`
      textResponse += `🕒 **Timings:** ${topPlace.opening_hours?.mon_fri || 'Open daily'}\n`
      if (topPlace.phone) textResponse += `📞 **Phone:** ${topPlace.phone}\n`
      textResponse += `\n📝 **Details:** ${topPlace.description}`
      if (returnPlaces.length > 1) {
        textResponse += `\n\nAap ke liye mazeed mutaliqa options bhi niche diye gaye hain:`
      }
    } else {
      textResponse = `**${topPlace.name}** (${topPlace.urdu_name || ''})\n\n`
      textResponse += `📍 **Location:** ${topPlace.address}\n`
      textResponse += `⭐ **Rating:** ${topPlace.rating}/5.0 (${topPlace.review_count || 0} reviews)\n`
      textResponse += `🕒 **Timings:** ${topPlace.opening_hours?.mon_fri || 'Open daily'}\n`
      if (topPlace.phone) textResponse += `📞 **Phone:** ${topPlace.phone}\n`
      textResponse += `\n📝 **Details:** ${topPlace.description}`
      if (returnPlaces.length > 1) {
        textResponse += `\n\nHere are additional relevant options matching your query:`
      }
    }

    return {
      reply: textResponse,
      places: returnPlaces,
    }
  } else {
    // If no direct specific match, return top places in detected category if any, or general guidance
    if (category) {
      const categoryPlaces = await searchPlaces({ category, limit: 3 })
      if (isRomanUrdu) {
        textResponse = `Aap ki specific query ke mutabiq exact jagah database mein nahi mili, lekin is category (**${category.toUpperCase()}**) ke verified aur top-rated places yeh hain:`
      } else {
        textResponse = `I could not find an exact match for that specific term in our directory, but here are the top-rated verified options in **${category.toUpperCase()}**:`
      }
      return {
        reply: textResponse,
        places: categoryPlaces,
      }
    } else {
      if (isRomanUrdu) {
        textResponse = `Aap ki query ke mutabiq koi specific jagah nahi mili. Aap Peshawar ke kisi specific ilaqay (Saddar, University Road, Hayatabad, Namak Mandi) ya category (Restaurants, Hospitals, IT/Tech, Shopping) ke baray mein pooch saktay hain.`
      } else {
        textResponse = `I couldn't find a direct place matching your query in the verified Peshawar directory. Please specify an area (Saddar, University Road, Hayatabad, Namak Mandi) or category (Restaurants, Hospitals, Tech & Repairs, Shopping, Tourism).`
      }
      return {
        reply: textResponse,
        places: [],
      }
    }
  }
}

/**
 * Main Chat Processing Handler
 */
export const processChatMessage = async (userMessage, conversationHistory = []) => {
  if (!userMessage || typeof userMessage !== 'string') {
    throw new Error('User message is required.')
  }

  // 1. If Gemini API is not configured or fails, gracefully fallback to local NLU engine
  if (!genAI) {
    return await handleLocalHeuristicChat(userMessage)
  }

  try {
    const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash']
    let replyText = null

    // Fetch verified places from database with fuzzy scoring to supply as ground truth context
    const retrievedPlaces = await searchPlaces({ query: userMessage, limit: 5 })

    const groundTruthContext = `
VERIFIED LOCAL DATABASE CONTEXT FOR PESHAWAR:
${JSON.stringify(retrievedPlaces, null, 2)}

INSTRUCTIONS:
1. Use the above verified places data to answer the user's inquiry naturally, warmly, accurately, and concisely.
2. If the user asked in Roman Urdu or Urdu, answer in Roman Urdu or Urdu. If in English, answer in English.
3. Highlight key details such as specific location, timings, phone numbers, and offerings.
4. If no places in the verified database match the query, honestly state that without inventing false places or returning random unrelated restaurants.
`

    const prompt = `${groundTruthContext}\n\nUser Question: ${userMessage}`

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        })
        const result = await model.generateContent(prompt)
        replyText = result.response.text()
        if (replyText) break
      } catch (err) {
        // try next model or fallback
      }
    }

    if (replyText && retrievedPlaces.length > 0) {
      return {
        reply: replyText,
        places: retrievedPlaces,
      }
    } else {
      return await handleLocalHeuristicChat(userMessage)
    }
  } catch (error) {
    console.error('Chat processing error, falling back to NLU:', error.message)
    return await handleLocalHeuristicChat(userMessage)
  }
}

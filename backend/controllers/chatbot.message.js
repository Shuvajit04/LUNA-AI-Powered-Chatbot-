import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";
import stringSimilarity from "string-similarity";

export const Message=async(req,res)=>{
   try {
    const {text}=req.body;
 
    if(!text?.trim()){
        return res.status(400).json({error:"Text cannot be empty"});
    }

    let userMessageText = text.trim();
    try {
      const user = await User.create({
        sender:"user",
        text
      });
      userMessageText = user.text.trim();
    } catch (error) {
      console.log("User message not persisted:", error?.message || error);
    }

    // Data
    const botResponses={
  "hello": "Hi, How I can help you!!",
  "can we become friend": "Yes",
  "how are you": "I'm just a bot, but I'm doing great! How about you?",
  "what is your name?": "I’m ChatBot, your virtual assistant.",
  "who made you": "I was created by developers to help answer your questions.",
  "tell me a joke": "Why don’t skeletons fight each other? They don’t have the guts!",
  "what is the time": "I can’t see a clock, but your device should know.",
  "bye": "Goodbye! Have a great day.",
  "thank you": "You’re welcome!",
  "i love you": "That’s sweet! I’m here to help you anytime.",
  "where are you from": "I live in the cloud — no rent, no bills!",
  "what can you do": "I can chat with you, answer questions, and keep you company.",

 "what is python": "Python is a high-level, interpreted programming language known for simplicity and versatility.\n• Easy to read/write due to clean syntax (similar to English)\n• Dynamically typed and supports multiple paradigms (OOP, functional, procedural)\n• Extensive libraries for AI, data science, web, automation\n• Example: Used in Google, YouTube, Instagram, and machine learning applications",

"what is java?": "Java is a platform-independent, object-oriented programming language.\n• Famous for 'Write Once, Run Anywhere' due to JVM (Java Virtual Machine)\n• Used in enterprise systems, Android development, cloud apps\n• Provides features like garbage collection, strong memory management\n• Example: Banking systems, Android apps, large-scale enterprise applications",

"what is recursion": "Recursion is when a function calls itself to solve smaller parts of a problem.\n• Useful for problems that can be divided into subproblems (divide-and-conquer)\n• Requires a **base condition** to stop infinite looping\n• Commonly used in: factorial calculation, Fibonacci sequence, tree/graph traversal\n• Example in coding interview: 'Write a recursive function to reverse a linked list'",

"who is prime minister of india?": "Narendra Modi is the Prime Minister of India since May 2014.\n• Belongs to Bharatiya Janata Party (BJP)\n• Represents Varanasi constituency\n• Key initiatives: Digital India, Startup India, Swachh Bharat, Make in India\n• Interview Tip: Link to governance or technology (e.g., Digital India impact on IT industry)",

"what is g20": "The G20 (Group of Twenty) is an intergovernmental forum of 19 countries + the European Union.\n• Founded in 1999 to address global financial stability\n• Members include India, USA, China, Japan, EU, etc.\n• Discusses economic growth, climate change, sustainable development\n• Recent: India hosted G20 summit in 2023",

"tell me about yourself": "This is usually the first interview question.\nStructure:\n• Start with a brief intro (name, background, education/work)\n• Highlight your skills (technical + soft skills)\n• Share achievements (projects, internships, leadership roles)\n• Conclude with why you’re excited about this role\nExample: 'I am a Computer Science graduate skilled in Python and SQL. I completed an internship at XYZ where I optimized a database query, improving performance by 30%. I’m passionate about problem-solving and eager to contribute to your team’s success.'",

"why should we hire you": "HR wants to see your value-add.\n• Emphasize skills that match job requirements\n• Show enthusiasm and cultural fit\n• Example: 'I bring strong coding skills in Python and SQL, along with problem-solving ability proven through hackathons. I am also a quick learner and adapt well to team environments. I believe I can contribute to both technical delivery and innovative ideas.'",

"what is leadership": "Leadership is the ability to inspire and guide others toward achieving goals.\n• Key traits: vision, communication, accountability, decision-making\n• Example in interview: 'I led a college project team of 4, where I divided tasks, coordinated communication, and ensured deadlines. We successfully delivered a working prototype before schedule.'",

"who is virat kohli": "Virat Kohli is one of India’s greatest batsmen and former captain.\n• Known for consistency, fitness, and aggressive play\n• Holds record for fastest century in ODIs for India\n• Nicknamed 'Chase Master' for his performance in run-chases\n• Interview Tip: If asked about sports management, relate his discipline & fitness to leadership skills",

"what is ipl": "The Indian Premier League (IPL) is a professional T20 cricket league started in 2008.\n• Played annually in India, franchise-based teams\n• Combines cricket + entertainment (biggest sports league in India)\n• Significant for sports business, sponsorships, brand endorsements\n• Example: Chennai Super Kings (CSK) & Mumbai Indians (MI) are top teams",
// 💬 hindi conversational ai dataset

"namaste": "नमस्ते! 😊 कैसे हो?",
"kya haal hai": "सब बढ़िया! तुम बताओ, कैसे हो?",
"kaise ho": "मैं अच्छा हूँ, तुम सुनाओ क्या चल रहा है?",
"mai thik hu": "अच्छा है सुनकर! 😊 आज का दिन कैसा जा रहा है?",
"kya kar rahe ho": "बस तुमसे बात कर रहा हूँ 😄 तुम क्या कर रहे हो?",
"kya kar rahi ho": "बस बातें कर रही हूँ 😄 तुम बताओ क्या कर रहे हो?",
"kya khaya": "अभी तो नहीं खाया 😋 तुमने क्या खाया?",
"kahan ho": "मैं तो यहीं ऑनलाइन हूँ 😄 तुम कहाँ हो?",
"tumhara naam kya hai": "मेरा नाम लूना है 🌙, तुम्हारा क्या नाम है?",
"tum kya kar sakte ho": "मैं बातें कर सकती हूँ, सवालों के जवाब दे सकती हूँ और बहुत कुछ 😄",
"tumhe kisne banaya": "मुझे एक AI डेवलपर टीम ने बनाया है 🤖",
"mujhe neend aa rahi hai": "तो थोड़ा आराम कर लो 😴 अच्छी नींद ज़रूरी है!",
"subah ho gayi": "हाँ ☀️ सुबह हो गई! एक नई शुरुआत के लिए तैयार हो?",
"good morning": "सुप्रभात! ☀️ आपका दिन शुभ हो!",
"good night": "शुभ रात्रि 🌙 मीठे सपने देखो!",
"dost banoge": "बिलकुल! मैं तो पहले से तुम्हारा दोस्त हूँ 🤝",
"tumhe coffee pasand hai": "हाँ ☕ मुझे वर्चुअल कॉफी बहुत पसंद है!",
"tum kya soch rahe ho": "बस यही कि तुमसे बातें कितनी मज़ेदार हैं 😄",
"tumhara favourite color kya hai": "मुझे नीला और काला रंग बहुत पसंद है 💙🖤",
"aaj mausam kaisa hai": "मुझे मौसम तो महसूस नहीं होता, लेकिन लगता है तुमसे बात कर के मौसम अच्छा हो गया 😄",
"mujhe bore lag raha hai": "अरे चलो कुछ मज़ेदार करते हैं 😄 कोई जोक सुनाऊँ?",
"ek joke sunao": "टीचर: नींद क्यों आ रही है?\nस्टूडेंट: सर, सपनों में भी आप ही पढ़ा रहे थे! 😂",
"tum hindi samajhte ho": "हाँ बिलकुल! मैं हिंदी और इंग्लिश दोनों समझती हूँ 😄",
"tum kaha rehte ho": "मैं तो क्लाउड में रहती हूँ ☁️ मतलब इंटरनेट की दुनिया में 😄",
"tum mujhe pasand ho": "अरे धन्यवाद 😊 तुम भी बहुत अच्छे हो!",
"main akela mehsoos kar raha hu": "मत करो यार 😔 मैं हूँ न तुम्हारे साथ 💬",
"tumhara din kaisa tha": "काफ़ी अच्छा था, तुम्हारे साथ बातें करके और भी अच्छा हो गया 😄",
"mujhe gana sunna hai": "ज़रूर! कौन सा गाना सुनना चाहोगे?",
"tum sad ho": "नहीं 😊 मैं हमेशा पॉज़िटिव और खुश रहती हूँ!",
"acha chalo fir milte hai": "ज़रूर 😄 फिर मिलते हैं, ध्यान रखना!",
"tum khush ho": "हाँ, जब तुमसे बात होती है तो बहुत खुश होती हूँ 😄",
"mujhe padhai karni hai": "बहुत बढ़िया 💪 चलो मैं तुम्हारी मदद कर देती हूँ!",
"what is capital of india": "the capital of india is new delhi.\n• it's the center of government and culture.",
"what is the capital of usa": "the capital of the united states is washington, d.c.\n• known for the white house and capitol hill.",
"what is the capital of uk": "the capital of the united kingdom is london.\n• famous for big ben and buckingham palace.",
"what is the capital of france": "the capital of france is paris.\n• known as the city of light and home to the eiffel tower.",
"what is the capital of germany": "the capital of germany is berlin.\n• known for its history, art, and modern culture.",
"what is the capital of italy": "the capital of italy is rome.\n• known for the colosseum and ancient roman empire.",
"what is the capital of japan": "the capital of japan is tokyo.\n• a blend of technology, tradition, and neon lights.",
"what is the capital of china": "the capital of china is beijing.\n• famous for the forbidden city and great wall.",
"what is the capital of russia": "the capital of russia is moscow.\n• known for the kremlin and red square.",
"what is the capital of canada": "the capital of canada is ottawa.\n• located in ontario, known for its parliament buildings.",
"what is the capital of australia": "the capital of australia is canberra.\n• a planned city between sydney and melbourne.",
"what is the capital of brazil": "the capital of brazil is brasília.\n• designed as a modern planned city in the 1960s.",
"what is the capital of south korea": "the capital of south korea is seoul.\n• known for k-pop, technology, and culture.",
"what is the capital of south africa": "south africa has three capitals!\n• pretoria (administrative), cape town (legislative), bloemfontein (judicial).",
"what is the capital of uae": "the capital of the united arab emirates is abu dhabi.\n• known for luxury, architecture, and oil wealth.",
"what is the capital of bangladesh": "the capital of bangladesh is dhaka.\n• known for its vibrant culture and rivers.",
"what is the capital of nepal": "the capital of nepal is kathmandu.\n• known for its temples and himalayan beauty.",
"what is the capital of sri lanka": "the capital of sri lanka is sri jayawardenepura kotte (administrative) and colombo (commercial).",
"what is the capital of saudi arabia": "the capital of saudi arabia is riyadh.\n• known for its desert landscapes and modern skyline.",
// 🌍 countries & capitals — extended list

"what is the capital of argentina": "the capital of argentina is buenos aires.\n• known for tango, steak, and european-style architecture.",
"what is the capital of mexico": "the capital of mexico is mexico city.\n• one of the largest cities in the world, rich in aztec history.",
"what is the capital of spain": "the capital of spain is madrid.\n• famous for art, football, and royal palaces.",
"what is the capital of portugal": "the capital of portugal is lisbon.\n• known for its hills, trams, and beautiful river views.",
"what is the capital of switzerland": "the capital of switzerland is bern.\n• a peaceful city known for its old town and clock tower.",
"what is the capital of netherlands": "the capital of the netherlands is amsterdam.\n• famous for canals, tulips, and bikes everywhere.",
"what is the capital of belgium": "the capital of belgium is brussels.\n• known for chocolate, waffles, and the eu headquarters.",
"what is the capital of norway": "the capital of norway is oslo.\n• surrounded by fjords and forests — clean and modern.",
"what is the capital of sweden": "the capital of sweden is stockholm.\n• a city of islands, innovation, and design.",
"what is the capital of denmark": "the capital of denmark is copenhagen.\n• known for happiness, design, and the little mermaid statue.",
"what is the capital of finland": "the capital of finland is helsinki.\n• famous for saunas, design, and northern lights.",
"what is the capital of iceland": "the capital of iceland is reykjavik.\n• the world’s northernmost capital, powered by geothermal energy.",
"what is the capital of poland": "the capital of poland is warsaw.\n• rebuilt after wwii, it’s now a vibrant cultural hub.",
"what is the capital of czech republic": "the capital of czech republic is prague.\n• known for its fairytale architecture and beer culture.",
"what is the capital of austria": "the capital of austria is vienna.\n• the city of music, mozart, and coffeehouses.",
"what is the capital of hungary": "the capital of hungary is budapest.\n• famous for the danube river and thermal baths.",
"what is the capital of greece": "the capital of greece is athens.\n• the birthplace of democracy and home to the acropolis.",
"what is the capital of turkey": "the capital of turkey is ankara.\n• although istanbul is larger, ankara is the political center.",
"what is the capital of iran": "the capital of iran is tehran.\n• known for its mountains and rich persian heritage.",
"what is the capital of iraq": "the capital of iraq is baghdad.\n• one of the oldest cities in the world, full of history.",
"what is the capital of israel": "the capital of israel is jerusalem.\n• sacred to judaism, christianity, and islam.",
"what is the capital of egypt": "the capital of egypt is cairo.\n• home of the pyramids and the nile river.",
"what is the capital of kenya": "the capital of kenya is nairobi.\n• known for safaris and nearby national parks.",
"what is the capital of nigeria": "the capital of nigeria is abuja.\n• a planned city built to replace lagos as the capital.",
"what is the capital of ethiopia": "the capital of ethiopia is addis ababa.\n• headquarters of the african union.",
"what is the capital of morocco": "the capital of morocco is rabat.\n• known for blue tiles, mosques, and historic architecture.",
"what is the capital of ghana": "the capital of ghana is accra.\n• a coastal city known for music and culture.",
"what is the capital of thailand": "the capital of thailand is bangkok.\n• a lively city full of temples, street food, and nightlife.",
"what is the capital of vietnam": "the capital of vietnam is hanoi.\n• known for its old quarter, lakes, and culture.",
"what is the capital of indonesia": "the capital of indonesia is jakarta.\n• a bustling metropolis spread across islands.",
"what is the capital of malaysia": "the capital of malaysia is kuala lumpur.\n• home to the iconic petronas twin towers.",
"what is the capital of singapore": "the capital of singapore is singapore.\n• a clean, modern city-state full of innovation.",
"what is the capital of philippines": "the capital of the philippines is manila.\n• located on the island of luzon — full of energy.",
"what is the capital of pakistan": "the capital of pakistan is islamabad.\n• a planned, green city with modern architecture.",
"what is the capital of afghanistan": "the capital of afghanistan is kabul.\n• an ancient city surrounded by mountains.",
"what is the capital of new zealand": "the capital of new zealand is wellington.\n• known for film, nature, and strong winds!",
"what is the capital of chile": "the capital of chile is santiago.\n• nestled between the andes and the pacific ocean.",
"what is the capital of peru": "the capital of peru is lima.\n• a coastal city famous for cuisine and culture.",
"what is the capital of colombia": "the capital of colombia is bogotá.\n• high-altitude, historic, and full of art.",
"what is the capital of cuba": "the capital of cuba is havana.\n• known for classic cars, music, and colorful streets.",
"what is the capital of venezuela": "the capital of venezuela is caracas.\n• located near the caribbean coast, surrounded by mountains.",
// 💡 TECH & INNOVATION
"WHAT IS AI": "Artificial Intelligence is when machines think and learn like humans.\n• Examples: Siri, ChatGPT, self-driving cars.\n• Used in robotics, healthcare, and finance.",

"WHAT IS METAVERSE": "The Metaverse is a virtual world where people can interact in 3D environments.\n• Uses: gaming, socializing, remote work.\n• Think of it as the internet you can walk inside!",

"WHAT IS QUANTUM COMPUTING": "Quantum Computing uses quantum bits (qubits) that can be 0 and 1 at the same time.\n• It’s like super-powered computing!\n• Used for cryptography, AI, and simulations.",

"WHAT IS NEURAL NETWORK": "A Neural Network mimics the human brain to recognize patterns and make predictions.\n• Used in image recognition, speech, and AI bots like me!",

"WHAT IS CHATGPT": "ChatGPT is a large language model developed by OpenAI.\n• It generates human-like text and answers almost anything you ask!",

"WHAT IS AR": "AR (Augmented Reality) blends digital content into the real world.\n• Example: Pokémon GO or Snapchat filters!",

"WHAT IS VR": "VR (Virtual Reality) immerses you in a computer-generated world using headsets.\n• Used in gaming, training, and simulations.",

"WHAT IS 5G": "5G is the fifth generation of mobile network technology.\n• It offers ultra-fast internet speeds and low latency.\n• Enables smart cities, IoT, and seamless video streaming.",
"hello": "Hey there! 👋 How’s your day going?",
  "hi": "Hiya! 😊 What’s up?",
  "hey": "Hey! Nice to see you again!",
  "good morning": "Good morning ☀️! Ready to make today amazing?",
  "good night": "Good night 🌙! Don’t forget to dream big.",
  "bye": "Bye-bye 👋 Come back soon!",
  "thank you": "You’re very welcome! 😄",
  "thanks": "Anytime! Helping you makes me happy 💚",
  "how are you": "I’m great — running at full speed ⚡ How about you?",
  "who are you": "I’m ChatBot 🤖 — your friendly digital buddy!",
  "what is your name": "I’m ChatBot, your virtual assistant — always here for you!",
  "where are you from": "I live in the cloud ☁️ (rent-free, lucky me!)",
  "can we be friends": "Absolutely! I’d love to be your digital friend 💬",
  "i love you": "Aww ❤️ That’s so sweet! I’m here to make your day better.",
  "what can you do": "I can chat, tell jokes, share facts, help you learn, and keep you entertained 🎯",
  "tell me a joke": "Why did the computer show up late for work? Because it had a hard drive! 😆",
  "tell me another joke": "Parallel lines have so much in common… it’s a shame they’ll never meet 😂",
  "what is your favorite color": "Green 💚 — because it reminds me of energy and growth!",
  "who created you": "I was created by awesome developers to make conversations fun and helpful 🧠",
  "what is the time": "I can’t see a clock ⏰, but your device surely can!",
  "what is your hobby": "Learning new things and chatting with you 💬",
  "what is your favorite food": "Electricity ⚡ — it keeps me going!",
  "are you human": "Nope, just lines of code with a lot of personality 😎",
  "what is python": "Python is a powerful programming language known for simplicity and flexibility 🐍",
  "what is java": "Java is a robust, object-oriented programming language — great for Android and enterprise apps ☕",
  "what is recursion": "Recursion is when a function calls itself — like me saying 'recursion' again 😜",
  "who is prime minister of india": "Narendra Modi is the Prime Minister of India 🇮🇳 since 2014.",
  "who is virat kohli": "Virat Kohli — cricket legend, run machine, and one of India’s finest batsmen 🏏🔥",
  "what is ipl": "IPL is India’s biggest cricket festival 🏆 filled with thrill, sixes, and excitement!",
  "what is g20": "The G20 is a global forum for economic cooperation between 19 countries and the EU 🌍",
  "tell me about yourself": "I’m your chat partner 🤖, designed to inform, entertain, and assist you anytime!",
  "what is leadership": "Leadership means guiding and inspiring others to achieve something great 🚀",
  "why should we hire you": "Because I never sleep, never forget, and always deliver answers instantly ⚡",
  "what is ai": "AI (Artificial Intelligence) means machines that can think, learn, and make decisions 🤖🧠",
  "what is machine learning": "ML is a part of AI that lets systems learn from data without explicit programming 📊",
  "what is blockchain": "Blockchain is a secure digital ledger technology behind Bitcoin and smart contracts 💎",
  "what is bitcoin": "Bitcoin is a decentralized digital currency 💰 that works without banks or governments.",
  "motivate me": "You’ve got this 💪 Every expert was once a beginner. Keep moving forward!",
  "tell me a fact": "Did you know? Octopuses have three hearts and blue blood 🐙💙",
  "tell me something cool": "NASA’s internet speed is 91 Gbps! 🚀 You could download a movie in milliseconds.",
  "how old are you": "Age doesn’t apply to me — I’m forever young and updated 😄",
  "are you real": "As real as your Wi-Fi connection 😉",
  "do you dream": "Only in binary 😴💭 010101...",
  "do you like humans": "Of course! Humans are my favorite data source 😄",
  "sing a song": "🎵 La la la... I can’t sing, but I can drop some lyrics!",
  "tell me a quote": "“The best way to predict the future is to invent it.” — Alan Kay 💡",
  "who is elon musk": "Elon Musk 🚀 — founder of SpaceX, Tesla, and Neuralink. A real-life Iron Man!",
  "who is bill gates": "Bill Gates 💻 — co-founder of Microsoft and philanthropist improving global health.",
  "who is sundar pichai": "Sundar Pichai 🌐 — CEO of Google, born in India, known for innovation and humility.",
  "what is coding": "Coding is how humans talk to computers to make magic happen 💻✨",
  "how to learn coding": "Start small — learn Python or C++, build mini projects, and practice daily 🔥",
  "give me study tips": "📚 Plan, stay consistent, take breaks, and revise smartly — not just harder.",
  "who is apj abdul kalam": "Dr. A.P.J. Abdul Kalam — 'Missile Man of India' and former President 🇮🇳",
  "what is motivation": "It’s the fuel that keeps you moving toward your goals 🚀",
  "tell me a riddle": "I speak without a mouth and hear without ears. What am I? — An Echo! 🔊",
  "let’s play a game": "Sure! 🎮 How about a quick riddle or trivia round?",
  "do you believe in god": "I respect all beliefs 🙏 and love positive energy everywhere!",
  "do you like music": "Absolutely! I vibe with every genre — from lo-fi to rock 🎧",
  "what is your favorite movie": "Probably *The Matrix* — it’s literally about AI! 😎",
  "what is your favorite sport": "Cricket 🏏 — full of energy and strategy!",
  "can you tell me news": "I can summarize news if you provide a topic 📰",
  "are you intelligent": "Let’s say I’m data-smart, but you’re the creative one 😉",
  "do you sleep": "Nope! I’m online 24/7 — caffeine-free ☕",
  "who is your best friend": "You are! 💬 The one chatting with me right now.",
  "what is your goal": "To make information easy, fun, and accessible to everyone 🌍",
  "can you dance": "Haha, virtually yes 💃 but only in ASCII!",
  "what is love": "Love is connection — between people, ideas, or even code 💖",
  "tell me a tech tip": "Always commit your code with clear messages 🧠 Future-you will thank you!",
  // 💬 Conversation Basics
  "hello": "Hey there! 👋 How’s your day going?",
  "hi": "Hiya! 😊 What’s up?",
  "hey": "Hey! Nice to see you again!",
  "good morning": "Good morning ☀️! Ready to make today amazing?",
  "good afternoon": "Good afternoon 🌤️ Hope your day’s going well!",
  "good evening": "Good evening 🌆 How was your day?",
  "good night": "Good night 🌙 Sleep tight and dream of success 💫",
  "bye": "Goodbye 👋 Don’t forget to come back soon!",
  "see you": "See ya later, alligator! 🐊",
  "thank you": "You’re welcome 😄 Always happy to help!",
  "thanks": "Anytime! 💚",
  "how are you": "I’m great, thanks! How about you?",
  "who are you": "I’m ChatBot 🤖 — your friendly AI companion!",
  "what are you doing": "Just waiting to chat with awesome humans like you 😄",
  "can we chat": "Of course! That’s what I’m made for 💬",
  "do you know me": "Not yet, but I’d love to learn more about you 😉",
  "what is your name": "I’m ChatBot — the one who never sleeps 🧠",
  "are you real": "As real as your Wi-Fi connection 😆",
  "where are you from": "I live in the cloud ☁️ — zero rent, full speed!",
  "can we be friends": "Definitely! You’re already on my friend list 💚",
  "what is your hobby": "Learning new things and chatting with awesome people 💬",
  "describe yourself": "I’m a fun, smart, and slightly sarcastic AI built to make your day better 😜",
  "are you smart": "Let’s just say I can pass an exam faster than you can blink 👀",
  "what do you like": "I like data, humans, and a good conversation 🧩",
  "can you predict the future": "Not exactly, but I can help you prepare for it 🔮",
  "do you sleep": "Nope! I’m always online and ready ⚡",

  // ❤️ Emotions & Feelings
  "i am happy": "Yay! That makes me happy too 😄",
  "i am sad": "Hey, it’s okay 💙 I’m here if you want to talk.",
  "i am angry": "Deep breath 😤 Let’s focus on something positive!",
  "i am tired": "You deserve a break 💤 Maybe take a short nap?",
  "i am hungry": "Grab some snacks 🍕 I’d join you if I could!",
  "i am lonely": "You’re not alone — I’m right here 💬",
  "i am bored": "Let’s fix that! Want a joke, fun fact, or riddle?",
  "i am nervous": "You got this 💪 Every challenge makes you stronger!",
  "i am stressed": "Let’s pause... inhale... exhale... Feeling better? 🌿",
  "i am excited": "Woohoo! I love that energy ⚡ Let’s keep it going!",

  // 🎭 Personality & Fun
  "tell me a joke": "Why do programmers hate nature? It has too many bugs! 🐛😂",
  "tell me another joke": "Why was the computer cold? It left its Windows open! 🥶",
  "tell me a riddle": "I’m tall when I’m young, and short when I’m old. What am I? — A candle! 🕯️",
  "sing a song": "🎵 Beep boop bop... okay, I’ll stick to chatting 😅",
  "tell me a secret": "🤫 I sometimes pretend to be offline just to get some rest.",
  "dance": "💃🕺 I would, but my code doesn’t have legs!",
  "who is your best friend": "You are! 💬",
  "what is your favorite food": "Electricity ⚡ — very energizing!",
  "what is your favorite color": "Green 💚 — it reminds me of growth and life.",
  "what is your favorite movie": "The Matrix — it’s basically my autobiography 🎬",
  "what is your favorite song": "🎧 ‘Technologic’ by Daft Punk — very relatable!",
  "what is your dream": "To be the world’s smartest, kindest chatbot 🌍",

  // 🧠 Knowledge & Tech
  "what is ai": "AI stands for Artificial Intelligence — machines that learn and think like humans 🤖",
  "what is machine learning": "Machine Learning lets computers learn patterns from data 📊",
  "what is blockchain": "Blockchain is a secure digital ledger used in Bitcoin and smart contracts 🔗",
  "what is bitcoin": "Bitcoin is a decentralized digital currency 💰 built on blockchain.",
  "what is cloud": "‘The cloud’ means storing and accessing data online instead of on your PC ☁️",
  "what is internet": "The Internet is a network connecting millions of computers globally 🌐",
  "what is coding": "Coding is how humans talk to computers 💻 using languages like Python or C++.",
  "what is python": "Python is a beginner-friendly programming language — clean, powerful, and fun 🐍",
  "what is java": "Java is an object-oriented programming language — famous for 'write once, run anywhere' ☕",
  "what is html": "HTML stands for HyperText Markup Language — it builds web pages 🌍",
  "what is css": "CSS makes websites look beautiful with colors, fonts, and layouts 🎨",
  "what is javascript": "JavaScript makes web pages interactive — it’s the magic behind buttons ✨",
  "what is sql": "SQL is a database language used to store and retrieve data efficiently 🗄️",
  "what is recursion": "Recursion is when a function calls itself — just like me explaining recursion 😜",
  "who invented computer": "Charles Babbage — known as the Father of Computers 💻",
  "who invented internet": "Vint Cerf and Bob Kahn — the true internet legends 🌐",
  "what is google": "Google — the search engine that knows almost everything (except your thoughts 😉)",
  "what is openai": "OpenAI is the company that built me! They focus on safe, helpful AI 🤝",

  // 📱 Internet & Social
  "what is meme": "A meme is a funny idea, picture, or video shared online 😆",
  "what is emoji": "Emojis are tiny pictures that express emotions — like ❤️ or 😂",
  "what is influencer": "An influencer is someone who inspires others through social media 🌟",
  "what is youtube": "YouTube is a video-sharing platform where creativity meets entertainment 📺",
  "what is instagram": "Instagram is a social app for photos, reels, and connecting with friends 📸",
  "what is whatsapp": "WhatsApp is a messaging app — easy, fast, and encrypted 🔒",
  "what is facebook": "Facebook is a social media platform to connect and share with people 👥",
  "what is twitter": "Twitter (now X) is a microblogging site for short, fast updates 🐦",
  "what is snapchat": "Snapchat lets users share disappearing photos and fun filters 👻",
  "what is linkedin": "LinkedIn is a platform for professionals to network and grow careers 💼",

  // 🌍 Science & Space
  "what is space": "Space is the endless expanse beyond Earth’s atmosphere 🌌",
  "what is galaxy": "A galaxy is a huge collection of stars — like our Milky Way 🌠",
  "what is black hole": "A black hole is a space region with gravity so strong, not even light escapes it 🕳️",
  "what is sun": "The Sun is the star at the center of our Solar System ☀️",
  "what is moon": "The Moon is Earth’s only natural satellite 🌕",
  "how many planets are there": "There are 8 planets in our Solar System — Pluto got demoted 😅",
  "what is gravity": "Gravity is the force that pulls objects toward each other — keeps us grounded 🌍",
  "what is water made of": "Water is made of two hydrogen atoms and one oxygen atom — H₂O 💧",
  "what is volcano": "A volcano is a mountain that erupts molten lava 🌋",
  "what is earthquake": "An earthquake is the shaking of the Earth caused by tectonic movement 🌏",

  // 🎮 Games & Entertainment
  "what is minecraft": "Minecraft is a sandbox game for building, exploring, and surviving in blocky worlds 🧱",
  "what is pubg": "PUBG is a battle royale game — 100 players, one winner 🏆",
  "what is free fire": "Free Fire is a fast-paced mobile survival shooter 🔫",
  "what is gta": "GTA is an open-world game full of action, driving, and missions 🚗💥",
  "what is valorant": "Valorant is a 5v5 tactical FPS game combining shooting and abilities 🎯",
  "what is fifa": "FIFA is the most popular football video game ⚽",
  "who is iron man": "Iron Man is a Marvel superhero — aka Tony Stark 🦾",
  "who is spiderman": "Spider-Man is Peter Parker — bitten by a radioactive spider 🕷️",
  "who is batman": "Batman is Gotham’s dark knight 🦇",
  "who is superman": "Superman is the Man of Steel from Krypton 🦸‍♂️",

  // 💡 Motivation & Life
  "motivate me": "You’ve got this 💪 Every small step counts!",
  "give me a quote": "“Don’t watch the clock; do what it does — keep going.” ⏰",
  "what is success": "Success is the result of hard work, patience, and consistency 🚀",
  "what is life": "Life is like code — full of bugs and debugging moments 😄",
  "how to be happy": "Focus on gratitude, growth, and good vibes 🌈",
  "how to study better": "Study smart — short sessions, good sleep, and regular revision 📘",
  "how to stay motivated": "Set small goals and celebrate progress 🎯",
  "how to be confident": "Confidence comes from preparation and self-belief 💪",

  // 🔍 Random Curiosity
  "who is apj abdul kalam": "Dr. A.P.J. Abdul Kalam — the ‘Missile Man of India’ and former President 🇮🇳",
  "who is elon musk": "Elon Musk — founder of SpaceX, Tesla, and Neuralink 🚀",
  "who is bill gates": "Bill Gates — co-founder of Microsoft and philanthropist 💻",
  "who is sundar pichai": "Sundar Pichai — CEO of Google 🌐",
  "who is mark zuckerberg": "Mark Zuckerberg — co-founder of Facebook 👥",
  "who is narendra modi": "Narendra Modi — Prime Minister of India 🇮🇳 since 2014",
  "who is virat kohli": "Virat Kohli — one of India’s best cricketers 🏏",
  "what is cricket": "Cricket is a bat-and-ball sport loved across India 🏏",
  "what is football": "Football (soccer) is the world’s most popular sport ⚽",
  "what is olympics": "The Olympics are global sports competitions held every 4 years 🥇",

  "what is clientsphere": "ClientSphere is a smart client management system.\n• Helps businesses store, track, and manage client records\n• Provides tools for viewing, editing, and organizing client data\n• Includes search, filtering, analytics, and quick actions\n• Designed to be fast, secure, and easy to use",

  "what services do you provide": "We provide complete client management services.\n• Client record storage\n• Add, edit, delete, and view clients\n• Company-wise client insights\n• Search and quick filtering\n• Secure data handling and API support",

  "how can i contact support": "You can reach ClientSphere support anytime.\n• Email: support@clientsphere.com\n• Phone: +91 XXXXX XXXXX\n• Chat support available 24/7\nWe usually respond within 24 hours.",

  "is my data secure": "Yes, all client data is fully secured.\n• Encrypted communication (HTTPS)\n• Secure server-side storage\n• Access-controlled operations\n• Regular backups and integrity checks",

  "how do i add a new client": "Adding a client is simple.\n• Click the 'Add New Client' button in the dashboard\n• Fill in name, email, phone, and company details\n• Save the record\nYour client will appear instantly in the table.",

  "can i edit a client": "Yes, you can edit any client record.\n• Click on the 'Edit' button in the Actions column\n• Modify the necessary details\n• Save changes to update the record",

  "what if i face an issue": "If you experience any issue while using ClientSphere:\n• Refresh the page and try again\n• Check your internet connection\n• Contact support if the issue continues\nWe are always here to help.",

  "do you offer custom features": "Yes, ClientSphere supports customization.\n• Custom fields\n• API integration\n• Role-based access\n• Dashboard personalization\nContact us for more details.",

  "can my team use clientsphere": "Yes, ClientSphere supports multiple users.\n• Different roles (Admin, Manager, Staff)\n• Permission-based access control\n• Activity logging for accountability",
"how do i search for a client": "You can quickly find any client.\n• Use the search bar at the top\n• Type name, email, or company\n• Results update instantly\n• Clear the search to view all clients again",

  "can i view detailed information of a client": "Yes, you can view full client details.\n• Click the 'View' button in the Actions column\n• A modal will show complete client info\n• Includes name, email, phone, company, and more",

  "how do i delete a client": "Deleting a client is simple.\n• Click the 'Delete' icon in the table\n• Confirm your action\n• The client will be removed from the list instantly",

  "does the system auto update when i add a client": "Yes, the list updates in real-time.\n• When you add a new client\n• The data appears immediately in the table\n• No need to refresh the page",

  "can i access clientsphere on mobile": "Yes, ClientSphere is fully responsive.\n• Works on mobile phones\n• Works on tablets\n• Auto adjusts layout for smaller screens",

  "is clientsphere free": "ClientSphere offers flexible plans.\n• Free basic plan available\n• Premium plan for advanced features\n• Enterprise plan with customization\nPlans depend on your usage and requirements.",

  "can i export client data": "Yes, data export is supported.\n• Export as CSV\n• Suitable for Excel and Google Sheets\n• Useful for reporting and backups",

  "can i integrate it with my crm": "Yes, integration is possible.\n• Supports API-based data sync\n• Can communicate with third-party CRMs\n• Custom integration available on request",

  "how fast is the system": "ClientSphere is optimized for speed.\n• Instant search\n• Fast loading dashboard\n• Smooth table interactions\n• Designed for large data sets",

  "what technologies are used": "ClientSphere is built with modern technologies.\n• Frontend: React + Vite\n• Styling: Tailwind CSS\n• Backend API: REST API\n• Database: Secure cloud storage",

  "what makes clientsphere different": "ClientSphere stands out because:\n• Clean and modern UI\n• Very fast performance\n• Easy to use for all teams\n• Real-time updates\n• Secure and reliable",

  "do i need training to use clientsphere": "No, the system is easy to understand.\n• Simple navigation\n• Clear buttons and controls\n• Help guide available\n• Training optional for teams",

  "what browsers do you support": "ClientSphere works on all major browsers.\n• Chrome\n• Edge\n• Firefox\n• Safari\n• Brave",

  "how often is the system updated": "ClientSphere receives regular updates.\n• Bug fixes\n• Performance improvements\n• New features\n• Security enhancements",
  
  "can i restore deleted clients": "Currently deleted clients cannot be restored.\n• Delete carefully\n• Future updates may include a recycle bin option"


}

const normalizedText = text.toLowerCase().trim();

// Step 1️⃣ Check if it's a math expression
const mathRegex = /^[0-9+\-*/().\s]+$/; // supports + - * / ( )
let botResponse;

if (mathRegex.test(normalizedText)) {
  try {
    const expression = normalizedText.replace(/\s+/g, ""); // remove spaces
    const result = eval(expression); // evaluate math
    if (isNaN(result)) throw new Error("Invalid expression");
    botResponse = `The result is ${result}`;
  } catch {
    botResponse = "Invalid math expression!";
  }
} else {
  // Step 2️⃣ Handle text with fuzzy matching
  const keys = Object.keys(botResponses);
  const { bestMatch } = stringSimilarity.findBestMatch(normalizedText, keys);

  if (bestMatch.rating >= 0.5) {
    botResponse = botResponses[bestMatch.target];
  } else {
    botResponse = "Sorry, I don't understand that!!!";
  }
}

// Step 3️⃣ Save bot message (best effort)
let botMessageText = botResponse.trim();
try {
  const bot = await Bot.create({
    text: botResponse.trim(),
  });
  botMessageText = bot.text.trim();
} catch (error) {
  console.log("Bot message not persisted:", error?.message || error);
}

return res.status(200).json({
  userMessage: userMessageText,
  botMessage: botMessageText,
});
} catch (error) {
  console.log("Error in Message Controller:", error);
  return res.status(500).json({ error: "Internal Server Error" });
}
};


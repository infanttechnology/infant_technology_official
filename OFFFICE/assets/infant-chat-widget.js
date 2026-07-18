/*
  Infant Technology — FAQ Chat Widget
  ------------------------------------
  Drop-in, no dependencies, no backend, no API key.
  Answers questions about services, enrollment, and contact using keyword
  matching against the KB below. Falls back to a "contact us" nudge with
  phone / WhatsApp / email when nothing matches well enough.

  HOW TO INSTALL
  1. Upload this file to your site (e.g. /assets/infant-chat-widget.js)
  2. Add this one line right before the closing body tag on every page you
     want the widget on, using a normal script tag with a src pointing at
     this file and the defer attribute set.
  3. Edit the KB array below whenever your services, pricing, or contact
     details change — no other code needs to change.
*/

(function () {
  "use strict";

  /* ---------------------------------------------------------------- */
  /* 1. KNOWLEDGE BASE — edit this whenever your info changes          */
  /* ---------------------------------------------------------------- */

  const BUSINESS = {
    name: "Infant Technology",
    phone: "+91 98944 56053",
    phoneHref: "tel:+919894456053",
    whatsappHref: "https://wa.me/919894456053",
    email: "infanttechnologyofficial@gmail.com",
    address: "Arul Complex, 1st Floor, Chettikulam, Nagercoil 629002, India",
  };

  // Each entry: keywords to match against + the reply to give.
  // Order matters a little — first strong match wins.
  const KB = [
    {
      id: "greeting",
      keywords: ["hi", "hello", "hey", "good morning", "good evening"],
      reply:
        "Hi! I'm the Infant Technology assistant. Ask me about our courses, final year projects, internships, or how to enroll — or tap one of the options below.",
    },
    {
      id: "services-overview",
      keywords: ["services", "what do you offer", "what do you do", "offerings"],
      reply:
        "We offer: Software Training Programs, Web & Software Development, IT Skill Training, Programming Courses, Project Guidance & Technical Support, Research Paper Publication, Internship Programs (regular & custom for institutions), and Workshops/Bootcamps. Want details on any of these?",
    },
    {
      id: "final-year-project",
      keywords: ["final year", "academic project", "mini project", "major project", "college project"],
      reply:
        "For Final Year Academic Projects we support the full pipeline — topic planning, implementation, documentation, and demo readiness — so you walk in prepared for your viva. Tell me your department/domain (CS, ECE, data science, IoT, etc.) and I can point you to the right track, or share your phone number and we'll call you.",
    },
    {
      id: "internship",
      keywords: ["internship", "intern", "trainee"],
      reply:
        "We run hands-on Internship Programs with live deliverables and industry-style collaboration, plus Custom Internship Programs designed for institutions/batches with tailored outcomes. Are you asking as an individual student or on behalf of a college/institution?",
    },
    {
      id: "training-courses",
      keywords: ["course", "training", "python", "javascript", "java", "ai", "ml", "machine learning", "full stack", "learn"],
      reply:
        "Our Programming Courses cover structured tracks in Python, JavaScript, AI/ML, and full-stack development, alongside IT Skill Training for general employability. Which technology are you most interested in?",
    },
    {
      id: "web-dev",
      keywords: ["website", "web development", "web design", "landing page"],
      reply:
        "We build conversion-focused websites with a premium UI, scalable architecture, and responsive performance — for businesses, portfolios, or institutions. Do you already have a website you'd like improved, or are you starting fresh?",
    },
    {
      id: "software-dev",
      keywords: ["software development", "custom software", "app development", "application"],
      reply:
        "We design custom software systems that streamline operations, automate workflows, and support business growth. If you can describe the problem you're trying to solve, I can flag it for our team to follow up.",
    },
    {
      id: "research-paper",
      keywords: ["research paper", "publication", "journal", "ieee", "publish"],
      reply:
        "We support Research Paper Publication — writing, formatting, review readiness, and the overall publication workflow. Let us know your topic area and target journal/conference if you have one in mind.",
    },
    {
      id: "workshop",
      keywords: ["workshop", "bootcamp", "seminar", "event"],
      reply:
        "We run Workshops and Bootcamps — interactive sessions with practical tasks and mentor feedback, available for individuals or as a custom event for your institution.",
    },
    {
      id: "pricing",
      keywords: ["price", "fee", "cost", "how much", "charges", "payment"],
      reply:
        "Pricing depends on the program and duration, so it's best confirmed directly with our team. Want me to share our contact details so you can get an exact quote?",
    },
    {
      id: "duration",
      keywords: ["duration", "how long", "weeks", "months", "time take"],
      reply:
        "Program length varies by track — from short workshops to multi-week internships and full project cycles. Tell me which service you're asking about and I'll point you toward the right person to confirm timing.",
    },
    {
      id: "enroll",
      keywords: ["enroll", "enrol", "join", "register", "sign up", "apply", "admission"],
      reply:
        "To enroll, the fastest way is to send us your name, the program you're interested in, and a phone number through the contact form below, or reach out directly on WhatsApp/phone. Our team will guide you from there.",
    },
    {
      id: "location",
      keywords: ["location", "address", "where are you", "nagercoil", "office"],
      reply:
        "We're located at " + BUSINESS.address + ". Would you like directions or the map link on this page?",
    },
    {
      id: "contact",
      keywords: ["contact", "phone number", "email", "call", "whatsapp", "reach you", "talk to someone"],
      reply:
        "You can reach us at " + BUSINESS.phone + " or " + BUSINESS.email + ". Tap 'Chat on WhatsApp' below for the fastest response.",
    },
    {
      id: "thanks",
      keywords: ["thank", "thanks", "thank you", "ok thanks", "cool"],
      reply: "You're welcome! Anything else you'd like to know about our programs or services?",
    },
  ];

  const QUICK_REPLIES = [
    "What services do you offer?",
    "Final year project support",
    "Internship programs",
    "Talk to a person",
  ];

  const FALLBACK_REPLY =
    "I'm not fully sure about that one — but our team can help directly. Call " +
    BUSINESS.phone +
    ", WhatsApp us, or use the contact form on this page and we'll get back to you.";

  /* ---------------------------------------------------------------- */
  /* 2. MATCHING LOGIC                                                  */
  /* ---------------------------------------------------------------- */

  function findReply(userText) {
    const text = userText.toLowerCase();
    let bestScore = 0;
    let bestEntry = null;

    KB.forEach(function (entry) {
      let score = 0;
      entry.keywords.forEach(function (kw) {
        if (text.indexOf(kw) !== -1) {
          score += kw.split(" ").length; // longer phrase matches count more
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    });

    if (bestEntry && bestScore > 0) return bestEntry.reply;
    return FALLBACK_REPLY;
  }

  /* ---------------------------------------------------------------- */
  /* 3. STYLES — dark navy to match the site, teal-cyan accent          */
  /* ---------------------------------------------------------------- */

  const css = `
  .it-chat-launcher {
    position: fixed;
    bottom: 22px;
    right: 22px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #2b6cb0, #164e8a 65%, #0d3566 100%);
    border: none;
    box-shadow: 0 10px 28px rgba(20, 78, 138, 0.45);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .it-chat-launcher:hover { transform: scale(1.06); }
  .it-chat-launcher svg { width: 30px; height: 30px; }
  .it-chat-dot {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5eead4, #2dd4bf);
    border: 3px solid #0a1220;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .it-chat-dot svg { width: 13px; height: 13px; }

  .it-chat-panel {
    position: fixed;
    bottom: 96px;
    right: 22px;
    width: 340px;
    max-width: calc(100vw - 32px);
    height: 480px;
    max-height: calc(100vh - 140px);
    background: #0a1d33;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.45);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .it-chat-panel.it-open { display: flex; }

  .it-chat-header {
    background: linear-gradient(135deg, #164e8a, #0d3566);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(94, 234, 212, 0.3);
  }
  .it-chat-header-title {
    color: #e8f1fb;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .it-chat-header-title .it-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #2dd4bf;
    display: inline-block;
  }
  .it-chat-header-sub {
    color: #9fc3e8;
    font-size: 11.5px;
    margin-top: 1px;
  }
  .it-chat-close {
    background: none;
    border: none;
    color: #8fa3bb;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 4px;
  }
  .it-chat-close:hover { color: #e8f1fb; }

  .it-chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #0a1d33;
  }
  .it-msg {
    max-width: 84%;
    padding: 9px 12px;
    border-radius: 12px;
    font-size: 13.5px;
    line-height: 1.45;
  }
  .it-msg.bot {
    background: #12294a;
    color: #dce8f5;
    align-self: flex-start;
    border-bottom-left-radius: 3px;
    border-left: 3px solid #2b6cb0;
  }
  .it-msg.user {
    background: linear-gradient(135deg, #2dd4bf, #2b6cb0);
    color: #04211c;
    align-self: flex-end;
    border-bottom-right-radius: 3px;
    font-weight: 500;
  }

  .it-quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 14px 10px;
    background: #0a1d33;
  }
  .it-quick-chip {
    background: transparent;
    border: 1px solid rgba(45, 212, 191, 0.45);
    color: #8fe9dc;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .it-quick-chip:hover { background: rgba(45, 212, 191, 0.14); }

  .it-chat-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
    background: #071427;
  }
  .it-chat-input {
    flex: 1;
    background: #0d2440;
    border: 1px solid rgba(45, 212, 191, 0.3);
    color: #e8f1fb;
    border-radius: 20px;
    padding: 9px 14px;
    font-size: 13.5px;
    outline: none;
  }
  .it-chat-input:focus { border-color: #2dd4bf; }
  .it-chat-input::placeholder { color: #607792; }
  .it-chat-send {
    background: radial-gradient(circle at 30% 30%, #2b6cb0, #164e8a 65%, #0d3566 100%);
    border: none;
    color: #fff;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .it-chat-send:hover { filter: brightness(1.1); }

  .it-chat-whatsapp {
    margin: 0 12px 12px;
    text-align: center;
    font-size: 11.5px;
  }
  .it-chat-whatsapp a {
    color: #8fe9dc;
    text-decoration: none;
    border-bottom: 1px dotted rgba(143, 233, 220, 0.5);
  }

  @media (prefers-reduced-motion: reduce) {
    .it-chat-launcher, .it-quick-chip, .it-chat-send { transition: none; }
  }

  @media (max-width: 420px) {
    .it-chat-panel {
      right: 12px;
      left: 12px;
      width: auto;
      bottom: 88px;
    }
    .it-chat-launcher { right: 16px; bottom: 16px; }
  }
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------------------------------------------------------------- */
  /* 4. MARKUP                                                          */
  /* ---------------------------------------------------------------- */

  const launcher = document.createElement("button");
  launcher.className = "it-chat-launcher";
  launcher.setAttribute("aria-label", "Open chat assistant");
  launcher.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="5" y="8" width="14" height="11" rx="3" stroke="#fff" stroke-width="1.6"/>' +
    '<path d="M12 8V5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="12" cy="4" r="1.3" fill="#fff"/>' +
    '<circle cx="9" cy="13.5" r="1.4" fill="#fff"/>' +
    '<circle cx="15" cy="13.5" r="1.4" fill="#fff"/>' +
    '<path d="M9 17h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M3 12h2M19 12h2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
    "</svg>" +
    '<span class="it-chat-dot">' +
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="#0a1220"/>' +
    "</svg>" +
    "</span>";

  const panel = document.createElement("div");
  panel.className = "it-chat-panel";
  panel.innerHTML =
    '<div class="it-chat-header">' +
    '<div>' +
    '<div class="it-chat-header-title"><span class="it-status-dot"></span>' + BUSINESS.name + '</div>' +
    '<div class="it-chat-header-sub">Usually replies within a day</div>' +
    "</div>" +
    '<button class="it-chat-close" aria-label="Close chat">&times;</button>' +
    "</div>" +
    '<div class="it-chat-body" id="it-chat-body"></div>' +
    '<div class="it-quick-replies" id="it-quick-replies"></div>' +
    '<div class="it-chat-whatsapp"><a href="' + BUSINESS.whatsappHref + '" target="_blank" rel="noopener">Chat on WhatsApp instead &rarr;</a></div>' +
    '<div class="it-chat-footer">' +
    '<input type="text" class="it-chat-input" id="it-chat-input" placeholder="Ask about services, fees, enrollment..." />' +
    '<button class="it-chat-send" id="it-chat-send" aria-label="Send message">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-8-8 18-2-8-8-2z" fill="#ffffff"/></svg>' +
    "</button>" +
    "</div>";

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const body = panel.querySelector("#it-chat-body");
  const input = panel.querySelector("#it-chat-input");
  const sendBtn = panel.querySelector("#it-chat-send");
  const closeBtn = panel.querySelector(".it-chat-close");
  const quickRepliesEl = panel.querySelector("#it-quick-replies");

  /* ---------------------------------------------------------------- */
  /* 5. BEHAVIOR                                                        */
  /* ---------------------------------------------------------------- */

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = "it-msg " + sender;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function renderQuickReplies() {
    quickRepliesEl.innerHTML = "";
    QUICK_REPLIES.forEach(function (q) {
      const chip = document.createElement("button");
      chip.className = "it-quick-chip";
      chip.textContent = q;
      chip.addEventListener("click", function () {
        handleUserMessage(q);
      });
      quickRepliesEl.appendChild(chip);
    });
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, "user");
    input.value = "";
    setTimeout(function () {
      const reply = findReply(text);
      addMessage(reply, "bot");
    }, 350);
  }

  let initialized = false;
  function openPanel() {
    panel.classList.add("it-open");
    if (!initialized) {
      addMessage(
        "Hi! I'm the Infant Technology assistant. Ask me about our courses, final year projects, internships, or how to enroll.",
        "bot"
      );
      renderQuickReplies();
      initialized = true;
    }
    input.focus();
  }
  function closePanel() {
    panel.classList.remove("it-open");
  }

  launcher.addEventListener("click", function () {
    if (panel.classList.contains("it-open")) {
      closePanel();
    } else {
      openPanel();
    }
  });
  closeBtn.addEventListener("click", closePanel);
  sendBtn.addEventListener("click", function () {
    handleUserMessage(input.value);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleUserMessage(input.value);
  });
})();

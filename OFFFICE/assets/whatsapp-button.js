/*
  Infant Technology — WhatsApp Click-to-Chat Button
  ---------------------------------------------------
  Drop-in, no dependencies. Floats bottom-left, opens a WhatsApp chat
  with your number when clicked (works on both desktop and mobile —
  desktop opens WhatsApp Web, mobile opens the WhatsApp app).

  HOW TO INSTALL
  1. Upload this file to your site (e.g. assets/whatsapp-button.js)
  2. Add this line right before the closing body tag, alongside the
     chat widget script tag, using a normal script tag with a src
     pointing at this file and the defer attribute set.
  3. Update WHATSAPP_NUMBER below if your number ever changes.
*/

(function () {
  "use strict";

  // Use the full number in international format, no + no spaces, e.g. 919894456053
  const WHATSAPP_NUMBER = "919894456053";
  const PREFILLED_MESSAGE = "Hi, I'd like to know more about Infant Technology's programs.";

  const href =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(PREFILLED_MESSAGE);

  const css = `
  .it-wa-launcher {
    position: fixed;
    bottom: 22px;
    left: 22px;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #34d67a, #22b559 65%, #159149 100%);
    box-shadow: 0 10px 24px rgba(21, 145, 73, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999998;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .it-wa-launcher:hover { transform: scale(1.07); }
  .it-wa-launcher svg { width: 28px; height: 28px; }

  .it-wa-pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(52, 214, 122, 0.55);
    animation: it-wa-pulse-anim 2.4s ease-out infinite;
    pointer-events: none;
  }
  @keyframes it-wa-pulse-anim {
    0% { transform: scale(1); opacity: 0.55; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  .it-wa-tooltip {
    position: absolute;
    bottom: 70px;
    left: 0;
    background: #12294a;
    color: #e8f1fb;
    padding: 7px 12px;
    border-radius: 8px;
    font-size: 12.5px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(4px);
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 6px 18px rgba(0,0,0,0.3);
  }
  .it-wa-wrap:hover .it-wa-tooltip {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .it-wa-launcher, .it-wa-tooltip { transition: none; }
    .it-wa-pulse { animation: none; display: none; }
  }

  @media (max-width: 420px) {
    .it-wa-launcher { left: 16px; bottom: 16px; width: 52px; height: 52px; }
  }
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const wrap = document.createElement("div");
  wrap.className = "it-wa-wrap";
  wrap.style.position = "fixed";
  wrap.style.bottom = "0";
  wrap.style.left = "0";
  wrap.style.zIndex = "999998";

  wrap.innerHTML =
    '<div class="it-wa-tooltip">Chat with us on WhatsApp</div>' +
    '<a class="it-wa-launcher" href="' + href + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
    '<span class="it-wa-pulse"></span>' +
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.7-1.2A9 9 0 1012 3z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M8.3 8.6c.2-.5.4-.5.6-.5h.5c.15 0 .35 0 .5.4.2.5.7 1.7.75 1.85.05.15.1.3 0 .5-.1.2-.15.3-.3.45-.15.15-.3.3-.45.4-.15.15-.3.3-.15.6.2.35.8 1.3 1.7 2.1 1.2 1 2.1 1.35 2.45 1.5.35.15.55.15.75-.05.2-.2.85-.9 1.05-1.2.2-.3.4-.25.7-.15.3.1 1.9.85 2.2 1 .3.15.5.2.55.35.1.35.05 1.2-.4 1.7-.45.5-1.7 1.05-2.5 1.05-.75 0-1.65-.15-3.9-1.2-2.75-1.3-4.4-4.15-4.55-4.35-.15-.2-1.05-1.4-1.05-2.65 0-1.25.65-1.85.85-2.1z" fill="#fff"/>' +
    "</svg>" +
    "</a>";

  document.body.appendChild(wrap);
})();

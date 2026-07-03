const slides = document.querySelectorAll('.hero-slide');
const dotsWrap = document.getElementById('heroDots');
let slideIndex = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => showSlide(i));
  dotsWrap.appendChild(dot);
});

function showSlide(i) {
  slides[slideIndex].classList.remove('active');
  dotsWrap.children[slideIndex].classList.remove('active');
  slideIndex = i;
  slides[slideIndex].classList.add('active');
  dotsWrap.children[slideIndex].classList.add('active');
}

setInterval(() => {
  showSlide((slideIndex + 1) % slides.length);
}, 6000);

const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
navToggle.addEventListener('click', () => {
  mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
});

import { RetellWebClient } from 'https://cdn.jsdelivr.net/npm/retell-client-js-sdk/+esm';

const retellWebClient = new RetellWebClient();
const voiceBtn = document.getElementById('voiceBtn');
const voiceIcon = document.getElementById('voiceIcon');
const voiceTooltip = document.getElementById('voiceTooltip');
const callStatus = document.getElementById('callStatus');

let callActive = false;

function setStatus(text) {
  callStatus.textContent = text;
  callStatus.classList.add('show');
}

function clearStatus() {
  callStatus.classList.remove('show');
  callStatus.textContent = '';
}

async function getAccessToken() {
  const res = await fetch('/get-access-token', { method: 'POST' });
  const data = await res.json();
  return data.access_token;
}

async function startCall() {
  voiceBtn.disabled = true;
  setStatus('Connecting...');
  try {
    const accessToken = await getAccessToken();
    await retellWebClient.startCall({ accessToken });
  } catch (err) {
    console.error('Call failed:', err);
    setStatus('Error: ' + (err?.message || err));
    voiceBtn.disabled = false;
  }
}

function endCall() {
  retellWebClient.stopCall();
}

voiceBtn.addEventListener('click', () => {
  if (callActive) {
    endCall();
  } else {
    startCall();
  }
});

retellWebClient.on('call_started', () => {
  callActive = true;
  voiceBtn.disabled = false;
  voiceBtn.classList.add('active');
  voiceIcon.className = 'fa-solid fa-phone-slash';
  voiceTooltip.textContent = 'End call';
  setStatus('Call active — speak now!');
});

retellWebClient.on('call_ended', () => {
  callActive = false;
  voiceBtn.disabled = false;
  voiceBtn.classList.remove('active');
  voiceIcon.className = 'fa-solid fa-microphone';
  voiceTooltip.textContent = 'Talk to May';
  setStatus('Call ended.');
  setTimeout(clearStatus, 3000);
});

retellWebClient.on('agent_start_talking', () => {
  setStatus('Agent is speaking...');
});

retellWebClient.on('agent_stop_talking', () => {
  setStatus('Your turn to speak...');
});

retellWebClient.on('error', (error) => {
  setStatus('Error: ' + error);
  retellWebClient.stopCall();
  callActive = false;
  voiceBtn.disabled = false;
  voiceBtn.classList.remove('active');
  voiceIcon.className = 'fa-solid fa-microphone';
  voiceTooltip.textContent = 'Talk to May';
});

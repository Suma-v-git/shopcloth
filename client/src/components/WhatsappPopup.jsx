import React from 'react';
import './WhatsappPopup.css';

const WHATSAPP_NUMBER = '+919876543210'; // Owner's WhatsApp number (international format, no spaces)
const MESSAGE = encodeURIComponent('Hello, I want to know more about your products!');
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace('+','')}/?text=${MESSAGE}`;

const WhatsappPopup = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-popup simple"
    aria-label="Contact owner on WhatsApp"
  >
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="22" cy="22" r="22" fill="#25D366"/>
  <path d="M32.2 28.1c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.1-1.2-.5-2.2-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.7.1-.1.2-.3.3-.4.1-.2.1-.3.2-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.8-.9 2 0 1.2.8 2.4 1 2.7.2.3 1.6 2.6 3.9 3.5 1.5.6 2.1.7 2.5.7.5 0 1.2-.1 1.5-.6.2-.3.2-.7.1-.8z" fill="#fff"/>
  <path d="M22 13.5c-4.7 0-8.5 3.8-8.5 8.5 0 1.5.4 2.9 1.1 4.1l-1.2 4.3 4.4-1.1c1.1.6 2.4 1 3.7 1 4.7 0 8.5-3.8 8.5-8.5s-3.8-8.5-8.5-8.5zm0 15.4c-1.2 0-2.3-.3-3.3-.9l-.2-.1-2.6.6.7-2.5-.1-.2c-.6-1-1-2.2-1-3.4 0-3.9 3.2-7.1 7.1-7.1s7.1 3.2 7.1 7.1-3.2 7.1-7.1 7.1z" fill="#fff"/>
</svg>
  </a>
);

export default WhatsappPopup;

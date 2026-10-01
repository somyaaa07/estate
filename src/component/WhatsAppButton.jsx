
"use client";

export default function WhatsAppButton() {
  const phoneNumber = "919876543210"; // Replace with your WhatsApp number
  const message = "Hi, I am interested in your properties. Please share more details.";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20BA5A] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-8 w-8 sm:h-9 sm:w-9"
        aria-hidden="true"
      >
        <path d="M16.02 3C8.86 3 3.03 8.82 3.03 15.98c0 2.28.6 4.5 1.75 6.47L3 29l6.72-1.76a12.97 12.97 0 0 0 6.3 1.61h.01C23.18 28.85 29 23.03 29 15.87 29 8.72 23.17 3 16.02 3Zm0 23.68h-.01a10.8 10.8 0 0 1-5.5-1.51l-.4-.24-4.1 1.07 1.1-4-.26-.41a10.75 10.75 0 0 1-1.65-5.76c0-5.96 4.85-10.81 10.82-10.81 2.89 0 5.6 1.13 7.64 3.17a10.73 10.73 0 0 1 3.16 7.66c0 5.96-4.85 10.83-10.8 10.83Zm5.94-8.1c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.83 1.04-1.02 1.25-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.85-1.61-1.9-1.8-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.4-.27-.64-.54-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.33-1.13 1.1-1.13 2.68 0 1.58 1.16 3.1 1.32 3.31.16.22 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.2 2.02.12.62-.1 1.9-.78 2.17-1.53.27-.76.27-1.4.19-1.54-.08-.13-.3-.21-.62-.37Z" />
      </svg>
    </a>
  );
}
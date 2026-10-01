
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  propertyType: "",
  message: "",
};

export default function EnquiryModal({ open, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Enquiry submitted:", formData);
    alert("Thank you! Your enquiry has been submitted.");

    setFormData(initialFormData);
    onClose();
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#1A2A22]/70 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        className="relative w-full max-w-lg rounded-2xl bg-[#FAF9F6] p-5 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute right-4 top-4 rounded-full p-2 text-[#1A2A22] transition hover:bg-[#F3F0E8]"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="mb-5 pr-8">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#52685B]">
            Let's Connect
          </p>

          <h2
            id="enquiry-title"
            className="font-marcellus text-2xl text-[#1A2A22] sm:text-3xl"
          >
            Make an Enquiry
          </h2>

          <p className="mt-2 text-sm leading-5 text-[#52685B]">
            Tell us what you're looking for. Our team will get in touch with you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <label
              htmlFor="enquiry-name"
              className="mb-1 block text-sm text-[#1A2A22]"
            >
              Full Name *
            </label>

            <input
              id="enquiry-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
              className="w-full rounded-lg border border-[#D9DED8] bg-white px-3.5 py-2.5 text-sm text-[#1A2A22] outline-none transition focus:border-[#52685B]"
            />
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="enquiry-phone"
                className="mb-1 block text-sm text-[#1A2A22]"
              >
                Phone Number *
              </label>

              <input
                id="enquiry-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                autoComplete="tel"
                required
                className="w-full rounded-lg border border-[#D9DED8] bg-white px-3.5 py-2.5 text-sm text-[#1A2A22] outline-none transition focus:border-[#52685B]"
              />
            </div>

            <div>
              <label
                htmlFor="enquiry-email"
                className="mb-1 block text-sm text-[#1A2A22]"
              >
                Email Address
              </label>

              <input
                id="enquiry-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                autoComplete="email"
                className="w-full rounded-lg border border-[#D9DED8] bg-white px-3.5 py-2.5 text-sm text-[#1A2A22] outline-none transition focus:border-[#52685B]"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label
              htmlFor="enquiry-property"
              className="mb-1 block text-sm text-[#1A2A22]"
            >
              Interested In
            </label>

            <select
              id="enquiry-property"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#D9DED8] bg-white px-3.5 py-2.5 text-sm text-[#1A2A22] outline-none focus:border-[#52685B]"
            >
              <option value="">Select property type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Plot">Plot</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="enquiry-message"
              className="mb-1 block text-sm text-[#1A2A22]"
            >
              Message
            </label>

            <textarea
              id="enquiry-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={2}
              placeholder="Tell us about your requirements..."
              className="w-full resize-none rounded-lg border border-[#D9DED8] bg-white px-3.5 py-2.5 text-sm text-[#1A2A22] outline-none focus:border-[#52685B]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#1A2A22] px-5 py-3 text-sm font-medium tracking-wide text-[#FAF9F6] transition hover:bg-[#52685B]"
          >
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
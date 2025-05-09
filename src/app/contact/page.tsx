"use client"
import "@styles/contact.css"
import "@styles/socketclient.css";

import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setStatus('Success! Your message has been sent.');
    } catch (error) {
      setStatus('Oops! Something went wrong. Please try again.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p className="intro-text">
          We are always striving to improve our project and would love to hear your feedback, suggestions, or questions. Your thoughts help us make this platform better!
        </p>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject of your message"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Submit</button>
        </form>

        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
};

export default Contact;

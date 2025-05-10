"use client"
import "@styles/contact.css";
import "@styles/socketclient.css";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';

const Contact = () => {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userid: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userid: user.id
      }));
    }
  }, [user]);

  if (!isLoaded) {
    return 
  }

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
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Success! Your message has been sent.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          userid: '', 
        });
      } else {
        setStatus('Oops! Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('Oops! Something went wrong. Please try again.');
    }
  };

  const isUserSignedIn = user?.id;
  return (
    <div className="contact-page">
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p className="intro-text">
          We are always striving to improve our project and would love to hear your feedback, suggestions, or questions. Your thoughts help us make this platform better!
        </p>

        {isUserSignedIn ? (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
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
              </div>
          
              <div className="input-group">
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
              </div>
            </div>
        
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
            <input
              type="text"
              name="honeypot"
              style={{ display: 'none' }}
              tabIndex={-1} 
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
        
        ) : (
          <p>Please sign in to send a message.</p>
        )}

        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
};

export default Contact;

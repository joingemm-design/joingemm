'use client'

import { useState } from 'react';
import Link from "next/link";
import { firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setSubmissionStatus('error');
      return;
    }
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      await addDoc(collection(firestore, 'contacts'), {
        name,
        email,
        message,
        submittedAt: new Date(),
      });
      setSubmissionStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{ fontSize: '1.5rem' }}>My Awesome App</h1>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
            <li><Link href="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link></li>
            <li><Link href="/pricing" style={{ textDecoration: 'none', color: 'white' }}>Pricing</Link></li>
            <li><Link href="/contact" style={{ textDecoration: 'none', color: 'white' }}>Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact Us</h2>
        {submissionStatus === 'success' ? (
          <div>
            <p style={{color: '#10B981'}}>Thank you! Your message has been sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '400px'
          }}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #374151', backgroundColor: '#1F2937', color: 'white' }} />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #374151', backgroundColor: '#1F2937', color: 'white' }}
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #374151', backgroundColor: '#1F2937', color: 'white', minHeight: '150px' }}></textarea>
            {submissionStatus === 'error' && <p style={{color: '#EF4444'}}>Please fill out all fields.</p>}
            <button type="submit" disabled={isSubmitting} style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </main>

      <footer style={{
        padding: '1rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid #374151'
      }}>
        <p>&copy; 2024 My Awesome App. All rights reserved.</p>
      </footer>
    </div>
  );
}

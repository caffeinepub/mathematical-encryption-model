import { useState, useCallback } from 'react';
import { Copy, Check, Lock, Unlock, ChevronDown, Shield, Hash, Calculator, BookOpen } from 'lucide-react';

// ─── Affine Cipher Logic ───────────────────────────────────────────────────────

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function encryptChar(char: string): string {
  const isUpper = char >= 'A' && char <= 'Z';
  const isLower = char >= 'a' && char <= 'z';
  if (!isUpper && !isLower) return char;
  const base = isUpper ? 65 : 97;
  const x = char.charCodeAt(0) - base;
  const encrypted = mod(3 * x + 5, 26);
  return String.fromCharCode(encrypted + base);
}

function decryptChar(char: string): string {
  const isUpper = char >= 'A' && char <= 'Z';
  const isLower = char >= 'a' && char <= 'z';
  if (!isUpper && !isLower) return char;
  const base = isUpper ? 65 : 97;
  const x = char.charCodeAt(0) - base;
  const decrypted = mod(9 * (x - 5), 26);
  return String.fromCharCode(decrypted + base);
}

function processMessage(message: string, fn: (c: string) => string): string {
  return message.split('').map(fn).join('');
}

// ─── Accordion Item ────────────────────────────────────────────────────────────

interface AccordionItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ icon, title, children, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="accordion-item">
      <button
        className="accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="accordion-icon-title">
          <span className="accordion-icon">{icon}</span>
          <span className="accordion-title">{title}</span>
        </span>
        <ChevronDown
          size={18}
          className="accordion-chevron"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div className="accordion-content" style={{ maxHeight: isOpen ? '400px' : '0' }}>
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
}

// ─── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
      onClick={handleCopy}
      disabled={!text}
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

// ─── Result Field ──────────────────────────────────────────────────────────────

interface ResultFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

function ResultField({ label, value, icon, colorClass }: ResultFieldProps) {
  return (
    <div className={`result-section ${colorClass}`}>
      <div className="result-header">
        <span className="result-label">
          {icon}
          {label}
        </span>
        <CopyButton text={value} />
      </div>
      <div className={`result-value ${value ? 'result-value--filled' : ''}`}>
        {value || <span className="result-placeholder">Result will appear here…</span>}
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [message, setMessage] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleEncrypt = () => {
    setEncrypted(processMessage(message, encryptChar));
  };

  const handleDecrypt = () => {
    setDecrypted(processMessage(message, decryptChar));
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(prev => (prev === index ? null : index));
  };

  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'unknown-app';

  const accordionItems = [
    {
      icon: <Hash size={16} />,
      title: 'Letters as Numbers (A = 0 … Z = 25)',
      content: (
        <>
          <p>Each letter of the alphabet is mapped to a number: <strong>A = 0, B = 1, C = 2, …, Z = 25</strong>. This numeric representation allows us to apply mathematical operations to text.</p>
          <div className="code-block">
            A→0, B→1, C→2, D→3, E→4, F→5, G→6, H→7, I→8, J→9,<br />
            K→10, L→11, M→12, N→13, O→14, P→15, Q→16, R→17,<br />
            S→18, T→19, U→20, V→21, W→22, X→23, Y→24, Z→25
          </div>
        </>
      ),
    },
    {
      icon: <Calculator size={16} />,
      title: 'Modular Arithmetic',
      content: (
        <>
          <p>Modular arithmetic (the "clock arithmetic") wraps numbers around a fixed modulus. For the 26-letter alphabet, we use <strong>mod 26</strong>.</p>
          <p>For example: <strong>27 mod 26 = 1</strong>, and <strong>−1 mod 26 = 25</strong>. This ensures every result stays within the range 0–25, mapping back to a valid letter.</p>
          <div className="code-block">
            E(x) = (3x + 5) mod 26<br />
            D(x) = 9(x − 5) mod 26
          </div>
        </>
      ),
    },
    {
      icon: <BookOpen size={16} />,
      title: 'Why 9 is the Modular Inverse of 3 (mod 26)',
      content: (
        <>
          <p>The modular inverse of <strong>a</strong> modulo <strong>m</strong> is the number <strong>a⁻¹</strong> such that <strong>a × a⁻¹ ≡ 1 (mod m)</strong>.</p>
          <p>For our cipher, <strong>a = 3</strong> and <strong>m = 26</strong>:</p>
          <div className="code-block">
            3 × 9 = 27 ≡ 1 (mod 26) ✓
          </div>
          <p>Therefore <strong>9</strong> is the modular inverse of 3 mod 26. Multiplying by 9 in the decryption formula undoes the multiplication by 3 in encryption, recovering the original letter.</p>
        </>
      ),
    },
    {
      icon: <Shield size={16} />,
      title: 'How Encryption Protects Digital Data',
      content: (
        <>
          <p>Encryption transforms readable data (plaintext) into an unreadable form (ciphertext) using a mathematical key. Only someone with the correct key and algorithm can reverse the process.</p>
          <p>The affine cipher is a classical substitution cipher — a foundational concept behind modern cryptography. Today's systems (AES, RSA, ECC) use far more complex mathematics, but share the same core principle: <strong>mathematical transformations that are easy to compute with the key, but hard to reverse without it</strong>.</p>
          <p>Encryption underpins HTTPS, secure messaging, banking, and virtually all digital privacy.</p>
        </>
      ),
    },
  ];

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-badge">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="header-title">Mathematical Encryption Model</h1>
            <p className="header-subtitle">Affine Cipher · E(x) = (3x + 5) mod 26 · D(x) = 9(x − 5) mod 26</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* ── Input Card ── */}
        <section className="card">
          <div className="card-header">
            <label htmlFor="message-input" className="card-label">
              Enter Message
            </label>
            <span className="char-count">{message.length} chars</span>
          </div>
          <textarea
            id="message-input"
            className="message-textarea"
            placeholder="Type your message here… e.g. Hello World!"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
          />
        </section>

        {/* ── Button Row ── */}
        <div className="button-row">
          <button className="btn btn--encrypt" onClick={handleEncrypt} disabled={!message.trim()}>
            <Lock size={16} />
            Encrypt
          </button>
          <button className="btn btn--decrypt" onClick={handleDecrypt} disabled={!message.trim()}>
            <Unlock size={16} />
            Decrypt
          </button>
        </div>

        {/* ── Output Card ── */}
        <section className="card output-card">
          <h2 className="card-section-title">Results</h2>
          <div className="results-grid">
            <ResultField
              label="Encrypted Text"
              value={encrypted}
              icon={<Lock size={14} />}
              colorClass="result-section--encrypt"
            />
            <ResultField
              label="Decrypted Text"
              value={decrypted}
              icon={<Unlock size={14} />}
              colorClass="result-section--decrypt"
            />
          </div>
        </section>

        {/* ── Explanation Panel ── */}
        <section className="card explanation-card">
          <h2 className="card-section-title">
            <BookOpen size={18} className="inline-icon" />
            How It Works
          </h2>
          <p className="explanation-intro">
            Explore the mathematical principles behind the affine cipher.
          </p>
          <div className="accordion">
            {accordionItems.map((item, i) => (
              <AccordionItem
                key={i}
                icon={item.icon}
                title={item.title}
                isOpen={openAccordion === i}
                onToggle={() => toggleAccordion(i)}
              >
                {item.content}
              </AccordionItem>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p>
          © {year} Mathematical Encryption Model &nbsp;·&nbsp; Built with{' '}
          <span className="footer-heart" aria-label="love">♥</span>{' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

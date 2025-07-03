async function fetchArticleList() {
  // This function assumes a static site generator or server will provide a list of .md files in /articles/
  // For static hosting (like GitHub Pages), you may need to manually update a manifest.json or index.json listing the .md files.
  // For demo, we'll try to fetch articles/index.json first, else fallback to a hardcoded list.
  try {
    const res = await fetch('articles/index.json');
    if (!res.ok) throw new Error('No index.json');
    return await res.json(); // Should be an array of filenames
  } catch {
    // Fallback: try to fetch all .md files by guessing (for local/dev use)
    // You should update articles/index.json for production
    return ['sample.md'];
  }
}

async function fetchMarkdown(filename) {
  const res = await fetch(`articles/${filename}`);
  if (!res.ok) throw new Error('Article not found');
  return await res.text();
}

function extractTitleAndExcerpt(md, filename) {
  const lines = md.split('\n');
  let title = filename.replace(/\.md$/, '').replace(/[-_]/g, ' ');
  let excerpt = '';
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace(/^# /, '').trim();
    }
    if (!excerpt && line.trim() && !line.startsWith('#')) {
      excerpt = line.trim();
    }
    if (title && excerpt) break;
  }
  return { title, excerpt };
}

function getSpiritualIcon(index) {
  // Rotate icons for variety
  const icons = ['spa', 'brightness_5', 'self_improvement'];
  return icons[index % icons.length];
}

function createArticleCard({ title, excerpt, filename, fullMarkdown }, index, isNew) {
  const card = document.createElement('div');
  card.className = 'article-card';
  card.style.setProperty('--delay', (index * 0.12) + 's');
  card.innerHTML = `
    <div class="article-badge"><span class="material-icons">${getSpiritualIcon(index)}</span></div>
    ${isNew ? '<div class="article-ribbon">New</div>' : ''}
    <div class="article-title">${title}</div>
    <div class="article-excerpt">${excerpt}</div>
    <button class="read-more-btn">Read More</button>
  `;
  card.querySelector('.read-more-btn').onclick = () => openModal(title, fullMarkdown);
  return card;
}

function openModal(title, md) {
  let modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal" title="Close">&times;</button>
      <h2>${title}</h2>
      <div class="modal-body">${marked.parse(md)}</div>
    </div>
  `;
  modal.querySelector('.close-modal').onclick = () => closeModal(modal);
  modal.onclick = (e) => { if (e.target === modal) closeModal(modal); };
  document.body.appendChild(modal);
}

function closeModal(modal) {
  modal.style.animation = 'modal-fade-in 0.3s reverse';
  setTimeout(() => {
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }, 250);
}

async function renderArticles() {
  const container = document.getElementById('articles');
  container.innerHTML = '';
  let files = [];
  try {
    files = await fetchArticleList();
  } catch {
    container.innerHTML = '<div style="color:#b36b00;text-align:center;">No articles found.</div>';
    return;
  }
  if (!files.length) {
    container.innerHTML = '<div style="color:#b36b00;text-align:center;">No articles found.</div>';
    return;
  }
  for (let i = 0; i < files.length; ++i) {
    try {
      const md = await fetchMarkdown(files[i]);
      const { title, excerpt } = extractTitleAndExcerpt(md, files[i]);
      const card = createArticleCard({ title, excerpt, filename: files[i], fullMarkdown: md }, i, i === 0);
      container.appendChild(card);
    } catch {
      // skip this file
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderArticles();
  // Back to top button
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.title = 'Back to Top';
  btn.innerHTML = '<span class="material-icons">north</span>';
  btn.style.display = 'none';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 200 ? 'flex' : 'none';
  });
});

// Floating magical particles
(function() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  const colors = ['#FFD580', '#FF9933', '#fff7e6'];
  const shapes = [
    '<ellipse cx="9" cy="9" rx="8" ry="6" fill="COLOR" opacity="0.7"/>',
    '<circle cx="9" cy="9" r="7" fill="COLOR" opacity="0.6"/>',
    '<path d="M9 2 Q13 9 9 16 Q5 9 9 2 Z" fill="COLOR" opacity="0.7"/>'
  ];
  function createParticle() {
    const el = document.createElement('span');
    el.className = 'particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)].replace(/COLOR/g, color);
    el.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18">${shape}</svg>`;
    el.style.left = Math.random() * 98 + 'vw';
    el.style.bottom = '-24px';
    el.style.animationDuration = (8 + Math.random() * 8) + 's';
    el.style.opacity = 0.5 + Math.random() * 0.5;
    container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 16000);
  }
  setInterval(createParticle, 600);
  for (let i = 0; i < 12; ++i) createParticle();
})();

window.beginJourneyEffect = function() {
  // Scroll to articles section
  const section = document.getElementById('spiritual-articles-section') || document.getElementById('articles-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });

  // Find the button
  const btn = document.querySelector('.cta-btn');
  if (!btn) return;

  // Create burst container
  const burst = document.createElement('div');
  burst.style.position = 'absolute';
  burst.style.left = btn.offsetLeft + btn.offsetWidth / 2 + 'px';
  burst.style.top = btn.offsetTop + btn.offsetHeight / 2 + 'px';
  burst.style.pointerEvents = 'none';
  burst.style.zIndex = 9999;
  burst.style.width = '0';
  burst.style.height = '0';
  burst.className = 'journey-burst';
  btn.parentElement.appendChild(burst);

  // Burst SVGs
  const icons = [
    '<svg width="32" height="32" viewBox="0 0 32 32"><text x="16" y="24" text-anchor="middle" font-size="28" fill="#FF9933">&#2384;</text></svg>',
    '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#FFD580" opacity="0.7"/><circle cx="16" cy="16" r="6" fill="#FF9933" opacity="0.8"/></svg>',
    '<svg width="32" height="32" viewBox="0 0 32 32"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#FFD580" opacity="0.7"/><ellipse cx="16" cy="16" rx="6" ry="10" fill="#FF9933" opacity="0.5"/></svg>',
    '<svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 4 L20 28 L16 24 L12 28 Z" fill="#FF9933" opacity="0.7"/></svg>'
  ];
  for (let i = 0; i < 12; ++i) {
    const angle = (i / 12) * 2 * Math.PI;
    const icon = document.createElement('div');
    icon.innerHTML = icons[i % icons.length];
    icon.style.position = 'absolute';
    icon.style.left = '0px';
    icon.style.top = '0px';
    icon.style.transform = `rotate(${angle}rad)`;
    icon.style.transition = 'transform 1s cubic-bezier(.17,.67,.83,.67), opacity 0.7s';
    icon.style.opacity = '1';
    burst.appendChild(icon);
    setTimeout(() => {
      icon.style.transform = `translate(${80 * Math.cos(angle)}px, ${80 * Math.sin(angle)}px) scale(1.2) rotate(${angle}rad)`;
      icon.style.opacity = '0';
    }, 30);
  }

  // Glowing aura
  btn.classList.add('journey-glow');

  // Sparkles
  for (let i = 0; i < 10; ++i) {
    setTimeout(() => {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6" fill="#FFD580" opacity="0.7"/><circle cx="9" cy="9" r="2" fill="#FF9933" opacity="0.8"/></svg>';
      sparkle.style.left = (btn.offsetLeft + btn.offsetWidth / 2 + (Math.random() - 0.5) * 80) + 'px';
      sparkle.style.top = (btn.offsetTop + btn.offsetHeight / 2 + (Math.random() - 0.5) * 40) + 'px';
      sparkle.style.position = 'absolute';
      sparkle.style.zIndex = 9999;
      document.body.appendChild(sparkle);
      setTimeout(() => { if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle); }, 1200);
    }, i * 60);
  }

  // Optional: Soft bell sound (if allowed)
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 660;
    g.gain.value = 0.12;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.5);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1);
    o.stop(ctx.currentTime + 1.1);
    setTimeout(() => ctx.close(), 1200);
  } catch {}

  // Cleanup
  setTimeout(() => {
    if (burst.parentNode) burst.parentNode.removeChild(burst);
    btn.classList.remove('journey-glow');
  }, 1500);
};

// Add journey-glow style
const style = document.createElement('style');
style.innerHTML = `.journey-glow { box-shadow: 0 0 32px 12px #FFD58099, 0 0 64px 24px #FF993344 !important; filter: brightness(1.15) saturate(1.2); transition: box-shadow 0.3s, filter 0.3s; }`;
document.head.appendChild(style); 
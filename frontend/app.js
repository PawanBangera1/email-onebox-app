const API_URL = 'http://localhost:3000/api/emails';

const emailsUl = document.getElementById('emails');
const emailDetail = document.getElementById('email-detail');

let emails = [];

function renderEmailList() {
  emailsUl.innerHTML = '';
  emails.forEach((email, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="subject">${email.subject || '(No Subject)'}</div>
      <div class="from">From: ${email.from}</div>
      <div class="date">${new Date(email.date).toLocaleString()}</div>
    `;
    li.onclick = () => showEmailDetail(idx);
    li.className = idx === selectedIdx ? 'selected' : '';
    emailsUl.appendChild(li);
  });
}

let selectedIdx = null;

function showEmailDetail(idx) {
  selectedIdx = idx;
  renderEmailList();
  const email = emails[idx];
  emailDetail.innerHTML = `
    <div class="email-detail">
      <h2>${email.subject || '(No Subject)'}</h2>
      <div class="meta">
        <div><strong>From:</strong> ${email.from}</div>
        <div><strong>To:</strong> ${email.to}</div>
        <div><strong>Date:</strong> ${new Date(email.date).toLocaleString()}</div>
      </div>
      <div class="body">${email.body ? email.body.replace(/\n/g, '<br>') : '(No Content)'}</div>
      <div class="category"><strong>Category:</strong> ${email.category}</div>
    </div>
  `;
}

// Fetch emails from backend
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    emails = data;
    renderEmailList();
    if (emails.length > 0) showEmailDetail(0);
    else emailDetail.innerHTML = '<p>No emails found.</p>';
  })
  .catch(err => {
    emailDetail.innerHTML = `<p style="color:red;">Failed to load emails.<br>${err}</p>`;
  });
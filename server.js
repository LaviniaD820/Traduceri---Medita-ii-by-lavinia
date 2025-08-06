// server.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Setup multer pentru upload fișiere (în memorie)
const upload = multer({ storage: multer.memoryStorage() });

// Nodemailer config (setează variabilele de mediu pentru securitate)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER || 'your-email@example.com',
    pass: process.env.SMTP_PASS || 'yourpassword',
  },
});

// Servește pagina principală + site-ul static (înlocuiește cu HTML-ul tău)
app.get('/', (req, res) => {
  res.send(htmlContent);
});

// Endpoint pentru upload document și trimitere cerere cotație
app.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Fișierul este obligatoriu.');
    }
    const { name, email, message, language } = req.body;

    // Trimite email cu atașament
    const mailOptions = {
      from: `"Cerere Traducere" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL || 'lavinia.dubina@yahoo.com',
      subject: `Cerere cotație preț traducere de la ${name}`,
      text: `Nume: ${name}\nEmail: ${email}\nLimba: ${language}\nMesaj: ${message || '(fără mesaj)'}\n\nDocument atașat.`,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.send('Cererea ta a fost trimisă cu succes! Vei fi contactat în curând.');
  } catch (err) {
    console.error(err);
    res.status(500).send('A apărut o eroare la trimiterea cererii.');
  }
});

// HTML complet site (poți edita textele aici)
// Include schimbare limbă simplă prin JS, formular upload, CTA, etc.
const htmlContent = `
<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TranslationsEdByLavinia - Traduceri și Meditații</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0; padding: 0;
    background: #f0e6f6;
    color: #333;
  }
  header {
    background: #d8b4f2;
    padding: 1rem 2rem;
    display: flex; justify-content: space-between; align-items: center;
  }
  header h2 {
    margin: 0; color: #4b0082;
  }
  nav a {
    color: #4b0082;
    margin-left: 1rem;
    text-decoration: none;
    font-weight: bold;
  }
  nav a:hover { text-decoration: underline; }
  .lang-links a {
    margin: 0 0.5rem;
    cursor: pointer;
    color: #7b68ee;
  }
  .hero {
    background: #ede7f6 url('https://www.transparenttextures.com/patterns/white-wall.png');
    padding: 3rem 1rem;
    text-align: center;
  }
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #5e35b1;
  }
  .hero p {
    font-size: 1.25rem;
    margin: 0.25rem 0 1rem;
  }
  .cta-buttons a {
    display: inline-block;
    margin: 0.5rem 1rem;
    padding: 0.75rem 1.5rem;
    background: #7b68ee;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
  }
  .cta-buttons a:hover {
    background: #5e35b1;
  }
  section {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  .services {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .service {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(123,104,238,0.3);
    flex: 1 1 350px;
  }
  .service h3 {
    color: #5e35b1;
    margin-top: 0;
  }
  form {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(123,104,238,0.3);
    max-width: 500px;
    margin: 2rem auto;
  }
  form label {
    display: block;
    margin: 1rem 0 0.3rem;
    font-weight: bold;
  }
  form input, form textarea, form select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #aaa;
    font-size: 1rem;
  }
  form button {
    margin-top: 1rem;
    background: #7b68ee;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1rem;
  }
  form button:hover {
    background: #5e35b1;
  }
  footer {
    background: #d8b4f2;
    text-align: center;
    padding: 1rem;
    color: #4b0082;
  }
  .message {
    max-width: 500px;
    margin: 1rem auto;
    padding: 1rem;
    background: #dcedc8;
    border-radius: 5px;
    color: #33691e;
    font-weight: bold;
    display: none;
  }
</style>
</head>
<body>

<header>
  <h2>TranslationsEdByLavinia</h2>
  <nav>
    <a href="#hero" onclick="scrollToSection('hero')">Acasă</a>
    <a href="#services" onclick="scrollToSection('services')">Servicii</a>
    <a href="#form-section" onclick="scrollToSection('form-section')">Cere o cotație</a>
    <a href="#contact" onclick="scrollToSection('contact')">Contact</a>
  </nav>
</header>

<div class="lang-links" style="text-align:center; margin:1rem 0;">
  <a onclick="setLang('ro')">Română</a> |
  <a onclick="setLang('en')">English</a> |
  <a onclick="setLang('fr')">Français</a>
</div>

<section class="hero" id="hero">
  <h1 data-ro="Cuvinte clare. Voci încrezătoare. Peste granițe."
      data-en="Clear Words. Confident Voices. Across Borders."
      data-fr="Des mots clairs. Des voix confiantes. Au-delà des frontières.">Cuvinte clare. Voci încrezătoare. Peste granițe.</h1>
  <p data-ro="Traduceri profesionale și meditații personalizate în engleză, română și franceză.<br>Fie că lansezi un proiect internațional sau înveți local – noi îți ducem cuvintele departe."
     data-en="Professional translation & personalized tutoring in English, Romanian, and French.<br>Whether you're launching globally or learning locally—we help your words travel far."
     data-fr="Traduction professionnelle et tutorat personnalisé en anglais, roumain et français.<br>Que vous lanciez à l'international ou appreniez localement – nous aidons vos mots à voyager loin.">Traduceri profesionale și meditații personalizate în engleză, română și franceză.<br>Fie că lansezi un proiect internațional sau înveți local – noi îți ducem cuvintele departe.</p>
  <div class="cta-buttons">
    <a href="#form-section" onclick="scrollToSection('form-section')" data-ro="Cere o cotație" data-en="Request a Quote" data-fr="Demandez un devis">Cere o cotație</a>
  </div>
</section>

<section id="services" class="services">
  <div class="service">
    <h3 data-ro="Traduceri Specializate" data-en="Specialized Translations" data-fr="Traductions spécialisées">Traduceri Specializate</h3>
    <p data-ro="Traduceri în cabină și documente oficiale în engleză, română și franceză."
       data-en="Simultaneous interpreting and official documents translation in English, Romanian, and French."
       data-fr="Interprétation simultanée et traduction de documents officiels en anglais, roumain et français.">
       Traduceri în cabină și documente oficiale în engleză, română și franceză.</p>
    <img src="https://cdn-icons-png.flaticon.com/512/3048/3048127.png" alt="Translator" width="100" style="margin-top:1rem;">
  </div>
  <div class="service">
    <h3 data-ro="Meditații" data-en="Tutoring" data-fr="Tutorat">Meditații</h3>
    <p data-ro="Lecții interactive pentru copii și adulți, cu materiale personalizate."
       data-en="Interactive lessons for children and adults, with personalized materials."
       data-fr="Leçons interactives pour enfants et adultes, avec du matériel personnalisé.">
       Lecții interactive pentru copii și adulți, cu materiale personalizate.</p>
    <img src="https://cdn-icons-png.flaticon.com/512/1351/1351520.png" alt="Tutoring" width="100" style="margin-top:1rem;">
  </div>
</section>

<section id="form-section">
  <form id="quoteForm" enctype="multipart/form-data" method="POST" action="/upload">
    <h2 data-ro="Cere o cotație de preț" data-en="Request a Price Quote" data-fr="Demandez un devis">Cere o cotație de preț</h2>

    <label for="name" data-ro="Nume complet" data-en="Full Name" data-fr="Nom complet">Nume complet</label>
    <input type="text" id="name" name="name" placeholder="Ex: Lavinia Dubina" required />

    <label for="email" data-ro="Email" data-en="Email" data-fr="Email">Email</label>
    <input type="email" id="email" name="email" placeholder="exemplu@mail.com" required />

    <label for="language" data-ro="Limba documentului" data-en="Document Language" data-fr="Langue du document">Limba documentului</label>
    <select id="language" name="language" required>
      <option value="ro" data-ro="Română" data-en="Romanian" data-fr="Roumain" selected>Română</option>
      <option value="en" data-ro="Engleză" data-en="English" data-fr="Anglais">Engleză</option>
      <option value="fr" data-ro="Franceză" data-en="French" data-fr="Français">Franceză</option>
    </select>

    <label for="message" data-ro="Mesaj opțional" data-en="Optional Message" data-fr="Message optionnel">Mesaj opțional</label>
    <textarea id="message" name="message" rows="4" placeholder="Descrie cerințele, dacă dorești"></textarea>

    <label for="document" data-ro="Încarcă documentul" data-en="Upload Document" data-fr="Télécharger le document">Încarcă documentul (pdf, doc, docx, txt)</label>
    <input type="file" id="document" name="document" accept=".pdf,.doc,.docx,.txt" required />

    <button type="submit" data-ro="Trimite cererea" data-en="Send Request" data-fr="Envoyer la demande">Trimite cererea</button>
  </form>
  <div id="responseMessage" class="message"></div>
</section>

<footer id="contact">
  <p>Contact: <a href="mailto:lavinia.dubina@yahoo.com">lavinia.dubina@yahoo.com</a> | Tel: +40 757 427 161</p>
</footer>

<script>
  // Schimbare limbă simplă fără backend, doar ascunde/arată texte
  const texts = document.querySelectorAll('[data-ro]');
  let currentLang = 'ro';

  function setLang(lang) {
    currentLang = lang;
    texts.forEach(el => {
      el.innerHTML = el.getAttribute('data-' + lang);
    });
  }
  setLang(currentLang);

  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({behavior: 'smooth'});
  }

  // Formular AJAX pentru upload
  const form = document.getElementById('quoteForm');
  const responseDiv = document.getElementById('responseMessage');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const resp = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const text = await resp.text();
      responseDiv.style.display = 'block';
      if (resp.ok) {
        responseDiv.style.background = '#dcedc8';
        responseDiv.style.color = '#33691e';
        responseDiv.textContent = text;
        form.reset();
      } else {
        responseDiv.style.background = '#ffcdd2';
        responseDiv.style.color = '#b71c1c';
        responseDiv.textContent = text;
      }
    } catch (error) {
      responseDiv.style.display = 'block';
      responseDiv.style.background = '#ffcdd2';
      responseDiv.style.color = '#b71c1c';
      responseDiv.textContent = 'A apărut o eroare la trimitere.';
    }
  });
</script>

</body>
</html>
`;

// Pornim serverul
app.listen(port, () => {
  console.log(`Serverul rulează la http://localhost:${port}`);
});


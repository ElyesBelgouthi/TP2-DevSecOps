const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Désactiver X-Powered-By
app.disable('x-powered-by');

// Middleware de sécurité avec Helmet
app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: "same-origin" },
  // X-Content-Type-Options
  noSniff: true,
  // Permissions Policy
  permissionsPolicy: {
    features: {
      camera: ["'none'"],
      microphone: ["'none'"],
      geolocation: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
      magnetometer: ["'none'"],
      gyroscope: ["'none'"],
      accelerometer: ["'none'"]
    }
  }
}));

// En-têtes de cache pour prévenir le stockage sensible
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

app.use(cookieParser());
app.use(express.json());

// Protection CSRF avec options de cookies sécurisées
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,      // Empêche l'accès JavaScript au cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
    sameSite: 'strict'   // Protection CSRF stricte
  }
});

app.get('/', csrfProtection, (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API sécurisée!',
    csrfToken: req.csrfToken()
  });
});

app.use('/api/users', userRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Token CSRF invalide' });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;
import express from "express";                        // For building the web server
import cors from "cors";                              // Allows requests from your frontend
import session from "express-session";                // Handles login sessions
import passport from "passport";                      // Auth middleware
import GitHubStrategy from "passport-github2";        // OAuth strategy for GitHub
import Database from "better-sqlite3";                // SQLite database connector
import dotenv from "dotenv";                          // Loads environment variables

// Load .env variables (like GitHub client secret)
dotenv.config();

// Set up Express app
const app = express();

// Allow frontend requests from localhost:5173
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json({ limit: '2mb' })); // consider changing limit

// 🛡️ Setup user session management
app.use(session({
  secret: "devHubSecret123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // false = HTTP
    sameSite: "lax"      // or "none" (and secure: true)
  }
}));

// Initialize Passport for GitHub OAuth
app.use(passport.initialize());
app.use(passport.session());

// Connect to SQLite database
const db = new Database("users.db");

// Create 'users' table (if it doesn't exist)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    githubId TEXT UNIQUE,
    name TEXT,
    email TEXT,
    avatarUrl TEXT,
    bio TEXT,
    location TEXT,
    portfolioUrl TEXT,
    roles TEXT,
    experience TEXT,
    availability TEXT,
    languages TEXT,
    accessToken TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create 'listings' table (if it doesn't exist)
db.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    imageUrl TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    userId INTEGER,
    isPublic INTEGER DEFAULT 1,
    repoName TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )
`);

// Serialize and deserialize user for session management (storing only githubId)
passport.serializeUser((user, done) => {
  // Store only the GitHub ID in the session
  done(null, user.githubId);
});
passport.deserializeUser((githubId, done) => {
  // Fetch user from DB by GitHub ID
  const select = db.prepare("SELECT * FROM users WHERE githubId = ?");
  const user = select.get(githubId);
  done(null, user || false);
});

// Configure GitHub login strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,             // From .env file
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  // 🎯 Extract user info from GitHub profile
  const githubId = profile.id;
  const name = profile.name || profile.username || profile.displayName;;
  const email = profile.emails?.[0]?.value || null;
  const avatarUrl = profile.photos?.[0]?.value || null;

  // 🔄 Check if user exists in DB
  const select = db.prepare("SELECT * FROM users WHERE githubId = ?");
  let user = select.get(githubId);

  // 🆕 If not found, insert them into DB
  if (!user) {
    const insert = db.prepare(`
      INSERT INTO users (githubId, name, email, avatarUrl, accessToken)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run(githubId, name, email, avatarUrl, accessToken);
    user = select.get(githubId); // Re-fetch new user
  }

  return done(null, { ...user, accessToken}); // Store user in session
}));


/* ------------------------------ ENDPOINTS ---------------------------------- */
// start GitHub login
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// Handle GitHub login callback
// This is where GitHub redirects after login
app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("http://localhost:5173/profile"); // Go to frontend after login
  }
);

// Failed login route
// If GitHub login fails, redirect here
app.get("/auth/failure", (req, res) => {
  res.status(401).send("GitHub authentication failed.");
});

// Handle logout
app.get("/auth/logout", (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.redirect("http://localhost:5173");
    });
  });
});



// get current logged-in user
app.get("/api/users/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const select = db.prepare("SELECT * FROM users WHERE githubId = ?");
  const freshUser = select.get(req.user.githubId);

  res.json(freshUser); // ✅ always fresh
});

// save edited profile info to DB
app.post('/api/users/me/profile-update', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const {
    bio,
    location,
    portfolioUrl,
    roles,
    experience,
    availability,
    languages
  } = req.body;

  const update = db.prepare(`
    UPDATE users
    SET bio = ?, location = ?, portfolioUrl = ?, roles = ?, experience = ?, availability = ?, languages = ?
    WHERE githubId = ?
  `);

  update.run(
    bio,
    location,
    portfolioUrl,
    roles,
    experience,
    availability,
    JSON.stringify(languages),
    req.user.githubId
  );

  console.log('✅ Profile updated for GitHub ID:', req.user.githubId);
  res.status(200).json({ success: true });
});

// fetch repos for current logged in user
app.get("/api/users/me/repos", async (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({ error: "User not authenticated or access token missing" });
  }

  const accessToken = req.user.accessToken;
  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${accessToken}`,
      "User-Agent": "your-app-name"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("GitHub API error:", errorText);
    return res.status(response.status).json({ error: "Failed to fetch GitHub repos" });
  }

  const data = await response.json();
  res.json(data);
});

// get any user's profile by GitHub username
app.get('/api/users/:username', (req, res) => {
  const username = req.params.username;
  // Find user by their GitHub username (the 'name' column)
  const user = db.prepare('SELECT * FROM users WHERE name = ?').get(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});



// fetch public listings (with all posting information)
app.get('/listings/public', (req, res) => {
  const listings = db.prepare(`
    SELECT listings.*, users.name, users.avatarUrl
    FROM listings
    JOIN users ON listings.userId = users.id
    WHERE isPublic = 1
    ORDER BY createdAt DESC
  `).all();

  res.json(listings);
});

// fetch recently active devs (names only)
app.get('/listings/recent', (req, res) => {
  const recentListings = db.prepare(`
    SELECT DISTINCT users.name
    FROM listings
    JOIN users ON listings.userId = users.id
    ORDER BY listings.id DESC
    LIMIT 10
  `).all();

  console.log('Fetched recent developer names:', recentListings);

  res.json(recentListings);
});

// fetch all listings by a specific user
app.get('/listings/user/:username', (req, res) => {
  const profileUsername = req.params.username;
  const currentUsername = req.query.currentUser;

  let listings;

  if (profileUsername === currentUsername) {
    // Show public + private listings if the viewer is the profile owner
    listings = db.prepare(`
      SELECT listings.*, users.name, users.avatarUrl
      FROM listings
      JOIN users ON listings.userId = users.id
      WHERE users.name = ?
      ORDER BY listings.createdAt DESC
    `).all(profileUsername);
  } else {
    // Show only public listings otherwise
    listings = db.prepare(`
      SELECT listings.*, users.name, users.avatarUrl
      FROM listings
      JOIN users ON listings.userId = users.id
      WHERE users.name = ? AND listings.isPublic = 1
      ORDER BY listings.createdAt DESC
    `).all(profileUsername);
  }

  res.json(listings);
});

// create new listing
app.post('/listings/create', (req, res) => {
  try {
    const { listingTitle, listingBio, imageUrl, githubId, isPublic, repoName} = req.body;
    console.log("📥 Incoming POST body:", req.body);

    const user = db.prepare("SELECT id FROM users WHERE githubId = ?").get(githubId);
    if (!user) {
      console.warn("⚠️ User not found for GitHub ID:", githubId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Found userId:", user.id);

    const stmt = db.prepare(`
      INSERT INTO listings (title, description, imageUrl, userId, isPublic, repoName)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(listingTitle, listingBio, imageUrl, user.id, isPublic, repoName);

    res.status(201).json({ message: 'Listing created!' });
  } catch (err) {
    console.error("WARNING! Error creating listing:", err);
    res.status(500).json({ error: "Something went wrong while creating the listing" });
  }
});

// delete listing by ID
app.delete('/listings/:id', (req, res) => {
  const listingId = parseInt(req.params.id);
  const { userId, userName } = req.body; // optional: get from auth/session instead

  console.log('DELETE request received');
  console.log(' by user:', { userId, userName });
  console.log(' Listing ID:', listingId);

  try {
    // 🎯 Lookup listing and joined user info
    const listing = db.prepare(`
      SELECT listings.*, users.name
      FROM listings
      JOIN users ON listings.userId = users.id
      WHERE listings.id = ?
    `).get(listingId);

    console.log('Fetched listing from DB:', listing);

    if (!listing) {
      console.warn('⚠️ No listing found for ID:', listingId);
      return res.status(404).json({ error: 'Listing not found' });
    }

    // 🔒 Auth check — must match both userId and name
    if (listing.userId !== userId || listing.name !== userName) {
      console.warn('🚫 Unauthorized delete attempt by user:', { userId, userName });
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    // 🧹 Delete listing from DB
    db.prepare('DELETE FROM listings WHERE id = ?').run(listingId);
    console.log('✅ Listing deleted:', listingId);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('🚨 Error deleting listing:', err);
    return res.status(500).json({ error: 'Something went wrong while deleting the listing' });
  }
});



// Start backend server
app.listen(3001, () => console.log("🚀 DevHub backend listening on http://localhost:3001"));
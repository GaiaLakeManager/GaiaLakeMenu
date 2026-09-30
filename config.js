/* ==========================================================================
   Gaia Lake Bungalow — Digital Menu System
   Shared configuration — loaded by BOTH admin.html and the public guest menu
   page (index.html on GitHub Pages, so it serves at your repo's root URL).
   ==========================================================================
   Nothing in this file is a secret. A Google API key and OAuth Client ID
   for a browser-only app are meant to be public (real access control is
   Google's own Sign-In + this Drive folder's sharing permissions, not
   anything hidden in this file). See SETUP.md for how to fill these in.
   ========================================================================== */

const CONFIG = {

  // --- Fill these in after completing SETUP.md ---------------------------
  GOOGLE_API_KEY:  "AIzaSyAxFZo4yTUhEi0SzXhzdmMaB3DZxm71iLU",        // used by admin + guest (read)
  GOOGLE_CLIENT_ID: "211068750758-jd4bdf6j30tkb9hprt29stqlhdm4tsc1.apps.googleusercontent.com", // used by admin only (write)

  // --- Your "GuestView" Drive folder ---------------------------------------
  // Root folder (from the link you shared): anyone-with-link can VIEW.
  GUEST_FOLDER_ID: "1LQZsf4EIeZ5Ggv1QwcIPHFQtptgBR3EE",

  // The live menu data file. Leave blank on first run — the admin app will
  // find-or-create "gaia_lake_menu.json" inside GUEST_FOLDER_ID and show you
  // its file ID to paste in here (and into the SAME field in the OTHER file).
  MENU_FILE_ID: "15FA8KrpgC0mcWcI2iDMTE5QP1E0Picqr",

  // Subfolder NAMES (admin app resolves their IDs automatically by name,
  // searched inside GUEST_FOLDER_ID — you don't need to hunt for IDs).
  DISH_IMAGES_FOLDER_NAME: "DishImages",       // guest-readable, dish photos
  BACKUP_FOLDER_NAME: "Backup",                // admin-only, JSON backups
  DELETED_IMAGES_FOLDER_NAME: "Deleted Images",// admin-only, soft-deleted photos

  // OPTIONAL: if your Backup / Deleted Images folders are NOT inside GuestView, paste each
  // folder's ID here (the long code at the end of the folder's Drive URL). When filled in,
  // it is used instead of looking the folder up by name. Leave "" to search inside GuestView.
  BACKUP_FOLDER_ID: "1OCgpZ80zS8tW4gNgkFuYkpRyML7Bh9fT",
  DELETED_IMAGES_FOLDER_ID: "1w27zIfxENUzJ64UyWhi_k8icSGFMge14",

  // Automatic backups: one file per day, per week and per month; only the newest N of each are kept.
  BACKUP_KEEP: { daily: 14, weekly: 8, monthly: 12 },

  // Google account(s) allowed to sign in and edit the menu.
  // Add your Gmail/Workspace address(es) here, e.g. ["you@gmail.com"].
  ADMIN_EMAILS: ["priyagaialake@gmail.com","gaialakewebapps@gmail.com","pkdithya@gmail.com"],

  // Default two-tone brand palette. Editable later from Admin → Settings;
  // this is only the fallback used before any settings are saved.
  DEFAULT_THEME: { primary: "#4C9D38", secondary: "#1E9BD7" },

  // Public URL of the guest menu once hosted (used to generate the QR code).
  // If it's named index.html, the /index.html suffix is optional.
  GUEST_MENU_URL: "https://gaialakemanager.github.io/GaiaLakeMenu/index.html", 	 	

  // Guest ordering (v2.0): the Apps Script web-app URL (…/exec) and the private Orders folder ID (owned by the orders account).
  ORDER_SCRIPT_URL: "",
  ORDERS_FOLDER_ID: "1JIYhb80EuLtRGHBU0PPItqgZH_XxFH6f",
  // Email guests see and use in the fallback "Email" button (Admin → Settings → For orders overrides it if filled in).
  GUEST_ORDER_EMAIL: "priyagaialake@gmail.com",

  RESTAURANT_NAME_FALLBACK: "Gaia Lake - Kandalama",

  // --- App version & What's New (Claude updates these two lines on every release —
  // admin no longer needs to type a version number anywhere) -----------------
  APP_VERSION: "2.0.3",
  WHATS_NEW_LATEST: "Ordering hours: same-day orders stop at 7 PM, dining time limited to 6 AM–9 PM. Guests on Bed & Breakfast can mark breakfast as included. Room field is now a dropdown with admin-managed Group/bulk-order labels. When ordering is paused, guests see a WhatsApp/Email contact banner instead."
};

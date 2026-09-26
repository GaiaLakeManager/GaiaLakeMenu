/* ==========================================================================
   Gaia Lake Bungalow — Digital Menu System
   Shared configuration — loaded by BOTH admin.html and guest-menu.html
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

  // Google account(s) allowed to sign in and edit the menu.
  // Add your Gmail/Workspace address(es) here, e.g. ["gaialakewebapps@gmail.com"].
  ADMIN_EMAILS: ["priyagaialake@gmail.com","gaialakewebapps@gmail.com"],

  // Default two-tone brand palette. Editable later from Admin → Settings;
  // this is only the fallback used before any settings are saved.
  DEFAULT_THEME: { primary: "#4C9D38", secondary: "#1E9BD7" },

  // Public URL of guest-menu.html once hosted (used to generate the QR code).
  // Update this after you publish to GitHub Pages.
  GUEST_MENU_URL: "https://gaialakemanager.github.io/GaiaLakeMenu/guest-menu.html",

  RESTAURANT_NAME_FALLBACK: "Gaia Lake Bungalow"
};

/*
  Everything the site shows lives in this file.
  Add a clip, photo, sponsor or gear item here and the page updates.
  Empty lists show a "coming soon" tile instead of breaking.
*/
window.SITE = {
  name: "Antwon Leslie",
  firstName: "Antwon",
  lastName: "Leslie",
  alias: "Duccaman",
  tagline: "Midwest born and raised.",
  // One-line mission shown in the hero. The full statement lives in the Mission section.
  intro:
    "Skating to get better every week and to show the Midwest you do not need a big-city scene to build a name.",

  // Contact form. Paste the Apps Script web app URL here after deploying (see README).
  // Until then the form runs in preview mode and offers a mailto fallback.
  formEndpoint: "",
  fallbackEmail: "", // his real email, used only for the preview-mode fallback

  social: {
    instagram: "https://www.instagram.com/duccaman",
    youtube: "", // channel URL, e.g. https://www.youtube.com/@handle
    facebook: "https://www.facebook.com/antwon.leslie"
  },

  hero: {
    video: "", // e.g. "media/reels/hero.mp4" (vertical 9:16 works best)
    poster: "" // e.g. "media/photos/hero.jpg"
  },

  // Vertical clips. Add as many as you like.
  reels: [
    // { src: "media/reels/clip-01.mp4", poster: "media/reels/clip-01.jpg", title: "Ledge line" }
  ],

  // Photos. The Photos section is commented out in index.html until there are 6-9 strong stills.
  photos: [
    // { src: "media/photos/01.jpg", alt: "Frontside smith at the park" }
  ],

  // Instagram: official post embeds, so visitors can scroll posts without leaving the site.
  // Paste post URLs (instagram.com/p/XXXX or /reel/XXXX). Newest first.
  instagram: {
    handle: "duccaman",
    posts: [
      // "https://www.instagram.com/reel/XXXXXXXXXXX/"
    ]
  },

  // YouTube video IDs are case sensitive. Copy the ID from the real link, not from a lowercased preview.
  youtube: {
    videos: [
      // { id: "XXXXXXXXXXX", title: "Full part" }
    ]
  },

  mission: {
    statement:
      "Skate for the love of it, get better every week, and show other kids in the Midwest that you do not need a big-city scene to build a name.",
    goals: [
      "Film a full-length video part",
      "Land a first board sponsor",
      "Travel for contests and demos",
      "Build a local crew that skates together every week"
    ]
  },

  sponsors: [
    // { name: "Brand", logo: "media/sponsors/brand.png", url: "https://brand.com" }
  ],

  // Gear he rides. Leave brand/where empty until filled in. No affiliation implied.
  gear: [
    { item: "Deck", brand: "", where: "", url: "" },
    { item: "Trucks", brand: "", where: "", url: "" },
    { item: "Wheels", brand: "", where: "", url: "" },
    { item: "Bearings", brand: "", where: "", url: "" },
    { item: "Grip tape", brand: "", where: "", url: "" },
    { item: "Shoes", brand: "", where: "", url: "" },
    { item: "Camera", brand: "", where: "", url: "" }
  ],

  bloopers: [
    // { src: "media/bloopers/01.mp4", poster: "media/bloopers/01.jpg", caption: "Take 14. The curb won." }
  ]
};

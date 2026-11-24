/* Invitation content.
 * This file is written by the dashboard (admin.html → Publish).
 * You can also edit it by hand: every text, photo and setting of the invitation lives here.
 */
window.INVITE_CONFIG = {
  "meta": {
    "title": "Ahmed & Nada · Wedding Invitation",
    "description": "You are invited to the wedding of Ahmed & Nada",
    "lang": "en",
    "dir": "ltr"
  },
  "theme": {
    "accent": "#d9b47c",
    "accent2": "#f3dcae",
    "background": "#1a0207",
    "background2": "#4a0915",
    "text": "#f7eee6",
    "ink": "#8f1426",
    "paper": "#f6eee5",
    "scriptFont": "Playfair Display",
    "bodyFont": "Cormorant Garamond",
    "uiFont": "Gilda Display",
    "namesStyle": "pearl",
    "typingCursor": false,
    "paperTexture": "assets/media/emboss.jpg",
    "laceTrim": "assets/media/lace-trim.webp"
  },
  "music": {
    "enabled": true,
    "src": "assets/uploads/fmwqevuzomjazo.mp4",
    "volume": 0.6,
    "startAt": 0,
    "showButton": true
  },
  "intro": {
    "enabled": true,
    "hint": "An invitation is hiding under the glitter",
    "monogram": "A & N",
    "action": "Blow on the glitter",
    "actionAlt": "or simply tap",
    "breathHint": "one gentle breath is enough",
    "touchAction": "Touch the glitter",
    "touchActionAlt": "and watch it fall away",
    "glitterImage": "assets/media/glitter.jpg",
    "glitterColor": "#c0121f",
    "curtainColor": "#8a0a18",
    "enableMic": true,
    "autoMic": true,
    "micLabel": "Use microphone to blow",
    "micTapLabel": "Tap here, then blow",
    "video": "assets/media/film.mp4",
    "namesAt": 3
  },
  "hero": {
    "stageImage": "assets/media/stage.jpg",
    "imagePosition": "50% 60%",
    "height": 100,
    "eyebrow": "Together with their families",
    "name1": "Ahmed",
    "ampersand": "&",
    "name2": "Nada",
    "invite": "invite you to celebrate their wedding",
    "dateLine": "03 12 2026",
    "place": "Mirage Hall, Cairo",
    "scrollHint": "",
    "curtains": true,
    "beam": false,
    "ring": false,
    "dust": true
  },
  "letter": {
    "enabled": true,
    "background": "assets/media/silk.jpg",
    "pin": "assets/media/pearl-pin.webp",
    "envelope": "assets/media/envelope.webp",
    "title": "Dear Family and Friends",
    "text": "We would love to celebrate this day with you.",
    "signature": "Ahmed & Nada"
  },
  "event": {
    "enabled": true,
    "datetime": "2026-12-03T19:00",
    "durationHours": 5,
    "title": "Save the date",
    "subtitle": "Turn the pages to our day",
    "padLabel": "A & N",
    "pearls": "assets/media/pearls-strand.webp",
    "monthsToFlip": 1,
    "weekStartsMonday": true,
    "dateText": "Thursday, 3 December 2026",
    "timeText": "7:00 PM",
    "calendarButton": "Add to my calendar"
  },
  "schedule": {
    "enabled": true,
    "title": "The evening",
    "subtitle": "How the night will unfold",
    "items": [
      {
        "time": "07:00 PM",
        "title": "Welcome",
        "text": "We'd love to have you with us right on time."
      },
      {
        "text": "Making it official with family & friends.",
        "title": "Katb El-Kitab",
        "time": "07:30 PM"
      },
      {
        "time": "11:00 PM",
        "title": "The End",
        "text": "A beautiful night comes to an end, but our memories last forever."
      }
    ]
  },
  "venue": {
    "enabled": true,
    "title": "Where",
    "image": "assets/uploads/fmwv89al648fgk.jpg",
    "name": "Mirage Hall",
    "address": "Transportation Officers House, Nile Corniche\n— in front of Mohamed Ali Palace",
    "button": "Get directions",
    "mapsUrl": "https://maps.app.goo.gl/T1HqiYZGamS7b2uT9?g_st=ic",
    "showMap": true,
    "mapQuery": "Transportation Officers House, Nile Corniche, Cairo"
  },
  "dress": {
    "enabled": true,
    "background": "assets/media/silk.jpg",
    "title": "Dress code",
    "text": "Formal Evening Attire"
  },
  "wishes": {
    "enabled": false,
    "title": "A few wishes",
    "items": [
      {
        "title": "Gifts",
        "text": "Your presence is the best gift."
      },
      {
        "title": "Children",
        "text": "Please keep your children by your side and take care of them."
      },
      {
        "title": "Contact",
        "text": "Ahmed +201026296355"
      }
    ]
  },
  "faq": {
    "enabled": false,
    "title": "Questions",
    "items": [
      {
        "q": "Where is the event?",
        "a": "Mirage Hall, Transportation Officers House, Nile Corniche — in front of Mohamed Ali Palace, Cairo."
      },
      {
        "q": "Is there parking?",
        "a": "Yes, there is parking available at the venue."
      }
    ]
  },
  "rsvp": {
    "enabled": true,
    "title": "RSVP",
    "text": "Please let us know if you can join us,\nso we can save a seat for you.",
    "background": "assets/media/silk.jpg",
    "namePlaceholder": "Your name",
    "accept": "Joyfully accept",
    "decline": "Regretfully decline",
    "askGuests": false,
    "guestsPlaceholder": "Number of guests",
    "messagePlaceholder": "Your message to the couple",
    "button": "Send RSVP",
    "method": "whatsapp",
    "whatsapp": "",
    "email": "",
    "endpoint": "",
    "deadline": "",
    "thanks": "Thank you! Your reply has been sent.",
    "missing": "Please write your name and choose an answer."
  },
  "closing": {
    "enabled": true,
    "title": "Until we meet",
    "days": "days",
    "hours": "hours",
    "minutes": "minutes",
    "seconds": "seconds",
    "showSeconds": false,
    "withLove": "With love,",
    "curtainBackdrop": true,
    "backdrop": "assets/media/stage-curtain.jpg",
    "footer": "Made with love"
  }
};

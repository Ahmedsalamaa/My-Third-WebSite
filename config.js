/* Invitation content.
 * This file is written by the dashboard (admin.html → Publish).
 * You can also edit it by hand: every text, photo and setting of the invitation lives here.
 */
window.INVITE_CONFIG = {
  "meta": {
    "title": "Ahmed & Nada · Wedding Invitation",
    "description": "You are invited to the wedding of Ahmed & Sara",
    "lang": "en",
    "dir": "ltr"
  },
  "theme": {
    "accent": "#e9c58f",
    "accent2": "#b8864b",
    "background": "#1c0508",
    "background2": "#3b0a12",
    "text": "#f4e6d6",
    "ink": "#8f1426",
    "paper": "#f6eee5",
    "scriptFont": "Corinthia",
    "bodyFont": "Cormorant Garamond",
    "uiFont": "Gilda Display",
    "namesStyle": "pearl",
    "typingCursor": false,
    "paperTexture": "assets/media/emboss.jpg",
    "laceTrim": "assets/media/lace-trim.webp"
  },
  "music": {
    "enabled": true,
    "src": "assets/music/waltz.mp3",
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
    "video": "",
    "namesAt": 3
  },
  "hero": {
    "stageImage": "assets/media/stage.jpg",
    "imagePosition": "50% 70%",
    "height": 150,
    "eyebrow": "Together with their families",
    "name1": "Ahmed",
    "ampersand": "&",
    "name2": "Nada",
    "invite": "invite you to celebrate their wedding",
    "dateLine": "03 12 2026",
    "place": "Hayah Hall, Cairo",
    "scrollHint": "scroll down",
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
    "title": "Dear family and friends",
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
    "monthsToFlip": 5,
    "weekStartsMonday": true,
    "dateText": "Wednesday, December 03, 2026",
    "timeText": "7:00 PM",
    "calendarButton": "Add to my calendar",
    "showCountdown": true,
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "showCalendar": true
  },
  "schedule": {
    "enabled": false,
    "title": "The evening",
    "subtitle": "How the night will unfold",
    "items": [
      {
        "time": "8:00 PM",
        "title": "Welcome",
        "text": "Meet the families and fellow guests"
      },
      {
        "time": "9:00 PM",
        "title": "Zaffa & first dance",
        "text": "The couple's grand entrance"
      },
      {
        "time": "10:00 PM",
        "title": "Dinner",
        "text": "An evening together"
      }
    ]
  },
  "venue": {
    "enabled": true,
    "title": "The venue",
    "image": "assets/media/venue.jpg",
    "name": "Hayah Hall",
    "address": "Air Force House, Salah Salem Road\n— after Al Tayaran Street",
    "button": "Open in maps",
    "mapsUrl": "https://maps.app.goo.gl/zFf9tz8n2rCapPnB8?g_st=ic",
    "showMap": true,
    "mapQuery": "Air Force House, Salah Salem Road, Cairo"
  },
  "dress": {
    "enabled": true,
    "background": "assets/media/silk.jpg",
    "title": "Dress code",
    "text": "Evening attire"
  },
  "wishes": {
    "enabled": true,
    "title": "A few wishes",
    "items": [
      {
        "title": "Gifts",
        "text": "Your presence is the best gift."
      },
      {
        "title": "Children",
        "text": "Please contact your host about bringing children."
      },
      {
        "title": "Photos",
        "text": "Photographs are welcome."
      },
      {
        "title": "Contact",
        "text": "Your host"
      }
    ]
  },
  "faq": {
    "enabled": true,
    "title": "Questions",
    "items": [
      {
        "q": "Where is the event?",
        "a": "Hayah Hall, Air Force House, Salah Salem Road, Cairo."
      },
      {
        "q": "Is there parking?",
        "a": "Yes, free parking is available at the venue."
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
    "footer": "Made with love",
    "text": "Thank you for being part of our special day.\nYour presence means more to us than words can say.",
    "names": "Ahmed & Sara"
  },
  "story": {
    "enabled": true,
    "title": "Two hearts, one story",
    "text": "We would be honoured to share the happiest day of our lives with you.\nYour presence completes our joy.",
    "signature": "The families of Ahmed & Sara\ninvite you to their wedding celebration.",
    "image": ""
  }
};

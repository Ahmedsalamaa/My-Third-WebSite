/* Invitation content.
 * This file is written by the dashboard (admin.html → Publish).
 * You can also edit it by hand: every text, photo and setting of the invitation lives here.
 */
window.INVITE_CONFIG = {
  "meta": {
    "title": "Ahmed & Sara · Wedding Invitation",
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
    "scriptFont": "Cormorant Garamond",
    "bodyFont": "Cormorant Garamond",
    "uiFont": "Cormorant SC"
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
    "monogram": "A & S",
    "action": "Blow on the glitter",
    "actionAlt": "or simply tap",
    "glitterImage": "assets/media/glitter.jpg",
    "glitterColor": "#c0121f",
    "enableMic": true,
    "micLabel": "Use microphone to blow",
    "video": ""
  },
  "hero": {
    "stageImage": "assets/media/stage.jpg",
    "imagePosition": "50% 70%",
    "eyebrow": "Together with their families",
    "name1": "Ahmed",
    "ampersand": "&",
    "name2": "Sara",
    "dateLine": "Wednesday, December 30, 2026",
    "scrollHint": "scroll down",
    "curtains": true,
    "beam": false,
    "ring": false,
    "dust": true
  },
  "story": {
    "enabled": true,
    "title": "Two hearts, one story",
    "text": "We would be honoured to share the happiest day of our lives with you.\nYour presence completes our joy.",
    "signature": "The families of Ahmed & Sara\ninvite you to their wedding celebration.",
    "image": ""
  },
  "event": {
    "enabled": true,
    "datetime": "2026-12-30T20:00",
    "title": "Save the date",
    "dateText": "Wednesday, December 30, 2026",
    "timeText": "8:00 PM",
    "showCountdown": true,
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "showCalendar": true,
    "weekStartsMonday": true,
    "calendarButton": "Add to my calendar",
    "durationHours": 5
  },
  "schedule": {
    "enabled": false,
    "title": "The evening",
    "subtitle": "How the night will unfold",
    "items": [
      { "time": "8:00 PM", "title": "Welcome", "text": "Meet the families and fellow guests" },
      { "time": "9:00 PM", "title": "Zaffa & first dance", "text": "The couple's grand entrance" },
      { "time": "10:00 PM", "title": "Dinner", "text": "An evening together" }
    ]
  },
  "venue": {
    "enabled": true,
    "title": "The venue",
    "image": "assets/media/venue.jpg",
    "name": "Hayah Hall",
    "address": "Air Force House, Salah Salem Road\n— after Al Tayaran Street",
    "mapsUrl": "https://maps.google.com/?q=Air+Force+House+Salah+Salem+Cairo",
    "button": "Open in maps"
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
    "text": "Thank you for being part of our special day.\nYour presence means more to us than words can say.",
    "names": "Ahmed & Sara",
    "footer": "Made with love"
  }
};

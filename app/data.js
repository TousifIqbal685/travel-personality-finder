// app/data.js

// The single voucher code for everyone
export const GLOBAL_VOUCHER_CODE = "RYOKO500";

export const questions = [
  {
    id: 1,
    question: "Traveler Type (Domestic / International)",
    // Updated to match your file: q1.jpeg
    bgImage: "/images/q1.jpeg",
    options: [
      { text: "Domestic", scores: {} },
      { text: "International", scores: { Culture: 2 } },
      { text: "Both", scores: { Explorer: 2 } },
    ],
  },
  {
    id: 2,
    question: "Travel Frequency",
    // Updated to match your file: q2.webp
    bgImage: "/images/q2.webp",
    options: [
      { text: "Once", scores: { Relaxer: 1, Planner: 1 } },
      { text: "2-3 times", scores: {} },
      { text: "4-6 times", scores: { Explorer: 1, Adventure: 1 } },
      { text: "More than 6 times", scores: { Explorer: 1, FreeSpirit: 1 } },
    ],
  },
  {
    id: 3,
    question: "Motivation for Choosing Destination",
    // Updated to match your file: q3.jpeg
    bgImage: "/images/q3.jpeg",
    options: [
      { text: "Nature & adventure", scores: { Adventure: 2, Explorer: 1 } },
      { text: "Culture & history", scores: { Culture: 2, Planner: 1 } },
      { text: "Food & lifestyle", scores: { Food: 2 } },
      { text: "Relaxation", scores: { Relaxer: 2 } },
      { text: "Shopping", scores: { Lifestyle: 1 } },
      { text: "Budget-friendly", scores: { Budget: 2 } },
    ],
  },
  {
    id: 4,
    question: "Trip Planning Style",
    // Updated to match your file: q4.webp
    bgImage: "/images/q4.webp",
    options: [
      { text: "Fully planned ahead", scores: { Planner: 2 } },
      { text: "Partially planned", scores: {} },
      { text: "Spontaneous", scores: { FreeSpirit: 2, Explorer: 1 } },
    ],
  },
  {
    id: 5,
    question: "Favorite Activities",
    // Updated to match your file: q5.webp
    bgImage: "/images/q5.webp",
    options: [
      { text: "Exploring hidden places", scores: { Explorer: 2 } },
      { text: "Visiting popular landmarks", scores: { Planner: 1, Culture: 1 } },
      { text: "Adventure activities", scores: { Adventure: 2 } },
      { text: "Food experiences", scores: { Food: 2 } },
      { text: "Relaxing & unwinding", scores: { Relaxer: 2 } },
    ],
  },
  {
    id: 6,
    question: "Trip Style",
    // Updated to match your file: q6.jpeg
    bgImage: "/images/q6.jpeg",
    options: [
      { text: "Solo", scores: { Explorer: 1, FreeSpirit: 1 } },
      { text: "Family", scores: { Relaxer: 1, Planner: 1 } },
      { text: "Couple", scores: { Relaxer: 1 } },
      { text: "Friends/Group", scores: { Adventure: 1 } },
    ],
  },
  {
    id: 7,
    question: "Preferred Accommodation",
    // Updated to match your file: q7.jpg
    bgImage: "/images/q7.jpg",
    options: [
      { text: "Budget hotels/hostels", scores: { Budget: 2 } },
      { text: "Mid-range hotels", scores: {} },
      { text: "Luxury hotels", scores: { Luxury: 2, Relaxer: 1 } },
      { text: "Homestay/Airbnb", scores: { Explorer: 1, Culture: 1 } },
    ],
  },
];

export const travelerDescriptions = {
  Explorer: { text: "You love discovering hidden spots off the beaten path!" },
  Planner: { text: "You enjoy structured itineraries and organized trips." },
  Relaxer: { text: "Your priority is comfort, peace, and slow travel." },
  Adventure: { text: "You seek adrenaline, hiking, and outdoor activities!" },
  Culture: { text: "You love immersing yourself in history and traditions." },
  Food: { text: "You travel primarily for culinary experiences!" },
  Budget: { text: "You are a master at finding the best deals and travel hacks." },
  Luxury: { text: "You prefer premium comfort and high-end experiences." },
  FreeSpirit: { text: "You are spontaneous, flexible, and go with the flow." },
  Lifestyle: { text: "You enjoy vibrant city life, shopping, and social scenes." },
};
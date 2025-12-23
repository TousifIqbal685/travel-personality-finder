// app/data.js

export const GLOBAL_VOUCHER_CODE = "RYOKO500";

export const questions = [
  {
    id: 1,
    question: "Traveler Type (Domestic / International)",
    bgImage: "/images/q1.jpeg",
    options: [
      { text: "Domestic", scores: {} },
      { text: "International", scores: { Culture: 2 } }, // Key stays "Culture"
      { text: "Both", scores: { Explorer: 2 } },
    ],
  },
  {
    id: 2,
    question: "Travel Frequency",
    bgImage: "/images/q2.webp",
    options: [
      { text: "Once", scores: { Relaxer: 1, Planner: 1 } },
      { text: "2-3 times", scores: {} },
      { text: "4-6 times", scores: { Explorer: 1, Adventure: 1 } }, // Key stays "Adventure"
      { text: "More than 6 times", scores: { Explorer: 1, FreeSpirit: 1 } }, // Key stays "FreeSpirit"
    ],
  },
  {
    id: 3,
    question: "Motivation for Choosing Destination",
    bgImage: "/images/q3.jpeg",
    options: [
      { text: "Nature & adventure", scores: { Adventure: 2, Explorer: 1 } },
      { text: "Culture & history", scores: { Culture: 2, Planner: 1 } },
      { text: "Food & lifestyle", scores: { Food: 2 } }, // Key stays "Food"
      { text: "Relaxation", scores: { Relaxer: 2 } },
      { text: "Budget-friendly", scores: { Budget: 2 } },
    ],
  },
  {
    id: 4,
    question: "Trip Planning Style",
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
    bgImage: "/images/q7.jpg",
    options: [
      { text: "Budget hotels/hostels", scores: { Budget: 2 } },
      { text: "Mid-range hotels", scores: {} },
      { text: "Luxury hotels", scores: { Luxury: 2, Relaxer: 1 } },
      { text: "Homestay/Airbnb", scores: { Explorer: 1, Culture: 1 } },
    ],
  },
];

// HERE is where we map the simple ID to the fancy Title
export const travelerDescriptions = {
  Explorer: { 
    title: "Explorer", 
    text: "You love discovering hidden spots off the beaten path!" 
  },
  Planner: { 
    title: "Planner", 
    text: "You enjoy structured itineraries and organized trips." 
  },
  Relaxer: { 
    title: "Relaxer", 
    text: "Your priority is comfort, peace, and slow travel." 
  },
  Adventure: { 
    title: "Adventurer", // Changed Display Name
    text: "You seek adrenaline, hiking, and outdoor activities!" 
  },
  Culture: { 
    title: "Culture Seeker", // Changed Display Name
    text: "You love immersing yourself in history and traditions." 
  },
  Food: { 
    title: "Foodie", // Changed Display Name
    text: "You travel primarily for culinary experiences!" 
  },
  Budget: { 
    title: "Budget Traveler", // Changed Display Name
    text: "You are a master at finding the best deals and travel hacks." 
  },
  Luxury: { 
    title: "Luxury Traveler", // Changed Display Name
    text: "You prefer premium comfort and high-end experiences." 
  },
  FreeSpirit: { 
    title: "Freespirit Traveler", // Changed Display Name
    text: "You are spontaneous, flexible, and go with the flow." 
  },
  Lifestyle: { 
    title: "Lifestyle Traveler", // Changed Display Name
    text: "You enjoy vibrant city life, shopping, and social scenes." 
  },
};
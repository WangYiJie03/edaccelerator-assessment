// lib/passages.ts
export type Passage = {
  id: string;
  title: string;
  text: string;
};

export const PASSAGES: Passage[] = [
  {
    id: "p1",
    title: "The Market Trip",
    text:
      "Tom went to the market on Saturday morning. He bought apples because they were on sale. " +
      "On the way home, he met his neighbour and talked about the weather. " +
      "Later, Tom made a simple fruit salad for lunch."
  },
  {
    id: "p2",
    title: "A New Hobby",
    text:
      "Lina wanted a hobby that could help her relax after work. She tried painting, but it felt slow at first. " +
      "After a few weeks, she noticed she was improving. She began to paint small landscapes and share them online. " +
      "The positive comments encouraged her to keep practicing."
  },
  {
  id: "p3",
  title: "The Late Train",
  text:
    "Maya usually left her apartment at 7:30 a.m. to catch the train into the city. One Monday, she woke up late after her alarm failed to ring. She rushed through breakfast, grabbed her bag, and ran to the station. When she arrived, the platform was unusually crowded. A staff announcement explained that a technical fault had delayed several services, and no one could say exactly when the next train would arrive.\n\nAt first, Maya felt frustrated. She had an important meeting at work, and being late would look unprofessional. But as she waited, she noticed an elderly man who seemed confused by the changes. He kept checking the timetable and shaking his head. Maya walked over and asked if he needed help. The man smiled with relief and said he was visiting the hospital for an appointment. Together, they listened for updates and found an alternative route using a tram and a short walk.\n\nMaya still arrived later than she hoped, but she felt calmer. Her manager appreciated that she sent a message early to explain the delay. On the way home, Maya realized that a stressful morning had turned into a small reminder: when plans break, being helpful can make the situation easier for everyone.",
 } 
];

const imageurl =
  "https://images.unsplash.com/photo-1620680779930-e74c15c8f7a0?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const samplePosts = [
  {
    id: 1,
    title: "Exploring the Future of AI",
    slug: "exploring-the-future-of-ai",
    description:
      "A deep dive into the advancements and implications of artificial intelligence.",
    content:
      "<h1>Introduction to Next.js 14</h1><p>Learn the basics and advanced features.</p>",
    image: imageurl,
    status: "APPROVE",
    createdAt: "2025-04-25T10:00:00Z",
    updatedAt: "2025-04-25T10:00:00Z",
    author: {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "EDITOR",
      createdAt: "2025-04-20T08:00:00Z",
      updatedAt: "2025-04-24T09:00:00Z",
    },
    comments: [
      {
        id: 1,
        content: "This is super insightful, thanks for sharing!",
        createdAt: "2025-04-25T11:00:00Z",
        updatedAt: "2025-04-25T11:00:00Z",
        author: {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          role: "READER",
          createdAt: "2025-04-22T10:00:00Z",
          updatedAt: "2025-04-24T10:30:00Z",
        },
      },
      {
        id: 2,
        content: "Would love a deep dive into AI ethics too!",
        createdAt: "2025-04-25T11:30:00Z",
        updatedAt: "2025-04-25T11:30:00Z",
        author: {
          id: 3,
          name: "Charlie Davis",
          email: "charlie@example.com",
          role: "READER",
          createdAt: "2025-04-23T12:00:00Z",
          updatedAt: "2025-04-24T14:00:00Z",
        },
      },
    ],
    like: [
      {
        id: 1,
        createdAt: "2025-04-25T12:00:00Z",
        user: {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          role: "READER",
          createdAt: "2025-04-22T10:00:00Z",
          updatedAt: "2025-04-24T10:30:00Z",
        },
      },
      {
        id: 2,
        createdAt: "2025-04-25T12:05:00Z",
        user: {
          id: 4,
          name: "Diana Prince",
          email: "diana@example.com",
          role: "EDITOR",
          createdAt: "2025-04-21T07:00:00Z",
          updatedAt: "2025-04-23T08:30:00Z",
        },
      },
    ],
    tag: [
      {
        id: 1,
        name: "AI",
        createdAt: "2025-04-19T06:00:00Z",
        updatedAt: "2025-04-24T06:00:00Z",
      },
      {
        id: 2,
        name: "Technology",
        createdAt: "2025-04-19T07:00:00Z",
        updatedAt: "2025-04-24T07:00:00Z",
      },
    ],
    Category: [
      {
        id: 1,
        name: "Science",
        createdAt: "2025-04-18T05:00:00Z",
        updatedAt: "2025-04-24T05:00:00Z",
      },
      {
        id: 2,
        name: "Innovation",
        createdAt: "2025-04-18T06:30:00Z",
        updatedAt: "2025-04-24T06:30:00Z",
      },
    ],
    saved: []
  },
  
];

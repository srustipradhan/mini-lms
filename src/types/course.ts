export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  instructorId: string;
  instructorName: string;
  lessonsCount: number;
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

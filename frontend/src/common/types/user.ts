export interface User {
  id: string;
  name: string;
  role: string;
  color: string; // Tailwind color class (e.g. 'bg-purple-500')
  textColor: string; // e.g. 'text-purple-500'
  style: string;
  time: string;
  status: string;
  activity: number[]; // Array for graph height
}

export type MovieStatus = "Now Showing" | "Coming Soon" | "Sold Out";

export type Movie = {
  id: string;
  title: string;
  genre: string;
  durationMin: number;
  status: MovieStatus;
  rating: string;
  posterTone: string;
  posterUrl: string;
  director: string;
  cast: string[];
  trailerUrl: string;
  imdbRank: number;
  releaseDate: string;
  synopsis: string;
  revenue: number;
  ticketsSold: number;
};

export type Cinema = {
  id: string;
  name: string;
  location: string;
  address: string;
};

export type Studio = {
  id: string;
  name: string;
  cinemaId: string;
  cinemaName: string;
  capacity: number;
  format: string;
};

export type StudioUtilizationItem = {
  label: string;
  value: number;
  bookedSeats: number;
  totalSeats: number;
};

export type Schedule = {
  id: string;
  movieId: string;
  movieTitle: string;
  genre: string;
  durationMin: number;
  studioName: string;
  startsAt: string;
  endsAt: string;
  format: string;
  occupancy: number;
  price: number;
  posterTone: string;
  posterUrl: string;
  cinemaId: string;
  cinemaName: string;
  cinemaLocation: string;
  showDate: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
  systemAccess: boolean;
  lastActive: string;
};

export type Metric = {
  label: string;
  value: string;
  trend: string;
  tone: "up" | "down" | "neutral";
};

export type AttentionItem = {
  title: string;
  detail: string;
  time: string;
  severity: "critical" | "warning" | "info";
};

export type DailySalesPoint = {
  label: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

export type DailySalesTransaction = {
  id: string;
  code: string;
  movieTitle: string;
  seats: number;
  totalAmount: number;
  createdAt: string;
};

export type DailySalesData = {
  totalRevenue: number;
  ticketsSold: number;
  bookings: number;
  avgOrder: number;
  hourly: DailySalesPoint[];
  recent: DailySalesTransaction[];
};

export type BookingSeat = {
  code: string;
  status: "available" | "occupied";
};

export type BookingDetail = {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  status: string;
  seats: string[];
  totalAmount: number;
  createdAt: string;
  schedule: Schedule;
  movie: Movie;
};

export type TopMoviePerformance = {
  id: string;
  title: string;
  ticketsSold: number;
  revenue: number;
  occupancy: number;
};

export type AnalyticsData = {
  metrics: Metric[];
  topMovies: TopMoviePerformance[];
  studioShare: Array<{ label: string; value: number }>;
};

import type {
  AdminUser,
  AnalyticsData,
  AttentionItem,
  BookingSeat,
  Cinema,
  DailySalesData,
  Metric,
  Movie,
  Schedule,
  Studio
} from "./types";

export const mockMovies: Movie[] = [
  {
    id: "movie-shawshank",
    title: "The Shawshank Redemption",
    genre: "Drama",
    durationMin: 142,
    status: "Now Showing",
    rating: "R",
    posterTone: "void",
    posterUrl: "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    trailerUrl: "https://www.youtube.com/watch?v=PLl99DlL6b4",
    imdbRank: 1,
    releaseDate: "1994-09-23",
    synopsis: "Two imprisoned men bond over years, finding dignity and hope inside Shawshank.",
    revenue: 420000000,
    ticketsSold: 23650
  },
  {
    id: "movie-godfather",
    title: "The Godfather",
    genre: "Crime",
    durationMin: 175,
    status: "Now Showing",
    rating: "R",
    posterTone: "noir",
    posterUrl: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    imdbRank: 2,
    releaseDate: "1972-03-24",
    synopsis: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    revenue: 390000000,
    ticketsSold: 22100
  },
  {
    id: "movie-dark-knight",
    title: "The Dark Knight",
    genre: "Action",
    durationMin: 152,
    status: "Now Showing",
    rating: "PG-13",
    posterTone: "velocity",
    posterUrl: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    imdbRank: 3,
    releaseDate: "2008-07-18",
    synopsis: "Batman faces a criminal mastermind who pushes Gotham into chaos.",
    revenue: 360000000,
    ticketsSold: 20680
  },
  {
    id: "movie-godfather-2",
    title: "The Godfather Part II",
    genre: "Crime",
    durationMin: 202,
    status: "Now Showing",
    rating: "R",
    posterTone: "noir",
    posterUrl: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    director: "Francis Ford Coppola",
    cast: ["Al Pacino", "Robert De Niro", "Robert Duvall"],
    trailerUrl: "https://www.youtube.com/watch?v=9O1Iy9od7-A",
    imdbRank: 4,
    releaseDate: "1974-12-20",
    synopsis: "The Corleone saga continues through Michael's rule and Vito's early rise.",
    revenue: 315000000,
    ticketsSold: 18120
  },
  {
    id: "movie-12-angry-men",
    title: "12 Angry Men",
    genre: "Drama",
    durationMin: 96,
    status: "Now Showing",
    rating: "U",
    posterTone: "silver",
    posterUrl: "https://image.tmdb.org/t/p/original/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
    director: "Sidney Lumet",
    cast: ["Henry Fonda", "Lee J. Cobb", "Martin Balsam"],
    trailerUrl: "https://www.youtube.com/watch?v=TEN-2uTi2c0",
    imdbRank: 5,
    releaseDate: "1957-04-10",
    synopsis: "A jury deliberation tests doubt, prejudice, and responsibility.",
    revenue: 280000000,
    ticketsSold: 15940
  },
  {
    id: "movie-return-king",
    title: "The Lord of the Rings: The Return of the King",
    genre: "Adventure",
    durationMin: 201,
    status: "Coming Soon",
    rating: "PG-13",
    posterTone: "dune",
    posterUrl: "https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
    trailerUrl: "https://www.youtube.com/watch?v=r5X-hFf6Bwo",
    imdbRank: 6,
    releaseDate: "2003-12-17",
    synopsis: "The final battle for Middle-earth unfolds as Frodo nears Mount Doom.",
    revenue: 260000000,
    ticketsSold: 14880
  },
  {
    id: "movie-schindler",
    title: "Schindler's List",
    genre: "Biography",
    durationMin: 195,
    status: "Coming Soon",
    rating: "R",
    posterTone: "silver",
    posterUrl: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    director: "Steven Spielberg",
    cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
    trailerUrl: "https://www.youtube.com/watch?v=gG22XNhtnoY",
    imdbRank: 7,
    releaseDate: "1993-12-15",
    synopsis: "Oskar Schindler saves more than a thousand lives during the Holocaust.",
    revenue: 240000000,
    ticketsSold: 13320
  },
  {
    id: "movie-fellowship",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: "Adventure",
    durationMin: 178,
    status: "Coming Soon",
    rating: "PG-13",
    posterTone: "dune",
    posterUrl: "https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
    trailerUrl: "https://www.youtube.com/watch?v=V75dMMIW2B4",
    imdbRank: 8,
    releaseDate: "2001-12-19",
    synopsis: "A meek hobbit begins the dangerous journey to destroy the One Ring.",
    revenue: 225000000,
    ticketsSold: 12690
  },
  {
    id: "movie-pulp-fiction",
    title: "Pulp Fiction",
    genre: "Crime",
    durationMin: 154,
    status: "Coming Soon",
    rating: "R",
    posterTone: "velocity",
    posterUrl: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    imdbRank: 9,
    releaseDate: "1994-10-14",
    synopsis: "Interwoven tales of crime, consequence, and dark humor in Los Angeles.",
    revenue: 210000000,
    ticketsSold: 11980
  },
  {
    id: "movie-good-bad-ugly",
    title: "The Good, the Bad and the Ugly",
    genre: "Western",
    durationMin: 178,
    status: "Coming Soon",
    rating: "R",
    posterTone: "noir",
    posterUrl: "https://image.tmdb.org/t/p/original/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
    director: "Sergio Leone",
    cast: ["Clint Eastwood", "Eli Wallach", "Lee Van Cleef"],
    trailerUrl: "https://www.youtube.com/watch?v=WCN5JJY_wiA",
    imdbRank: 10,
    releaseDate: "1966-12-23",
    synopsis: "Three gunslingers compete to find a hidden fortune during the Civil War.",
    revenue: 198000000,
    ticketsSold: 11240
  }
];

export const mockCinemas: Cinema[] = [
  {
    id: "cinema-grand-indonesia",
    name: "FilmKeren Grand Indonesia",
    location: "Jakarta Pusat",
    address: "Grand Indonesia, West Mall Lt. 8"
  },
  {
    id: "cinema-pacific-place",
    name: "FilmKeren Pacific Place",
    location: "SCBD",
    address: "Pacific Place Mall Lt. 6"
  },
  {
    id: "cinema-kota-kasablanka",
    name: "FilmKeren Kota Kasablanka",
    location: "Jakarta Selatan",
    address: "Kota Kasablanka Lt. 2"
  }
];

export const mockStudios: Studio[] = [
  { id: "studio-gi-imax", name: "GI IMAX", cinemaId: "cinema-grand-indonesia", cinemaName: "FilmKeren Grand Indonesia", capacity: 120, format: "IMAX 2D" },
  { id: "studio-gi-regular", name: "GI Studio 2", cinemaId: "cinema-grand-indonesia", cinemaName: "FilmKeren Grand Indonesia", capacity: 90, format: "Regular 2D" },
  { id: "studio-pp-premiere", name: "PP Premiere", cinemaId: "cinema-pacific-place", cinemaName: "FilmKeren Pacific Place", capacity: 72, format: "Premiere" },
  { id: "studio-pp-dolby", name: "PP Dolby", cinemaId: "cinema-pacific-place", cinemaName: "FilmKeren Pacific Place", capacity: 96, format: "Dolby Atmos" },
  { id: "studio-kokas-regular", name: "Kokas Studio 1", cinemaId: "cinema-kota-kasablanka", cinemaName: "FilmKeren Kota Kasablanka", capacity: 86, format: "Regular 2D" },
  { id: "studio-kokas-sphere", name: "Kokas SphereX", cinemaId: "cinema-kota-kasablanka", cinemaName: "FilmKeren Kota Kasablanka", capacity: 110, format: "SphereX" }
];

export const mockSchedules: Schedule[] = [
  {
    id: "schedule-imax-1400",
    movieId: "movie-shawshank",
    movieTitle: "The Shawshank Redemption",
    genre: "Drama",
    durationMin: 142,
    studioName: "IMAX",
    startsAt: "14:00",
    endsAt: "16:22",
    format: "IMAX 2D",
    occupancy: 0,
    price: 85000,
    posterTone: "void",
    posterUrl: mockMovies[0].posterUrl,
    cinemaId: "cinema-grand-indonesia",
    cinemaName: "FilmKeren Grand Indonesia",
    cinemaLocation: "Jakarta Pusat",
    showDate: "2026-05-02"
  },
  {
    id: "schedule-studio4-1715",
    movieId: "movie-godfather",
    movieTitle: "The Godfather",
    genre: "Crime",
    durationMin: 175,
    studioName: "Studio 4",
    startsAt: "17:15",
    endsAt: "20:10",
    format: "Dolby Atmos",
    occupancy: 0,
    price: 75000,
    posterTone: "noir",
    posterUrl: mockMovies[1].posterUrl,
    cinemaId: "cinema-pacific-place",
    cinemaName: "FilmKeren Pacific Place",
    cinemaLocation: "SCBD",
    showDate: "2026-05-02"
  },
  {
    id: "schedule-studio1-1930",
    movieId: "movie-dark-knight",
    movieTitle: "The Dark Knight",
    genre: "Action",
    durationMin: 152,
    studioName: "Studio 1",
    startsAt: "19:30",
    endsAt: "22:02",
    format: "Regular 2D",
    occupancy: 0,
    price: 65000,
    posterTone: "velocity",
    posterUrl: mockMovies[2].posterUrl,
    cinemaId: "cinema-kota-kasablanka",
    cinemaName: "FilmKeren Kota Kasablanka",
    cinemaLocation: "Jakarta Selatan",
    showDate: "2026-05-02"
  }
];

export const mockUsers: AdminUser[] = [
  {
    id: "user-abimanyu",
    name: "Abimanyu Panji",
    email: "abimanyu.panji@filmkeren.id",
    role: "Admin",
    status: "Active",
    systemAccess: true,
    lastActive: "Baru saja"
  }
];

export const mockMetrics: Metric[] = [
  { label: "Total Film", value: "10", trend: "Top 10 IMDb", tone: "up" },
  { label: "Tiket Terjual", value: "0", trend: "dari booking", tone: "neutral" },
  { label: "Pendapatan", value: "Rp0", trend: "dari pembayaran", tone: "neutral" },
  { label: "Pengguna Aktif", value: "1", trend: "admin aktif", tone: "neutral" }
];

export const mockAttention: AttentionItem[] = [
  {
    title: "Data katalog bersih",
    detail: "CRUD form kosong dan siap input",
    time: "Baru saja",
    severity: "info"
  },
  {
    title: "Poster eksternal aktif",
    detail: "Gambar film memakai URL HD internet",
    time: "Baru saja",
    severity: "info"
  }
];

export const mockDailySales: DailySalesData = {
  totalRevenue: 0,
  ticketsSold: 0,
  bookings: 0,
  avgOrder: 0,
  hourly: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map((label) => ({
    label,
    revenue: 0,
    tickets: 0,
    bookings: 0
  })),
  recent: []
};

export const mockAnalytics: AnalyticsData = {
  metrics: [
    { label: "Booking Hari Ini", value: "0", trend: "dari checkout", tone: "neutral" },
    { label: "Tiket Terjual", value: "0", trend: "dari booking", tone: "neutral" },
    { label: "Pendapatan", value: "Rp0", trend: "dari pembayaran", tone: "neutral" },
    { label: "Avg Occupancy", value: "0%", trend: "jadwal aktif", tone: "neutral" }
  ],
  topMovies: mockMovies.slice(0, 5).map((movie) => ({
    id: movie.id,
    title: movie.title,
    ticketsSold: 0,
    revenue: 0,
    occupancy: 0
  })),
  studioShare: [
    { label: "IMAX", value: 0 },
    { label: "Studio 1", value: 0 },
    { label: "Studio 4", value: 0 }
  ]
};

export const mockBookingSeats: BookingSeat[] = ["H", "G", "F", "E", "D", "C", "B"].flatMap((row) =>
  Array.from({ length: 10 }, (_, index) => {
    const code = `${row}${index + 1}`;
    return {
      code,
      status: "available"
    };
  })
);

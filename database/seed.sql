truncate table booking_seats, bookings, sales, studio_seats, schedules, studios, cinemas, admin_users, movies restart identity cascade;

insert into cinemas (id, name, location, address)
values
  ('cinema-grand-indonesia', 'FilmKeren Grand Indonesia', 'Jakarta Pusat', 'Grand Indonesia West Mall Lt. 8'),
  ('cinema-pacific-place', 'FilmKeren Pacific Place', 'SCBD', 'Pacific Place Mall Lt. 6'),
  ('cinema-kota-kasablanka', 'FilmKeren Kota Kasablanka', 'Jakarta Selatan', 'Kota Kasablanka Lt. 2');

insert into movies (
  id, title, genre, duration_min, status, rating, poster_tone, poster_url,
  director, cast_members, trailer_url, imdb_rank, release_date, synopsis, created_at
)
values
  ('movie-shawshank', 'The Shawshank Redemption', 'Drama', 142, 'Now Showing', 'R', 'void', 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 'Frank Darabont', 'Tim Robbins, Morgan Freeman, Bob Gunton', 'https://www.youtube.com/watch?v=PLl99DlL6b4', 1, '1994-09-23', 'Two imprisoned men bond over years, finding dignity and hope inside Shawshank.', now() + interval '1 second'),
  ('movie-godfather', 'The Godfather', 'Crime', 175, 'Now Showing', 'R', 'noir', 'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'Francis Ford Coppola', 'Marlon Brando, Al Pacino, James Caan', 'https://www.youtube.com/watch?v=sY1S34973zA', 2, '1972-03-24', 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.', now() + interval '2 seconds'),
  ('movie-dark-knight', 'The Dark Knight', 'Action', 152, 'Now Showing', 'PG-13', 'velocity', 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 3, '2008-07-18', 'Batman faces a criminal mastermind who pushes Gotham into chaos.', now() + interval '3 seconds'),
  ('movie-godfather-2', 'The Godfather Part II', 'Crime', 202, 'Now Showing', 'R', 'noir', 'https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg', 'Francis Ford Coppola', 'Al Pacino, Robert De Niro, Robert Duvall', 'https://www.youtube.com/watch?v=9O1Iy9od7-A', 4, '1974-12-20', 'The Corleone saga continues through Michael''s rule and Vito''s early rise.', now() + interval '4 seconds'),
  ('movie-12-angry-men', '12 Angry Men', 'Drama', 96, 'Now Showing', 'U', 'silver', 'https://image.tmdb.org/t/p/original/ppd84D2i9W8jXmsyInGyihiSyqz.jpg', 'Sidney Lumet', 'Henry Fonda, Lee J. Cobb, Martin Balsam', 'https://www.youtube.com/watch?v=TEN-2uTi2c0', 5, '1957-04-10', 'A jury deliberation tests doubt, prejudice, and responsibility.', now() + interval '5 seconds'),
  ('movie-return-king', 'The Lord of the Rings: The Return of the King', 'Adventure', 201, 'Coming Soon', 'PG-13', 'dune', 'https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', 'Peter Jackson', 'Elijah Wood, Viggo Mortensen, Ian McKellen', 'https://www.youtube.com/watch?v=r5X-hFf6Bwo', 6, '2003-12-17', 'The final battle for Middle-earth unfolds as Frodo nears Mount Doom.', now() + interval '6 seconds'),
  ('movie-schindler', 'Schindler''s List', 'Biography', 195, 'Coming Soon', 'R', 'silver', 'https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', 'Steven Spielberg', 'Liam Neeson, Ralph Fiennes, Ben Kingsley', 'https://www.youtube.com/watch?v=gG22XNhtnoY', 7, '1993-12-15', 'Oskar Schindler saves more than a thousand lives during the Holocaust.', now() + interval '7 seconds'),
  ('movie-fellowship', 'The Lord of the Rings: The Fellowship of the Ring', 'Adventure', 178, 'Coming Soon', 'PG-13', 'dune', 'https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 'Peter Jackson', 'Elijah Wood, Ian McKellen, Orlando Bloom', 'https://www.youtube.com/watch?v=V75dMMIW2B4', 8, '2001-12-19', 'A meek hobbit begins the dangerous journey to destroy the One Ring.', now() + interval '8 seconds'),
  ('movie-pulp-fiction', 'Pulp Fiction', 'Crime', 154, 'Coming Soon', 'R', 'velocity', 'https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'Quentin Tarantino', 'John Travolta, Uma Thurman, Samuel L. Jackson', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 9, '1994-10-14', 'Interwoven tales of crime, consequence, and dark humor in Los Angeles.', now() + interval '9 seconds'),
  ('movie-good-bad-ugly', 'The Good, the Bad and the Ugly', 'Western', 178, 'Coming Soon', 'R', 'noir', 'https://image.tmdb.org/t/p/original/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg', 'Sergio Leone', 'Clint Eastwood, Eli Wallach, Lee Van Cleef', 'https://www.youtube.com/watch?v=WCN5JJY_wiA', 10, '1966-12-23', 'Three gunslingers compete to find a hidden fortune during the Civil War.', now() + interval '10 seconds');

insert into studios (id, name, cinema_id, capacity, format)
values
  ('studio-gi-imax', 'GI IMAX', 'cinema-grand-indonesia', 120, 'IMAX 2D'),
  ('studio-gi-regular', 'GI Studio 2', 'cinema-grand-indonesia', 90, 'Regular 2D'),
  ('studio-pp-premiere', 'PP Premiere', 'cinema-pacific-place', 72, 'Premiere'),
  ('studio-pp-dolby', 'PP Dolby', 'cinema-pacific-place', 96, 'Dolby Atmos'),
  ('studio-kokas-regular', 'Kokas Studio 1', 'cinema-kota-kasablanka', 86, 'Regular 2D'),
  ('studio-kokas-sphere', 'Kokas SphereX', 'cinema-kota-kasablanka', 110, 'SphereX');

insert into schedules (id, movie_id, studio_id, cinema_id, starts_at, ends_at, show_date, format, occupancy, price)
values
  ('show-shawshank-gi-1100', 'movie-shawshank', 'studio-gi-imax', 'cinema-grand-indonesia', '11:00', '13:22', current_date, 'IMAX 2D', 0, 85000),
  ('show-shawshank-pp-1900', 'movie-shawshank', 'studio-pp-premiere', 'cinema-pacific-place', '19:00', '21:22', current_date, 'Premiere', 0, 120000),
  ('show-godfather-gi-1430', 'movie-godfather', 'studio-gi-regular', 'cinema-grand-indonesia', '14:30', '17:25', current_date, 'Regular 2D', 0, 65000),
  ('show-godfather-kokas-2000', 'movie-godfather', 'studio-kokas-sphere', 'cinema-kota-kasablanka', '20:00', '22:55', current_date, 'SphereX', 0, 90000),
  ('show-dark-knight-gi-1700', 'movie-dark-knight', 'studio-gi-imax', 'cinema-grand-indonesia', '17:00', '19:32', current_date, 'IMAX 2D', 0, 90000),
  ('show-dark-knight-pp-2100', 'movie-dark-knight', 'studio-pp-dolby', 'cinema-pacific-place', '21:00', '23:32', current_date, 'Dolby Atmos', 0, 80000),
  ('show-godfather2-pp-1300', 'movie-godfather-2', 'studio-pp-premiere', 'cinema-pacific-place', '13:00', '16:22', current_date + 1, 'Premiere', 0, 120000),
  ('show-12angry-kokas-1230', 'movie-12-angry-men', 'studio-kokas-regular', 'cinema-kota-kasablanka', '12:30', '14:06', current_date + 1, 'Regular 2D', 0, 55000),
  ('show-returnking-gi-1800', 'movie-return-king', 'studio-gi-imax', 'cinema-grand-indonesia', '18:00', '21:21', current_date + 2, 'IMAX 2D', 0, 90000),
  ('show-schindler-pp-1600', 'movie-schindler', 'studio-pp-dolby', 'cinema-pacific-place', '16:00', '19:15', current_date + 2, 'Dolby Atmos', 0, 75000),
  ('show-fellowship-kokas-1700', 'movie-fellowship', 'studio-kokas-sphere', 'cinema-kota-kasablanka', '17:00', '19:58', current_date + 2, 'SphereX', 0, 85000),
  ('show-pulpfiction-gi-2130', 'movie-pulp-fiction', 'studio-gi-regular', 'cinema-grand-indonesia', '21:30', '00:04', current_date + 1, 'Regular 2D', 0, 65000),
  ('show-goodbad-pp-1130', 'movie-good-bad-ugly', 'studio-pp-dolby', 'cinema-pacific-place', '11:30', '14:28', current_date + 3, 'Dolby Atmos', 0, 75000);

insert into admin_users (id, name, email, role, status, system_access, last_active_at)
values
  ('user-abimanyu', 'Abimanyu Panji', 'abimanyu.panji@filmkeren.id', 'Admin', 'Active', true, now());

insert into studio_seats (studio_name, seat_code, is_occupied)
select
  studio.name,
  row_label || seat_number::text,
  false
from
  (values ('GI IMAX'), ('GI Studio 2'), ('PP Premiere'), ('PP Dolby'), ('Kokas Studio 1'), ('Kokas SphereX')) as studio(name),
  unnest(array['H', 'G', 'F', 'E', 'D', 'C', 'B']) as rows(row_label),
  generate_series(1, 10) as seat_number;

import { cache } from "react";
import { neon } from "@neondatabase/serverless";
import {
  mockAnalytics,
  mockAttention,
  mockBookingSeats,
  mockCinemas,
  mockDailySales,
  mockMetrics,
  mockMovies,
  mockSchedules,
  mockStudios,
  mockUsers
} from "./mock-data";
import type {
  AdminUser,
  AnalyticsData,
  AttentionItem,
  BookingDetail,
  BookingSeat,
  Cinema,
  DailySalesData,
  Metric,
  Movie,
  Schedule,
  Studio,
  StudioUtilizationItem
} from "./types";

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

function csv(value: unknown) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asMovie(row: Record<string, unknown>): Movie {
  return {
    id: String(row.id),
    title: String(row.title),
    genre: String(row.genre),
    durationMin: Number(row.durationMin ?? row.duration_min),
    status: String(row.status) as Movie["status"],
    rating: String(row.rating),
    posterTone: String(row.posterTone ?? row.poster_tone ?? "void"),
    posterUrl: String(row.posterUrl ?? row.poster_url ?? ""),
    director: String(row.director ?? ""),
    cast: Array.isArray(row.cast) ? (row.cast as string[]) : csv(row.cast),
    trailerUrl: String(row.trailerUrl ?? row.trailer_url ?? ""),
    imdbRank: Number(row.imdbRank ?? row.imdb_rank ?? 0),
    releaseDate: String(row.releaseDate ?? row.release_date ?? ""),
    synopsis: String(row.synopsis ?? ""),
    revenue: Number(row.revenue ?? 0),
    ticketsSold: Number(row.ticketsSold ?? row.tickets_sold ?? 0)
  };
}

function asSchedule(row: Record<string, unknown>): Schedule {
  return {
    id: String(row.id),
    movieId: String(row.movieId ?? row.movie_id),
    movieTitle: String(row.movieTitle ?? row.movie_title),
    genre: String(row.genre),
    durationMin: Number(row.durationMin ?? row.duration_min),
    studioName: String(row.studioName ?? row.studio_name),
    startsAt: String(row.startsAt ?? row.starts_at),
    endsAt: String(row.endsAt ?? row.ends_at),
    format: String(row.format),
    occupancy: Number(row.occupancy ?? 0),
    price: Number(row.price ?? 0),
    posterTone: String(row.posterTone ?? row.poster_tone ?? "void"),
    posterUrl: String(row.posterUrl ?? row.poster_url ?? ""),
    cinemaId: String(row.cinemaId ?? row.cinema_id ?? ""),
    cinemaName: String(row.cinemaName ?? row.cinema_name ?? "FilmKeren Cinema"),
    cinemaLocation: String(row.cinemaLocation ?? row.cinema_location ?? ""),
    showDate: String(row.showDate ?? row.show_date ?? "")
  };
}

function asCinema(row: Record<string, unknown>): Cinema {
  return {
    id: String(row.id),
    name: String(row.name),
    location: String(row.location),
    address: String(row.address)
  };
}

function asStudio(row: Record<string, unknown>): Studio {
  return {
    id: String(row.id),
    name: String(row.name),
    cinemaId: String(row.cinemaId ?? row.cinema_id ?? ""),
    cinemaName: String(row.cinemaName ?? row.cinema_name ?? ""),
    capacity: Number(row.capacity ?? 0),
    format: String(row.format)
  };
}

function asUser(row: Record<string, unknown>): AdminUser {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: String(row.role),
    status: String(row.status) as AdminUser["status"],
    systemAccess: Boolean(row.systemAccess ?? row.system_access),
    lastActive: String(row.lastActive ?? row.last_active ?? "Baru saja")
  };
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000000) return `Rp${(value / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
  if (value >= 1000000) return `Rp${(value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Jt`;
  return `Rp${value.toLocaleString("id-ID")}`;
}

export const getMovies = cache(async (): Promise<Movie[]> => {
  if (!sql) return mockMovies;

  try {
    const rows = await sql`
      select
        m.id,
        m.title,
        m.genre,
        m.duration_min as "durationMin",
        m.status,
        m.rating,
        m.poster_tone as "posterTone",
        m.poster_url as "posterUrl",
        m.director,
        m.cast_members as cast,
        m.trailer_url as "trailerUrl",
        m.imdb_rank as "imdbRank",
        m.release_date as "releaseDate",
        m.synopsis,
        coalesce(sum(bs.price), 0) as revenue,
        count(bs.id)::int as "ticketsSold"
      from movies m
      left join schedules sch on sch.movie_id = m.id
      left join bookings b on b.schedule_id = sch.id and b.status in ('CONFIRMED', 'PAID')
      left join booking_seats bs on bs.booking_id = b.id
      group by m.id
      order by m.imdb_rank asc nulls last, m.created_at asc
    `;
    return rows.map(asMovie);
  } catch {
    return mockMovies;
  }
});

export const getMovieById = cache(async (movieId: string): Promise<Movie | null> => {
  const movies = await getMovies();
  return movies.find((movie) => movie.id === movieId) ?? null;
});

export const getCinemas = cache(async (): Promise<Cinema[]> => {
  if (!sql) return mockCinemas;

  try {
    const rows = await sql`
      select id, name, location, address
      from cinemas
      order by name asc
    `;
    return rows.map(asCinema);
  } catch {
    return mockCinemas;
  }
});

export const getStudios = cache(async (): Promise<Studio[]> => {
  if (!sql) return mockStudios;

  try {
    const rows = await sql`
      select
        st.id,
        st.name,
        st.cinema_id as "cinemaId",
        c.name as "cinemaName",
        st.capacity,
        st.format
      from studios st
      left join cinemas c on c.id = st.cinema_id
      order by c.name asc, st.name asc
    `;
    return rows.map(asStudio);
  } catch {
    return mockStudios;
  }
});

export const getStudioUtilization = cache(async (): Promise<StudioUtilizationItem[]> => {
  if (!sql) {
    return mockStudios.map((studio) => ({
      label: studio.name,
      value: 0,
      bookedSeats: 0,
      totalSeats: 0
    }));
  }

  try {
    const rows = await sql`
      select
        st.name as label,
        count(bs.id)::int as "bookedSeats",
        (count(distinct s.id) * st.capacity)::int as "totalSeats",
        case
          when count(bs.id) = 0 then 0
          else greatest(1, round((count(bs.id)::numeric / nullif(count(distinct s.id) * st.capacity, 0)) * 100))
        end::int as value
      from studios st
      left join schedules s on s.studio_id = st.id
      left join bookings b on b.schedule_id = s.id and b.status in ('CONFIRMED', 'PAID')
      left join booking_seats bs on bs.booking_id = b.id
      group by st.id
      order by value desc, st.name asc
    `;

    return rows.map((row) => ({
      label: String(row.label),
      value: Number(row.value ?? 0),
      bookedSeats: Number(row.bookedSeats ?? 0),
      totalSeats: Number(row.totalSeats ?? 0)
    }));
  } catch {
    return mockStudios.map((studio) => ({
      label: studio.name,
      value: 0,
      bookedSeats: 0,
      totalSeats: 0
    }));
  }
});

export const getSchedules = cache(async (): Promise<Schedule[]> => {
  if (!sql) return mockSchedules;

  try {
    const rows = await sql`
      select
        s.id,
        m.id as "movieId",
        m.title as "movieTitle",
        m.genre,
        m.duration_min as "durationMin",
        st.name as "studioName",
        to_char(s.starts_at, 'HH24:MI') as "startsAt",
        to_char(s.ends_at, 'HH24:MI') as "endsAt",
        s.format,
        coalesce(round((count(bs.id)::numeric / nullif(st.capacity, 0)) * 100), 0)::int as occupancy,
        s.price,
        m.poster_tone as "posterTone",
        m.poster_url as "posterUrl",
        c.id as "cinemaId",
        c.name as "cinemaName",
        c.location as "cinemaLocation",
        to_char(s.show_date, 'YYYY-MM-DD') as "showDate"
      from schedules s
      join movies m on m.id = s.movie_id
      join studios st on st.id = s.studio_id
      join cinemas c on c.id = s.cinema_id
      left join bookings b on b.schedule_id = s.id and b.status in ('CONFIRMED', 'PAID')
      left join booking_seats bs on bs.booking_id = b.id
      group by s.id, m.id, st.id, c.id
      order by s.show_date asc, s.starts_at asc
    `;
    return rows.map(asSchedule);
  } catch {
    return mockSchedules;
  }
});

export const getMovieShowtimes = cache(async (movieId: string): Promise<Schedule[]> => {
  const schedules = await getSchedules();
  return schedules.filter((schedule) => schedule.movieId === movieId);
});

export const getScheduleDetail = cache(async (
  scheduleId: string
): Promise<{ schedule: Schedule; movie: Movie; seats: BookingSeat[] } | null> => {
  const [movies, schedules] = await Promise.all([getMovies(), getSchedules()]);
  const schedule = schedules.find((item) => item.id === scheduleId);
  if (!schedule) return null;

  const movie = movies.find((item) => item.id === schedule.movieId);
  if (!movie) return null;

  if (!sql) return { schedule, movie, seats: mockBookingSeats };

  try {
    const bookedRows = await sql`
      select bs.seat_code
      from booking_seats bs
      join bookings b on b.id = bs.booking_id
      where b.schedule_id = ${scheduleId}
        and b.status in ('CONFIRMED', 'PAID')
    `;
    const bookedSeats = new Set(bookedRows.map((row) => String(row.seat_code)));

    await sql`delete from seat_locks where expires_at <= now()`;

    const lockedRows = await sql`
      select seat_code
      from seat_locks
      where schedule_id = ${scheduleId}
        and expires_at > now()
    `;
    const lockedSeats = new Set(lockedRows.map((row) => String(row.seat_code)));

    const rows = await sql`
      select
        seat_code as code,
        case when is_occupied then 'occupied' else 'available' end as status
      from studio_seats
      where studio_name = ${schedule.studioName}
      order by seat_code asc
    `;

    const seats = rows.map((row) => {
      const code = String(row.code);
      return {
        code,
        status:
          bookedSeats.has(code) || String(row.status) === "occupied"
            ? "occupied"
            : lockedSeats.has(code)
              ? "locked"
              : "available"
      } as BookingSeat;
    });

    return { schedule, movie, seats: seats.length ? seats : mockBookingSeats };
  } catch {
    return { schedule, movie, seats: mockBookingSeats };
  }
});

export const getUsers = cache(async (): Promise<AdminUser[]> => {
  if (!sql) return mockUsers;

  try {
    const rows = await sql`
      select
        id,
        name,
        email,
        role,
        status,
        system_access as "systemAccess",
        coalesce(to_char(last_active_at, 'DD Mon HH24:MI'), 'Belum aktif') as "lastActive"
      from admin_users
      order by created_at asc
    `;
    return rows.map(asUser);
  } catch {
    return mockUsers;
  }
});

export const getDashboardData = cache(async (): Promise<{
  metrics: Metric[];
  attention: AttentionItem[];
  movies: Movie[];
  schedules: Schedule[];
  dailySales: DailySalesData;
}> => {
  const [movies, schedules] = await Promise.all([getMovies(), getSchedules()]);
  if (!sql) return { metrics: mockMetrics, attention: mockAttention, movies, schedules, dailySales: mockDailySales };

  try {
    const [metricRow] = await sql`
      select
        (select count(*)::int from movies) as movies,
        (
          select count(bs.id)::int
          from booking_seats bs
          join bookings b on b.id = bs.booking_id
          where b.status in ('CONFIRMED', 'PAID')
        ) as tickets,
        (
          select coalesce(sum(bs.price), 0)::numeric
          from booking_seats bs
          join bookings b on b.id = bs.booking_id
          where b.status in ('CONFIRMED', 'PAID')
        ) as revenue,
        (select count(*)::int from admin_users where status = 'Active') as users
    `;

    const [todayRow] = await sql`
      select
        count(distinct b.id)::int as bookings,
        count(bs.id)::int as tickets,
        coalesce(sum(bs.price), 0)::numeric as revenue,
        coalesce(round(sum(bs.price) / nullif(count(distinct b.id), 0)), 0)::numeric as "avgOrder"
      from bookings b
      left join booking_seats bs on bs.booking_id = b.id
      where b.created_at::date = current_date
        and b.status in ('CONFIRMED', 'PAID')
    `;

    const dailyRows = await sql`
      with slots as (
        select generate_series(10, 22, 2) as hour
      )
      select
        lpad(slots.hour::text, 2, '0') || ':00' as label,
        coalesce(sum(bs.price), 0)::numeric as revenue,
        count(bs.id)::int as tickets,
        count(distinct b.id)::int as bookings
      from slots
      left join bookings b on b.created_at::date = current_date
        and extract(hour from b.created_at) >= slots.hour
        and extract(hour from b.created_at) < slots.hour + 2
        and b.status in ('CONFIRMED', 'PAID')
      left join booking_seats bs on bs.booking_id = b.id
      group by slots.hour
      order by slots.hour asc
    `;

    const recentRows = await sql`
      select
        b.id,
        b.booking_code as code,
        m.title as "movieTitle",
        count(bs.id)::int as seats,
        b.total_amount as "totalAmount",
        to_char(b.created_at, 'HH24:MI') as "createdAt"
      from bookings b
      join schedules s on s.id = b.schedule_id
      join movies m on m.id = s.movie_id
      left join booking_seats bs on bs.booking_id = b.id
      where b.created_at::date = current_date
        and b.status in ('CONFIRMED', 'PAID')
      group by b.id, m.title
      order by b.created_at desc
      limit 4
    `;

    const metrics: Metric[] = [
      { label: "Total Film", value: Number(metricRow.movies).toLocaleString("id-ID"), trend: "katalog aktif", tone: "up" },
      { label: "Tiket Terjual", value: Number(metricRow.tickets).toLocaleString("id-ID"), trend: "dari booking", tone: "neutral" },
      {
        label: "Pendapatan",
        value: formatCompactCurrency(Number(metricRow.revenue)),
        trend: "dari pembayaran",
        tone: "neutral"
      },
      { label: "Pengguna Aktif", value: Number(metricRow.users).toLocaleString("id-ID"), trend: "admin aktif", tone: "up" }
    ];

    return {
      metrics,
      attention: mockAttention,
      movies,
      schedules,
      dailySales: {
        totalRevenue: Number(todayRow?.revenue ?? 0),
        ticketsSold: Number(todayRow?.tickets ?? 0),
        bookings: Number(todayRow?.bookings ?? 0),
        avgOrder: Number(todayRow?.avgOrder ?? 0),
        hourly: dailyRows.map((row) => ({
          label: String(row.label),
          revenue: Number(row.revenue ?? 0),
          tickets: Number(row.tickets ?? 0),
          bookings: Number(row.bookings ?? 0)
        })),
        recent: recentRows.map((row) => ({
          id: String(row.id),
          code: String(row.code),
          movieTitle: String(row.movieTitle),
          seats: Number(row.seats ?? 0),
          totalAmount: Number(row.totalAmount ?? 0),
          createdAt: String(row.createdAt)
        }))
      }
    };
  } catch {
    return { metrics: mockMetrics, attention: mockAttention, movies, schedules, dailySales: mockDailySales };
  }
});

export const getAnalytics = cache(async (period: "today" | "7d" | "30d" | "month" = "today"): Promise<AnalyticsData> => {
  if (!sql) return mockAnalytics;

  try {
    const startDate = getAnalyticsStartDate(period);
    const [metricRow] = await sql`
      with schedule_occupancy as (
        select
          s.id,
          st.capacity,
          count(bs.id)::int as booked_seats
        from schedules s
        join studios st on st.id = s.studio_id
        left join bookings b on b.schedule_id = s.id
          and b.status in ('CONFIRMED', 'PAID')
          and (${startDate}::date is null or b.created_at::date >= ${startDate}::date)
        left join booking_seats bs on bs.booking_id = b.id
        group by s.id, st.capacity
      )
      select
        (
          select count(*)::int
          from bookings
          where status in ('CONFIRMED', 'PAID')
            and (${startDate}::date is null or created_at::date >= ${startDate}::date)
        ) as "bookingsToday",
        (
          select count(bs.id)::int
          from booking_seats bs
          join bookings b on b.id = bs.booking_id
          where b.status in ('CONFIRMED', 'PAID')
            and (${startDate}::date is null or b.created_at::date >= ${startDate}::date)
        ) as tickets,
        (
          select coalesce(sum(bs.price), 0)::numeric
          from booking_seats bs
          join bookings b on b.id = bs.booking_id
          where b.status in ('CONFIRMED', 'PAID')
            and (${startDate}::date is null or b.created_at::date >= ${startDate}::date)
        ) as revenue,
        coalesce(round(avg(case when capacity > 0 then (booked_seats::numeric / capacity) * 100 else 0 end)), 0)::int as "avgOccupancy"
      from schedule_occupancy
    `;

    const topMovies = await sql`
      with movie_capacity as (
        select
          m.id,
          coalesce(sum(st.capacity), 0)::int as total_seats
        from movies m
        left join schedules s on s.movie_id = m.id
        left join studios st on st.id = s.studio_id
        group by m.id
      ),
      movie_sales as (
        select
          m.id,
          m.title,
          m.imdb_rank,
          count(bs.id)::int as tickets_sold,
          coalesce(sum(bs.price), 0)::numeric as revenue
        from movies m
        left join schedules s on s.movie_id = m.id
        left join bookings b on b.schedule_id = s.id
          and b.status in ('CONFIRMED', 'PAID')
          and (${startDate}::date is null or b.created_at::date >= ${startDate}::date)
        left join booking_seats bs on bs.booking_id = b.id
        group by m.id
      )
      select
        ms.id,
        ms.title,
        ms.tickets_sold as "ticketsSold",
        ms.revenue,
        case
          when ms.tickets_sold = 0 then 0
          else greatest(1, round((ms.tickets_sold::numeric / nullif(mc.total_seats, 0)) * 100))
        end::int as occupancy
      from movie_sales ms
      join movie_capacity mc on mc.id = ms.id
      order by ms.revenue desc, ms.tickets_sold desc, ms.imdb_rank asc nulls last
      limit 10
    `;

    const studioShare = await sql`
      with studio_sales as (
        select
          st.name as label,
          count(bs.id)::int as tickets
        from studios st
        left join schedules s on s.studio_id = st.id
        left join bookings b on b.schedule_id = s.id
          and b.status in ('CONFIRMED', 'PAID')
          and (${startDate}::date is null or b.created_at::date >= ${startDate}::date)
        left join booking_seats bs on bs.booking_id = b.id
        group by st.id
      ),
      totals as (
        select coalesce(sum(tickets), 0)::int as total from studio_sales
      )
      select
        label,
        case when totals.total = 0 then 0 else round((tickets::numeric / totals.total) * 100)::int end as value
      from studio_sales, totals
      order by value desc, label asc
      limit 5
    `;

    return {
      metrics: [
        {
          label: "Total Booking",
          value: Number(metricRow.bookingsToday ?? 0).toLocaleString("id-ID"),
          trend: analyticsPeriodLabel(period),
          tone: "neutral"
        },
        {
          label: "Tiket Terjual",
          value: Number(metricRow.tickets ?? 0).toLocaleString("id-ID"),
          trend: "dari booking",
          tone: "neutral"
        },
        {
          label: "Pendapatan",
          value: formatCompactCurrency(Number(metricRow.revenue ?? 0)),
          trend: "dari pembayaran",
          tone: "neutral"
        },
        {
          label: "Avg Occupancy",
          value: `${Number(metricRow.avgOccupancy ?? 0).toLocaleString("id-ID")}%`,
          trend: "jadwal aktif",
          tone: "neutral"
        }
      ],
      topMovies: topMovies.map((row) => ({
        id: String(row.id),
        title: String(row.title),
        ticketsSold: Number(row.ticketsSold ?? 0),
        revenue: Number(row.revenue ?? 0),
        occupancy: Number(row.occupancy ?? 0)
      })),
      studioShare: studioShare.map((row) => ({
        label: String(row.label),
        value: Number(row.value ?? 0)
      }))
    };
  } catch {
    return mockAnalytics;
  }
});

function getAnalyticsStartDate(period: "today" | "7d" | "30d" | "month") {
  const date = new Date();
  if (period === "7d") date.setDate(date.getDate() - 6);
  if (period === "30d") date.setDate(date.getDate() - 29);
  if (period === "month") date.setDate(1);
  return date.toISOString().slice(0, 10);
}

function analyticsPeriodLabel(period: "today" | "7d" | "30d" | "month") {
  if (period === "7d") return "7 hari terakhir";
  if (period === "30d") return "30 hari terakhir";
  if (period === "month") return "bulan ini";
  return "hari ini";
}

export const getBookingData = cache(async (): Promise<{
  schedule: Schedule;
  movie: Movie;
  seats: BookingSeat[];
}> => {
  const schedules = await getSchedules();
  const schedule = schedules[0] ?? mockSchedules[0];
  const detail = await getScheduleDetail(schedule.id);
  return detail ?? { schedule, movie: mockMovies[0], seats: mockBookingSeats };
});

export const getBookingDetail = cache(async (bookingId: string): Promise<BookingDetail | null> => {
  if (!sql) return null;

  try {
    const rows = await sql`
      select
        b.id,
        b.booking_code as "bookingCode",
        b.customer_name as "customerName",
        b.customer_email as "customerEmail",
        b.payment_method as "paymentMethod",
        b.status,
        b.total_amount as "totalAmount",
        to_char(b.created_at, 'DD Mon YYYY HH24:MI') as "createdAt",
        s.id as "scheduleId",
        m.id as "movieId",
        m.title as "movieTitle",
        m.genre,
        m.duration_min as "durationMin",
        m.status as "movieStatus",
        m.rating,
        m.poster_tone as "posterTone",
        m.poster_url as "posterUrl",
        m.director,
        m.cast_members as cast,
        m.trailer_url as "trailerUrl",
        m.imdb_rank as "imdbRank",
        to_char(m.release_date, 'YYYY-MM-DD') as "releaseDate",
        m.synopsis,
        st.name as "studioName",
        to_char(s.starts_at, 'HH24:MI') as "startsAt",
        to_char(s.ends_at, 'HH24:MI') as "endsAt",
        s.format,
        s.occupancy,
        s.price,
        c.id as "cinemaId",
        c.name as "cinemaName",
        c.location as "cinemaLocation",
        to_char(s.show_date, 'YYYY-MM-DD') as "showDate",
        coalesce(string_agg(bs.seat_code, ', ' order by bs.seat_code), '') as seats
      from bookings b
      join schedules s on s.id = b.schedule_id
      join movies m on m.id = s.movie_id
      join studios st on st.id = s.studio_id
      join cinemas c on c.id = s.cinema_id
      left join booking_seats bs on bs.booking_id = b.id
      where b.id = ${bookingId}
      group by b.id, s.id, m.id, st.name, c.id
      limit 1
    `;

    const row = rows[0];
    if (!row) return null;

    const movie = asMovie({
      id: row.movieId,
      title: row.movieTitle,
      genre: row.genre,
      durationMin: row.durationMin,
      status: row.movieStatus,
      rating: row.rating,
      posterTone: row.posterTone,
      posterUrl: row.posterUrl,
      director: row.director,
      cast: row.cast,
      trailerUrl: row.trailerUrl,
      imdbRank: row.imdbRank,
      releaseDate: row.releaseDate,
      synopsis: row.synopsis
    });

    const schedule = asSchedule({
      id: row.scheduleId,
      movieId: row.movieId,
      movieTitle: row.movieTitle,
      genre: row.genre,
      durationMin: row.durationMin,
      studioName: row.studioName,
      startsAt: row.startsAt,
      endsAt: row.endsAt,
      format: row.format,
      occupancy: row.occupancy,
      price: row.price,
      posterTone: row.posterTone,
      posterUrl: row.posterUrl,
      cinemaId: row.cinemaId,
      cinemaName: row.cinemaName,
      cinemaLocation: row.cinemaLocation,
      showDate: row.showDate
    });

    return {
      id: String(row.id),
      bookingCode: String(row.bookingCode),
      customerName: String(row.customerName),
      customerEmail: String(row.customerEmail),
      paymentMethod: String(row.paymentMethod),
      status: String(row.status),
      totalAmount: Number(row.totalAmount),
      createdAt: String(row.createdAt),
      seats: String(row.seats).split(", ").filter(Boolean),
      schedule,
      movie
    };
  } catch {
    return null;
  }
});

export function getSqlClient() {
  return sql;
}

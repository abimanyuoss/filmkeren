"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CUSTOMER_COOKIE, getCustomerSession, safeRedirectPath } from "@/lib/auth";
import { getSqlClient } from "@/lib/db";

export async function createMovie(formData: FormData) {
  const sql = getSqlClient();
  if (!sql) {
    revalidatePath("/admin/movies");
    return;
  }

  const title = String(formData.get("title") ?? "Untitled").trim() || "Untitled";
  const genre = String(formData.get("genre") ?? "").trim() || "Drama";
  const durationMin = Number(formData.get("durationMin") ?? 120);
  const status = String(formData.get("status") ?? "").trim() || "Coming Soon";
  const rating = String(formData.get("rating") ?? "").trim() || "PG-13";
  const releaseDate = String(formData.get("releaseDate") ?? "").trim() || new Date().toISOString().slice(0, 10);
  const synopsis = String(formData.get("synopsis") ?? "");
  const posterTone = String(formData.get("posterTone") ?? "").trim() || "void";
  const posterUrl = String(formData.get("posterUrl") ?? "").trim();
  const director = String(formData.get("director") ?? "").trim();
  const cast = String(formData.get("cast") ?? "").trim();
  const trailerUrl = String(formData.get("trailerUrl") ?? "").trim();
  const imdbRankValue = String(formData.get("imdbRank") ?? "").trim();
  const imdbRank = imdbRankValue ? Number(imdbRankValue) : null;

  await sql`
    insert into movies (
      title, genre, duration_min, status, rating, release_date, synopsis,
      poster_tone, poster_url, director, cast_members, trailer_url, imdb_rank
    )
    values (
      ${title}, ${genre}, ${durationMin}, ${status}, ${rating}, ${releaseDate}, ${synopsis},
      ${posterTone}, ${posterUrl}, ${director}, ${cast}, ${trailerUrl}, ${imdbRank}
    )
  `;

  revalidatePath("/");
  revalidatePath("/movies");
  revalidatePath("/admin");
  revalidatePath("/admin/movies");
}

export async function deleteMovie(formData: FormData) {
  const sql = getSqlClient();
  const movieId = String(formData.get("movieId") ?? "");

  if (sql && movieId) {
    await sql`delete from movies where id = ${movieId}`;
  }

  revalidatePath("/");
  revalidatePath("/movies");
  revalidatePath("/admin");
  revalidatePath("/admin/movies");
}

export async function updateMovie(formData: FormData) {
  const sql = getSqlClient();
  const movieId = String(formData.get("movieId") ?? "");

  if (!sql || !movieId) {
    revalidatePath("/admin/movies");
    return;
  }

  const title = String(formData.get("title") ?? "Untitled").trim() || "Untitled";
  const genre = String(formData.get("genre") ?? "").trim() || "Drama";
  const durationMin = Number(formData.get("durationMin") ?? 120);
  const status = String(formData.get("status") ?? "").trim() || "Coming Soon";
  const rating = String(formData.get("rating") ?? "").trim() || "PG-13";
  const releaseDate = String(formData.get("releaseDate") ?? "").trim() || new Date().toISOString().slice(0, 10);
  const synopsis = String(formData.get("synopsis") ?? "");
  const posterTone = String(formData.get("posterTone") ?? "").trim() || "void";
  const posterUrl = String(formData.get("posterUrl") ?? "").trim();
  const director = String(formData.get("director") ?? "").trim();
  const cast = String(formData.get("cast") ?? "").trim();
  const trailerUrl = String(formData.get("trailerUrl") ?? "").trim();
  const imdbRankValue = String(formData.get("imdbRank") ?? "").trim();
  const imdbRank = imdbRankValue ? Number(imdbRankValue) : null;

  await sql`
    update movies
    set
      title = ${title},
      genre = ${genre},
      duration_min = ${durationMin},
      status = ${status},
      rating = ${rating},
      release_date = ${releaseDate},
      synopsis = ${synopsis},
      poster_tone = ${posterTone},
      poster_url = ${posterUrl},
      director = ${director},
      cast_members = ${cast},
      trailer_url = ${trailerUrl},
      imdb_rank = ${imdbRank},
      updated_at = now()
    where id = ${movieId}
  `;

  revalidatePath("/");
  revalidatePath("/movies");
  revalidatePath(`/movies/${movieId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/movies");
}

export async function createSchedule(formData: FormData) {
  const sql = getSqlClient();
  if (!sql) {
    revalidatePath("/admin/schedules");
    return;
  }

  const movieId = String(formData.get("movieId") ?? "");
  const cinemaId = String(formData.get("cinemaId") ?? "");
  const studioId = String(formData.get("studioId") ?? "");
  const showDate = String(formData.get("showDate") ?? new Date().toISOString().slice(0, 10));
  const startsAt = String(formData.get("startsAt") ?? "12:00");
  const endsAt = String(formData.get("endsAt") ?? "14:00");
  const format = String(formData.get("format") ?? "Regular 2D");
  const price = Number(formData.get("price") ?? 65000);

  if (movieId && cinemaId && studioId) {
    await sql`
      insert into schedules (movie_id, cinema_id, studio_id, starts_at, ends_at, show_date, format, price, occupancy)
      values (${movieId}, ${cinemaId}, ${studioId}, ${startsAt}, ${endsAt}, ${showDate}, ${format}, ${price}, 0)
    `;
  }

  revalidatePath("/admin/schedules");
  revalidatePath("/movies");
}

export async function updateSchedule(formData: FormData) {
  const sql = getSqlClient();
  const scheduleId = String(formData.get("scheduleId") ?? "");

  if (!sql || !scheduleId) {
    revalidatePath("/admin/schedules");
    return;
  }

  const movieId = String(formData.get("movieId") ?? "");
  const cinemaId = String(formData.get("cinemaId") ?? "");
  const studioId = String(formData.get("studioId") ?? "");
  const showDate = String(formData.get("showDate") ?? new Date().toISOString().slice(0, 10));
  const startsAt = String(formData.get("startsAt") ?? "12:00");
  const endsAt = String(formData.get("endsAt") ?? "14:00");
  const format = String(formData.get("format") ?? "Regular 2D");
  const price = Number(formData.get("price") ?? 65000);

  if (movieId && cinemaId && studioId) {
    await sql`
      update schedules
      set
        movie_id = ${movieId},
        cinema_id = ${cinemaId},
        studio_id = ${studioId},
        show_date = ${showDate},
        starts_at = ${startsAt},
        ends_at = ${endsAt},
        format = ${format},
        price = ${price}
      where id = ${scheduleId}
    `;
  }

  revalidatePath("/admin/schedules");
  revalidatePath("/movies");
}

export async function deleteSchedule(formData: FormData) {
  const sql = getSqlClient();
  const scheduleId = String(formData.get("scheduleId") ?? "");

  if (sql && scheduleId) {
    await sql`delete from schedules where id = ${scheduleId}`;
  }

  revalidatePath("/admin/schedules");
  revalidatePath("/movies");
}

export async function toggleUserAccess(formData: FormData) {
  const sql = getSqlClient();
  const userId = String(formData.get("userId") ?? "");
  const nextAccess = String(formData.get("nextAccess") ?? "false") === "true";

  if (sql && userId) {
    await sql`
      update admin_users
      set system_access = ${nextAccess}, updated_at = now()
      where id = ${userId}
    `;
  }

  revalidatePath("/admin/users");
}

export async function createBooking(formData: FormData) {
  const sql = getSqlClient();
  const customerSession = await getCustomerSession();
  const scheduleId = String(formData.get("scheduleId") ?? "");
  const rawSeats = String(formData.get("seats") ?? "");
  const seats = rawSeats
    .split(",")
    .map((seat) => seat.trim())
    .filter(Boolean);
  const customerName = customerSession?.name ?? "";
  const customerEmail = customerSession?.email ?? "";
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const paymentMethod = String(formData.get("paymentMethod") ?? "QRIS").trim();
  const lockToken = String(formData.get("lockToken") ?? "").trim();

  if (!customerSession) {
    redirect(
      `/account/login?redirectTo=${encodeURIComponent(
        `/checkout?scheduleId=${scheduleId}&seats=${rawSeats}&lockToken=${lockToken}`
      )}`
    );
  }

  if (!sql || !scheduleId || seats.length === 0 || !customerName || !customerEmail) {
    redirect(`/checkout?scheduleId=${encodeURIComponent(scheduleId)}&seats=${encodeURIComponent(rawSeats)}&error=missing`);
  }

  const alreadyBooked = await sql`
    select bs.seat_code
    from booking_seats bs
    join bookings b on b.id = bs.booking_id
    where b.schedule_id = ${scheduleId}
      and b.status in ('CONFIRMED', 'PAID')
      and bs.seat_code = any(${seats})
  `;

  if (alreadyBooked.length > 0) {
    redirect(`/booking/${scheduleId}?error=seat-unavailable`);
  }

  await sql`delete from seat_locks where expires_at <= now()`;

  const lockedByOther = await sql`
    select seat_code
    from seat_locks
    where schedule_id = ${scheduleId}
      and seat_code = any(${seats})
      and lock_token <> ${lockToken}
      and expires_at > now()
  `;

  if (lockedByOther.length > 0) {
    redirect(`/booking/${scheduleId}?error=seat-locked`);
  }

  const [schedule] = await sql`
    select price
    from schedules
    where id = ${scheduleId}
    limit 1
  `;

  if (!schedule) {
    redirect("/movies");
  }

  const price = Number(schedule.price);
  const serviceFee = 5000;
  const totalAmount = price * seats.length + serviceFee;
  const bookingCode = `FK${Date.now().toString(36).toUpperCase().slice(-8)}`;

  const [booking] = await sql`
    insert into bookings (
      booking_code, schedule_id, customer_id, customer_name, customer_email, customer_phone,
      payment_method, total_amount, status, expires_at, paid_at
    )
    values (
      ${bookingCode}, ${scheduleId}, ${customerSession.id}, ${customerName}, ${customerEmail}, ${customerPhone},
      ${paymentMethod}, ${totalAmount}, 'PAID', now() + interval '10 minutes', now()
    )
    returning id
  `;

  for (const seat of seats) {
    await sql`
      insert into booking_seats (booking_id, seat_code, price)
      values (${booking.id}, ${seat}, ${price})
    `;
  }

  await sql`
    delete from seat_locks
    where schedule_id = ${scheduleId}
      and seat_code = any(${seats})
  `;

  revalidatePath(`/booking/${scheduleId}`);
  revalidatePath("/admin");
  redirect(`/ticket/${booking.id}`);
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (email !== "admin@gmail.com" || password !== "admin123") {
    redirect("/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set("filmkeren_admin", "abimanyu-panji", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("filmkeren_admin");
  redirect("/login");
}

export async function registerCustomer(formData: FormData) {
  const sql = getSqlClient();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const redirectTo = safeRedirectPath(formData.get("redirectTo"));

  if (!sql || !name || !email || password.length < 6) {
    redirect(`/account/register?error=invalid&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  try {
    const [customer] = await sql`
      insert into customers (name, email, phone, password_hash)
      values (${name}, ${email}, ${phone}, crypt(${password}, gen_salt('bf')))
      returning id, name, email
    `;

    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE, JSON.stringify(customer), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  } catch {
    redirect(`/account/register?error=exists&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  redirect(redirectTo);
}

export async function loginCustomer(formData: FormData) {
  const sql = getSqlClient();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const redirectTo = safeRedirectPath(formData.get("redirectTo"));

  if (!sql || !email || !password) {
    redirect(`/account/login?error=invalid&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const [customer] = await sql`
    select id, name, email
    from customers
    where email = ${email}
      and password_hash = crypt(${password}, password_hash)
    limit 1
  `;

  if (!customer) {
    redirect(`/account/login?error=invalid&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, JSON.stringify(customer), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  redirect(redirectTo);
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
  redirect("/movies");
}

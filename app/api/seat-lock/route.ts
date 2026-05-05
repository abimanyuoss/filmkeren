import { NextResponse } from "next/server";
import { getSqlClient } from "@/lib/db";

export async function POST(request: Request) {
  const sql = getSqlClient();
  const body = (await request.json().catch(() => ({}))) as {
    scheduleId?: string;
    seats?: string[];
    lockToken?: string;
  };
  const scheduleId = String(body.scheduleId ?? "");
  const lockToken = String(body.lockToken ?? "");
  const seats = Array.from(new Set((body.seats ?? []).map((seat) => String(seat).trim()).filter(Boolean)));

  if (!sql || !scheduleId || !lockToken) {
    return NextResponse.json({ ok: false, message: "Seat lock tidak tersedia." }, { status: 400 });
  }

  await sql`delete from seat_locks where expires_at <= now()`;

  if (!seats.length) {
    await sql`delete from seat_locks where schedule_id = ${scheduleId} and lock_token = ${lockToken}`;
    return NextResponse.json({ ok: true, lockedSeats: [] });
  }

  const bookedRows = await sql`
    select bs.seat_code
    from booking_seats bs
    join bookings b on b.id = bs.booking_id
    where b.schedule_id = ${scheduleId}
      and b.status in ('CONFIRMED', 'PAID')
      and bs.seat_code = any(${seats})
  `;
  const bookedSeats = bookedRows.map((row) => String(row.seat_code));
  if (bookedSeats.length) {
    return NextResponse.json({ ok: false, seats: bookedSeats, message: "Kursi sudah dipesan." }, { status: 409 });
  }

  const lockedRows = await sql`
    select seat_code
    from seat_locks
    where schedule_id = ${scheduleId}
      and seat_code = any(${seats})
      and lock_token <> ${lockToken}
      and expires_at > now()
  `;
  const lockedSeats = lockedRows.map((row) => String(row.seat_code));
  if (lockedSeats.length) {
    return NextResponse.json({ ok: false, seats: lockedSeats, message: "Kursi sedang dikunci pelanggan lain." }, { status: 409 });
  }

  await sql`
    delete from seat_locks
    where schedule_id = ${scheduleId}
      and lock_token = ${lockToken}
      and not (seat_code = any(${seats}))
  `;

  for (const seat of seats) {
    await sql`
      insert into seat_locks (schedule_id, seat_code, lock_token, expires_at)
      values (${scheduleId}, ${seat}, ${lockToken}, now() + interval '5 minutes')
      on conflict (schedule_id, seat_code)
      do update set lock_token = excluded.lock_token, expires_at = excluded.expires_at
      where seat_locks.lock_token = ${lockToken} or seat_locks.expires_at <= now()
    `;
  }

  return NextResponse.json({ ok: true, lockedSeats: seats, expiresInSeconds: 300 });
}

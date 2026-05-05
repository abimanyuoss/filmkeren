import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { createSchedule } from "@/app/actions";
import {
  PageHeader,
  PrimaryButton,
  ScheduleRow,
  StudioUtilization
} from "@/components/ui";
import { getCinemas, getMovies, getSchedules, getStudios, getStudioUtilization } from "@/lib/db";

export default async function SchedulesPage({
  searchParams
}: {
  searchParams: Promise<{ cinemaId?: string; studioName?: string; date?: string }>;
}) {
  const filters = await searchParams;
  const [schedules, movies, cinemas, studios, studioUtilization] = await Promise.all([
    getSchedules(),
    getMovies(),
    getCinemas(),
    getStudios(),
    getStudioUtilization()
  ]);
  const selectedCinemaId = filters.cinemaId ?? "";
  const selectedStudioName = filters.studioName ?? "";
  const selectedDate = filters.date ?? "";
  const filteredSchedules = schedules.filter((schedule) => {
    if (selectedCinemaId && schedule.cinemaId !== selectedCinemaId) return false;
    if (selectedStudioName && schedule.studioName !== selectedStudioName) return false;
    if (selectedDate && schedule.showDate !== selectedDate) return false;
    return true;
  });
  const activeCinemaCount = new Set(filteredSchedules.map((schedule) => schedule.cinemaId)).size;
  const activeStudioCount = new Set(filteredSchedules.map((schedule) => schedule.studioName)).size;
  const avgOccupancy = filteredSchedules.length
    ? Math.round(filteredSchedules.reduce((total, schedule) => total + schedule.occupancy, 0) / filteredSchedules.length)
    : 0;

  function scheduleHref(overrides: { cinemaId?: string; studioName?: string; date?: string }) {
    const params = new URLSearchParams();
    const nextCinemaId = overrides.cinemaId ?? selectedCinemaId;
    const nextStudioName = overrides.studioName ?? selectedStudioName;
    const nextDate = overrides.date ?? selectedDate;

    if (nextCinemaId) params.set("cinemaId", nextCinemaId);
    if (nextStudioName) params.set("studioName", nextStudioName);
    if (nextDate) params.set("date", nextDate);

    const query = params.toString();
    return query ? `/admin/schedules?${query}` : "/admin/schedules";
  }

  return (
    <>
      <PageHeader
        eyebrow="Studio"
        title="Schedule & Studio Management"
      />

      <section className="schedule-page-stack">
        <article className="panel roster-panel">
          <div className="panel-heading roster-heading">
            <div>
              <h2>Daftar Jadwal</h2>
              <p>Filter jadwal berdasarkan cinema, studio, dan tanggal tayang.</p>
            </div>
          </div>

          <div className="schedule-summary-grid">
            <span>
              <strong>{filteredSchedules.length}</strong>
              <small>Jadwal</small>
            </span>
            <span>
              <strong>{activeCinemaCount}</strong>
              <small>Cinema</small>
            </span>
            <span>
              <strong>{activeStudioCount}</strong>
              <small>Studio</small>
            </span>
            <span>
              <strong>{avgOccupancy}%</strong>
              <small>Avg Occupancy</small>
            </span>
          </div>

          <div className="cinema-filter-chips">
            <Link className={!selectedCinemaId ? "selected" : ""} href={scheduleHref({ cinemaId: "", studioName: "" })}>
              Semua Cinema
            </Link>
            {cinemas.map((cinema) => (
              <Link
                className={selectedCinemaId === cinema.id ? "selected" : ""}
                href={scheduleHref({ cinemaId: cinema.id, studioName: "" })}
                key={cinema.id}
              >
                {cinema.name}
              </Link>
            ))}
          </div>

          <form className="schedule-filter-bar">
            <label>
              Cinema
              <select name="cinemaId" defaultValue={selectedCinemaId}>
                <option value="">Semua cinema</option>
                {cinemas.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Studio
              <select name="studioName" defaultValue={selectedStudioName}>
                <option value="">Semua studio</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.name}>
                    {studio.name} - {studio.format}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tanggal
              <input name="date" type="date" defaultValue={selectedDate} />
            </label>
            <div className="filter-actions">
              <button className="primary-button" type="submit">
                Terapkan
              </button>
              <Link className="secondary-button" href="/admin/schedules">
                Reset
              </Link>
            </div>
          </form>

          <div className="schedule-list">
            {filteredSchedules.length ? (
              filteredSchedules.map((schedule, index) => (
                <ScheduleRow active={index === 0} key={schedule.id} schedule={schedule} />
              ))
            ) : (
              <div className="empty-state schedule-empty">
                <strong>Tidak ada jadwal.</strong>
                <p>Ubah filter cinema, studio, atau tanggal untuk melihat jadwal lain.</p>
              </div>
            )}
          </div>
        </article>

        <section className="schedule-support-grid">
          <form action={createSchedule} className="panel movie-form schedule-form">
            <div className="panel-heading">
              <h2>Tambah Jadwal</h2>
              <CalendarPlus size={18} />
            </div>
            <label>
              Film
              <select name="movieId" required defaultValue="">
                <option disabled value="">
                  Pilih film
                </option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cinema
              <select name="cinemaId" required defaultValue="">
                <option disabled value="">
                  Pilih cinema
                </option>
                {cinemas.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Studio
              <select name="studioId" required defaultValue="">
                <option disabled value="">
                  Pilih studio
                </option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name} - {studio.format}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                Date
                <input name="showDate" type="date" required />
              </label>
              <label>
                Price
                <input min="0" name="price" placeholder="65000" type="number" required />
              </label>
              <label>
                Start
                <input name="startsAt" type="time" required />
              </label>
              <label>
                End
                <input name="endsAt" type="time" required />
              </label>
            </div>
            <label>
              Format
              <select name="format" defaultValue="Regular 2D">
                <option>Regular 2D</option>
                <option>IMAX 2D</option>
                <option>Dolby Atmos</option>
                <option>Premiere</option>
                <option>SphereX</option>
              </select>
            </label>
            <PrimaryButton type="submit">Save Slot</PrimaryButton>
          </form>
          <article className="panel">
            <div className="panel-heading">
              <h2>Studio Utilization</h2>
            </div>
            <StudioUtilization items={studioUtilization} />
          </article>
        </section>
      </section>
    </>
  );
}

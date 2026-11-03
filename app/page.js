"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const restaurants = ["Sushi", "Pasta", "Pizza", "Steakhouse", "Mexican"];
const vibes = ["Cinema", "Picnic", "Museum", "Bowling", "Beach", "Dance"];
const photos = {
  Sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
  Pasta: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
  Steakhouse: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  Mexican: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=80",
};
const blankMemory = { title: "", date: "", description: "", photo: null };
const blankPlan = { name: "", date: "", time: "", restaurant: "", vibe: "" };
const dateLabel = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));

export default function Home() {
  const [view, setView] = useState("tracker");
  const [events, setEvents] = useState([]);
  const [memory, setMemory] = useState(blankMemory);
  const [plan, setPlan] = useState(blankPlan);
  const [calendarLink, setCalendarLink] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/events")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((savedEvents) => {
        if (isCurrent) setEvents(savedEvents);
      })
      .catch(() => {
        if (isCurrent) setStatus("Connect Neon to save events permanently.");
      });

    return () => { isCurrent = false; };
  }, []);

  const orderedEvents = useMemo(() => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)), [events]);
  const today = new Date().toISOString().slice(0, 10);
  const past = orderedEvents.filter((event) => event.date < today);
  const upcoming = orderedEvents.filter((event) => event.date >= today);
  const updateMemory = (event) => setMemory({ ...memory, [event.target.name]: event.target.value });
  const updatePlan = (event) => setPlan({ ...plan, [event.target.name]: event.target.value });

  async function addMemory(event) {
    event.preventDefault();
    const data = new FormData();
    data.set("title", memory.title);
    data.set("date", memory.date);
    data.set("description", memory.description);
    if (memory.photo) data.set("photo", memory.photo);
    await saveEvent(data);
  }

  async function createPlan(event) {
    event.preventDefault();
    const title = `${plan.restaurant} & ${plan.vibe}`;
    const description = `A date with ${plan.name}: ${plan.restaurant}, followed by ${plan.vibe.toLowerCase()}.`;
    const data = { title, date: plan.date, description, photoUrl: photos[plan.restaurant] };
    await saveEvent(data);
    const start = new Date(`${plan.date}T${plan.time}`);
    const end = new Date(start); end.setHours(end.getHours() + 3);
    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    setCalendarLink(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(start)}/${formatDate(end)}&details=${encodeURIComponent(description)}`);
    setPlan(blankPlan);
  }

  async function saveEvent(data) {
    setStatus("Saving...");
    try {
      const response = await fetch("/api/events", { method: "POST", body: data instanceof FormData ? data : JSON.stringify(data), headers: data instanceof FormData ? undefined : { "Content-Type": "application/json" } });
      const savedEvent = await response.json();
      if (!response.ok) throw new Error(savedEvent.error);
      setEvents((current) => [...current, savedEvent]);
      setMemory(blankMemory);
      setStatus("Saved to your shared timeline.");
    } catch (error) {
      setStatus(error.message || "Could not save this event.");
    }
  }

  return <main className="min-h-screen bg-[#fffaf7] text-[#312b32]">
    <header className="border-b border-[#eadfd9] bg-[#fffaf7]/95 px-5 py-4 backdrop-blur sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
      <button className="text-left" type="button" onClick={() => setView("tracker")}><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b85d67]">Relationship Tracker</p><h1 className="font-serif text-2xl font-bold text-[#342d34]">Our little story</h1></button>
      <nav className="flex rounded-full bg-[#f4e9e5] p-1" aria-label="Application sections"><Tab active={view === "tracker"} onClick={() => setView("tracker")}>Timeline</Tab><Tab active={view === "planner"} onClick={() => setView("planner")}>Plan a date</Tab></nav>
    </div></header>
    {view === "tracker" ? <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b85d67]">A shared calendar of us</p><h2 className="mt-3 max-w-2xl font-serif text-5xl font-bold leading-[.94] text-[#342d34] sm:text-7xl">Every date becomes part of the story.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-[#71636a]">Keep the moments that shaped you close, and make room for every lovely thing ahead.</p></div><div className="rounded-[2rem] bg-[#4d3948] p-6 text-white shadow-xl shadow-[#4d3948]/15"><p className="text-sm font-semibold text-[#f4c8c5]">Your journey</p><p className="mt-2 font-serif text-4xl font-bold">{events.length} chapters</p><p className="mt-3 text-sm leading-6 text-white/75">Past memories and future plans, all in one place.</p><button className="mt-5 rounded-full bg-[#f6d5cc] px-5 py-3 text-sm font-bold text-[#4d3948] transition hover:bg-white" type="button" onClick={() => setView("planner")}>Plan the next one →</button></div></div>
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_.7fr]"><div className="space-y-10"><Timeline title="Already written" subtitle="The days we keep replaying" events={past} empty="Your favorite memories will live here." /><Timeline title="Coming up" subtitle="The next pages to write" events={upcoming} empty="Plan a date to add it to your shared calendar." /></div><form className="h-fit rounded-[2rem] border border-[#eadfd9] bg-white p-6 shadow-lg shadow-[#8f6f6c]/10 sm:p-8" onSubmit={addMemory}><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b85d67]">Add a memory</p><h3 className="mt-2 font-serif text-3xl font-bold">Save a special day</h3><div className="mt-6 grid gap-4"><Field label="Title"><input required name="title" value={memory.title} onChange={updateMemory} placeholder="The day we..." /></Field><Field label="Date"><input required type="date" name="date" value={memory.date} onChange={updateMemory} /></Field><Field label="Photo (optional)"><input type="file" accept="image/*" onChange={(event) => setMemory({ ...memory, photo: event.target.files?.[0] || null })} /></Field><Field label="Description"><textarea required rows="4" name="description" value={memory.description} onChange={updateMemory} placeholder="What made this date special?" /></Field><button className="rounded-full bg-[#b85d67] px-5 py-3 font-bold text-white transition hover:bg-[#9c4855]" type="submit">Add to our story</button>{status && <p className="text-sm font-semibold text-[#71636a]" role="status">{status}</p>}</div></form></div>
    </section> : <section className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-20"><div className="rounded-[2rem] bg-[#4d3948] p-7 text-white sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4c8c5]">Date planner</p><h2 className="mt-3 font-serif text-5xl font-bold leading-none">Make the next chapter count.</h2><p className="mt-6 leading-7 text-white/75">This is your planning corner. Once you create a date, it appears on your relationship timeline and is ready for your calendar.</p><button className="mt-8 text-sm font-bold text-[#f6d5cc] underline underline-offset-4" type="button" onClick={() => setView("tracker")}>← Back to timeline</button></div><div className="rounded-[2rem] border border-[#eadfd9] bg-white p-6 shadow-xl shadow-[#8f6f6c]/10 sm:p-9"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b85d67]">A date for two</p><h2 className="mt-2 font-serif text-4xl font-bold">Build the plan</h2><form className="mt-7 grid gap-5" onSubmit={createPlan}><Field label="Your date's name"><input required name="name" value={plan.name} onChange={updatePlan} placeholder="Alex" /></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Date"><input required type="date" name="date" value={plan.date} onChange={updatePlan} /></Field><Field label="Time"><input required type="time" name="time" value={plan.time} onChange={updatePlan} /></Field></div><Select label="Restaurant" name="restaurant" value={plan.restaurant} options={restaurants} onChange={updatePlan} /><Select label="After dinner" name="vibe" value={plan.vibe} options={vibes} onChange={updatePlan} /><button className="rounded-full bg-[#b85d67] px-5 py-4 font-bold text-white transition hover:bg-[#9c4855]" type="submit">Create date & add to tracker</button></form>{calendarLink && <a className="mt-5 block rounded-full bg-[#edf2e9] px-5 py-3 text-center text-sm font-bold text-[#40503e] transition hover:bg-[#dfe9d9]" href={calendarLink} target="_blank" rel="noreferrer">Save this date to Google Calendar ↗</a>}</div></section>}
  </main>;
}

function Tab({ active, onClick, children }) { return <button className={`rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-white text-[#4d3948] shadow-sm" : "text-[#796a70] hover:text-[#4d3948]"}`} type="button" onClick={onClick}>{children}</button>; }
function Field({ label, children }) { return <label className="grid gap-2 text-sm font-bold text-[#5c5056]"><span>{label}</span>{children}</label>; }
function Select({ label, name, value, options, onChange }) { return <Field label={label}><select required name={name} value={value} onChange={onChange}><option value="" disabled>Select one</option>{options.map((option) => <option key={option}>{option}</option>)}</select></Field>; }
function Timeline({ title, subtitle, events, empty }) { return <section><div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b85d67]">{title}</p><h3 className="mt-1 font-serif text-3xl font-bold">{subtitle}</h3></div><span className="rounded-full bg-[#f4e9e5] px-3 py-1 text-sm font-bold text-[#77656b]">{events.length}</span></div>{events.length ? <div className="grid gap-4 sm:grid-cols-2">{events.map((event) => <article className="overflow-hidden rounded-[1.5rem] border border-[#eadfd9] bg-white shadow-sm" key={event.id}>{event.photo ? <div className="relative h-44"><Image src={event.photo} alt="" fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover" /></div> : <div className="grid h-44 place-items-center bg-[#f4e9e5] text-4xl" aria-hidden="true">♥</div>}<div className="p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b85d67]">{dateLabel(event.date)}</p><h4 className="mt-2 font-serif text-2xl font-bold">{event.title}</h4><p className="mt-2 text-sm leading-6 text-[#71636a]">{event.description}</p></div></article>)}</div> : <p className="rounded-2xl border border-dashed border-[#d9cbc5] bg-white/70 p-5 text-[#83747a]">{empty}</p>}</section>; }

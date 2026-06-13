"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const restaurantOptions = [
  { label: "Sushi", emoji: "🍣", note: "quiet counter seats" },
  { label: "Pasta", emoji: "🍝", note: "warm trattoria energy" },
  { label: "Pizza", emoji: "🍕", note: "easy and cozy" },
  { label: "Steakhouse", emoji: "🥩", note: "classic dinner mood" },
  { label: "Mexican", emoji: "🌮", note: "colorful and lively" },
];

const vibeOptions = [
  { label: "Cinema", emoji: "🎬", note: "low-key after dinner" },
  { label: "Picnic", emoji: "🧺", note: "sunset blanket plan" },
  { label: "Museum", emoji: "🖼️", note: "slow wandering" },
  { label: "Bowling", emoji: "🎳", note: "playful competition" },
  { label: "Beach", emoji: "🌊", note: "barefoot evening" },
  { label: "Dance", emoji: "💃", note: "late-night sparkle" },
];

const inspirationImages = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    alt: "Warm restaurant interior with intimate tables",
    label: "Dinner",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Friends enjoying an outdoor picnic",
    label: "Outdoors",
  },
  {
    src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
    alt: "Classic cinema seats and screen lights",
    label: "After",
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    user: "Dan",
    date: "",
    time: "",
    restaurant: "",
    vibe: "",
  });
  const [submittedPlan, setSubmittedPlan] = useState(null);

  const selectedRestaurant = restaurantOptions.find(
    (option) => option.label === formData.restaurant,
  );
  const selectedVibe = vibeOptions.find((option) => option.label === formData.vibe);

  const calendarLink = useMemo(() => {
    if (!submittedPlan?.date || !submittedPlan?.time) {
      return "#";
    }

    const startDate = new Date(`${submittedPlan.date}T${submittedPlan.time}`);

    if (Number.isNaN(startDate.getTime())) {
      return "#";
    }

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 3);

    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    const text = encodeURIComponent(`Date with ${submittedPlan.user} ❤️`);
    const details = encodeURIComponent(
      `Restaurant: ${submittedPlan.restaurant}\nActivity: ${submittedPlan.vibe}`,
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
  }, [submittedPlan]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedPlan(formData);
  };

  return (
    <main className="min-h-screen bg-[#f8f2ee] text-[#2a211f]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-5 py-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="flex flex-col justify-between gap-8 rounded-[2rem] bg-[#2f3d36] p-5 text-white shadow-2xl shadow-[#4b3426]/15 sm:p-7 lg:min-h-[calc(100vh-3rem)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#f6c9a3]">
                Date Planner
              </p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.96] sm:text-7xl">
                Plan a night that feels personal ✨
              </h1>
            </div>
            <div className="hidden rounded-full bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur sm:block">
              ❤️ Ready in 3 steps
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-80 overflow-hidden rounded-3xl">
              <Image
                src={inspirationImages[0].src}
                alt={inspirationImages[0].alt}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5">
                <p className="text-sm font-semibold text-[#ffd8b6]">Tonight&apos;s mood</p>
                <p className="text-2xl font-bold">Dinner, laughs, then something sweet</p>
              </div>
            </div>

            <div className="grid gap-4">
              {inspirationImages.slice(1).map((image) => (
                <div className="relative min-h-36 overflow-hidden rounded-3xl" key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 45vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#2f3d36]">
                    {image.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-3">
            <p>🍽️ Pick the food</p>
            <p>🎟️ Choose the vibe</p>
            <p>📅 Save it to calendar</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 py-4 lg:py-8">
          <div className="rounded-[2rem] bg-white p-5 shadow-xl shadow-[#4b3426]/10 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d65c4f]">
                  Build the plan
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#2f3d36] sm:text-4xl">
                  Details first, magic after
                </h2>
              </div>
              <span className="rounded-2xl bg-[#fff1db] px-4 py-3 text-2xl">💌</span>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-bold text-[#4d403b]">
                Name
                <input
                  className="h-12 rounded-2xl border border-[#eadbd2] bg-[#fbf8f5] px-4 text-base font-semibold outline-none transition focus:border-[#d65c4f] focus:bg-white"
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-[#4d403b]">
                  Date
                  <input
                    className="h-12 rounded-2xl border border-[#eadbd2] bg-[#fbf8f5] px-4 text-base font-semibold outline-none transition focus:border-[#d65c4f] focus:bg-white"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#4d403b]">
                  Time
                  <input
                    className="h-12 rounded-2xl border border-[#eadbd2] bg-[#fbf8f5] px-4 text-base font-semibold outline-none transition focus:border-[#d65c4f] focus:bg-white"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <Picker
                name="restaurant"
                title="Restaurant type"
                options={restaurantOptions}
                value={formData.restaurant}
                onChange={handleChange}
              />

              <Picker
                name="vibe"
                title="Date vibe"
                options={vibeOptions}
                value={formData.vibe}
                onChange={handleChange}
              />

              <button
                className="mt-2 h-14 rounded-2xl bg-[#d65c4f] px-6 text-base font-black text-white shadow-lg shadow-[#d65c4f]/25 transition hover:bg-[#bd473d] focus:outline-none focus:ring-4 focus:ring-[#f5b8a9]"
                type="submit"
              >
                Create plan 💖
              </button>
            </form>
          </div>

          <section className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-lg shadow-[#4b3426]/5 backdrop-blur sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7e6255]">
                  Preview
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#2f3d36]">
                  {submittedPlan ? "Planned Date 🎉" : "Your plan will appear here"}
                </h2>
              </div>
              <a
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  submittedPlan
                    ? "bg-[#2f3d36] text-white hover:bg-[#243029]"
                    : "pointer-events-none bg-[#e9ded6] text-[#8f7e75]"
                }`}
                href={calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!submittedPlan}
              >
                Save to Calendar 📅
              </a>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PlanItem emoji="🗓️" label="When" value={submittedPlan?.date || "Pick a date"} />
              <PlanItem emoji="⏰" label="Time" value={submittedPlan?.time || "Pick a time"} />
              <PlanItem
                emoji={selectedRestaurant?.emoji || "🍽️"}
                label="Food"
                value={submittedPlan?.restaurant || formData.restaurant || "Choose food"}
              />
              <PlanItem
                emoji={selectedVibe?.emoji || "🎟️"}
                label="Vibe"
                value={submittedPlan?.vibe || formData.vibe || "Choose activity"}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Picker({ name, title, options, value, onChange }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-bold text-[#4d403b]">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            className={`cursor-pointer rounded-2xl border p-3 transition ${
              value === option.label
                ? "border-[#d65c4f] bg-[#fff4ed] shadow-md shadow-[#d65c4f]/10"
                : "border-[#eadbd2] bg-[#fbf8f5] hover:border-[#d9bdae]"
            }`}
            key={option.label}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={option.label}
              checked={value === option.label}
              onChange={onChange}
              required
            />
            <span className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-white text-xl shadow-sm">
                {option.emoji}
              </span>
              <span>
                <span className="block font-black text-[#2f3d36]">{option.label}</span>
                <span className="text-xs font-semibold text-[#8a7468]">{option.note}</span>
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PlanItem({ emoji, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7468]">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-lg font-black text-[#2f3d36]">
        <span>{emoji}</span>
        <span>{value}</span>
      </p>
    </div>
  );
}

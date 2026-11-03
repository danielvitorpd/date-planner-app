import { put } from "@vercel/blob";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

function eventResponse(event) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.event_date,
    photo: event.photo_url,
  };
}

function isValidEvent({ title, description, date }) {
  return (
    typeof title === "string" && title.trim() &&
    typeof description === "string" && description.trim() &&
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
  );
}

export async function GET() {
  try {
    const events = await getSql()`SELECT id, title, description, event_date::text, photo_url FROM events ORDER BY event_date ASC`;
    return Response.json(events.map(eventResponse));
  } catch (error) {
    console.error("Unable to load events", error);
    return Response.json({ error: "Unable to load events." }, { status: 503 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const body = contentType.includes("multipart/form-data")
      ? await request.formData()
      : await request.json();
    const getValue = (name) => body instanceof FormData ? body.get(name) : body[name];
    const title = getValue("title");
    const description = getValue("description");
    const date = getValue("date");

    if (!isValidEvent({ title, description, date })) {
      return Response.json({ error: "Title, description, and a valid date are required." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let photoUrl = getValue("photoUrl") || null;
    const photo = getValue("photo");

    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith("image/") || photo.size > 10 * 1024 * 1024) {
        return Response.json({ error: "Photos must be images no larger than 10 MB." }, { status: 400 });
      }

      const blob = await put(`events/${id}/${photo.name}`, photo, {
        access: "public",
        addRandomSuffix: true,
      });
      photoUrl = blob.url;
    }

    const sql = getSql();
    const [event] = await sql`
      INSERT INTO events (id, title, description, event_date, photo_url)
      VALUES (${id}, ${title.trim()}, ${description.trim()}, ${date}, ${photoUrl})
      RETURNING id, title, description, event_date::text, photo_url
    `;
    return Response.json(eventResponse(event), { status: 201 });
  } catch (error) {
    console.error("Unable to create event", error);
    return Response.json({ error: "Unable to create event." }, { status: 503 });
  }
}

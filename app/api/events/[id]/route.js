import { del, put } from "@vercel/blob";
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

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
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

    const sql = getSql();
    const [currentEvent] = await sql`SELECT photo_url FROM events WHERE id = ${id}`;
    if (!currentEvent) {
      return Response.json({ error: "Event not found." }, { status: 404 });
    }

    let photoUrl = currentEvent.photo_url;
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

    const [event] = await sql`
      UPDATE events
      SET title = ${title.trim()}, description = ${description.trim()}, event_date = ${date}, photo_url = ${photoUrl}
      WHERE id = ${id}
      RETURNING id, title, description, event_date::text, photo_url
    `;

    if (photoUrl !== currentEvent.photo_url && currentEvent.photo_url) {
      await del(currentEvent.photo_url).catch((error) => console.error("Unable to remove replaced photo", error));
    }

    return Response.json(eventResponse(event));
  } catch (error) {
    console.error("Unable to update event", error);
    return Response.json({ error: "Unable to update event." }, { status: 503 });
  }
}

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      date,
      time,
      party_size,
      occasion,
      special_requests,
      source,
      chat_summary,
    } = body;

    if (!name || !phone || !date || !time || !party_size) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, date, time, party_size" },
        { status: 400 }
      );
    }

    const docData = {
      name,
      phone,
      date,
      time,
      party_size: Number(party_size),
      occasion: occasion || null,
      special_requests: special_requests || null,
      source: source || "direct",
      chat_summary: chat_summary || null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "reservations"), docData);
    const data = { id: docRef.id, ...docData };

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  const q = query(
    collection(db, "reservations"),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);
  let data: Record<string, unknown>[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Filter client-side to avoid Firestore composite index requirement
  if (source && source !== "all") {
    data = data.filter((r) => r.source === source);
  }

  return NextResponse.json(data);
}

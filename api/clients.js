import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getAllClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("client_id, data")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(function(row) {
    return row.data;
  });
}

async function saveAllClients(clients) {
  const rows = (Array.isArray(clients) ? clients : []).map(function(client) {
    return {
      client_id: String(client.clientId || ""),
      client_name: String(client.clientName || ""),
      data: client,
      updated_at: new Date().toISOString()
    };
  });

  if (!rows.length) {
    const existing = await supabase.from("clients").select("client_id");

    if (existing.error) {
      throw existing.error;
    }

    const existingIds = (existing.data || []).map(function(row) {
      return row.client_id;
    });

    if (existingIds.length) {
      const { error: deleteError } = await supabase
        .from("clients")
        .delete()
        .in("client_id", existingIds);

      if (deleteError) {
        throw deleteError;
      }
    }

    return;
  }

  const incomingIds = rows.map(function(row) {
    return row.client_id;
  });

  const { data: existingRows, error: existingError } = await supabase
    .from("clients")
    .select("client_id");

  if (existingError) {
    throw existingError;
  }

  const existingIds = (existingRows || []).map(function(row) {
    return row.client_id;
  });

  const idsToDelete = existingIds.filter(function(id) {
    return !incomingIds.includes(id);
  });

  if (idsToDelete.length) {
    const { error: deleteError } = await supabase
      .from("clients")
      .delete()
      .in("client_id", idsToDelete);

    if (deleteError) {
      throw deleteError;
    }
  }

  const { error: upsertError } = await supabase
    .from("clients")
    .upsert(rows, { onConflict: "client_id" });

  if (upsertError) {
    throw upsertError;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const clients = await getAllClients();
      return res.status(200).json({ clients });
    }

    if (req.method === "POST") {
      const body = req.body;

      if (!body || !Array.isArray(body.clients)) {
        return res.status(400).json({ ok: false, error: "Invalid data" });
      }

      await saveAllClients(body.clients);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("clients API error:", error);
    return res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : "Server error"
    });
  }
}

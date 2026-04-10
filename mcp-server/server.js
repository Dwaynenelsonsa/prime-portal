import express from "express";
import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

const PORT = process.env.PORT || 3002;
const CLIENTS_FILE = path.join("D:", "Prime Solutions", "prime-portal-vercel", "clients.json");

function readClientsFile() {
  try {
    if (!fs.existsSync(CLIENTS_FILE)) {
      return [];
    }

    const raw = fs.readFileSync(CLIENTS_FILE, "utf8");
    const parsed = JSON.parse(raw);

    return parsed && Array.isArray(parsed.clients) ? parsed.clients : [];
  } catch (error) {
    console.error("Failed to read clients.json:", error);
    return [];
  }
}

function getCurrentPhase(client) {
  const actions = Array.isArray(client.actions) ? client.actions : [];

  if (actions.some(function(action) {
    return String(action.reportStage || "").trim() === "v2";
  })) {
    return "Phase 2";
  }

  if (actions.some(function(action) {
    return String(action.reportStage || "").trim() === "v1";
  })) {
    return "Phase 1";
  }

  return "Overview";
}

function getActionProgress(action) {
  const reviewPoints = Array.isArray(action.reviewPoints) ? action.reviewPoints : [];
  const evidence = Array.isArray(action.evidence) ? action.evidence : [];
  const items = reviewPoints.concat(evidence);

  if (!items.length) return 0;

  const complete = items.filter(function(item) {
    return item.checked || (item.status && item.status !== "unanswered");
  }).length;

  return Math.round((complete / items.length) * 100);
}

function getConcernCount(action) {
  const manual = Array.isArray(action.concernsFound) ? action.concernsFound.length : 0;
  const auto = Array.isArray(action.autoConcerns) ? action.autoConcerns.length : 0;
  return manual + auto;
}

function getActiveArea(client) {
  const actions = Array.isArray(client.actions) ? client.actions : [];

  const openActions = actions.filter(function(action) {
    const progress = getActionProgress(action);
    const concerns = getConcernCount(action);
    return !(progress === 100 && concerns === 0);
  });

  if (!openActions.length) {
    return actions.length ? String(actions[0].title || "No active area") : "No active area";
  }

  openActions.sort(function(a, b) {
    return getConcernCount(b) - getConcernCount(a);
  });

  return String(openActions[0].title || "No active area");
}

function findClientByName(clients, clientName) {
  if (!clientName || !String(clientName).trim()) {
    return clients[clients.length - 1] || null;
  }

  const target = String(clientName).trim().toLowerCase();

  return clients.find(function(client) {
    return String(client.clientName || "").trim().toLowerCase() === target;
  }) || null;
}

function createPrimeForgeServer() {
  const server = new McpServer(
    {
      name: "prime-forge-mcp",
      version: "1.0.0",
    },
    {
      instructions:
        "This server provides read-only Prime Forge project context from live saved client data.",
    }
  );

  server.registerTool(
    "get_project_state",
    {
      title: "Get Project State",
      description: "Return the current Prime Forge project state from saved client data.",
      inputSchema: {
        clientName: z.string().optional().describe("Optional client name to fetch"),
      },
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        destructiveHint: false,
      },
    },
    async ({ clientName }) => {
      const clients = readClientsFile();
      const client = findClientByName(clients, clientName);

      if (!client) {
        const emptyResult = {
          found: false,
          message: "No saved clients found.",
          clientName: clientName || "",
          currentPhase: "Overview",
          activeArea: "No active area",
          deferredModulesCount: 0,
          assistantStatus: "Ready",
          projectName: "",
          projectSummary: "",
          scopeSummary: "",
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(emptyResult, null, 2),
            },
          ],
          structuredContent: emptyResult,
        };
      }

      const output = {
        found: true,
        clientId: client.clientId || "",
        clientName: client.clientName || "",
        projectName: client.projectName || "",
        projectSummary: client.projectSummary || "",
        scopeSummary: client.projectScope || "",
        deferredModulesCount: Array.isArray(client.deferredModules) ? client.deferredModules.length : 0,
        currentPhase: getCurrentPhase(client),
        activeArea: getActiveArea(client),
        assistantStatus: "Ready",
        keptWorkstreams: Array.isArray(client.modules) ? client.modules : [],
        status: client.status || "In Progress",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    }
  );

  return server;
}

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  console.log(
    new Date().toISOString(),
    req.method,
    req.originalUrl,
    "UA:",
    req.headers["user-agent"] || "",
    "Accept:",
    req.headers["accept"] || ""
  );
  next();
});

const transports = {};
const servers = {};

app.post("/mcp", async (req, res) => {
  try {
    const sessionId = req.headers["mcp-session-id"];
    let transport;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      const server = createPrimeForgeServer();

      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          transports[newSessionId] = transport;
          servers[newSessionId] = server;
        },
      });

      transport.onclose = async () => {
        try {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
            delete servers[transport.sessionId];
          }
          await server.close();
        } catch (closeError) {
          console.error("Server close error:", closeError);
        }
      };

      await server.connect(transport);
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP POST error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

const handleSessionRequest = async (req, res) => {
  try {
    const sessionId = req.headers["mcp-session-id"];

    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("MCP session error:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal server error");
    }
  }
};

app.get("/mcp", handleSessionRequest);
app.delete("/mcp", handleSessionRequest);

app.get("/", (_req, res) => {
  res.send("Prime Forge MCP server is running.");
});

app.listen(PORT, () => {
  console.log(`Prime Forge MCP server listening on http://127.0.0.1:${PORT}/mcp`);
});
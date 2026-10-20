
const $ = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const response = await fetch("/api" + path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...options
  });

  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }
  return data;
}

function message(text, error = false) {
  const el = $("message");
  el.textContent = text;
  el.style.color = error ? "#ff9292" : "#a5e6b4";
}

function showError(error) {
  message(error.message || "Une erreur est survenue.", true);
}

function cardHTML(card) {
  return `
    <article class="game-card">
      <div style="font-size:2.5rem">${card.icon || "🃏"}</div>
      <h3>${escapeHTML(card.name)}</h3>
      <p>${escapeHTML(card.category)} · ${escapeHTML(card.rarity)}</p>
      <p>${escapeHTML(card.fact)}</p>
      <strong>Force : ${Number(card.stat) || 0}</strong>
      <p>Quantité : ${Number(card.quantity) || 1}</p>
    </article>`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

async function authenticate(endpoint) {
  const username = $("username").value.trim();
  const password = $("password").value;

  if (!username || !password) {
    message("Entre ton pseudo et ton mot de passe.", true);
    return;
  }

  $("register").disabled = true;
  $("login").disabled = true;
  message(endpoint === "/register" ? "Création du compte…" : "Connexion…");

  try {
    const result = await api(endpoint, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    $("auth").hidden = true;
    $("game").hidden = false;
    $("player").textContent = result.user.username;
    await refreshGame();
    message("Bienvenue dans l'arène !");
  } catch (error) {
    showError(error);
  } finally {
    $("register").disabled = false;
    $("login").disabled = false;
  }
}

async function refreshGame() {
  const [me, inventory, leaderboard] = await Promise.all([
    api("/me"),
    api("/inventory"),
    api("/leaderboard")
  ]);

  $("player").textContent = me.user.username;
  $("coins").textContent = me.user.coins;
  $("cardsCount").textContent = inventory.reduce(
    (total, card) => total + Number(card.quantity || 0), 0
  );

  $("collection").innerHTML = inventory.length
    ? inventory.map(cardHTML).join("")
    : "<p>Ta collection est vide. Ouvre un booster pour commencer.</p>";

  $("leaderboard").innerHTML = leaderboard.length
    ? leaderboard.map(player =>
        `<li>${escapeHTML(player.username)} — ${Number(player.xp)} XP</li>`
      ).join("")
    : "<li>Le classement est vide pour le moment.</li>";
}

async function openPack() {
  const button = $("pack");
  button.disabled = true;
  button.textContent = "Ouverture du booster…";

  try {
    const result = await api("/pack", {
      method: "POST",
      body: "{}"
    });

    $("newCard").innerHTML =
      "<h3>Cartes obtenues</h3><div class='cards'>" +
      result.cards.map(cardHTML).join("") +
      "</div>";

    await refreshGame();
    message("Booster ouvert ! Tu as obtenu " + result.cards.length + " cartes.");
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
    button.textContent = "Ouvrir un booster — 30 pièces";
  }
}

async function logout() {
  try {
    await api("/logout", { method: "POST", body: "{}" });
  } catch (error) {
    showError(error);
    return;
  }

  $("game").hidden = true;
  $("auth").hidden = false;
  $("password").value = "";
  $("newCard").innerHTML = "";
  message("Tu es déconnecté.");
}

$("register").addEventListener("click", () => authenticate("/register"));
$("login").addEventListener("click", () => authenticate("/login"));
$("pack").addEventListener("click", openPack);
$("logout").addEventListener("click", logout);

$("password").addEventListener("keydown", event => {
  if (event.key === "Enter") authenticate("/login");
});

(async function checkSession() {
  try {
    await api("/me");
    $("auth").hidden = true;
    $("game").hidden = false;
    await refreshGame();
  } catch {
    $("auth").hidden = false;
    $("game").hidden = true;
  }
})();

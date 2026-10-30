
// ==========================================
// HAPPY'S VAULT
// ==========================================

// SUPABASE CONNECTION
const SUPABASE_URL = "https://dkrylupagssmkmelprjn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NXa119tDArKOc4LcoD3uSA_fDNPlxve";

if (!window.supabase) {
    throw new Error("Supabase library did not load. Check index.html.");
}

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

let currentUser = null;
let cloudReady = false;
let selectedPack = "classic";

// ==========================================
// PACKS
// ==========================================

const packs = {
    classic: {
        name: "Classic Pack",
        price: 20,
        odds: { Basic: 70, Mid: 25, Elite: 5 },
        values: { Basic: 15, Mid: 20, Elite: 40 }
    },
    neon: {
        name: "Neon Pack",
        price: 50,
        odds: { Basic: 55, Mid: 35, Elite: 10 },
        values: { Basic: 20, Mid: 35, Elite: 80 }
    },
    galaxy: {
        name: "Galaxy Pack",
        price: 150,
        odds: { Basic: 35, Mid: 45, Elite: 20 },
        values: { Basic: 35, Mid: 60, Elite: 200 }
    }
};

const packUnlocked = {
    classic: true,
    neon: false,
    galaxy: false
};

// ==========================================
// BASIC POKEMON
// ==========================================

const pokemonCards = [
    { name: "Clive", number: "150/129", image: "https://img.simplifiedtcg.com/cards/zh/14807.webp" },
    { name: "Tatsugiri ex", number: "229/208", image: "https://cdn.shopify.com/s/files/1/0919/6650/5335/files/CSV9C-Stellar-Crystal-Simplified-Chinese-Pokemon-Set-List-Card-Armoury-UK-229.webp?v=1790967873" },
    { name: "Dondozo ex", number: "235/222", image: "https://static.tcgcollector.com/content/images/ec/11/33/ec11334a99f780c5cb7492c84aed08ad2dcbe2da6404cd4392fe3cfc07eab4ae.webp" },
    { name: "Dancer", number: "152/132", image: "https://i.ebayimg.com/images/g/-6wAAOSw1vVmHjFD/s-l1200.jpg" },
    { name: "Luxray", number: "069/066", image: "https://i.ebayimg.com/images/g/DfoAAOSwLpZmz7Au/s-l1200.png" },
    { name: "Oranguru", number: "008/008", image: "https://static.tcgcollector.com/content/images/22/61/dc/2261dc86b523cd8dd95d924110fa1ea5fbb177a26576f66da400fc3b16ce71c4.webp" },
    { name: "Tapu Koko V", number: "133/125", image: "https://i.ebayimg.com/thumbs/images/g/U78AAeSwcbNoo~tH/s-l500.jpg" },
    { name: "Scovillain ex", number: "219/208", image: "https://static.tcgcollector.com/content/images/9a/d0/77/9ad0776dbc30e78b7a86560f5d9c3ed6a2b5de134f3bf8bfb3bab2fab74d3dee.webp" },
    { name: "Brute Bonnet", number: "135/128", image: "https://static.tcgcollector.com/content/images/18/c3/e0/18c3e036e0cc111ef609778fe7202540d565056d7dcbae0f3c19c38c407975ac.webp" },
    { name: "Passimian", number: "125/122", image: "https://static.tcgcollector.com/content/images/e0/e8/2e/e0e82e48805b453984b77819abbdf977bd6d8ae5994f7c7dd3aff616fc7694d4.webp" }
];

// ==========================================
// MID CARDS
// ==========================================

const midCards = [
    { name: "Forretress", number: "117/052", gradingCompany: "CHINESE COMPANY", grade: "10", rarity: "Mid", image: "https://static.tcgcollector.com/content/images/85/8a/83/858a83fdbef7d37dfcf079c7b9c1eb7d2c0ab5b572a666d47ca002eaaff40b13.webp" },
    { name: "Grimer", number: "151", gradingCompany: "CGC", grade: "PRISTINE 10", cert: "1401032381050", rarity: "Mid", image: "https://i.ebayimg.com/images/g/HG8AAOSw5sJlNvEB/s-l1600.jpg" },
    { name: "Popplio", number: "", gradingCompany: "PSA", grade: "9", cert: "85157935", rarity: "Mid", image: "https://i.ebayimg.com/images/g/rxoAAeSw5ZZp2Cyv/s-l1600.webp" },
    { name: "Adventurer's Discovery", number: "TG23", gradingCompany: "PSA", grade: "9", cert: "72052968", rarity: "Mid", image: "https://i.ebayimg.com/images/g/D18AAOSwKPhjmlRS/s-l1200.jpg" },
    { name: "Arven's Mabosstiff", number: "081/063", gradingCompany: "CHINESE COMPANY", grade: "10", rarity: "Mid", image: "https://images.pkmnprices.com/cards/17fe17e69c509bec.webp" },
    { name: "Gengar V", number: "072/137", gradingCompany: "CHINESE COMPANY", grade: "10", rarity: "Mid", image: "https://i.ebayimg.com/images/g/CUsAAeSwLCZo5D3A/s-l500.jpg" }
];

// ==========================================
// ELITE CARDS
// ==========================================

const eliteCards = [
    { name: "Blastoise ex", number: "009/165", gradingCompany: "CGC", grade: "PRISTINE 10", rarity: "Elite", image: "https://i.ebayimg.com/thumbs/images/g/cp4AAeSwkt9puVCK/s-l500.jpg" },
    { name: "Durant ex", number: "242/208", gradingCompany: "CHINESE COMPANY", grade: "10", rarity: "Elite", image: "https://cdn.shopify.com/s/files/1/0853/4851/6149/files/242_csv9C_krystalkollectz.jpg?v=1778736498" }
];

// ==========================================
// SAVED DATA
// ==========================================

function loadArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

let credits = Number(localStorage.getItem("hvCredits"));

if (!Number.isFinite(credits) || credits < 0) {
    credits = 500;
}

let collection = loadArray("hvCollection");
let redeemedCodes = loadArray("hvRedeemedCodes");
let discoveredPokemon = loadArray("hvDiscoveredPokemon");

let selectedQuantities = {
    classic: 1,
    neon: 1,
    galaxy: 1
};

// DO NOT CHANGE THESE PROMO REWARDS
const promoCodes = {
    HV20: 20,
    HV40: 40,
    HV100: 100,
    HV200: 200,
    HV300: 300,
    HV400: 400,
    HV500: 500,
    HV600: 600,
    HV700: 700,
    HV800: 800,
    HV900: 900,
    HV1000: 1000,
    HV1M: 1000000
};

// ==========================================
// ACCOUNT PANEL
// ==========================================

function setAccountMessage(message, isError = false) {
    const element = document.getElementById("hvAccountMessage");

    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#ff7777" : "#7ee0a0";
}

function showAccountState(user) {
    const loggedOut = document.getElementById("hvLoggedOut");
    const loggedIn = document.getElementById("hvLoggedIn");
    const welcome = document.getElementById("hvAccountWelcome");

    if (!loggedOut || !loggedIn) return;

    loggedOut.style.display = user ? "none" : "block";
    loggedIn.style.display = user ? "block" : "none";

    if (user && welcome) {
        welcome.textContent =
            user.user_metadata?.username ||
            user.email?.split("@")[0] ||
            "Player";
    }
}

function connectAccountButtons() {
    const panel = document.getElementById("hvAccountPanel");
    const toggle = document.getElementById("accountToggle");

    // Prevent duplicate event listeners.
    if (document.body.dataset.accountConnected === "true") return;
    document.body.dataset.accountConnected = "true";

    document.getElementById("hvSignupButton")
        ?.addEventListener("click", signup);

    document.getElementById("hvLoginButton")
        ?.addEventListener("click", login);

    document.getElementById("hvLogoutButton")
        ?.addEventListener("click", logout);

    if (!panel || !toggle) return;

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = panel.classList.toggle("account-open");

        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    panel.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        panel.classList.remove("account-open");
        toggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            panel.classList.remove("account-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

// ==========================================
// SIGN UP
// ==========================================

async function signup() {
    const username = document.getElementById("hvUsername")?.value.trim();
    const email = document.getElementById("hvEmail")?.value.trim();
    const password = document.getElementById("hvPassword")?.value;

    if (!username || !email || !password) {
        setAccountMessage("Enter a username, email, and password.", true);
        return;
    }

    if (username.length < 3) {
        setAccountMessage("Username must be at least 3 characters.", true);
        return;
    }

    if (password.length < 8) {
        setAccountMessage("Password must be at least 8 characters.", true);
        return;
    }

    setAccountMessage("Creating your account...");

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });

    if (error) {
        setAccountMessage(error.message, true);
        return;
    }

    if (data.session) {
        setAccountMessage("Account created successfully!");
    } else {
        setAccountMessage("Check your email to confirm your account.");
    }
}

// ==========================================
// LOG IN
// ==========================================

async function login() {
    const email = document.getElementById("hvEmail")?.value.trim();
    const password = document.getElementById("hvPassword")?.value;

    if (!email || !password) {
        setAccountMessage("Enter your email and password.", true);
        return;
    }

    setAccountMessage("Logging in...");

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        setAccountMessage(error.message, true);
    }
}

// ==========================================
// LOG OUT
// ==========================================

async function logout() {
    setAccountMessage("Logging out...");

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        setAccountMessage(error.message, true);
        return;
    }

    currentUser = null;
    cloudReady = false;

    credits = 500;
    collection = [];
    redeemedCodes = [];
    discoveredPokemon = [];

    localStorage.removeItem("hvCredits");
    localStorage.removeItem("hvCollection");
    localStorage.removeItem("hvRedeemedCodes");
    localStorage.removeItem("hvDiscoveredPokemon");

    updateCredits();
    renderCollection();
    showAccountState(null);
    setAccountMessage("You have logged out.");
}

// ==========================================
// CLOUD SAVING
// ==========================================

function saveData() {
    localStorage.setItem("hvCredits", credits);
    localStorage.setItem("hvCollection", JSON.stringify(collection));
    localStorage.setItem("hvRedeemedCodes", JSON.stringify(redeemedCodes));
    localStorage.setItem("hvDiscoveredPokemon", JSON.stringify(discoveredPokemon));

    if (!currentUser || !cloudReady) return;

    supabaseClient
        .from("player_progress")
        .upsert({
            user_id: currentUser.id,
            credits,
            inventory: collection,
            redeemed_codes: redeemedCodes,
            updated_at: new Date().toISOString()
        })
        .then(({ error }) => {
            if (error) {
                console.error("Cloud save failed:", error.message);

                setAccountMessage(
                    "Cloud save failed. Your device still has your progress.",
                    true
                );
            }
        });
}

function updatePrizePool() {
    discoveredPokemon = collection
        .filter(card => card.rarity === "Basic" && card.number)
        .map(card => card.number);

    saveData();
}

function updateCredits() {
    const element = document.getElementById("credits");

    if (element) {
        element.textContent = credits.toLocaleString();
    }
}

// ==========================================
// LOAD CLOUD PROGRESS
// ==========================================

async function loadCloudProgress(user) {
    currentUser = user;
    cloudReady = false;

    if (!user) {
        showAccountState(null);
        setAccountMessage("Playing as a guest.");
        return;
    }

    showAccountState(user);
    setAccountMessage("Loading your saved progress...");

    const { data, error } = await supabaseClient
        .from("player_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        setAccountMessage("Cloud loading error: " + error.message, true);
        console.error(error);
        return;
    }

    if (data) {
        credits = Number(data.credits);

        if (!Number.isFinite(credits) || credits < 0) {
            credits = 500;
        }

        collection = Array.isArray(data.inventory) ? data.inventory : [];

        redeemedCodes = Array.isArray(data.redeemed_codes)
            ? data.redeemed_codes
            : [];

        const seen = new Set();

        collection = collection.filter(card => {
            if (!card.number || card.rarity !== "Basic") return true;

            if (seen.has(card.number)) return false;

            seen.add(card.number);
            return true;
        });

        discoveredPokemon = collection
            .filter(card => card.rarity === "Basic" && card.number)
            .map(card => card.number);

        setAccountMessage("Your cloud progress loaded!");
    } else {
        setAccountMessage("New account. Saving your current progress...");
    }

    cloudReady = true;

    updateCredits();
    renderCollection();
    updatePrizePool();
}

// ==========================================
// AUTHENTICATION
// ==========================================

function startAuthentication() {
    connectAccountButtons();

    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
            setTimeout(() => {
                loadCloudProgress(session?.user || null);
            }, 0);
        }

        if (event === "SIGNED_OUT") {
            currentUser = null;
            cloudReady = false;

            showAccountState(null);
            setAccountMessage("You are playing as a guest.");
        }
    });
}

// ==========================================
// NAVIGATION
// ==========================================

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        const tabName = button.dataset.tab;

        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        const tab = document.getElementById(tabName);

        if (tab) {
            tab.classList.add("active");
        }

        if (tabName === "inventory") {
            renderCollection();
        }
    });
});

// ==========================================
// PACK POPUP
// ==========================================

function showPack(packType) {
    if (!packs[packType]) return;

    selectedPack = packType;

    const pack = packs[packType];

    const art = document.getElementById("modalPackArt");

    if (art) {
        art.className = `pack-art modal-pack ${packType}-pack`;
    }

    document.getElementById("modalPackTitle").textContent =
        packType.toUpperCase();

    document.getElementById("modalName").textContent = pack.name;

    document.getElementById("modalPrice").textContent =
        `${pack.price} Credits per pack`;

    document.getElementById("basicOdds").textContent =
        pack.odds.Basic + "%";

    document.getElementById("midOdds").textContent =
        pack.odds.Mid + "%";

    document.getElementById("eliteOdds").textContent =
        pack.odds.Elite + "%";

    document.getElementById("packQuantity").value =
        selectedQuantities[packType];

    updateQuantity();

    const message = document.getElementById("packMessage");

    if (message) {
        if (!packUnlocked[packType]) {
            message.textContent = "🔒 This pack is currently locked!";
            message.className = "code-message error";
        } else {
            message.textContent = "";
            message.className = "code-message";
        }
    }

    document.getElementById("packModal").classList.add("show");
}

function closePack() {
    document.getElementById("packModal")?.classList.remove("show");
}

document.getElementById("packQuantity")
    ?.addEventListener("input", updateQuantity);

function updateQuantity() {
    const slider = document.getElementById("packQuantity");

    if (!slider) return;

    const quantity = Math.max(
        1,
        Math.min(10, Number(slider.value) || 1)
    );

    slider.value = quantity;
    selectedQuantities[selectedPack] = quantity;

    const quantityNumber = document.getElementById("quantityNumber");

    if (quantityNumber) {
        quantityNumber.textContent = quantity;
    }

    const total = packs[selectedPack].price * quantity;
    const totalCost = document.getElementById("totalCost");

    if (totalCost) {
        totalCost.textContent = total.toLocaleString();
    }
}

// ==========================================
// CARD GENERATION
// ==========================================

function generateRarity(pack) {
    const random = Math.random() * 100;

    if (random < pack.odds.Elite) return "Elite";

    if (random < pack.odds.Elite + pack.odds.Mid) {
        return "Mid";
    }

    return "Basic";
}

function getAvailablePokemon() {
    return pokemonCards.filter(card =>
        !collection.some(owned =>
            owned.rarity === "Basic" &&
            owned.number === card.number
        )
    );
}

function getAvailableMidCards() {
    return midCards.filter(card =>
        !collection.some(owned =>
            owned.rarity === "Mid" &&
            (owned.midCardId === card.name || owned.name === card.name)
        )
    );
}

function createCard(packType) {
    const pack = packs[packType];

    if (!pack) return null;

    let rarity = generateRarity(pack);

    if (rarity === "Basic") {
        const available = getAvailablePokemon();

        if (available.length) {
            const pokemon = available[
                Math.floor(Math.random() * available.length)
            ];

            return {
                id: Date.now() + Math.random(),
                name: pokemon.name,
                number: pokemon.number,
                image: pokemon.image,
                rarity: "Basic",
                value: pack.values.Basic,
                pack: packType,
                grade: "10",
                gradingCompany: "CHINESE COMPANY"
            };
        }

        rarity = "Mid";
    }

    if (rarity === "Mid") {
        const available = getAvailableMidCards();

        if (available.length) {
            const card = available[
                Math.floor(Math.random() * available.length)
            ];

            return {
                id: Date.now() + Math.random(),
                ...card,
                midCardId: card.name,
                value: pack.values.Mid,
                pack: packType
            };
        }

        rarity = "Elite";
    }

    const elite = eliteCards[
        Math.floor(Math.random() * eliteCards.length)
    ];

    return {
        id: Date.now() + Math.random(),
        ...elite,
        value: pack.values.Elite,
        pack: packType
    };
}

// ==========================================
// GRADED SLABS
// ==========================================

function createSlab(card) {
    const artwork = card.image
        ? `
            <img src="${card.image}" alt="${card.name}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="slab-placeholder" style="display:none">
                ${card.name}
            </div>
        `
        : `
            <div class="slab-placeholder">
                <span>POKEMON CARD</span>
                <strong>${card.name}</strong>
                <small>${card.number || ""}</small>
                <span class="artwork-pending">IMAGE NOT ADDED YET</span>
            </div>
        `;

    const company = card.gradingCompany || "CHINESE COMPANY";
    const grade = card.grade || "10";

    return `
        <div class="slab">
            <div class="slab-label">
                <span>HAPPY'S VAULT</span>
                <strong>${company} ${grade}</strong>
                ${card.cert ? `<small>CERT ${card.cert}</small>` : ""}
            </div>

            <div class="slab-card">${artwork}</div>

            <div class="slab-footer">
                <span>${card.number || ""}</span>
                <span>${company} · ${grade}</span>
            </div>

            <div class="slab-glare"></div>
        </div>
    `;
}

// ==========================================
// OPEN PACKS
// ==========================================

function openPacks() {
    if (!packUnlocked[selectedPack]) {
        const message = document.getElementById("packMessage");

        if (message) {
            message.textContent = "🔒 This pack is currently locked!";
            message.className = "code-message error";
        }

        return;
    }

    const pack = packs[selectedPack];
    const quantity = selectedQuantities[selectedPack];
    const totalCost = pack.price * quantity;

    if (credits < totalCost) {
        const message = document.getElementById("packMessage");

        if (message) {
            message.textContent = "You don't have enough credits!";
            message.className = "code-message error";
        }

        return;
    }

    credits -= totalCost;

    const newCards = [];

    for (let i = 0; i < quantity; i++) {
        const card = createCard(selectedPack);

        if (!card) continue;

        collection.push(card);
        newCards.push(card);
    }

    updatePrizePool();
    updateCredits();
    closePack();
    showResults(newCards);
    renderCollection();
}

// ==========================================
// RESULTS
// ==========================================

function showResults(cards) {
    const container = document.getElementById("newCards");

    if (!container) return;

    container.innerHTML = "";

    cards.forEach(card => {
        const element = document.createElement("div");
        element.className = "new-card";

        element.innerHTML = `
            ${createSlab(card)}
            <h3>${card.name}</h3>
            <p>${card.rarity.toUpperCase()} · ${card.number || "SPECIAL CARD"}</p>
            <p>${card.value} Credits</p>
        `;

        container.appendChild(element);
    });

    document.getElementById("resultsModal")?.classList.add("show");
}

function closeResults() {
    document.getElementById("resultsModal")?.classList.remove("show");
}

// ==========================================
// COLLECTION
// ==========================================

function renderCollection() {
    const container = document.getElementById("collection");
    const emptyMessage = document.getElementById("emptyMessage");

    if (!container || !emptyMessage) return;

    container.innerHTML = "";

    const totalCards = document.getElementById("totalCards");

    if (totalCards) {
        totalCards.textContent = collection.length;
    }

    const totalValue = collection.reduce(
        (sum, card) => sum + Number(card.value || 0),
        0
    );

    const collectionValue = document.getElementById("collectionValue");

    if (collectionValue) {
        collectionValue.textContent =
            totalValue.toLocaleString() + " ✦";
    }

    emptyMessage.style.display =
        collection.length === 0 ? "block" : "none";

    collection.forEach(card => {
        const element = document.createElement("div");

        element.className =
            `card-item ${(card.rarity || "basic").toLowerCase()}-card`;

        element.innerHTML = `
            ${createSlab(card)}
            <h3>${card.name}</h3>
            <p>${(card.rarity || "").toUpperCase()} · ${card.number || "SPECIAL CARD"}</p>
            <p>${card.value} Credits</p>
            <button onclick="sellCard('${card.id}')">
                SELL FOR ${card.value}
            </button>
        `;

        container.appendChild(element);
    });
}

// ==========================================
// SELL CARDS
// ==========================================

function sellCard(id) {
    const index = collection.findIndex(card =>
        String(card.id) === String(id)
    );

    if (index === -1) return;

    const sold = collection[index];

    credits += Number(sold.value || 0);
    collection.splice(index, 1);

    updatePrizePool();
    updateCredits();
    renderCollection();
}

function sellAllBasic() {
    const basic = collection.filter(card =>
        card.rarity === "Basic"
    );

    if (!basic.length) {
        alert("You don't have any Basic cards to sell!");
        return;
    }

    const earnings = basic.reduce(
        (sum, card) => sum + Number(card.value || 0),
        0
    );

    collection = collection.filter(card =>
        card.rarity !== "Basic"
    );

    credits += earnings;

    updatePrizePool();
    updateCredits();
    renderCollection();

    alert(
        `You sold ${basic.length} Basic cards for ${earnings} credits!`
    );
}

// ==========================================
// PROMO CODES
// ==========================================

function redeemCode() {
    const input = document.getElementById("codeInput");

    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {
        showCodeMessage("Please enter a code.", false);
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(promoCodes, code)) {
        showCodeMessage("Invalid code.", false);
        return;
    }

    if (redeemedCodes.includes(code)) {
        showCodeMessage("You have already redeemed this code.", false);
        return;
    }

    const reward = promoCodes[code];

    credits += reward;
    redeemedCodes.push(code);

    saveData();
    updateCredits();

    input.value = "";

    showCodeMessage(
        `Success! You received ${reward.toLocaleString()} credits!`,
        true
    );
}

function showCodeMessage(message, success) {
    const element = document.getElementById("codeMessage");

    if (!element) return;

    element.textContent = message;

    element.className = success
        ? "code-message success"
        : "code-message error";
}

// ==========================================
// START WEBSITE
// ==========================================

function startWebsite() {
    updatePrizePool();
    updateCredits();
    renderCollection();
    startAuthentication();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWebsite);
} else {
    startWebsite();
}

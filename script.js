
const PACK_COST = 10;

let credits = 100;
let isOpening = false;

const creditsDisplay = document.getElementById("credits");
const pack = document.getElementById("pack");
const openButton = document.getElementById("openButton");
const revealSection = document.getElementById("revealSection");
const revealCard = document.getElementById("revealCard");
const cardName = document.getElementById("cardName");
const cardValue = document.getElementById("cardValue");
const cardTier = document.getElementById("cardTier");
const cardNumber = document.getElementById("cardNumber");
const stageHint = document.getElementById("stageHint");
const openingFlash = document.getElementById("openingFlash");
const againButton = document.getElementById("againButton");
const toast = document.getElementById("toast");

const inventory = {
  basic: {
    name: "Basic",
    className: "basic-result",
    cards: Array.from({ length: 12 }, (_, i) => ({
      name: `Basic Card #${i + 1}`,
      value: 15
    }))
  },

  mid: {
    name: "Mid-tier",
    className: "mid-result",
    cards: Array.from({ length: 6 }, (_, i) => ({
      name: `Mid-tier Card #${i + 1}`,
      value: i % 2 === 0 ? 20 : 25
    }))
  },

  elite: {
    name: "Elite",
    className: "elite-result",
    cards: Array.from({ length: 2 }, (_, i) => ({
      name: `Elite Card #${i + 1}`,
      value: 40
    }))
  }
};

function updateCredits() {
  if (creditsDisplay) {
    creditsDisplay.textContent = credits;
  }

  if (openButton) {
    openButton.disabled = credits < PACK_COST || isOpening;
    openButton.textContent =
      credits < PACK_COST ? "Not Enough Credits" : "Open Mystery Pack";
  }
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function chooseCard() {
  const roll = Math.random() * 100;

  // 70% Basic, 25% Mid-tier, 5% Elite
  let tier;

  if (roll < 70) {
    tier = inventory.basic;
  } else if (roll < 95) {
    tier = inventory.mid;
  } else {
    tier = inventory.elite;
  }

  const index = Math.floor(Math.random() * tier.cards.length);
  const card = tier.cards[index];

  return {
    ...card,
    tier: tier.name,
    className: tier.className
  };
}

function openPack() {
  if (isOpening) return;

  if (credits < PACK_COST) {
    showToast("Not enough demo credits!");
    return;
  }

  isOpening = true;
  credits -= PACK_COST;

  updateCredits();

  if (revealSection) {
    revealSection.hidden = true;
  }

  if (stageHint) {
    stageHint.textContent = "Opening your mystery pack...";
  }

  if (pack) {
    pack.classList.remove("pack-opening");
    void pack.offsetWidth;
    pack.classList.add("pack-opening");
  }

  if (openingFlash) {
    openingFlash.classList.remove("flash-active");
    void openingFlash.offsetWidth;
    openingFlash.classList.add("flash-active");
  }

  const result = chooseCard();

  window.setTimeout(() => {
    displayCard(result);

    if (stageHint) {
      stageHint.textContent = "Pack opened! Ready for another?";
    }

    if (revealSection) {
      revealSection.hidden = false;
      revealSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    isOpening = false;
    updateCredits();
  }, 1000);
}

function displayCard(card) {
  if (revealCard) {
    revealCard.className = `reveal-card ${card.className}`;
  }

  if (cardName) {
    cardName.textContent = card.name;
  }

  if (cardValue) {
    cardValue.textContent = `Approx. $${card.value} CAD`;
  }

  if (cardTier) {
    cardTier.textContent = card.tier;
  }

  if (cardNumber) {
    cardNumber.textContent = "HAPPYSVAULT";
  }
}

if (openButton) {
  openButton.addEventListener("click", openPack);
}

if (againButton) {
  againButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    window.setTimeout(openPack, 400);
  });
}

// Start the website with 100 free demo credits.
updateCredits();

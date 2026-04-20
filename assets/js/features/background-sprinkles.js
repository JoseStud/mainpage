const ICONS = [
  { src: "assets/images/background-icons/motif-satellite.png", aspect: 140 / 98, minWidth: 76, maxWidth: 108 },
  { src: "assets/images/background-icons/motif-book.png", aspect: 130 / 105, minWidth: 68, maxWidth: 98 },
  { src: "assets/images/background-icons/motif-chair.png", aspect: 94 / 99, minWidth: 56, maxWidth: 80 },
  { src: "assets/images/background-icons/motif-ring.png", aspect: 40 / 42, minWidth: 36, maxWidth: 54 },
  { src: "assets/images/background-icons/motif-globe.png", aspect: 54 / 54, minWidth: 40, maxWidth: 58 },
  { src: "assets/images/background-icons/motif-gem.png", aspect: 67 / 73, minWidth: 42, maxWidth: 64 },
  { src: "assets/images/background-icons/motif-crystal.png", aspect: 53 / 88, minWidth: 38, maxWidth: 56 },
  { src: "assets/images/background-icons/motif-saturn.png", aspect: 98 / 46, minWidth: 62, maxWidth: 92 },
];

function randomBetween(min, max) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + Math.random() * (high - low);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function pickWeightedZone(zones) {
  const totalWeight = zones.reduce((sum, zone) => sum + zone.weight, 0);
  let target = Math.random() * totalWeight;

  for (const zone of zones) {
    target -= zone.weight;
    if (target <= 0) {
      return zone;
    }
  }

  return zones[zones.length - 1];
}

function overlaps(candidate, existingPlacements) {
  return existingPlacements.some((placement) => {
    const distance = Math.hypot(candidate.x - placement.x, candidate.y - placement.y);
    return distance < candidate.radius + placement.radius;
  });
}

function sameIconTooClose(candidate, existingPlacements) {
  if (candidate.type !== "icon") {
    return false;
  }

  return existingPlacements.some((placement) => {
    if (placement.type !== "icon") {
      return false;
    }

    if (placement.icon.src !== candidate.icon.src) {
      return false;
    }

    const distance = Math.hypot(candidate.x - placement.x, candidate.y - placement.y);
    const minDistance = Math.max(candidate.width, placement.width) * 1.8;
    return distance < minDistance;
  });
}

function createZones(pageRect, viewportWidth, viewportHeight) {
  const outerPadding = viewportWidth < 720 ? 10 : 18;
  const innerGap = viewportWidth < 720 ? 28 : viewportWidth < 1000 ? 36 : 48;
  const leftLimit = clamp(pageRect.left - innerGap, outerPadding, viewportWidth - outerPadding);
  const rightStart = clamp(pageRect.right + innerGap, outerPadding, viewportWidth - outerPadding);
  const leftWidth = Math.max(0, leftLimit - outerPadding);
  const rightWidth = Math.max(0, viewportWidth - outerPadding - rightStart);
  const sidePadding = viewportWidth < 720 ? 8 : 12;
  const leftZone = {
    xMin: outerPadding + sidePadding,
    xMax: Math.max(outerPadding + sidePadding, leftLimit - sidePadding),
  };
  const rightZone = {
    xMin: Math.min(viewportWidth - outerPadding - sidePadding, rightStart + sidePadding),
    xMax: viewportWidth - outerPadding - sidePadding,
  };
  const topCloudBottom = Math.min(160, Math.max(96, viewportHeight * 0.19));
  const cloudMidMin = clamp(pageRect.left + 90, 70, viewportWidth - 70);
  const cloudMidMax = clamp(pageRect.right - 90, 70, viewportWidth - 70);

  return {
    sideWidths: {
      left: leftWidth,
      right: rightWidth,
    },
    icon: [
      {
        weight: 3.1,
        xMin: leftZone.xMin,
        xMax: leftZone.xMax,
        yMin: 72,
        yMax: viewportHeight * 0.42,
      },
      {
        weight: 3.1,
        xMin: rightZone.xMin,
        xMax: rightZone.xMax,
        yMin: 72,
        yMax: viewportHeight * 0.42,
      },
      {
        weight: 2.2,
        xMin: leftZone.xMin,
        xMax: leftZone.xMax,
        yMin: viewportHeight * 0.42,
        yMax: viewportHeight - 82,
      },
      {
        weight: 2.2,
        xMin: rightZone.xMin,
        xMax: rightZone.xMax,
        yMin: viewportHeight * 0.42,
        yMax: viewportHeight - 82,
      },
    ],
    star: [
      {
        weight: 3,
        xMin: leftZone.xMin,
        xMax: leftZone.xMax,
        yMin: 18,
        yMax: viewportHeight * 0.34,
      },
      {
        weight: 3,
        xMin: rightZone.xMin,
        xMax: rightZone.xMax,
        yMin: 18,
        yMax: viewportHeight * 0.34,
      },
      {
        weight: 2.4,
        xMin: leftZone.xMin,
        xMax: leftZone.xMax,
        yMin: viewportHeight * 0.34,
        yMax: viewportHeight * 0.68,
      },
      {
        weight: 2.4,
        xMin: rightZone.xMin,
        xMax: rightZone.xMax,
        yMin: viewportHeight * 0.34,
        yMax: viewportHeight * 0.68,
      },
      {
        weight: 1.8,
        xMin: leftZone.xMin,
        xMax: leftZone.xMax,
        yMin: viewportHeight * 0.68,
        yMax: viewportHeight - 18,
      },
      {
        weight: 1.8,
        xMin: rightZone.xMin,
        xMax: rightZone.xMax,
        yMin: viewportHeight * 0.68,
        yMax: viewportHeight - 18,
      },
    ],
    cloud: [
      {
        weight: 2.2,
        xMin: outerPadding + 70,
        xMax: Math.max(outerPadding + 70, pageRect.left + 30),
        yMin: 28,
        yMax: topCloudBottom,
      },
      {
        weight: 2.4,
        xMin: cloudMidMin,
        xMax: Math.max(cloudMidMin, cloudMidMax),
        yMin: 18,
        yMax: topCloudBottom - 18,
      },
      {
        weight: 2.2,
        xMin: Math.min(viewportWidth - outerPadding - 70, pageRect.right - 30),
        xMax: viewportWidth - outerPadding - 70,
        yMin: 28,
        yMax: topCloudBottom,
      },
    ],
  };
}

function createIconPlacement(icon, zone, viewportWidth) {
  const mobileScale = viewportWidth < 720 ? 0.78 : 1;
  const width = randomBetween(icon.minWidth, icon.maxWidth) * mobileScale;
  const height = width / icon.aspect;

  return {
    type: "icon",
    icon,
    width,
    height,
    x: randomBetween(zone.xMin, zone.xMax),
    y: randomBetween(zone.yMin, zone.yMax),
    radius: Math.max(width, height) * 0.62,
    opacity: randomBetween(0.3, 0.52),
    blur: randomBetween(0, 0.6),
    rotation: randomBetween(-18, 18),
    shiftX: randomBetween(-5, 5),
    shiftY: randomBetween(-4, 4),
    driftX: randomBetween(-10, 10),
    driftY: randomBetween(-8, 8),
    driftRotation: randomBetween(-4, 4),
    floatDuration: randomBetween(22, 36),
    delay: randomBetween(-18, 0),
  };
}

function createStarPlacement(zone, viewportWidth) {
  const mobileScale = viewportWidth < 720 ? 0.88 : 1;
  const size = randomBetween(2.2, 5.1) * mobileScale;

  return {
    type: "star",
    size,
    x: randomBetween(zone.xMin, zone.xMax),
    y: randomBetween(zone.yMin, zone.yMax),
    radius: size * 4.2,
    opacity: randomBetween(0.34, 0.86),
    twinkleDuration: randomBetween(4.6, 8.6),
    delay: randomBetween(-8, 0),
  };
}

function createCloudPlacement(zone, viewportWidth) {
  const mobileScale = viewportWidth < 720 ? 0.72 : viewportWidth < 1000 ? 0.84 : 1;
  const width = randomBetween(250, 430) * mobileScale;
  const height = width * randomBetween(0.26, 0.38);

  return {
    type: "cloud",
    width,
    height,
    x: randomBetween(zone.xMin, zone.xMax),
    y: randomBetween(zone.yMin, zone.yMax),
    radius: width * 0.34,
    opacity: randomBetween(0.24, 0.4),
    blur: randomBetween(12, 20),
    shiftX: randomBetween(-12, 12),
    shiftY: randomBetween(-6, 6),
    driftX: randomBetween(-16, 16),
    driftY: randomBetween(-4, 6),
    floatDuration: randomBetween(28, 46),
    delay: randomBetween(-22, 0),
    scale: randomBetween(0.94, 1.08),
  };
}

function getMotionBudget(viewportWidth) {
  const hardwareThreads = navigator.hardwareConcurrency || 0;
  const deviceMemory = typeof navigator.deviceMemory === "number" ? navigator.deviceMemory : 0;
  const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);
  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || saveDataEnabled) {
    return "minimal";
  }

  if ((hardwareThreads > 0 && hardwareThreads <= 4) || (deviceMemory > 0 && deviceMemory <= 4)) {
    return viewportWidth >= 1000 ? "balanced" : "minimal";
  }

  return "full";
}

function getPlacementCount(type, viewportWidth, motionBudget) {
  if (type === "cloud") {
    if (motionBudget === "minimal") {
      return viewportWidth >= 1000 ? 2 : 1;
    }

    if (motionBudget === "balanced") {
      return viewportWidth >= 820 ? 3 : 2;
    }

    return viewportWidth >= 1200 ? 4 : viewportWidth >= 820 ? 3 : 2;
  }

  if (type === "icon") {
    if (motionBudget === "minimal") {
      return viewportWidth >= 1000 ? 3 : viewportWidth >= 720 ? 2 : 1;
    }

    if (motionBudget === "balanced") {
      return viewportWidth >= 1320 ? 5 : viewportWidth >= 1000 ? 4 : viewportWidth >= 720 ? 3 : 1;
    }

    return viewportWidth >= 1320 ? 6 : viewportWidth >= 1000 ? 5 : viewportWidth >= 720 ? 4 : 2;
  }

  if (motionBudget === "minimal") {
    return viewportWidth >= 1320 ? 4 : viewportWidth >= 1000 ? 3 : viewportWidth >= 720 ? 2 : 0;
  }

  if (motionBudget === "balanced") {
    return viewportWidth >= 1320 ? 8 : viewportWidth >= 1000 ? 6 : viewportWidth >= 720 ? 4 : 2;
  }

  return viewportWidth >= 1320 ? 12 : viewportWidth >= 1000 ? 10 : viewportWidth >= 720 ? 6 : 3;
}

function shouldAnimatePlacement(type, index, motionBudget) {
  if (motionBudget === "minimal") {
    return type === "cloud" && index === 0;
  }

  if (motionBudget === "balanced") {
    if (type === "cloud") {
      return index < 2;
    }

    if (type === "icon") {
      return index % 3 === 0;
    }

    return index % 6 === 0;
  }

  if (type === "cloud") {
    return true;
  }

  if (type === "icon") {
    return index % 2 === 0;
  }

  return index % 4 === 0;
}

function applyMotionBudget(type, placements, motionBudget) {
  return placements.map((placement, index) => ({
    ...placement,
    animate: shouldAnimatePlacement(type, index, motionBudget),
  }));
}

function createSprinkleElement(placement) {
  const element = document.createElement("span");
  element.className = `bg-sprinkle bg-sprinkle--${placement.type}`;
  element.style.left = `${placement.x}px`;
  element.style.top = `${placement.y}px`;
  element.style.setProperty("--sprinkle-opacity", placement.opacity.toFixed(3));
  element.style.setProperty("--sprinkle-delay", `${placement.delay.toFixed(2)}s`);

  if (!placement.animate) {
    element.style.animation = "none";
  }

  if (placement.type === "icon") {
    element.style.width = `${placement.width}px`;
    element.style.height = `${placement.height}px`;
    element.style.backgroundImage = `url("${placement.icon.src}")`;
    element.style.setProperty("--sprinkle-blur", `${placement.blur.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-rotation", `${placement.rotation.toFixed(2)}deg`);
    element.style.setProperty("--sprinkle-shift-x", `${placement.shiftX.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-shift-y", `${placement.shiftY.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-drift-x", `${placement.driftX.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-drift-y", `${placement.driftY.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-drift-rotation", `${placement.driftRotation.toFixed(2)}deg`);
    element.style.setProperty("--sprinkle-float-duration", `${placement.floatDuration.toFixed(2)}s`);
    return element;
  }

  if (placement.type === "cloud") {
    element.style.width = `${placement.width}px`;
    element.style.height = `${placement.height}px`;
    element.style.setProperty("--cloud-blur", `${placement.blur.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-shift-x", `${placement.shiftX.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-shift-y", `${placement.shiftY.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-drift-x", `${placement.driftX.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-drift-y", `${placement.driftY.toFixed(2)}px`);
    element.style.setProperty("--sprinkle-float-duration", `${placement.floatDuration.toFixed(2)}s`);
    element.style.setProperty("--cloud-scale", placement.scale.toFixed(3));
    return element;
  }

  element.style.width = `${placement.size}px`;
  element.style.height = `${placement.size}px`;
  element.style.setProperty("--sprinkle-twinkle-duration", `${placement.twinkleDuration.toFixed(2)}s`);
  return element;
}

function createSceneLayer(className) {
  const layer = document.createElement("div");
  layer.className = `bg-scene-layer ${className}`;
  return layer;
}

function buildCloudPlacements(zones, viewportWidth) {
  const placements = [];
  const motionBudget = getMotionBudget(viewportWidth);
  const cloudCount = getPlacementCount("cloud", viewportWidth, motionBudget);

  for (let index = 0; index < cloudCount; index += 1) {
    let placement = null;

    for (let attempts = 0; attempts < 120; attempts += 1) {
      const candidate = createCloudPlacement(pickWeightedZone(zones), viewportWidth);

      if (!overlaps(candidate, placements)) {
        placement = candidate;
        break;
      }
    }

    if (placement) {
      placements.push(placement);
    }
  }

  return applyMotionBudget("cloud", placements, motionBudget);
}

function buildIconPlacements(zones, sideWidths, viewportWidth) {
  const placements = [];
  const sidesAvailable = Number(sideWidths.left >= 78) + Number(sideWidths.right >= 78);
  if (sidesAvailable === 0) {
    return placements;
  }

  const motionBudget = getMotionBudget(viewportWidth);
  const iconCount = getPlacementCount("icon", viewportWidth, motionBudget);
  const iconPool = [];
  let iconDeck = shuffle(ICONS);

  for (let index = 0; index < iconCount; index += 1) {
    if (index > 0 && index % ICONS.length === 0) {
      iconDeck = shuffle(ICONS);
    }

    iconPool.push(iconDeck[index % ICONS.length]);
  }

  iconPool.forEach((icon) => {
    let placement = null;

    for (let attempts = 0; attempts < 120; attempts += 1) {
      const candidate = createIconPlacement(icon, pickWeightedZone(zones), viewportWidth);

      if (!overlaps(candidate, placements) && !sameIconTooClose(candidate, placements)) {
        placement = candidate;
        break;
      }
    }

    if (placement) {
      placements.push(placement);
    }
  });

  return applyMotionBudget("icon", placements, motionBudget);
}

function buildStarPlacements(zones, sideWidths, viewportWidth, existingPlacements) {
  const placements = [];
  const narrowSides = sideWidths.left < 52 || sideWidths.right < 52;
  if (narrowSides && viewportWidth < 720) {
    return placements;
  }

  const motionBudget = getMotionBudget(viewportWidth);
  const starCount = getPlacementCount("star", viewportWidth, motionBudget);
  const occupied = [...existingPlacements];

  for (let index = 0; index < starCount; index += 1) {
    let placement = null;

    for (let attempts = 0; attempts < 180; attempts += 1) {
      const candidate = createStarPlacement(pickWeightedZone(zones), viewportWidth);

      if (!overlaps(candidate, occupied)) {
        placement = candidate;
        break;
      }
    }

    if (placement) {
      placements.push(placement);
      occupied.push(placement);
    }
  }

  return applyMotionBudget("star", placements, motionBudget);
}

export function initBackgroundSprinkles() {
  const scene = document.querySelector(".bg-photo-scene");
  const page = document.querySelector(".page");
  if (!scene || !page) {
    return;
  }

  let resizeFrame = null;

  function renderSprinkles() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pageRect = page.getBoundingClientRect();
    const zones = createZones(pageRect, viewportWidth, viewportHeight);
    const cloudPlacements = buildCloudPlacements(zones.cloud, viewportWidth);
    const iconPlacements = buildIconPlacements(zones.icon, zones.sideWidths, viewportWidth);
    const starPlacements = buildStarPlacements(
      zones.star,
      zones.sideWidths,
      viewportWidth,
      [...cloudPlacements, ...iconPlacements],
    );
    const cloudFragment = document.createDocumentFragment();
    const starFragment = document.createDocumentFragment();
    const iconFragment = document.createDocumentFragment();
    const cloudLayer = createSceneLayer("bg-scene-layer--clouds");
    const starLayer = createSceneLayer("bg-scene-layer--stars");
    const iconLayer = createSceneLayer("bg-scene-layer--icons");

    cloudPlacements.forEach((placement) => {
      cloudFragment.append(createSprinkleElement(placement));
    });

    starPlacements.forEach((placement) => {
      starFragment.append(createSprinkleElement(placement));
    });

    iconPlacements.forEach((placement) => {
      iconFragment.append(createSprinkleElement(placement));
    });

    cloudLayer.append(cloudFragment);
    starLayer.append(starFragment);
    iconLayer.append(iconFragment);
    scene.replaceChildren(cloudLayer, starLayer, iconLayer);
  }

  function scheduleRender() {
    if (resizeFrame !== null) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      renderSprinkles();
    });
  }

  scheduleRender();
  window.addEventListener("resize", scheduleRender, { passive: true });
  window.addEventListener("load", scheduleRender, { once: true });

  if (document.fonts && typeof document.fonts.ready?.then === "function") {
    document.fonts.ready.then(scheduleRender).catch(() => {});
  }
}

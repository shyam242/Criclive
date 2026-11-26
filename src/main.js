import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#match-scene');
const header = document.querySelector('.site-header');
const stage = document.querySelector('.cinematic-stage');
const stickyScene = document.querySelector('.cinematic-sticky');
const matchFeed = document.querySelector('.match-feed');
const sceneProgress = document.querySelector('#cinematic-progress');
const caption = document.querySelector('#cinematic-caption');
const brand = document.querySelector('#cinematic-brand');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: window.devicePixelRatio < 2,
  alpha: true,
  powerPreference: 'low-power',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7faf7);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
scene.add(new THREE.HemisphereLight(0xffffff, 0x899889, 2.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(-5, 11, 8);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xdce9dd, 1.2);
fillLight.position.set(6, 6, -5);
scene.add(fillLight);

const materials = {
  grass: new THREE.MeshStandardMaterial({ color: 0x54775a, roughness: 0.96 }),
  pitch: new THREE.MeshStandardMaterial({ color: 0xc3a77a, roughness: 0.9 }),
  line: new THREE.MeshBasicMaterial({ color: 0xf3f4e9 }),
  kit: new THREE.MeshStandardMaterial({ color: 0xf0f0e5, roughness: 0.78 }),
  bowlerKit: new THREE.MeshStandardMaterial({ color: 0x1f6685, roughness: 0.78 }),
  bowlerTrousers: new THREE.MeshStandardMaterial({ color: 0x25384c, roughness: 0.86 }),
  helmet: new THREE.MeshStandardMaterial({ color: 0x142a37, roughness: 0.65 }),
  trousers: new THREE.MeshStandardMaterial({ color: 0xe7e9e3, roughness: 0.9 }),
  skin: new THREE.MeshStandardMaterial({ color: 0x9a6246, roughness: 0.82 }),
  glove: new THREE.MeshStandardMaterial({ color: 0xf5f2e7, roughness: 0.78 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xd9782d, roughness: 0.75 }),
  green: new THREE.MeshStandardMaterial({ color: 0x17684f, roughness: 0.78 }),
  pad: new THREE.MeshStandardMaterial({ color: 0xf5f4ed, roughness: 0.9 }),
  bat: new THREE.MeshStandardMaterial({ color: 0xb18a5c, roughness: 0.7 }),
  ball: new THREE.MeshStandardMaterial({ color: 0xc6443b, roughness: 0.53 }),
  seam: new THREE.LineBasicMaterial({ color: 0xf5dfcc }),
};

const field = new THREE.Mesh(new THREE.PlaneGeometry(19, 16), materials.grass);
field.rotation.x = -Math.PI / 2;
field.position.y = -0.08;
scene.add(field);
const pitch = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.05, 8.5), materials.pitch);
pitch.position.set(0, 0, -0.1);
scene.add(pitch);

const makeLine = (width, height, depth, x, y, z) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.line);
  mesh.position.set(x, y, z);
  scene.add(mesh);
};
for (const z of [-3.35, 3.15]) {
  makeLine(1.76, 0.022, 0.045, 0, 0.05, z);
  makeLine(0.045, 0.022, 1.25, -0.84, 0.05, z);
  makeLine(0.045, 0.022, 1.25, 0.84, 0.05, z);
}
makeLine(15.8, 0.016, 0.035, 0, 0.015, -6.5);
makeLine(15.8, 0.016, 0.035, 0, 0.015, 6.5);
makeLine(0.035, 0.016, 13, -7.9, 0.015, 0);
makeLine(0.035, 0.016, 13, 7.9, 0.015, 0);

const wicket = new THREE.Group();
for (let index = -1; index <= 1; index += 1) {
  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), materials.line);
  stump.position.set(index * 0.18, 0.47, 0);
  wicket.add(stump);
}
const bail = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.08), materials.line);
bail.position.y = 0.94;
wicket.add(bail);
wicket.position.set(0, 0, 3.55);
scene.add(wicket);

const buildPlayer = (x, z, isBatter = false) => {
  const root = new THREE.Group();
  const kitMaterial = isBatter ? materials.kit : materials.bowlerKit;
  const trousers = isBatter ? materials.trousers : materials.bowlerTrousers;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.31, 0.82, 12), kitMaterial);
  torso.position.y = 1.43;
  root.add(torso);

  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.31, 12, 9), kitMaterial);
  shoulders.scale.set(1, 0.5, 0.78);
  shoulders.position.y = 1.66;
  root.add(shoulders);

  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.29, 0.1, 12), isBatter ? materials.green : materials.orange);
  belt.position.y = 1.05;
  root.add(belt);

  const chestMark = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.075, 0.025), isBatter ? materials.green : materials.orange);
  chestMark.position.set(0, 1.52, 0.235);
  root.add(chestMark);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.18, 10), materials.skin);
  neck.position.y = 1.93;
  root.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), materials.skin);
  head.position.y = 2.13;
  root.add(head);

  for (const eyeX of [-0.065, 0.065]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), materials.helmet);
    eye.position.set(eyeX, 2.15, 0.174);
    root.add(eye);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), materials.skin);
  nose.position.set(0, 2.105, 0.19);
  root.add(nose);

  if (isBatter) {
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.235, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.53), materials.helmet);
    helmet.position.y = 2.22;
    root.add(helmet);
    const grilleMaterial = new THREE.MeshStandardMaterial({ color: 0x9aa8a6, metalness: 0.55, roughness: 0.4 });
    for (const grilleX of [-0.105, 0, 0.105]) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), grilleMaterial);
      bar.position.set(grilleX, 2.02, 0.18);
      root.add(bar);
    }
    for (const grilleY of [1.97, 2.07]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.014, 0.018), grilleMaterial);
      bar.position.set(0, grilleY, 0.19);
      root.add(bar);
    }
  } else {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.205, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.38), materials.bowlerKit);
    cap.position.y = 2.23;
    root.add(cap);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.035, 14), materials.bowlerKit);
    brim.position.set(0, 2.17, 0.045);
    root.add(brim);
  }

  const limb = (length, radius, material) => new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 2, 6), material);
  const leftLeg = limb(0.68, 0.12, trousers);
  leftLeg.position.set(-0.16, 0.45, 0);
  root.add(leftLeg);
  const rightLeg = limb(0.68, 0.12, trousers);
  rightLeg.position.set(0.16, 0.45, 0);
  root.add(rightLeg);

  for (const footX of [-0.16, 0.16]) {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.14, 0.34), materials.helmet);
    shoe.position.set(footX, 0.09, 0.055);
    root.add(shoe);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.35), materials.orange);
    sole.position.set(footX, 0.025, 0.055);
    root.add(sole);
  }

  if (isBatter) {
    for (const padX of [-0.16, 0.16]) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.47, 0.11), materials.pad);
      pad.position.set(padX, 0.43, 0.13);
      root.add(pad);
      for (const bandY of [0.32, 0.49]) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.195, 0.025, 0.118), materials.glove);
        band.position.set(padX, bandY, 0.135);
        root.add(band);
      }
    }
  }

  const shoulder = new THREE.Group();
  shoulder.position.set(isBatter ? 0.23 : -0.23, 1.65, 0);
  const arm = limb(0.54, 0.095, kitMaterial);
  arm.rotation.z = Math.PI / 2;
  arm.position.x = 0.25;
  shoulder.add(arm);
  const gloveMaterial = isBatter ? materials.glove : materials.skin;
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), gloveMaterial);
  hand.position.set(0.53, 0, 0.02);
  shoulder.add(hand);
  root.add(shoulder);
  const secondArm = limb(0.57, 0.09, kitMaterial);
  secondArm.position.set(isBatter ? -0.3 : 0.28, 1.42, 0.02);
  secondArm.rotation.z = isBatter ? -0.65 : 0.55;
  root.add(secondArm);
  const secondHand = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), gloveMaterial);
  secondHand.position.set(isBatter ? -0.48 : 0.47, 1.16, 0.02);
  root.add(secondHand);

  let bat = null;
  if (isBatter) {
    bat = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.32, 0.12), materials.bat);
    blade.position.y = 0.6;
    bat.add(blade);
    const bladeEdge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.24, 0.125), materials.orange);
    bladeEdge.position.set(0.08, 0.6, 0);
    bat.add(bladeEdge);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 7), materials.helmet);
    handle.position.y = 1.48;
    bat.add(handle);
    bat.position.set(0.34, 1.26, 0.05);
    bat.rotation.z = -0.55;
    root.add(bat);
  }

  root.position.set(x, 0, z);
  scene.add(root);
  return { root, shoulder, bat, leftLeg, rightLeg };
};

const bowler = buildPlayer(-0.7, -2.65);
const batter = buildPlayer(0.55, 2.25, true);
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), materials.ball);
scene.add(ball);
const seamPoints = [];
for (let index = 0; index <= 28; index += 1) {
  const angle = -1.05 + (index / 28) * 2.1;
  seamPoints.push(new THREE.Vector3(Math.cos(angle) * 0.128, Math.sin(angle) * 0.128, 0.025));
}
ball.add(new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(seamPoints),
  materials.seam,
));

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smooth = (value) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};
const ballPosition = new THREE.Vector3();
const beatCaptions = [
  'EVERY MATCH, EVERY MOMENT',
  'LIVE SCORES · BALL BY BALL',
  'VISUAL STORIES · USEFUL STATS',
  'CRICKET FOR EVERY LEVEL',
];
let progress = 0;
let lastBeat = -1;
let renderFrame = 0;
let sceneVisible = true;

const resizeScene = () => {
  const width = stickyScene.clientWidth;
  const height = stickyScene.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.fov = window.innerWidth < 620 ? 49 : window.innerWidth < 900 ? 44 : 37;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
};

const updateFromScroll = () => {
  const bounds = stage.getBoundingClientRect();
  const scrollable = Math.max(1, stage.offsetHeight - window.innerHeight);
  progress = clamp(-bounds.top / scrollable, 0, 1);
  sceneProgress.style.height = `${progress * 100}%`;

  const beat = Math.min(3, Math.floor(progress * 4));
  if (beat !== lastBeat) {
    caption.textContent = beatCaptions[beat];
    lastBeat = beat;
  }
  const reveal = smooth((progress - 0.86) / 0.06);
  const exit = smooth((progress - 0.92) / 0.04);
  const feedReveal = smooth((progress - 0.96) / 0.04);
  const feedOffset = (window.innerHeight - header.offsetHeight) * (1 - feedReveal);
  stage.classList.toggle('brand-arriving', reveal > 0.015);
  brand.style.setProperty('--brand-opacity', (reveal * (1 - exit)).toFixed(3));
  brand.style.setProperty('--brand-scale', (0.18 + reveal * 4.15 + exit * 1.65).toFixed(3));
  matchFeed.style.setProperty('--feed-offset', `${feedOffset.toFixed(2)}px`);
};

const renderScene = () => {
  renderFrame = 0;
  if (!sceneVisible) return;

  const release = smooth((progress - 0.1) / 0.17);
  const delivery = smooth((progress - 0.07) / 0.43);
  const bounce = smooth((progress - 0.5) / 0.14);
  const flight = smooth((progress - 0.64) / 0.2);
  const hit = smooth((progress - 0.6) / 0.08);
  ballPosition.set(
    -0.7 + delivery * 0.95 + bounce * 0.3 + flight * 0.12,
    1.55 - delivery * 1.39 + Math.sin(bounce * Math.PI / 2) + flight * 2.35,
    -2.55 + delivery * 4.75 + bounce * 0.3 + flight * 10.25,
  );
  ball.position.copy(ballPosition);
  ball.rotation.x = 0.8 + progress * 10;
  ball.rotation.z = 0.45 + progress * 7;
  ball.scale.setScalar(1 + flight * 10);
  ball.material.opacity = 1 - smooth((progress - 0.8) / 0.08);
  ball.material.transparent = ball.material.opacity < 1;
  ball.visible = progress < 0.88;

  bowler.shoulder.rotation.z = -0.25 + Math.sin(release * Math.PI) * 1.55;
  bowler.root.rotation.y = Math.sin(release * Math.PI) * 0.2;
  bowler.leftLeg.rotation.x = Math.sin(release * Math.PI) * 0.48;
  bowler.rightLeg.rotation.x = -Math.sin(release * Math.PI) * 0.4;
  batter.shoulder.rotation.z = -0.45 - hit * 1.05;
  batter.bat.rotation.z = -0.55 + hit * 1.72;
  batter.root.rotation.y = hit * -0.24;

  const cameraOffset = window.innerWidth < 620 ? -1.4 : -1.9;
  const targetX = cameraOffset + flight * (0.7 - cameraOffset);
  camera.position.set(targetX, 5.2 - flight * 0.1, 17 - flight * 0.9);
  camera.lookAt(targetX, 1.25 + flight * 0.12, 0.45);
  renderer.render(scene, camera);
};

const requestRender = () => {
  if (!renderFrame && sceneVisible) renderFrame = window.requestAnimationFrame(renderScene);
};

window.addEventListener('scroll', () => {
  updateFromScroll();
  requestRender();
}, { passive: true });

window.addEventListener('resize', () => {
  resizeScene();
  updateFromScroll();
  requestRender();
}, { passive: true });

document.addEventListener('visibilitychange', () => {
  sceneVisible = document.visibilityState === 'visible';
  if (sceneVisible) requestRender();
  else if (renderFrame) {
    window.cancelAnimationFrame(renderFrame);
    renderFrame = 0;
  }
});

new IntersectionObserver(([entry]) => {
  sceneVisible = entry.isIntersecting && document.visibilityState === 'visible';
  if (sceneVisible) requestRender();
  else if (renderFrame) {
    window.cancelAnimationFrame(renderFrame);
    renderFrame = 0;
  }
}, { threshold: 0 }).observe(stage);

resizeScene();
updateFromScroll();
requestRender();

const deliveries = [
  {
    label: '16.1 · THE FIRST BOUNDARY',
    title: 'A little room.<br /><em>A lot of timing.</em>',
    copy: 'Suryakumar waits for width and opens the face late. The ball races behind point before the field can turn.',
    shot: 'Late cut',
    trail: 'first',
  },
  {
    label: '16.2 · BACK-TO-BACK',
    title: 'Same intent.<br /><em>New angle.</em>',
    copy: 'The bowler goes fuller. Suryakumar meets it early and beats the sweeper on the off side. Eight from two.',
    shot: 'Guided drive',
    trail: 'second',
  },
];

const deliveryButtons = [...document.querySelectorAll('.delivery-ball[data-delivery]')];
const deliveryLabel = document.querySelector('#delivery-label');
const deliveryTitle = document.querySelector('#delivery-title');
const deliveryCopy = document.querySelector('#delivery-copy');
const shotName = document.querySelector('#shot-name');
const shotTrails = [...document.querySelectorAll('.shot-trail, .shot-landing')];
const replayButton = document.querySelector('#replay-over');
const overCard = document.querySelector('.over-card');
const scrollStorySteps = [...document.querySelectorAll('.scroll-story-step')];
let replayTimer;

const selectDelivery = (index) => {
  const delivery = deliveries[index];
  if (!delivery) return;

  deliveryButtons.forEach((button, buttonIndex) => {
    const isSelected = buttonIndex === index;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  deliveryLabel.textContent = delivery.label;
  deliveryTitle.innerHTML = delivery.title;
  deliveryCopy.textContent = delivery.copy;
  shotName.textContent = delivery.shot;
  shotTrails.forEach((trail) => {
    trail.classList.toggle('is-active', trail.classList.contains(`trail-${delivery.trail}`) || trail.classList.contains(`landing-${delivery.trail}`));
  });
};

deliveryButtons.forEach((button) => {
  button.addEventListener('click', () => selectDelivery(Number(button.dataset.delivery)));
});

replayButton.addEventListener('click', () => {
  window.clearTimeout(replayTimer);
  overCard.classList.remove('replaying');
  replayButton.classList.remove('replaying');
  void overCard.offsetWidth;
  overCard.classList.add('replaying');
  replayButton.classList.add('replaying');
  replayButton.innerHTML = '<span aria-hidden="true">↻</span> Replaying the over';
  replayButton.setAttribute('aria-pressed', 'true');
  replayTimer = window.setTimeout(() => {
    overCard.classList.remove('replaying');
    replayButton.classList.remove('replaying');
    replayButton.innerHTML = '<span aria-hidden="true">↻</span> Replay the over';
    replayButton.setAttribute('aria-pressed', 'false');
  }, 1500);
});

document.querySelectorAll('.section-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.section-nav a').forEach((item) => item.classList.remove('selected'));
    link.classList.add('selected');
  });
});

selectDelivery(0);

const scrollStoryMoments = [
  { over: '16.1 OV', score: '144/3', runs: '+4', shot: 'LATE CUT · BEHIND POINT', context: 'India move from 60 off 24 to 56 off 23.', pressure: 58, pathBall: 0 },
  { over: '16.2 OV', score: '148/3', runs: '+4', shot: 'GUIDED DRIVE · PAST THE SWEEPER', context: 'Two boundaries. The asking rate falls to 14.18.', pressure: 68, pathBall: 1 },
  { over: 'AFTER 16.2', score: '148/3', runs: '+8', shot: 'TWO BOUNDARIES · 8 RUNS', context: '52 needed from 22. Partnership: 51 from 24.', pressure: 68, pathBall: 1 },
];

const updateScrollStory = (activeStep) => {
  const index = Number(activeStep.dataset.storyStep);
  const moment = scrollStoryMoments[index];
  if (!moment) return;

  scrollStorySteps.forEach((step, stepIndex) => {
    step.classList.toggle('is-current', stepIndex === index);
  });
  document.querySelector('#scroll-story-over').textContent = moment.over;
  document.querySelector('#scroll-story-score').textContent = moment.score;
  document.querySelector('#scroll-story-runs').textContent = moment.runs;
  document.querySelector('#scroll-story-shot').textContent = moment.shot;
  document.querySelector('#scroll-story-context').textContent = moment.context;
  document.querySelector('#scroll-story-pressure').textContent = `${moment.pressure}%`;
  document.querySelector('#scroll-story-meter').style.width = `${moment.pressure}%`;
  document.querySelectorAll('[data-path-ball]').forEach((pathBall, ballIndex) => {
    pathBall.classList.toggle('path-current', ballIndex === moment.pathBall);
  });
};

const scrollStoryObserver = new IntersectionObserver((entries) => {
  const visibleStep = entries.find((entry) => entry.isIntersecting);
  if (visibleStep) updateScrollStory(visibleStep.target);
}, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

scrollStorySteps.forEach((step) => scrollStoryObserver.observe(step));
updateScrollStory(scrollStorySteps[0]);

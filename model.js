/* 阿平 A-Ping — interactive 3D model + exploded parts view
   Dependencies: three.js r128 UMD (loaded before this file). No modules, no build step. */
(function () {
  var host = document.getElementById("viewer");
  if (!host || typeof THREE === "undefined") return;

  var PARTS = [
    {
      key: "hat",
      name: { zh: "針織帽（可拆）", en: "Knit cap (removable)" },
      what: { zh: "布質外觀配件，可以除下來洗。", en: "A fabric accessory that comes off and can be washed." },
      why: {
        zh: "長者家裡的東西不應該長得像儀器。一頂可以換的帽讓它變成「屋企嘅一份子」，而不是一部監測器——這也是子女願意把它放在客廳的原因。",
        en: "Equipment does not belong in a living room. A cap you can swap makes it part of the household rather than a monitor — which is why an adult child is willing to put it in the parent's flat."
      },
      cost: { zh: "約 US$0.8（量產）", en: "≈ US$0.8 at volume" }
    },
    {
      key: "face",
      name: { zh: "表情面板", en: "Face panel" },
      what: { zh: "單色 LED 點陣，只顯示一對眼睛。", en: "A monochrome LED matrix that shows nothing but a pair of eyes." },
      why: {
        zh: "不用彩色螢幕有兩個理由：長者不需要再多一個要「操作」的螢幕；而且眼睛足夠表達「我聽緊」「我講緊嘢」「我瞓着咗」，比一堆圖示更易懂。",
        en: "No colour screen, for two reasons: an older adult does not need another display to operate, and eyes alone convey listening, speaking and sleeping better than any set of icons."
      },
      cost: { zh: "約 US$3–5", en: "≈ US$3–5" }
    },
    {
      key: "mic",
      name: { zh: "雙 MEMS 麥克風", en: "Dual MEMS microphones" },
      what: { zh: "兩顆 PDM 數位麥克風，裝在機身頂部兩側。", en: "Two PDM digital microphones, one at each top corner." },
      why: {
        zh: "兩顆而不是一顆，是為了做波束成形：抵消電視聲同冷氣聲，並且判斷聲音來自邊個方向。長者講嘢通常唔會特登行到機面前。",
        en: "Two rather than one, so the device can beam-form: cancel the television and the air-conditioner, and tell which direction a voice came from. Older adults do not walk up to a device before speaking."
      },
      cost: { zh: "US$1.91（兩顆，量產）", en: "US$1.91 for the pair at volume" }
    },
    {
      key: "mcu",
      name: { zh: "主控模組 ESP32-S3", en: "ESP32-S3 controller" },
      what: { zh: "Wi-Fi 微控制器，跑喚醒詞偵測同提醒排程。", en: "A Wi-Fi microcontroller running wake-word detection and the reminder scheduler." },
      why: {
        zh: "呢粒嘢決定咗邊啲工作唔使上雲：喚醒詞同已排定嘅提醒都喺本機執行，所以斷網照樣提你食藥，而且回應冇延遲。",
        en: "This chip decides what never leaves the flat: wake-word detection and scheduled reminders run locally, so the medication reminder still fires with the internet down — and with no round-trip delay."
      },
      cost: { zh: "US$3.24（量產）", en: "US$3.24 at volume" }
    },
    {
      key: "amp",
      name: { zh: "功放 + 40mm 喇叭", en: "Amplifier + 40 mm speaker" },
      what: { zh: "I2S 數位功放推一個 40mm 全音域單體。", en: "An I2S digital amplifier driving a 40 mm full-range driver." },
      why: {
        zh: "長者聽力普遍在高頻衰減，所以喇叭選型偏重人聲頻段同音量餘裕，唔係追求音質。聽唔清嘅提醒等於冇提醒。",
        en: "Hearing loss in older adults starts at the high frequencies, so the driver is chosen for the vocal range and headroom, not fidelity. A reminder that cannot be heard is not a reminder."
      },
      cost: { zh: "約 US$3（量產）", en: "≈ US$3 at volume" }
    },
    {
      key: "led",
      name: { zh: "狀態燈環", en: "Status light ring" },
      what: { zh: "一圈可定址 RGB LED。", en: "A ring of addressable RGB LEDs." },
      why: {
        zh: "綠＝正常，黃＝斷咗網，熄＝靜音。唔使識字、唔使睇手機，行過就知佢而家係咩狀態。",
        en: "Green is normal, amber means the network is down, off means muted. No reading and no phone required — you can tell the state by walking past."
      },
      cost: { zh: "US$0.06（量產）", en: "US$0.06 at volume" }
    },
    {
      key: "btn",
      name: { zh: "實體按鍵", en: "Physical button" },
      what: { zh: "機頂一粒掣：㩒一下講嘢，長㩒靜音。", en: "One button on top: press to talk, hold to mute." },
      why: {
        zh: "整部機只有一個可以按嘅嘢。所有設定喺子女嘅手機完成，長輩呢邊永遠只有「講」同「唔講」。",
        en: "It is the only thing on the device that can be pressed. Everything else is configured from the child's phone; on this side there are only two states."
      },
      cost: { zh: "US$0.014（量產）", en: "US$0.014 at volume" }
    },
    {
      key: "shell",
      name: { zh: "外殼與底座", en: "Enclosure and base" },
      what: { zh: "前後兩件式外殼，加一個加重底座。", en: "A two-piece shell over a weighted base." },
      why: {
        zh: "底座加重係為咗撞唔跌——長者家裡好多時枱面窄。兩件式係為咗維修：換喇叭或者換電源唔使成部掉。",
        en: "The base is weighted so a knock does not topple it; tables in these flats are small. Two pieces so a speaker or a power board can be replaced without discarding the device."
      },
      cost: { zh: "約 US$4.50（含開模攤分）", en: "≈ US$4.50 including amortised tooling" }
    },
    {
      key: "nocam",
      name: { zh: "這裡沒有鏡頭", en: "There is no camera here" },
      what: { zh: "同類產品通常喺呢個位置裝鏡頭。我哋刻意留空。", en: "Competing products put a camera exactly here. We deliberately left it empty." },
      why: {
        zh: "香港住宅細，客廳就係長者一日活動嘅全部。加上買嘅係子女、用嘅係長輩——裝咗鏡頭好易變成「仔女監視我」，會直接破壞我哋最想達成嘅第三層價值。代價係我哋做唔到跌倒偵測，我哋唔會扮做到，亦唔會聲稱可以取代平安鐘。",
        en: "Hong Kong flats are small; the living room is the whole of an older adult's day. And because the child buys it while the parent uses it, a camera reads as surveillance and destroys the third layer of value we care most about. The cost is that we cannot do fall detection — we will not pretend otherwise, and we do not claim to replace a personal emergency alarm."
      },
      cost: { zh: "省下 US$2–4，以及一整套影像合規負擔", en: "Saves US$2–4, and an entire video compliance burden" }
    }
  ];

  var lang = "zh";
  var W = host.clientWidth, H = host.clientHeight || 420;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, W / H, 1, 2000);
  camera.position.set(0, 40, 420);

  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  var key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(120, 190, 240); scene.add(key);
  var rim = new THREE.DirectionalLight(0x8fd7ff, 0.5);
  rim.position.set(-180, 90, -160); scene.add(rim);
  var fill = new THREE.DirectionalLight(0xffffff, 0.3);
  fill.position.set(-90, -60, 160); scene.add(fill);

  function roundedRect(w, h, r) {
    var s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
  }
  function slab(w, h, r, depth, mat) {
    var g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
      depth: depth, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 4, curveSegments: 24
    });
    g.center();
    return new THREE.Mesh(g, mat);
  }

  var matShell = new THREE.MeshStandardMaterial({ color: 0x1b2124, roughness: 0.45, metalness: 0.12 });
  var matBack = new THREE.MeshStandardMaterial({ color: 0x11161a, roughness: 0.6, metalness: 0.1 });
  var matGlass = new THREE.MeshStandardMaterial({ color: 0x05080a, roughness: 0.18, metalness: 0.35 });
  var matHat = new THREE.MeshStandardMaterial({ color: 0x1478e0, roughness: 0.95, metalness: 0.0 });
  var matPcb = new THREE.MeshStandardMaterial({ color: 0x145c3c, roughness: 0.7 });
  var matChip = new THREE.MeshStandardMaterial({ color: 0x20262a, roughness: 0.5, metalness: 0.4 });
  var matMetal = new THREE.MeshStandardMaterial({ color: 0x9aa4a8, roughness: 0.35, metalness: 0.8 });
  var matLed = new THREE.MeshStandardMaterial({ color: 0x0f6b4f, emissive: 0x2ecf92, emissiveIntensity: 0.9, roughness: 0.4 });
  var matWarn = new THREE.MeshStandardMaterial({ color: 0xb4552a, emissive: 0xb4552a, emissiveIntensity: 0.35, roughness: 0.6 });

  var device = new THREE.Group();
  scene.add(device);

  // ---- face texture (eyes) -------------------------------------------------
  var faceCanvas = document.createElement("canvas");
  faceCanvas.width = 512; faceCanvas.height = 320;
  var fctx = faceCanvas.getContext("2d");
  var faceTex = new THREE.CanvasTexture(faceCanvas);
  var blink = 0;
  function drawFace(t) {
    fctx.fillStyle = "#05080a";
    fctx.fillRect(0, 0, 512, 320);
    var open = 1 - blink;
    fctx.strokeStyle = "#ffffff";
    fctx.lineCap = "round";
    fctx.lineWidth = 30;
    [170, 342].forEach(function (cx) {
      fctx.beginPath();
      if (open < 0.18) {
        fctx.moveTo(cx - 46, 168); fctx.lineTo(cx + 46, 168);
      } else {
        fctx.moveTo(cx - 46, 178);
        fctx.quadraticCurveTo(cx, 178 - 54 * open, cx + 46, 178);
      }
      fctx.stroke();
    });
    faceTex.needsUpdate = true;
  }
  drawFace(0);

  // ---- parts ---------------------------------------------------------------
  var meshes = {};

  var shell = slab(150, 112, 44, 46, matShell);
  shell.userData.key = "shell"; device.add(shell); meshes.shell = [shell];

  var back = slab(138, 102, 40, 12, matBack);
  back.position.z = -30; back.userData.key = "shell"; device.add(back); meshes.shell.push(back);

  var base = new THREE.Mesh(new THREE.CylinderGeometry(52, 60, 14, 48), matBack);
  base.position.y = -62; base.userData.key = "shell"; device.add(base); meshes.shell.push(base);

  var facePanel = slab(112, 74, 32, 6, matGlass);
  facePanel.position.z = 26; facePanel.userData.key = "face";
  device.add(facePanel);
  var faceScreen = new THREE.Mesh(new THREE.PlaneGeometry(104, 66), new THREE.MeshBasicMaterial({ map: faceTex }));
  faceScreen.position.z = 30.2; faceScreen.userData.key = "face";
  device.add(faceScreen);
  meshes.face = [facePanel, faceScreen];

  // knit cap
  var cap = new THREE.Group();
  var dome = new THREE.Mesh(new THREE.SphereGeometry(46, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.55), matHat);
  dome.scale.set(1.62, 0.72, 0.62); dome.position.y = 2;
  var brim = new THREE.Mesh(new THREE.TorusGeometry(44, 9, 14, 48), matHat);
  brim.rotation.x = Math.PI / 2; brim.scale.set(1.68, 1, 0.66);
  var pom = new THREE.Mesh(new THREE.SphereGeometry(9, 18, 14), matHat);
  pom.position.y = 34;
  cap.add(dome, brim, pom);
  cap.position.y = 48;
  cap.traverse(function (o) { o.userData.key = "hat"; });
  device.add(cap); meshes.hat = [cap];

  // internals
  var pcb = new THREE.Mesh(new THREE.BoxGeometry(104, 76, 3), matPcb);
  pcb.position.z = -6; pcb.userData.key = "mcu"; device.add(pcb);
  var mcu = new THREE.Mesh(new THREE.BoxGeometry(30, 20, 4), matChip);
  mcu.position.set(-22, 12, -1); mcu.userData.key = "mcu"; device.add(mcu);
  meshes.mcu = [pcb, mcu];

  meshes.mic = [];
  [-52, 52].forEach(function (x) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(9, 6, 4), matMetal);
    m.position.set(x, 46, 8); m.userData.key = "mic";
    device.add(m); meshes.mic.push(m);
  });

  var driver = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 13, 36), matChip);
  driver.rotation.x = Math.PI / 2; driver.position.set(20, -22, -4); driver.userData.key = "amp";
  var cone = new THREE.Mesh(new THREE.CylinderGeometry(17, 9, 7, 36), matMetal);
  cone.rotation.x = Math.PI / 2; cone.position.set(20, -22, 3); cone.userData.key = "amp";
  var ampIc = new THREE.Mesh(new THREE.BoxGeometry(14, 12, 3), matChip);
  ampIc.position.set(-26, -22, -1); ampIc.userData.key = "amp";
  device.add(driver, cone, ampIc); meshes.amp = [driver, cone, ampIc];

  var ring = new THREE.Mesh(new THREE.TorusGeometry(30, 2.6, 12, 60), matLed);
  ring.position.set(0, -6, 24); ring.userData.key = "led";
  device.add(ring); meshes.led = [ring];

  var btn = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 6, 28), matMetal);
  btn.position.set(0, 58, -4); btn.userData.key = "btn";
  device.add(btn); meshes.btn = [btn];

  var noCam = new THREE.Mesh(new THREE.TorusGeometry(11, 2, 10, 32), matWarn);
  noCam.position.set(0, 30, 30); noCam.userData.key = "nocam"; noCam.visible = false;
  var slash = new THREE.Mesh(new THREE.BoxGeometry(28, 2.4, 2.4), matWarn);
  slash.position.set(0, 30, 31); slash.rotation.z = Math.PI / 4; slash.visible = false;
  slash.userData.key = "nocam";
  device.add(noCam, slash); meshes.nocam = [noCam, slash];

  // explode vectors ----------------------------------------------------------
  var EXPLODE = {
    hat: [0, 120, 0], face: [0, 0, 120], mic: [0, 60, 70], mcu: [0, 0, -90],
    amp: [0, -70, -40], led: [0, -20, 90], btn: [0, 95, -30], shell: [0, 0, 0], nocam: [0, 60, 130]
  };
  device.traverse(function (o) { if (o.isMesh || o.isGroup) o.userData.home = o.position.clone(); });
  [cap].forEach(function (g) { g.userData.home = g.position.clone(); });

  function applyExplode(v) {
    Object.keys(meshes).forEach(function (k) {
      var vec = EXPLODE[k] || [0, 0, 0];
      meshes[k].forEach(function (m) {
        var h = m.userData.home;
        if (!h) return;
        m.position.set(h.x + vec[0] * v, h.y + vec[1] * v, h.z + vec[2] * v);
      });
    });
    // back shell drifts backwards so internals are visible
    back.position.z = back.userData.home.z - 70 * v;
    base.position.y = base.userData.home.y - 40 * v;
    noCam.visible = slash.visible = v > 0.25;
  }

  // selection ---------------------------------------------------------------
  var selected = null;
  function setSelected(k) {
    selected = k;
    Object.keys(meshes).forEach(function (kk) {
      meshes[kk].forEach(function (m) {
        m.traverse(function (o) {
          if (!o.isMesh) return;
          if (!o.userData.baseOpacity) {
            o.userData.baseOpacity = 1;
          }
          var dim = (k && kk !== k);
          o.material.transparent = dim;
          o.material.opacity = dim ? 0.22 : 1;
        });
      });
    });
    renderInfo();
    document.querySelectorAll("#partList button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.key === k ? "true" : "false");
    });
  }

  function renderInfo() {
    var box = document.getElementById("partInfo");
    if (!box) return;
    if (!selected) {
      box.innerHTML = '<p class="sub">' +
        (lang === "zh"
          ? "拖動可以轉動，滾輪縮放。拉下面的滑桿可以拆開它，㩒任何一個零件睇佢做乜。"
          : "Drag to rotate, scroll to zoom. Pull the slider to take it apart, and tap any part to see what it does.") +
        "</p>";
      return;
    }
    var p = PARTS.filter(function (x) { return x.key === selected; })[0];
    box.innerHTML =
      '<h3>' + p.name[lang] + "</h3>" +
      '<p class="what">' + p.what[lang] + "</p>" +
      '<p class="why">' + p.why[lang] + "</p>" +
      '<p class="cost">' + p.cost[lang] + "</p>";
  }

  function buildList() {
    var list = document.getElementById("partList");
    if (!list) return;
    list.innerHTML = "";
    PARTS.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button"; b.dataset.key = p.key;
      b.textContent = p.name[lang];
      if (p.key === "nocam") b.className = "warn";
      b.setAttribute("aria-pressed", selected === p.key ? "true" : "false");
      b.addEventListener("click", function () {
        setSelected(selected === p.key ? null : p.key);
        if (p.key === "nocam" || selected) {
          var sl = document.getElementById("explode");
          if (sl && +sl.value < 60) { sl.value = 70; applyExplode(0.7); }
        }
      });
      list.appendChild(b);
    });
  }

  // interaction --------------------------------------------------------------
  var drag = false, px = 0, py = 0, rotY = -0.45, rotX = 0.12, autoRot = true, dist = 420;
  var el = renderer.domElement;
  el.style.touchAction = "none";
  el.style.cursor = "grab";

  el.addEventListener("pointerdown", function (e) {
    drag = true; autoRot = false; px = e.clientX; py = e.clientY;
    el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing";
  });
  el.addEventListener("pointermove", function (e) {
    if (!drag) return;
    rotY += (e.clientX - px) * 0.008;
    rotX += (e.clientY - py) * 0.005;
    rotX = Math.max(-0.75, Math.min(0.85, rotX));
    px = e.clientX; py = e.clientY;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
    el.addEventListener(ev, function () { drag = false; el.style.cursor = "grab"; });
  });
  el.addEventListener("wheel", function (e) {
    e.preventDefault();
    dist = Math.max(250, Math.min(700, dist + e.deltaY * 0.5));
  }, { passive: false });

  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  el.addEventListener("click", function (e) {
    var r = el.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(device.children, true);
    for (var i = 0; i < hits.length; i++) {
      var k = hits[i].object.userData.key;
      if (k) { setSelected(selected === k ? null : k); return; }
    }
    setSelected(null);
  });

  var slider = document.getElementById("explode");
  if (slider) slider.addEventListener("input", function () { applyExplode(+slider.value / 100); });
  var resetBtn = document.getElementById("resetView");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    rotY = -0.45; rotX = 0.12; dist = 420; autoRot = true;
    if (slider) { slider.value = 0; applyExplode(0); }
    setSelected(null);
  });

  window.APING_MODEL = {
    setLang: function (l) { lang = l; buildList(); renderInfo(); }
  };

  function resize() {
    W = host.clientWidth; H = host.clientHeight || 420;
    renderer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t0 = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    var t = (now - t0) / 1000;
    if (autoRot && !reduce) rotY += 0.0035;
    device.rotation.y += (rotY - device.rotation.y) * 0.12;
    device.rotation.x += (rotX - device.rotation.x) * 0.12;
    camera.position.z += (dist - camera.position.z) * 0.1;
    camera.lookAt(0, 0, 0);

    var phase = t % 6.2;
    blink = (phase > 5.9) ? 1 : (phase > 5.75 ? (phase - 5.75) / 0.15 : 0);
    if (!reduce) drawFace(t);
    ring.material.emissiveIntensity = 0.7 + Math.sin(t * 1.6) * 0.25;

    renderer.render(scene, camera);
  }
  buildList(); renderInfo(); applyExplode(0);
  requestAnimationFrame(loop);
})();

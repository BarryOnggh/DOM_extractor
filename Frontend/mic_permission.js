(function () {
  "use strict";

  const heading = document.getElementById("heading");
  const desc    = document.getElementById("desc");
  const status  = document.getElementById("status");
  const micRing = document.getElementById("micRing");
  const BACKEND = "http://127.0.0.1:8000/transcribe";

  // Read dialect from URL param (set by sidepanel.js when opening this tab)
  const params = new URLSearchParams(window.location.search);
  const rawLang = params.get("lang") || "en";

  // Map internal dialect codes → Google Speech Recognition language tags
  const LANG_MAP = {
    "en":            "en-US",
    "zh-CN":         "zh-CN",
    "zh-HK":         "zh-HK",
    "zh-CN-hokkien": "zh-TW",   // closest Google supports for Hokkien/Min Nan
    "ms":            "ms-MY",
    "ta":            "ta-IN",
  };
  const googleLang = LANG_MAP[rawLang] || "en-US";

  const TRANSLATIONS = {
    "en": {
      headingReq: "Requesting Microphone…",
      descReq: "Please click <strong>Allow</strong> in the browser prompt above.",
      statusWait: "Waiting for permission…",
      headingListen: "Listening…",
      descListen: "Speak now. Recording will stop automatically after 5 seconds of silence.",
      statusListen: "🎙️ Recording — speak your goal",
      statusDenied: "Please allow microphone access and try again.",
      headingDenied: "Permission Denied",
      statusNoAudio: "No audio captured — tap the mic button to retry.",
      headingTranscribing: "Transcribing…",
      statusSending: "⏳ Sending to backend…",
      headingDone: "Done!",
      statusUnclear: "Couldn't make out what you said — tap the mic to retry.",
      headingError: "Backend Error",
      statusError: "Could not reach backend:",
    },
    "zh-CN": {
      headingReq: "请求麦克风权限…",
      descReq: "请在浏览器提示中点击 <strong>允许</strong>。",
      statusWait: "等待权限…",
      headingListen: "倾听中…",
      descListen: "请说话。静音自动停止录音。",
      statusListen: "🎙️ 录音中 — 请说出您的目标",
      statusDenied: "请允许麦克风权限并重试。",
      headingDenied: "权限被拒绝",
      statusNoAudio: "未捕获到音频 — 点击麦克风重试。",
      headingTranscribing: "转录中…",
      statusSending: "⏳ 发送到服务器…",
      headingDone: "完成！",
      statusUnclear: "无法听清您说的话 — 点击麦克风重试。",
      headingError: "服务器错误",
      statusError: "无法连接到服务器:",
    },
    "zh-HK": {
      headingReq: "請求咪高峰權限…",
      descReq: "請在瀏覽器提示中點擊 <strong>允許</strong>。",
      statusWait: "等待權限…",
      headingListen: "聆聽中…",
      descListen: "請說話。靜音自動停止錄音。",
      statusListen: "🎙️ 錄音中 — 請說出您的目標",
      statusDenied: "請允許咪高峰權限並重試。",
      headingDenied: "權限被拒絕",
      statusNoAudio: "未捕獲到音頻 — 點擊咪高峰重試。",
      headingTranscribing: "轉錄中…",
      statusSending: "⏳ 發送到服務器…",
      headingDone: "完成！",
      statusUnclear: "無法聽清您說的話 — 點擊咪高峰重試。",
      headingError: "服務器錯誤",
      statusError: "無法連接到服務器:",
    },
    "zh-CN-hokkien": {
      headingReq: "請求麥克風權限…",
      descReq: "請在瀏覽器提示中點擊 <strong>允許</strong>。",
      statusWait: "等待權限…",
      headingListen: "傾聽中…",
      descListen: "請說話。靜音自動停止錄音。",
      statusListen: "🎙️ 錄音中 — 請說出您的目標",
      statusDenied: "請允許麥克風權限並重試。",
      headingDenied: "權限被拒絕",
      statusNoAudio: "未捕獲到音頻 — 點擊麥克風重試。",
      headingTranscribing: "轉錄中…",
      statusSending: "⏳ 發送到伺服器…",
      headingDone: "完成！",
      statusUnclear: "無法聽清您說的話 — 點擊麥克風重試。",
      headingError: "伺服器錯誤",
      statusError: "無法連接到伺服器:",
    },
    "ms": {
      headingReq: "Memohon Akses Mikrofon…",
      descReq: "Sila klik <strong>Benarkan</strong> pada tetingkap pelayar.",
      statusWait: "Menunggu kebenaran…",
      headingListen: "Mendengar…",
      descListen: "Sila bercakap sekarang. Rakaman akan berhenti secara automatik.",
      statusListen: "🎙️ Merakam — nyatakan matlamat anda",
      statusDenied: "Sila benarkan akses mikrofon dan cuba lagi.",
      headingDenied: "Kebenaran Ditolak",
      statusNoAudio: "Tiada audio ditangkap — tekan butang mikrofon untuk cuba lagi.",
      headingTranscribing: "Menyalin…",
      statusSending: "⏳ Menghantar ke pelayan…",
      headingDone: "Selesai!",
      statusUnclear: "Tidak dapat memahami apa yang anda katakan — tekan mikrofon untuk cuba lagi.",
      headingError: "Ralat Pelayan",
      statusError: "Tidak dapat menghubungi pelayan:",
    },
    "ta": {
      headingReq: "மைக்ரோஃபோன் அனுமதி…",
      descReq: "மேலே உள்ள அறிவுறுத்தலில் <strong>அனுமதி</strong> என்பதைத் கிளிக் செய்யவும்.",
      statusWait: "காத்திருக்கிறது…",
      headingListen: "கேட்கிறது…",
      descListen: "இப்போது பேசுங்கள். பதிவு தானாகவே நின்றுவிடும்.",
      statusListen: "🎙️ பதிவு செய்கிறது — உங்கள் இலக்கை கூறுங்கள்",
      statusDenied: "அனுமதித்து மீண்டும் முயற்சிக்கவும்.",
      headingDenied: "அனுமதி மறுக்கப்பட்டது",
      statusNoAudio: "ஒலியும் இல்லை — மீண்டும் முயற்சிக்க மைக்கைத் தட்டவும்.",
      headingTranscribing: "எழுதுகிறது…",
      statusSending: "⏳ அனுப்பப்படுகிறது…",
      headingDone: "முடிந்தது!",
      statusUnclear: "புரிந்துகொள்ள முடியவில்லை — மீண்டும் முயற்சிக்க மைக்கைத் தட்டவும்.",
      headingError: "பிழை",
      statusError: "தொடர்பு கொள்ள முடியவில்லை:",
    }
  };

  const t = TRANSLATIONS[rawLang] || TRANSLATIONS["en"];

  // Initialize UI text
  heading.textContent = t.headingReq;
  desc.innerHTML = t.descReq;
  setStatus(t.statusWait, "");

  function setStatus(text, cls) {
    status.textContent = text;
    status.className = cls || "";
  }

  // Encode raw PCM samples as a proper WAV file (Blob)
  function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view   = new DataView(buffer);

    function writeString(offset, str) {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    function writeUint32LE(offset, val) { view.setUint32(offset, val, true); }
    function writeUint16LE(offset, val) { view.setUint16(offset, val, true); }

    writeString(0,  "RIFF");
    writeUint32LE(4,  36 + samples.length * 2);
    writeString(8,  "WAVE");
    writeString(12, "fmt ");
    writeUint32LE(16, 16);           // chunk size
    writeUint16LE(20, 1);            // PCM
    writeUint16LE(22, 1);            // mono
    writeUint32LE(24, sampleRate);
    writeUint32LE(28, sampleRate * 2); // byte rate
    writeUint16LE(32, 2);            // block align
    writeUint16LE(34, 16);           // bits per sample
    writeString(36, "data");
    writeUint32LE(40, samples.length * 2);

    // Convert float32 PCM to int16
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  async function startRecording() {
    heading.textContent = t.headingListen;
    desc.textContent    = t.descListen;
    setStatus(t.statusListen, "");
    micRing.classList.add("listening");

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      heading.textContent = t.headingDenied;
      setStatus(t.statusDenied, "error");
      chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: "not-allowed" });
      return;
    }

    // Capture raw PCM via AudioContext
    const audioCtx   = new AudioContext();
    const sampleRate  = audioCtx.sampleRate;
    const source      = audioCtx.createMediaStreamSource(stream);
    const bufferSize  = 4096;
    const recorder    = audioCtx.createScriptProcessor(bufferSize, 1, 1);
    const chunks      = [];

    source.connect(recorder);
    recorder.connect(audioCtx.destination);

    recorder.onaudioprocess = (e) => {
      // Copy samples (slice to break reference)
      chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };

    // Auto-stop after 8 seconds max; silence detection after 2s of quiet
    let silenceFrames  = 0;
    const SILENCE_THRESHOLD = 0.01;
    const SILENCE_MAX_FRAMES = Math.floor((sampleRate / bufferSize) * 2); // ~2s silence

    recorder.onaudioprocess = (e) => {
      const channelData = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(channelData));

      // Detect silence
      const rms = Math.sqrt(channelData.reduce((sum, s) => sum + s * s, 0) / channelData.length);
      if (rms < SILENCE_THRESHOLD) {
        silenceFrames++;
        if (silenceFrames >= SILENCE_MAX_FRAMES && chunks.length > SILENCE_MAX_FRAMES) {
          stop(); // auto-stop on silence
        }
      } else {
        silenceFrames = 0;
      }
    };

    const MAX_TIMEOUT = setTimeout(stop, 8000);

    async function stop() {
      clearTimeout(MAX_TIMEOUT);
      recorder.disconnect();
      source.disconnect();
      stream.getTracks().forEach(t => t.stop());
      audioCtx.close();
      micRing.classList.remove("listening");

      if (chunks.length === 0) {
        setStatus(t.statusNoAudio, "error");
        chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: "no-speech" });
        setTimeout(() => window.close(), 2000);
        return;
      }

      // Merge all chunks
      const totalLength = chunks.reduce((n, c) => n + c.length, 0);
      const merged = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }

      const wavBlob = encodeWAV(merged, sampleRate);

      heading.textContent = t.headingTranscribing;
      setStatus(t.statusSending, "");

      try {
        const formData = new FormData();
        formData.append("audio", wavBlob, "recording.wav");
        formData.append("lang", googleLang);

        const resp = await fetch(BACKEND, { method: "POST", body: formData });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        if (data.text) {
          heading.textContent = t.headingDone;
          setStatus(`✅ "${data.text}"`, "success");
          chrome.runtime.sendMessage({ type: "VOICE_RESULT", text: data.text });
          setTimeout(() => window.close(), 1500);
        } else {
          setStatus(t.statusUnclear, "error");
          chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: "no-speech" });
          setTimeout(() => window.close(), 2000);
        }
      } catch (err) {
        heading.textContent = t.headingError;
        setStatus(`${t.statusError} ${err.message}`, "error");
        chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: "backend-error" });
        setTimeout(() => window.close(), 3000);
      }
    }
  }

  // Kick off immediately
  startRecording();
})();

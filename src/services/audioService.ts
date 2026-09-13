class AudioNotificationService {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a synthesized peaceful Islamic chime or soft melodic Adhan tone using the Web Audio API
   */
  public async playNotification(type: 'makkah' | 'madinah' | 'chime' | 'soft_beep' = 'chime') {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      if (type === 'soft_beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        return;
      }

      if (type === 'chime') {
        // 3-note harmonic chime (B4, E5, G#5)
        const freqs = [493.88, 659.25, 830.61];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.25);
          gain.gain.setValueAtTime(0, now + i * 0.25);
          gain.gain.linearRampToValueAtTime(0.25, now + i * 0.25 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.25);
          osc.stop(now + i * 0.25 + 1.8);
        });
        return;
      }

      // Melodic Maqam Bayati simulation (peaceful Adhan phrase sequence)
      // Notes: D4, E4(half flat ~315Hz), F4, G4, A4, Bb4, C5, D5
      const adhanMelody = [
        { freq: 293.66, dur: 0.8 }, // D4
        { freq: 349.23, dur: 1.2 }, // F4
        { freq: 392.00, dur: 1.5 }, // G4
        { freq: 440.00, dur: 2.0 }, // A4 ("Allahu Akbar")
        { freq: 392.00, dur: 1.2 }, // G4
        { freq: 349.23, dur: 1.8 }, // F4
        { freq: 293.66, dur: 2.5 }, // D4
      ];

      let offset = 0;
      adhanMelody.forEach(({ freq, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + offset);

        // Gentle subtle vibrato
        const vibrato = ctx.createOscillator();
        const vibGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5, now + offset);
        vibGain.gain.setValueAtTime(2.5, now + offset);
        vibrato.connect(osc.frequency);
        vibrato.start(now + offset);
        vibrato.stop(now + offset + dur);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + dur);

        offset += dur * 0.85;
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Triggers a browser desktop notification if permission granted
   */
  public async sendNotification(title: string, body: string) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Notification error:', e);
      }
    } else if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification(title, { body });
      }
    }
  }
}

export const audioService = new AudioNotificationService();

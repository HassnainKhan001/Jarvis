import type { AudioStreamOptions } from '../types/api';

export class AudioStreamer {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private options: AudioStreamOptions;

  constructor(options: AudioStreamOptions = {}) {
    this.options = {
      autoPlay: true,
      volume: 1.0,
      ...options,
    };
  }

  private async initAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playFromURL(url: string): Promise<void> {
    try {
      await this.initAudioContext();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);

      this.playAudioBuffer(audioBuffer);
    } catch (error) {
      console.error('Audio playback error:', error);
      this.options.onError?.(error as Error);
    }
  }

  private playAudioBuffer(audioBuffer: AudioBuffer): void {
    if (!this.audioContext) return;

    // Stop any currently playing audio
    this.stop();

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = audioBuffer;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this.options.volume || 1.0;

    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.sourceNode.onended = () => {
      this.isPlaying = false;
      this.options.onEnd?.();
    };

    this.sourceNode.start();
    this.isPlaying = true;
  }

  stop(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (error) {
        // Ignore errors when stopping already stopped audio
      }
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  setVolume(volume: number): void {
    this.options.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.options.volume;
    }
  }

  getPlaying(): boolean {
    return this.isPlaying;
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class SpeechRecognition {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResult: ((transcript: string) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.onResult?.(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.onError?.(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  start(onResult: (transcript: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    this.onResult = onResult;
    this.onError = onError || null;
    
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      onError?.('Failed to start speech recognition');
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
      }
      this.isListening = false;
    }
  }

  getListening(): boolean {
    return this.isListening;
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }
}

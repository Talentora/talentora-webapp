declare module 'realtime-ai';

export type TransportState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export type RTVIEvent = 'message' | 'error' | 'transportStateChanged' | 'participantConnected' | 'participantDisconnected' | 'messageError';    

export type RTVIMessage = {
    data: any;
    type: RTVIEvent;
}

export type TranscriptData = {
    text: string;
    role: 'bot' | 'user';
}
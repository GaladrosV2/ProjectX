import { useVoice } from "../store/useVoice";

export default function VoiceBar() {
  const { joined, muted, deafened, join, leave, toggleMute, toggleDeafen } =
    useVoice();
  return (
    <div className="flex items-center gap-3 p-2">
      {!joined ? (
        <button
          className="px-3 py-1 bg-white/10 rounded-lg"
          onClick={() => join("1", "voice1")}
        >
          Join Voice
        </button>
      ) : (
        <>
          <span className="text-white/60">voice1</span>
          <button
            onClick={toggleMute}
            className="px-3 py-1 bg-white/5 rounded-lg"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={toggleDeafen}
            className="px-3 py-1 bg-white/5 rounded-lg"
          >
            {deafened ? "Undeafen" : "Deafen"}
          </button>
          <button onClick={leave} className="px-3 py-1 bg-white/5 rounded-lg">
            Leave
          </button>
        </>
      )}
    </div>
  );
}

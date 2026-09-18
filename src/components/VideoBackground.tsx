export default function VideoBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>
      {/* Subtle cinematic tint ensuring text contrast without obscuring video depth */}
      <div className="absolute inset-0 bg-black/30 backdrop-brightness-95 pointer-events-none z-0" />
    </div>
  );
}

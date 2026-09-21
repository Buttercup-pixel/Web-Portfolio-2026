export default function Tile({ src, alt, ratio, label, logo, logoBg }) {
  return (
    <figure
      className="relative m-0 overflow-hidden bg-black group"
      style={{ aspectRatio: ratio }}
    >
      {logo ? (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: logoBg }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={logoBg === "#e4e4e4" ? "w-4/5 h-auto" : "w-full h-full"}
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}

      {label && (
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-white text-sm tracking-[0.15em] opacity-0 bg-black/0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-black/45">
          <span>{label}</span>
        </figcaption>
      )}
    </figure>
  );
}

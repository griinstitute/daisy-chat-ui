export function WhatsAppQR({ base64 = "" }: { base64?: string }) {
  if (!base64) return null;

  const src = base64.startsWith("data:")
    ? base64
    : `data:image/png;base64,${base64}`;

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border p-4">
      {/* <p className="text-muted-foreground text-sm">
        Escaneie o QR Code abaixo com o WhatsApp para conectar:
      </p> */}
      <img
        src={src}
        alt="WhatsApp QR Code"
        className="h-64 w-64"
      />
    </div>
  );
}

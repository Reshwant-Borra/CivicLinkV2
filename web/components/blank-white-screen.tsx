/**
 * Intentionally empty product surface — full-viewport white canvas.
 */
export function BlankWhiteScreen() {
  return (
    <div
      data-testid="blank-white-screen"
      className="min-h-screen w-full bg-white"
    />
  );
}

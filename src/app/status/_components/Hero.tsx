export default function Hero({ projects, translations = {} }: { projects?: any[]; translations?: Record<string,string> }) {
  const t = (k: string) => translations?.[k] ?? k;
  return (<section className="mb-12"></section>)
}

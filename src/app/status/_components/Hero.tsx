import { useI18n } from "@/lib/I18nProvider";
import { SnapshotProject } from "../types";

export default function Hero({ projects }: { projects?: SnapshotProject[] }) {
  const { t } = useI18n();

  return (
    <section className="mb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black font-display tracking-tight">
          {t("status.hero.title")}
        </h2>
        <p className="text-on-surface/60 font-medium">
          {t("status.hero.subtitle")}
        </p>
      </div>
    </section>
  );
}

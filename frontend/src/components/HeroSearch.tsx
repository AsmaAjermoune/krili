"use client";

import { motion } from "framer-motion";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { useI18n } from "@/context/I18nContext";

export default function HeroSearch() {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8 w-full max-w-2xl mx-auto"
    >
      <ActionSearchBar
        variant="dark"
        label={t("search.hero_label")}
        placeholder={t("search.hero_placeholder")}
      />
    </motion.div>
  );
}

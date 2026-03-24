"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getUserProfile } from "@/lib/db";

export type PlanTier = "spark" | "velocity" | "empire";

export function usePlan() {
  const { user, loading } = useAuth();
  const [plan, setPlan] = useState<PlanTier>("spark");
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    if (!user) { setPlanLoading(false); return; }
    getUserProfile(user.uid).then(p => {
      setPlan((p?.plan as PlanTier) || "spark");
      setPlanLoading(false);
    });
  }, [user]);

  const isSpark = plan === "spark";
  const isVelocity = plan === "velocity";
  const isEmpire = plan === "empire";
  const isVelocityOrAbove = isVelocity || isEmpire;
  const isEmpireOnly = isEmpire;

  // Feature gates
  const canUseShop = isVelocityOrAbove;
  const canUsePortfolio = isVelocityOrAbove;
  const canUseServices = isVelocityOrAbove;
  const canUseCRM = isVelocityOrAbove;
  const canUseBranding = isEmpireOnly;
  const canUsePress = isEmpireOnly;
  const canUseCustomDomain = isEmpireOnly;
  const canUseAdvancedAnalytics = isEmpireOnly;
  const showWatermark = isSpark;
  const maxLinks = isSpark ? 5 : Infinity;
  const maxProducts = isSpark ? 0 : isVelocity ? 10 : Infinity;
  const maxCRMContacts = isSpark ? 0 : isVelocity ? 500 : Infinity;

  return {
    plan, planLoading,
    isSpark, isVelocity, isEmpire,
    isVelocityOrAbove, isEmpireOnly,
    canUseShop, canUsePortfolio, canUseServices,
    canUseCRM, canUseBranding, canUsePress,
    canUseCustomDomain, canUseAdvancedAnalytics,
    showWatermark, maxLinks, maxProducts, maxCRMContacts,
  };
}

import { useState, useEffect, useCallback } from "react";
import { getBites, getQuizBites, loadBites, type Bite } from "@/data/bites";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DailyActivity {
  date: string;
  quizzes: number;
  bites: number;
}

interface LearningState {
  usedBiteIds: number[];
  collectedBiteIds: number[]; // bites intentionally collected/saved by user
  currentBiteId: number | null;
  streak: number;
  lastVisitDate: string;
  quizCount: number;
  biteTokens: number; // total bites earned as tokens
  confidenceRatings: Record<string, "confused" | "getting-there" | "mastered">;
  dailyGoalProgress: number;
  dailyGoalTarget: number;
  simulatedDay: number;
  activityLog: DailyActivity[];
  // categories the user has chosen as preferences; empty = all
  preferredCategories: string[];
  lastCertificateDate: string; // track when certificate was last shown
}

const STORAGE_KEY = "bitsize-learning";

function getStorageKey(userId: string | undefined): string {
  // Use user-specific storage if authenticated, otherwise use default
  return userId ? `${STORAGE_KEY}-${userId}` : STORAGE_KEY;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadState(userId: string | undefined): LearningState {
  const key = getStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure new fields exist for backward compatibility
      return {
        usedBiteIds: parsed.usedBiteIds || [],
        collectedBiteIds: parsed.collectedBiteIds || [],
        currentBiteId: parsed.currentBiteId || null,
        streak: parsed.streak || 0,
        lastVisitDate: parsed.lastVisitDate || "",
        quizCount: parsed.quizCount || 0,
        biteTokens: parsed.biteTokens || 0,
        confidenceRatings: parsed.confidenceRatings || {},
        dailyGoalProgress: parsed.dailyGoalProgress || 0,
        dailyGoalTarget: parsed.dailyGoalTarget || 3,
        simulatedDay: parsed.simulatedDay || 0,
        activityLog: parsed.activityLog || [],
        preferredCategories: parsed.preferredCategories || [],
        lastCertificateDate: parsed.lastCertificateDate || "",
      };
    }
  } catch {}
  return {
    usedBiteIds: [],
    collectedBiteIds: [],
    currentBiteId: null,
    streak: 0,
    lastVisitDate: "",
    quizCount: 0,
    biteTokens: 0,
    confidenceRatings: {},
    dailyGoalProgress: 0,
    dailyGoalTarget: 3,
    simulatedDay: 0,
    activityLog: [],
    preferredCategories: [],
    lastCertificateDate: "",
  };
}

function saveState(state: LearningState, userId: string | undefined) {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(state));
}

export function useLearningStore() {
  const { user } = useAuth();
  const [state, setState] = useState<LearningState>(() => loadState(user?.id));
  const [bitesLoaded, setBitesLoaded] = useState(false);

  // Load bites from JSON on mount
  useEffect(() => {
    loadBites().then(() => setBitesLoaded(true));
  }, []);

  // When user changes, reload the state from storage
  useEffect(() => {
    if (user?.id) {
      // Clear any old user data (previous storage keys that don't match current user)
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          // Remove old bitsize-learning keys that don't match current user
          if (key.startsWith("bitsize-learning-") && key !== `bitsize-learning-${user.id}`) {
            localStorage.removeItem(key);
          }
          // Also clear the default guest key when user logs in
          if (key === "bitsize-learning") {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn("Could not clear old data:", e);
      }
      // Load fresh state for this user
      setState(loadState(user.id));
    } else {
      // When user logs out, also clear all user-specific data
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("bitsize-learning-")) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn("Could not clear user data on logout:", e);
      }
      // Load guest state
      setState(loadState(undefined));
    }
  }, [user?.id]);

  useEffect(() => {
    saveState(state, user?.id);
  }, [state, user?.id]);

  // Initialize daily bite and streak on first load (after bites are loaded)
  useEffect(() => {
    if (!bitesLoaded) return;
    const allBites = getBites();
    if (allBites.length === 0) return;

    const today = getToday();
    setState((prev) => {
      const newState = { ...prev };
      // Streak logic
      if (prev.lastVisitDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split("T")[0];
        if (prev.lastVisitDate === yStr) {
          newState.streak = prev.streak + 1;
        } else if (prev.lastVisitDate === "") {
          newState.streak = 1;
        } else {
          newState.streak = 1;
        }
        newState.lastVisitDate = today;
        newState.dailyGoalProgress = 0;
        // Pick new bite (respect preferences if set)
        const allowed =
          prev.preferredCategories.length > 0
            ? allBites.filter((b) => prev.preferredCategories.includes(b.category))
            : allBites;
        const available = allowed.filter((b) => !prev.usedBiteIds.includes(b.id));
        if (available.length > 0) {
          const pick = available[Math.floor(Math.random() * available.length)];
          newState.currentBiteId = pick.id;
          newState.usedBiteIds = [...prev.usedBiteIds, pick.id];
        } else {
          const pick = allBites[Math.floor(Math.random() * allBites.length)];
          newState.currentBiteId = pick.id;
          newState.usedBiteIds = [pick.id];
        }
      } else if (!prev.currentBiteId) {
        const available = allBites.filter((b) => !prev.usedBiteIds.includes(b.id));
        if (available.length > 0) {
          const pick = available[Math.floor(Math.random() * available.length)];
          newState.currentBiteId = pick.id;
          newState.usedBiteIds = [...prev.usedBiteIds, pick.id];
        }
      }
      return newState;
    });
  }, [bitesLoaded]);

  const simulateNewDay = useCallback(() => {
    const allBites = getBites();
    if (allBites.length === 0) return;
    setState((prev) => {
      const allowed =
        prev.preferredCategories.length > 0
          ? allBites.filter((b) => prev.preferredCategories.includes(b.category))
          : allBites;
      const available = allowed.filter((b) => !prev.usedBiteIds.includes(b.id));
      let pick: Bite;
      let newUsed: number[];
      if (available.length > 0) {
        pick = available[Math.floor(Math.random() * available.length)];
        newUsed = [...prev.usedBiteIds, pick.id];
      } else {
        pick = allBites[Math.floor(Math.random() * allBites.length)];
        newUsed = [pick.id];
      }
      return {
        ...prev,
        currentBiteId: pick.id,
        usedBiteIds: newUsed,
        streak: prev.streak + 1,
        dailyGoalProgress: 0,
        simulatedDay: prev.simulatedDay + 1,
      };
    });
  }, []);

  const incrementGoal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dailyGoalProgress: Math.min(prev.dailyGoalProgress + 1, prev.dailyGoalTarget),
    }));
  }, []);

  const collectBite = useCallback((id: number) => {
    setState((prev) => {
      if (prev.collectedBiteIds.includes(id)) return prev;
      return { ...prev, collectedBiteIds: [...prev.collectedBiteIds, id] };
    });
  }, []);

  const earnBites = useCallback((count: number) => {
    if (count <= 0) return;
    setState((prev) => ({
      ...prev,
      biteTokens: prev.biteTokens + count,
    }));
    logActivity("bites", count);
  }, []);

  const logActivity = useCallback((field: "quizzes" | "bites", count: number) => {
    const today = getToday();
    setState((prev) => {
      const log = Array.isArray(prev.activityLog) ? [...prev.activityLog] : [];
      const idx = log.findIndex((a) => a.date === today);
      if (idx >= 0) {
        log[idx] = { ...log[idx], [field]: log[idx][field] + count };
      } else {
        log.push({ date: today, quizzes: 0, bites: 0, [field]: count });
      }
      // Keep only last 30 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().split("T")[0];
      return { ...prev, activityLog: log.filter((a) => a.date >= cutoffStr) };
    });
  }, []);

  const completeQuiz = useCallback((count: number = 1) => {
    setState((prev) => ({
      ...prev,
      quizCount: prev.quizCount + count,
    }));
    logActivity("quizzes", count);
    incrementGoal();
  }, [incrementGoal, logActivity]);

  const setConfidence = useCallback(
    (category: string, level: "confused" | "getting-there" | "mastered") => {
      setState((prev) => ({
        ...prev,
        confidenceRatings: { ...prev.confidenceRatings, [category]: level },
      }));
    },
    []
  );

  const setPreferredCategories = useCallback((categories: string[]) => {
    setState((prev) => {
      const newState = { ...prev, preferredCategories: categories };
      // if current bite is no longer in an allowed category, swap it out
      if (
        categories.length > 0 &&
        prev.currentBiteId !== null
      ) {
        const current = getBites().find((b) => b.id === prev.currentBiteId);
        if (current && !categories.includes(current.category)) {
          const allowed = getBites().filter((b) => categories.includes(b.category));
          if (allowed.length > 0) {
            const pick = allowed[Math.floor(Math.random() * allowed.length)];
            newState.currentBiteId = pick.id;
            newState.usedBiteIds = [...prev.usedBiteIds, pick.id];
          }
        }
      }
      return newState;
    });
  }, []);

  const updateCertificateDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, lastCertificateDate: date }));
  }, []);

  const allBites = getBites();
  const currentBite = allBites.find((b) => b.id === state.currentBiteId) || null;
  const collectedBites = allBites.filter((b) => state.collectedBiteIds.includes(b.id));
  const mastereBites = Object.entries(state.confidenceRatings)
    .filter(([, level]) => level === "mastered")
    .map(([category]) => category);

  return {
    ...state,
    currentBite,
    bitesLoaded,
    simulateNewDay,
    incrementGoal,
    completeQuiz,
    setConfidence,
    allBites,
    collectedBites,
    collectedCount: collectedBites.length,
    biteTokens: state.biteTokens,
    earnBites,
    collectBite,
    masteredCount: mastereBites.length,
    setPreferredCategories,
    updateCertificateDate,
  };
}

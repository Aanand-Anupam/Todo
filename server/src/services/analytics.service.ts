import type { ITodoItem_DB } from "../types/model.interface.js";
import { completionTimestampForItem } from "../utils/todoItem.js";

function formatHourLabel(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${suffix}`;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export interface ProductivityStats {
  periodDays: number;
  totals: {
    totalTasks: number;
    completed: number;
    upcoming: number;
    missed: number;
    completionRate: number;
    listsCount: number;
  };
  mostProductiveTime: {
    hour: number;
    label: string;
    completions: number;
  } | null;
  dailyTrend: Array<{
    date: string;
    completed: number;
    completionRate: number;
  }>;
  listBreakdown: Array<{
    todoName: string;
    total: number;
    completed: number;
    completionRate: number;
  }>;
}

export function buildProductivityStats(
  todos: Array<{
    todoName: string;
    items: ITodoItem_DB[];
    updatedAt: Date;
    createdAt: Date;
    deleteStatus: string;
  }>,
  periodDays = 7,
): ProductivityStats {
  const activeTodos = todos.filter((todo) => todo.deleteStatus !== "PENDING");
  const periodStart = startOfDay(new Date());
  periodStart.setDate(periodStart.getDate() - (periodDays - 1));

  let completed = 0;
  let upcoming = 0;
  let missed = 0;
  const hourCounts = new Array<number>(24).fill(0);
  const dailyCompleted = new Map<string, number>();
  const dailyTotals = new Map<string, number>();
  const listBreakdown: ProductivityStats["listBreakdown"] = [];

  for (let i = 0; i < periodDays; i++) {
    const day = new Date(periodStart);
    day.setDate(periodStart.getDate() + i);
    const key = toDateKey(day);
    dailyCompleted.set(key, 0);
    dailyTotals.set(key, 0);
  }

  for (const todo of activeTodos) {
    let listCompleted = 0;

    for (const item of todo.items) {
      if (item.status === "DONE") completed += 1;
      if (item.status === "UPCOMING") upcoming += 1;
      if (item.status === "MISSED") missed += 1;
      if (item.status === "DONE") listCompleted += 1;

      const completionTime = completionTimestampForItem(item, todo.updatedAt);
      if (!completionTime) continue;

      const completionDay = startOfDay(completionTime);
      if (completionDay < periodStart) continue;

      const dateKey = toDateKey(completionDay);
      dailyCompleted.set(dateKey, (dailyCompleted.get(dateKey) ?? 0) + 1);
      const hour = completionTime.getHours();
      if (hourCounts[hour] !== undefined) hourCounts[hour] += 1;
    }

    const listTotal = todo.items.length;
    listBreakdown.push({
      todoName: todo.todoName,
      total: listTotal,
      completed: listCompleted,
      completionRate:
        listTotal === 0 ? 0 : Math.round((listCompleted / listTotal) * 100),
    });
  }

  for (const todo of activeTodos) {
    const createdDay = startOfDay(new Date(todo.createdAt));
    if (createdDay < periodStart) continue;
    const key = toDateKey(createdDay);
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + todo.items.length);
  }

  const totalTasks = completed + upcoming + missed;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

  let peakHour: number | null = null;
  let peakCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > peakCount) {
      peakCount = count;
      peakHour = hour;
    }
  });

  const dailyTrend = Array.from(dailyCompleted.entries()).map(
    ([date, dayCompleted]) => {
      const dayTotal = dailyTotals.get(date) ?? dayCompleted + 1;
      return {
        date,
        completed: dayCompleted,
        completionRate:
          dayTotal === 0
            ? 0
            : Math.round((dayCompleted / dayTotal) * 100),
      };
    },
  );

  return {
    periodDays,
    totals: {
      totalTasks,
      completed,
      upcoming,
      missed,
      completionRate,
      listsCount: activeTodos.length,
    },
    mostProductiveTime:
      peakHour === null || peakCount === 0
        ? null
        : {
            hour: peakHour,
            label: formatHourLabel(peakHour),
            completions: peakCount,
          },
    dailyTrend,
    listBreakdown: listBreakdown.sort((a, b) => b.total - a.total),
  };
}

export function buildLocalSummary(stats: ProductivityStats) {
  const { totals, mostProductiveTime, dailyTrend } = stats;
  const bestDay = [...dailyTrend].sort((a, b) => b.completed - a.completed)[0];
  const lines = [
    `You have completed ${totals.completed} of ${totals.totalTasks} tasks (${totals.completionRate}% completion rate) across ${totals.listsCount} lists.`,
  ];

  if (totals.missed > 0) {
    lines.push(
      `${totals.missed} task${totals.missed === 1 ? " is" : "s are"} marked missed — consider rescheduling or breaking them into smaller steps.`,
    );
  }

  if (mostProductiveTime) {
    lines.push(
      `Your most productive window recently is around ${mostProductiveTime.label}, with ${mostProductiveTime.completions} completion${mostProductiveTime.completions === 1 ? "" : "s"} logged in that hour.`,
    );
  } else {
    lines.push(
      "Complete a few more tasks to unlock a reliable productivity time window.",
    );
  }

  if (bestDay && bestDay.completed > 0) {
    lines.push(
      `Your strongest day in the last ${stats.periodDays} days was ${bestDay.date} with ${bestDay.completed} completed task${bestDay.completed === 1 ? "" : "s"}.`,
    );
  }

  if (totals.upcoming > 0) {
    lines.push(
      `${totals.upcoming} task${totals.upcoming === 1 ? " remains" : "s remain"} upcoming — batch similar items to protect focus time.`,
    );
  }

  return lines.join(" ");
}

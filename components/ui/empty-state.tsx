"use client";

import { Film, Ticket, Search, Heart, Star, Clock } from "lucide-react";
import { type ReactNode } from "react";

const icons = {
  film: Film,
  ticket: Ticket,
  search: Search,
  heart: Heart,
  star: Star,
  clock: Clock
};

interface EmptyStateProps {
  icon?: keyof typeof icons;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = "film", title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="empty-state-illustrated">
      <div className="empty-state-icon">
        <Icon size={40} />
      </div>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}

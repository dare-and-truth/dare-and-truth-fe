export interface Badge {
  id: string;
  title: string;
  image: string;
  description: string;
  startDay: Date;
  endDay: Date;
  badgeCriteria: number;
  points: number;
  isActive: boolean;
}

export interface CreateBadge {
  title: string;
  image: string;
  description: string;
  startDay: Date;
  endDay: Date;
  badgeCriteria: number;
  points: number;
  isActive: boolean;
}

export interface ModalUpdateBadge {
  open: boolean;
  setOpen: (value: boolean) => void;
  badge: Badge;
  setRefreshBadge: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export interface ModalCreateBadge {
  setRefreshBadge: (value: boolean | ((prev: boolean) => boolean)) => void;
}

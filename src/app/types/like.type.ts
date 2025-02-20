export interface LikePayload {
  feedId: string;
  isChallenge: boolean;
}

export type unlikeFeedPayload = Omit<
  LikePayload,
  'isChallenge'
>;
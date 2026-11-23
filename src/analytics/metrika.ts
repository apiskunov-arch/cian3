export const METRIKA_COUNTER_ID = 99999999;

export type AuctionRole = 'seller' | 'buyer';

export type AuctionGoal =
  | 'auction_buyer_home_view'
  | 'auction_buyer_search_view'
  | 'auction_buyer_listing_open'
  | 'auction_buyer_listing_view'
  | 'auction_buyer_bid_submit'
  | 'auction_buyer_bid_pending'
  | 'auction_buyer_bid_accepted'
  | 'auction_buyer_bid_below_min'
  | 'auction_buyer_bid_error'
  | 'auction_buyer_auction_finished'
  | 'auction_seller_home_view'
  | 'auction_seller_placement_start'
  | 'auction_seller_placement_choice'
  | 'auction_seller_choose_auction'
  | 'auction_seller_conditions_view'
  | 'auction_seller_review_open'
  | 'auction_seller_review_view'
  | 'auction_seller_publish'
  | 'auction_seller_published_view'
  | 'auction_seller_listing_view';

export type AuctionGoalParams = {
  role: AuctionRole;
  step: string;
  [key: string]: string | number | boolean;
};

declare global {
  interface Window {
    ym?: (
      counterId: number,
      action: 'reachGoal',
      target: string,
      params: AuctionGoalParams,
    ) => void;
  }
}

/**
 * Единственная точка интеграции аналитики для сценария аукциона.
 * ID намеренно тестовый: подключение настоящего счётчика не входит в прототип.
 */
export function reachAuctionGoal(goal: AuctionGoal, params: AuctionGoalParams) {
  window.ym?.(METRIKA_COUNTER_ID, 'reachGoal', goal, params);

  if (import.meta.env.DEV) {
    console.info('[Metrika stub]', METRIKA_COUNTER_ID, goal, params);
  }
}

import { FavoriteItem, OfferFull, OfferPreview, Review } from '../../../types.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, Status } from '../../../const.ts';
import {
  changeFavoriteStatusAction,
  fetchFavoritesAction,
  fetchNearbyAction,
  fetchOfferAction,
  fetchOffersAction,
  fetchReviewsAction,
  postReviewAction
} from '../../api-actions.ts';

type AppData = {
  offer: OfferFull | null;
  offers: OfferPreview[];
  nearby: OfferPreview[];
  reviews: Review[];
  isReviewsStatusSubmitting: boolean;
  favorites: FavoriteItem[];
  isOffersLoading: boolean;
  isOfferLoading: boolean;
  isNearbyLoading: boolean;
  isReviewsLoading: boolean;
  isFavoritesLoading: boolean;
  isFavoriteStatusSubmitting: boolean;
  hasError: boolean;
  reviewsStatus: Status;
}

const initialState: AppData = {
  offer: null,
  offers: [],
  nearby: [],
  reviews: [],
  isReviewsStatusSubmitting: false,
  favorites: [],
  isOffersLoading: false,
  isOfferLoading: false,
  isNearbyLoading: false,
  isReviewsLoading: false,
  isFavoritesLoading: false,
  isFavoriteStatusSubmitting: false,
  hasError: false,
  reviewsStatus: Status.Idle,
};

export const appData = createSlice({
  name: NameSpace.Data,
  initialState,
  reducers: {
    setReviewsErrorStatus: (state, action: PayloadAction<Status>) => {
      state.reviewsStatus = action.payload;
    },
    resetFavoriteStatus: (state) => {
      state.favorites = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.hasError = false;
        state.isOffersLoading = true;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersLoading = false;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.hasError = true;
        state.isOffersLoading = false;
      })
      .addCase(fetchOfferAction.pending, (state) => {
        state.hasError = false;
        state.isOfferLoading = true;
      })
      .addCase(fetchOfferAction.fulfilled, (state, action) => {
        state.offer = action.payload;
        state.isOfferLoading = false;
      })
      .addCase(fetchOfferAction.rejected, (state) => {
        state.hasError = true;
        state.isOfferLoading = false;
      })
      .addCase(fetchNearbyAction.pending, (state) => {
        state.isNearbyLoading = true;
      })
      .addCase(fetchNearbyAction.fulfilled, (state, action) => {
        state.nearby = action.payload;
        state.isNearbyLoading = false;
      })
      .addCase(fetchNearbyAction.rejected, (state) => {
        state.isNearbyLoading = false;
      })
      .addCase(fetchReviewsAction.pending, (state) => {
        state.isReviewsLoading = true;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.isReviewsLoading = false;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.isReviewsLoading = false;
      })
      .addCase(postReviewAction.pending, (state) => {
        state.reviewsStatus = Status.Loading;
        state.isReviewsStatusSubmitting = true;
      })
      .addCase(postReviewAction.fulfilled, (state, action) => {
        state.reviewsStatus = Status.Success;
        state.isReviewsStatusSubmitting = false;
        state.reviews.push(action.payload);
      })
      .addCase(postReviewAction.rejected, (state) => {
        state.reviewsStatus = Status.Error;
        state.isReviewsStatusSubmitting = false;
      })
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.isFavoritesLoading = true;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.isFavoritesLoading = false;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.isFavoritesLoading = false;
      })
      .addCase(changeFavoriteStatusAction.pending, (state) => {
        state.isFavoriteStatusSubmitting = true;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        state.isFavoriteStatusSubmitting = false;

        const payloadOffer = action.payload;
        const { id } = payloadOffer;
        const offerIndex = state.offers.findIndex((el) => el.id === id);
        const favoriteOfferIndex = state.favorites.findIndex((el) => el.id === id);
        if (offerIndex !== -1) {
          state.offers[offerIndex] = payloadOffer;
        }

        if (payloadOffer.isFavorite) {
          state.favorites.push(payloadOffer);
        } else {
          state.favorites.splice(favoriteOfferIndex, 1);
        }

        if (state.offer && state.offer.id === id) {
          state.offer.isFavorite = !state.offer.isFavorite;
        }

        const offerNearbyIndex = state.nearby.findIndex((el) => el.id === id);
        if (offerNearbyIndex !== -1) {
          state.nearby[offerNearbyIndex].isFavorite = !state.nearby[offerNearbyIndex].isFavorite;
        }
      })
      .addCase(changeFavoriteStatusAction.rejected, (state) => {
        state.isFavoriteStatusSubmitting = false;
      });
  }
});

export const { setReviewsErrorStatus, resetFavoriteStatus } = appData.actions;

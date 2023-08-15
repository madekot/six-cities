import MainPage from '../../pages/main-page/main-page.tsx';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../../pages/login-page/login-page.tsx';
import FavoritesPage from '../../pages/favorites-page/favorites-page.tsx';
import OfferPage from '../../pages/offer-page/offer-page.tsx';
import NotFoundPage from '../../pages/not-found-page/not-found-page.tsx';
import PrivateRoute from '../private-route/private-route.tsx';
import { useAppSelector } from '../../store/hooks.ts';
import LoadingPage from '../../pages/loading-page/loading-page.tsx';
import { AppRoute } from '../../const.ts';
import HistoryRouter from '../history-route/history-route.tsx';
import browserHistory from '../../browser-history.ts';
import RedirectToMainRoute from '../redirect-to-main-route/redirect-to-main-route.tsx';
import { getIsOffersLoading, getOffers } from '../../store/slices/app-data/selectors.ts';
import { getAuthorizationStatus } from '../../store/slices/user-process/selectors.ts';

function App(): JSX.Element {
  const offers = useAppSelector(getOffers);
  const isOffersDataLoading = useAppSelector(getIsOffersLoading);
  const userAuthorizationStatus = useAppSelector(getAuthorizationStatus);

  if (isOffersDataLoading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <HistoryRouter history={browserHistory}>
      <Routes>
        <Route
          index
          path={AppRoute.Main}
          element={<MainPage offers={offers}/>}
        />
        <Route
          path={AppRoute.Login}
          element={
            <RedirectToMainRoute authorizationStatus={userAuthorizationStatus}>
              <LoginPage/>
            </RedirectToMainRoute>
          }
        />
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute authorizationStatus={userAuthorizationStatus}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Offer}
          element={<OfferPage offersPreview={offers}/>}
        />
        <Route
          path={AppRoute.PageNotFound}
          element={<NotFoundPage />}
        />
      </Routes>
    </HistoryRouter>
  );
}

export default App;

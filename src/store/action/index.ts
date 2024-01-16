/*
 * @Date: 2023-12-08 17:58:35
 * @Description: description
 */
import { onThemeChange } from './theme';
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite  } from './popular/index';
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite  } from './trending/index';
import { onLoadFavoriteData } from './favorite/index';
/*
* action聚合
*/
export default {
  onThemeChange,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadFavoriteData
};

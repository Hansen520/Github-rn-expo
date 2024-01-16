/*
 * @Date: 2023-11-13 17:38:39
 * @Description: description
 */
import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {tabNav} from '../navigator/NavigationDelegate';
import keys from '../data/keys.json';
import NavigationBar from 'react-native-navbar-plus';
import FavoriteDao from "../expand/FavoriteDao";
import { FLAG_STORAGE } from "../expand/DataStore";
import {connect} from 'react-redux';
import actions from '../store/action';
import PopularItem from '../common/PopularItem';
import FavoriteUtil from '../util/FavoriteUtil';
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil'
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

interface Props {
  theme: {
    themeColor: string;
  }
}

class PopularPage extends Component<Props> {
  private themeColor: any;
  private canLoadMore: any;
  TabNavigator: any;
  render() {
    const themeColor = this.props.theme.themeColor || this.props.theme;
    if (this.themeColor != themeColor) {//当主题变更的时候需要以新的主题色来创建TabNavigator
      this.themeColor = themeColor;
      this.TabNavigator = null;
    }
    let navigationBar = (
      <NavigationBar
        title={'最热'}
        statusBar={{backgroundColor: themeColor,}}
        style={{ backgroundColor: themeColor }}//修改标题栏主题色
      />
    );
    this.TabNavigator = keys.length
      ? tabNav({
          Component: PopularTabPage,
          theme: {themeColor},
          keys,
        })
      : null;
    return (
      <View style={styles.container}>
        {navigationBar}
        {this.TabNavigator}
      </View>
    );
  }
}
const mapPopularStateToProps = (state: any) => ({
  theme: state.theme.theme,
});
export default connect(mapPopularStateToProps, null)(PopularPage);


const pageSize = 10;//设为常量，防止修改
class PopularTab extends Component<{ tabLabel: string, popular: any, onRefreshPopular: any, onLoadMorePopular: any }> {
  private storeName: string;
  private canLoadMore: any;
  private refs: any;
  private isFavoriteChanged: any;
  constructor(props: any) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }

  loadData(loadMore?: boolean) {
    const { onRefreshPopular, onLoadMorePopular } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, () => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshPopular(this.storeName, url, pageSize)
    }
  }

  /* 获取与当前页面有关的数据 */
  _store() {
    const { popular } = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store;
  }

  genFetchUrl(key: string) {
    return URL + key + QUERY_STR;
  }

  renderItem(data: any) {
    const item = data.item;
    return <PopularItem
      projectModel={item}
      item={item}
      onSelect={() => {
        NavigationUtil.goPage({
          projectModel: item,
        }, 'DetailPage')
      }}
      onFavorite={(item: any, isFavorite: boolean) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.id}
          refreshControl={
            <RefreshControl
              title="Loading"
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached---');
            setTimeout(() => {
              /* 滚动时候的两次调用 */
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
            console.log('---onMomentumScrollBegin---');
          }}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}
const mapStateToProps = (state: { popular: any }) => ({
  popular: state.popular
});
const mapDispatchToProps = (dispatch: (e: any) => {}) => ({
  onRefreshPopular: (storeName: string, url: string, pageSize: number) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName: string, pageIndex: number, pageSize: number, items: any, callBack: any) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack))
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab as any)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});

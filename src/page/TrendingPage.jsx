import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action/index';
import { tabNav } from '../navigator/NavigationDelegate';
import NavigationUtil from '../navigator/NavigationUtil'
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from 'react-native-navbar-plus';
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import keys from '../data/langs.json';
import FavoriteDao from "../expand/FavoriteDao";
import { FLAG_STORAGE } from "../expand/DataStore";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';
const THEME_COLOR = '#678';

class TrendingPage extends Component {
  render() {
    const themeColor = this.props.theme.themeColor || this.props.theme;
    if (this.themeColor != themeColor) {//当主题变更的时候需要以新的主题色来创建TabNavigator
      this.themeColor = themeColor;
      this.TabNavigator = null;
    }
    let navigationBar = (
      <NavigationBar
        title={'趋势'}
        style={{ backgroundColor: themeColor }}//修改标题栏主题色
      />
    );
    this.TabNavigator = keys.length
      ? tabNav({
          Component: TrendingTabPage,
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
const mapTrendingStateToProps = (state) => ({
  theme: state.theme.theme,
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, null)(TrendingPage);

const pageSize = 10;//设为常量，防止修改
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favoriteChanged_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }

  loadData(loadMore) {
    const { onRefreshTrending, onLoadMoreTrending } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize)
    }
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName];
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

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    return <TrendingItem
      item={item}
      onSelect={() => {
        NavigationUtil.goPage({
          projectModel: item
        }, 'DetailPage')
      }}
    />
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => "" + item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----')
          }}
        />
        <Toast ref={'toast'}
          position={'center'}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    trending: state.trendingHansen || {}
  }
};
const mapDispatchToProps = dispatch => ({
  //将 dispatch(onRefreshPopular(storeName, url))绑定到props
  onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack)),
});
//注意：connect只是个function，并不应定非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6

  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
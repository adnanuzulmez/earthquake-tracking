<template>
  <div id="app">
   
   <div class="leftSidebar" :class="[sidebarFlag === 0 ? 'sidebarHidden' : '']">
    <div id="sideBar" >
      <div class="searchBar">
        <input type="text" placeholder="Search" v-model="citySearch">
      </div>
      <div class="locationData" v-for="(item, index) in searchArray[0]" :key="index"
        :class="[(index === 0 && citySearch === '') ? 'lastLocation' : '']" @click="setCenterByLocation(item._id, index)">
        <div class="headInfo">
          <h3 class="locationNumber magSize" style=" cursor: pointer;">
            {{ item.mag }}</h3>
          <h4>●</h4>
          <h3 class="locationNumber fw-300" style=" cursor: pointer;">
            {{ item.depth }} KM</h3>
          <h4>●</h4>
          <h3 class="locationNumber fw-300" style=" cursor: pointer;">
            {{ dateDay[index].date }} {{ dateDay[index].time }}</h3>
        </div>
        <div>
          <div class="lastLocationData">
            <p class="locationAddress" style=" cursor: pointer;">
              {{ item.title }}
            </p>
            <p class="lastTitle" v-if="index === 0 && citySearch === ''">Last</p>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebarSwitch" @click="sidebarHide()" :class="[sidebarFlag === 0 ? 'sidebarSwitchStatus' : '']">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul"
        viewBox="0 0 16 16">
        <path fill-rule="evenodd"
          d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
    </div>
   </div>
    <div id="mapBox">
      <l-map :zoom="zoom" :center="center" :min-zoom="minZoom" :max-zoom="maxZoom" ref="map">
        <l-tile-layer :url="this.mapCreator" :attribution="attribution" />
        <Vue2LeafletHeatmap :lat-lng="getHeatMapDatas" :radius="40" :min-opacity="0.35" :max-zoom="10" :blur="50">
        </Vue2LeafletHeatmap>

        <l-marker v-for="(item, index) in position" :key="index" :lat-lng="item.position"
          @click="() => center = [item.position.lat, item.position.lng]">
          <l-popup>
            <div class="magnitude">
              <h2 style="font-size: 40px;color: #446c8f;;">{{ item.popup.mag }}</h2>
              <h4>Magnitude</h4>
            </div>
            <div class="infos">
              <h5>{{ dateDay[index].date }} {{ dateDay[index].time }}</h5>
              <h5>Depth: {{ item.popup.depth }} KM</h5>
              <h5>{{ dateDay[index].title }} </h5>
            </div>
          </l-popup>
          <l-icon>
            <div :id="item.id" :class="[`mag-${parseInt(item.popup.mag)}`, index === 0 ? 'lastEarthQuake' : '']"></div>
          </l-icon>
          <l-tooltip :content="item.tooltip">

          </l-tooltip>
        </l-marker>
        <l-icon-default :image-path="path" />
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIconDefault, LPopup, LIcon, LTooltip } from "vue2-leaflet";

import mapMixin from "./assets/js/map.js"
import Vue2LeafletHeatmap from "./Vue2LeafletHeatMap";
let cityId
export default {
  name: "EarthquakeMap",
  mixins: [mapMixin],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIconDefault,
    LPopup,
    Vue2LeafletHeatmap,
    LIcon,
    LTooltip,
  },
  data() {
    return {
      zoom: 4,
      minZoom: 4,
      maxZoom: 15,
      path: "/images/",
      center: [38.837033, 35.057786],
      popupOpen: "",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      citySearch: '',
      searchArray: [],
      sidebarFlag: 1,

    };
  },
  mounted() {

    this.getMap()
    this.getEAdatas = this.getEarthquakeDatas()

    console.log(this.getDetailData);
    setTimeout(() => {
      this.createHeatMapDatas()
      this.createMarkerDatas()

    }, 400);
    setTimeout(() => {
      this.$refs.map.mapObject.setZoom(5)
    }, 200);
    let leafletZoom = document.querySelector(".leaflet-left")
    leafletZoom.remove()

  },


  watch: {
    citySearch() {

      this.filterCity()

    }
  },
  methods: {
    sidebarHide(){
      if(this.sidebarFlag != 0){
        this.sidebarFlag = 0
      }
      else{
        this.sidebarFlag = 1
      }
    },
    filterCity() {
      this.searchArray[0] = this.getDetailData[0]
      this.searchArray[0] = this.searchArray[0].filter(item => item.title.toLowerCase().includes(this.citySearch.toLowerCase()))
    },
    setCenterByLocation(id) {
      
      cityId = this.getDetailData[0].filter((item) => item._id === id) 
      console.log(cityId[0]);
      setTimeout(async () => {
        this.getHeatMapDatas = []
        await this.$refs.map.mapObject.flyTo(cityId[0].geojson.coordinates.reverse(), 13, { duration: 3.2 })
      }, 10);
      setTimeout(() => {
        this.createHeatMapDatas()
      }, 20);
      setTimeout(() => {
        this.x = document.querySelectorAll(`.leaflet-marker-icon`)
        Array.from(this.x).map((item) => {
          if (item.childNodes[0].getAttribute("id") === cityId[0]._id) {
            item.childNodes[0].click()
          }
        })
      }, 3300);
    },

  }
};


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

* {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
}

#mapBox {
  height: 100%;
  width: 100%;
  position: absolute;
}

#sideBar {
  min-width: 500px;
  background-color: #3C3D3F;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  right: 0%;
  z-index: 99999999;
  transition:  1.5s;
}

* {
  scrollbar-width: 5px !important;
  scrollbar-color: #5f5f5f #3C3D3F !important;
  scrollbar-face-color: #5c5c5c !important;
  /* Firefox 63 compatibility */
  scrollbar-track-color: #636363 !important;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 10px !important;
}

*::-webkit-scrollbar-track {
  background: #3C3D3F !important;
}

*::-webkit-scrollbar-thumb {
  background-color: #8d8d8d !important;
  border-radius: 15px !important;
  border: 2px solid #3C3D3F !important;
}

.magnitude {
  text-align: center;
  margin-bottom: 15px;
}

.infos h5 {
  padding-bottom: 5px;
}

.mag-1 {
  width: 8px;
  height: 8px;
  background-color: rgb(255, 229, 114);
  border-radius: 50%;
}

.mag-2 {
  width: 10px;
  height: 10px;
  background-color: rgb(255, 160, 72);
  border-radius: 50%;
}

.mag-3 {
  width: 18px;
  height: 18px;
  background-color: rgb(255, 108, 23);
  border-radius: 50%;
}

.mag-4,
.mag-5 {
  width: 24px;
  height: 24px;
  background-color: rgb(253, 84, 84);
  border-radius: 50%;
}

.mag-6,
.mag-7 {
  width: 32px;
  height: 32px;
  background-color: rgb(201, 0, 0);
  border-radius: 50%;
}

.magSize {
  font-size: 25px;
}

.lastLocationData {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.searchBar {
  margin: 32px 30px 23px 25px;
}

.sidebarSwitchStatus{
  margin-left: 20px;
}

.sidebarHidden{
  right: 500px !important;
  transition:  3s;
}

.leftSidebar{
    transition: 1s;
    display: flex;
    position: relative;
    right: 0 
}

.sidebarSwitch{
    
    position: relative;
    color: #dfdfdf;
    margin-left: 20px;
    z-index: 9999999;
    padding: 10px;
    border-radius: 50%;
    background: #494c50;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 20px;
    box-shadow: rgb(173 173 173 / 55%) 0px 0px 7px 6px;
    cursor: pointer;
    height: 28px;
}

.sidebarSwitch svg{
    width: 28px;
    height: 28px;
}

.searchBar input {
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  color: #c3c3c3;
  font-size: 16px;
  border-bottom: 1px solid #ffffff00;
  transition: .2s;
}

.searchBar input:focus {
  border-bottom: 1px solid #81a1ff;
  box-shadow: rgb(69 111 173 / 55%) 0px 6px 7px -4px;
}

.searchBar input::placeholder {
  color: #a9a9a9;
}

.lastTitle {
  padding: 3px 14px;
  border: 1px solid #a1a1a1;
  border-radius: 7px;
  box-shadow: rgb(133 133 133 / 55%) 0px 0px 12px;
}

.locationData {
  border: 1px solid rgb(204 204 204 / 11%);
  margin: 10px 25px;
  padding: 12px 19px;
  box-shadow: rgb(0 81 255 / 10%) 0px 0px 20px;
  transition: 0.3s;
  position: relative;
  z-index: 10;
  background-color: #313133ad;
  border-radius: 5px;
  color: #d0d8df;
  cursor: pointer;
}

.fw-300 {
  font-weight: 300;
  font-size: 14px;
}

.headInfo {

  font-size: 13px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;

}

.locationAddress {
  font-size: 13px;
}

.lastLocation {
  box-shadow: rgb(255 255 255 / 55%) 0px 0px 20px;
}

.leaflet-tile-pane {
  filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
}

.leaflet-popup-content-wrapper {
  border-radius: 3px !important;
}

.leaflet-popup-tip {
  width: 12px !important;
  height: 8px !important;
  padding: 1px !important;
  margin: -6px auto 0px !important;
}

.lastEarthQuake{
  animation: pulse 2s infinite;
}
	
@keyframes pulse {
	0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 3px rgb(255, 255, 255);
  }
  
  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
